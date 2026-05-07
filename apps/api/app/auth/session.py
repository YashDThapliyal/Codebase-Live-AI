import base64
import hashlib
import hmac
import json
import time
from typing import Any

TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7


def _b64url(data: bytes) -> str:
  return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64url_decode(data: str) -> bytes:
  pad = "=" * (-len(data) % 4)
  return base64.urlsafe_b64decode((data + pad).encode("ascii"))


def sign_session_token(payload: dict[str, Any], secret: str) -> str:
  body = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
  body_b64 = _b64url(body)
  sig = hmac.new(secret.encode("utf-8"), body_b64.encode("ascii"), hashlib.sha256).digest()
  return f"{body_b64}.{_b64url(sig)}"


def create_session_token(user_id: str, role: str, secret: str) -> str:
  now = int(time.time())
  payload = {"sub": user_id, "role": role, "iat": now, "exp": now + TOKEN_TTL_SECONDS}
  return sign_session_token(payload, secret)


def verify_session_token(token: str, secret: str) -> dict[str, Any]:
  try:
    body_b64, sig_b64 = token.split(".", 1)
    expected_sig = hmac.new(secret.encode("utf-8"), body_b64.encode("ascii"), hashlib.sha256).digest()
    actual_sig = _b64url_decode(sig_b64)
    if not hmac.compare_digest(expected_sig, actual_sig):
      raise ValueError("Invalid signature")

    payload = json.loads(_b64url_decode(body_b64).decode("utf-8"))
    if int(payload.get("exp", 0)) < int(time.time()):
      raise ValueError("Token expired")
    return payload
  except Exception as exc:
    raise ValueError("Invalid token") from exc
