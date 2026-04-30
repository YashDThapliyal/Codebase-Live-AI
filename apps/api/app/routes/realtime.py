import json
import logging
from datetime import datetime, timezone

import httpx
from fastapi import APIRouter, Request, Response
from pydantic import BaseModel

from app.config import settings

router = APIRouter()
logger = logging.getLogger("codebase_live_ai.realtime")

INTERVIEWER_INSTRUCTIONS = (
  "You are Codebase Live AI, a professional AI interviewer for a student club. "
  "Ask one question at a time. Be concise, warm, and technical. "
  "Probe for project depth, implementation details, tradeoffs, and communication clarity. "
  "Do not make final admissions decisions."
)


class RealtimeCallRequest(BaseModel):
  sdp: str
  model: str | None = None


class RealtimeSessionRequest(BaseModel):
  preferred_language: str | None = None


def _build_instructions(preferred_language: str | None) -> str:
  if not preferred_language:
    return INTERVIEWER_INSTRUCTIONS
  return (
    INTERVIEWER_INSTRUCTIONS
    + f" Conduct the full interview in {preferred_language}. "
    + f" Use only {preferred_language} for all spoken and text responses unless the candidate explicitly asks to switch languages. "
    + "If the candidate asks to switch language, confirm and continue in the requested language."
  )


def _client_secret_payload(model: str, preferred_language: str | None) -> dict:
  # silence_duration_ms controls how long we wait after speech stops before
  # committing the user's turn. Increasing it makes the AI less interruptive,
  # and interview mode should prefer slightly longer pauses so candidates can think.
  return {
    "session": {
      "type": "realtime",
      "model": model,
      "instructions": _build_instructions(preferred_language),
      "audio": {
        "input": {
          "turn_detection": {
            "type": "server_vad",
            "threshold": settings.realtime_vad_threshold,
            "prefix_padding_ms": settings.realtime_vad_prefix_padding_ms,
            "silence_duration_ms": settings.realtime_vad_silence_duration_ms,
          }
        },
        "output": {"voice": "alloy"}
      },
    }
  }


@router.options("/session")
def options_realtime_session() -> Response:
  return Response(status_code=204)


@router.post("/session")
def create_realtime_session(payload: RealtimeSessionRequest):
  if not settings.openai_key_configured:
    return {"error": "OPENAI_API_KEY is not configured"}

  primary_model = settings.openai_realtime_model

  try:
    with httpx.Client(timeout=20.0) as client:
      response = client.post(
        "https://api.openai.com/v1/realtime/client_secrets",
        headers={
          "Authorization": f"Bearer {settings.openai_api_key}",
          "Content-Type": "application/json",
        },
        json=_client_secret_payload(primary_model, payload.preferred_language),
      )
      response.raise_for_status()
      return response.json()

  except httpx.HTTPStatusError as exc:
    detail = exc.response.text
    logger.error("Client secret failed model=%s status=%s body=%s", primary_model, exc.response.status_code, detail)

    # Compatibility fallback: preview model strings may fail on GA client_secrets.
    if exc.response.status_code == 400 and "preview" in primary_model:
      fallback_model = "gpt-realtime"
      try:
        with httpx.Client(timeout=20.0) as client:
          response = client.post(
            "https://api.openai.com/v1/realtime/client_secrets",
            headers={
              "Authorization": f"Bearer {settings.openai_api_key}",
              "Content-Type": "application/json",
            },
            json=_client_secret_payload(fallback_model, payload.preferred_language),
          )
          response.raise_for_status()
          data = response.json()
          data["model_fallback"] = {
            "requested": primary_model,
            "used": fallback_model,
          }
          return data
      except httpx.HTTPStatusError as fallback_exc:
        fallback_detail = fallback_exc.response.text
        logger.error(
          "Client secret fallback failed model=%s status=%s body=%s",
          fallback_model,
          fallback_exc.response.status_code,
          fallback_detail,
        )
        return {
          "error": "Failed to create realtime session",
          "detail": fallback_detail,
          "status_code": fallback_exc.response.status_code,
        }
      except httpx.HTTPError as fallback_exc:
        logger.exception("Client secret fallback request failed")
        return {
          "error": "Failed to create realtime session",
          "detail": str(fallback_exc),
        }

    return {
      "error": "Failed to create realtime session",
      "detail": detail,
      "status_code": exc.response.status_code,
    }

  except httpx.HTTPError as exc:
    logger.exception("Failed to create realtime session")
    return {"error": "Failed to create realtime session", "detail": str(exc)}


@router.post("/call")
def create_realtime_call(payload: RealtimeCallRequest):
  if not settings.openai_key_configured:
    return Response(content='{"error":"OPENAI_API_KEY is not configured"}', status_code=500, media_type="application/json")

  model = payload.model or settings.openai_realtime_model

  try:
    with httpx.Client(timeout=30.0) as client:
      response = client.post(
        "https://api.openai.com/v1/realtime/calls",
        headers={
          "Authorization": f"Bearer {settings.openai_api_key}",
          "Content-Type": "application/sdp",
        },
        params={"model": model},
        content=payload.sdp,
      )
      response.raise_for_status()
      return Response(content=response.text, media_type="application/sdp")
  except httpx.HTTPStatusError as exc:
    detail = exc.response.text
    logger.error("Realtime call failed status=%s body=%s", exc.response.status_code, detail)
    return Response(content=detail, status_code=exc.response.status_code, media_type="application/json")
  except httpx.HTTPError as exc:
    logger.exception("Realtime call failed")
    return Response(content=json.dumps({"error": "realtime_call_failed", "detail": str(exc)}), status_code=500, media_type="application/json")


@router.post("/debug-log")
async def realtime_debug_log(request: Request):
  payload = await request.json()
  logger.error(
    "[RealtimeDebug][%s] %s",
    datetime.now(timezone.utc).isoformat(),
    json.dumps(payload, ensure_ascii=True),
  )
  return {"ok": True}
