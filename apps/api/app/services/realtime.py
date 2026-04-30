"""Scaffold for future OpenAI Realtime API integration.

Do not implement full voice interview in this phase.
"""


def create_realtime_session_placeholder() -> dict:
  # Future: create and authenticate a realtime WebSocket session.
  return {"status": "not_implemented", "note": "Realtime session creation scaffold only."}


def stream_audio_input_placeholder() -> None:
  # Future: stream encoded audio chunks from client to realtime session.
  # Future: include voice activity detection boundaries.
  pass


def handle_transcript_events_placeholder() -> None:
  # Future: consume partial/final transcript events and persist them.
  pass


def reconnect_resume_placeholder() -> None:
  # Future: support reconnect + resume for unstable network conditions.
  pass
