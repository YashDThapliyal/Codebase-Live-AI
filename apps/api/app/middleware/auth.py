"""FastAPI auth dependencies.

When SUPABASE_URL is not configured (local mock mode), all dependencies
are no-ops so the mock dev flow continues to work without credentials.
"""

import os
from typing import Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

_bearer = HTTPBearer(auto_error=False)

_MOCK_MODE = not bool(os.environ.get("SUPABASE_URL"))
_JWT_SECRET: Optional[str] = os.environ.get("SUPABASE_JWT_SECRET")


def _decode_token(token: str) -> dict:
  """Decode and verify a Supabase JWT.

  Supabase JWTs are HS256-signed with the project JWT secret.
  The secret is available in the Supabase dashboard under Settings > API.
  """
  if not _JWT_SECRET:
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="SUPABASE_JWT_SECRET not configured",
    )
  try:
    payload = jwt.decode(
      token,
      _JWT_SECRET,
      algorithms=["HS256"],
      options={"verify_aud": False},
    )
    return payload
  except jwt.ExpiredSignatureError:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
  except jwt.InvalidTokenError:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


def require_auth(
  credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
) -> dict:
  """Validate the Bearer token. Returns the decoded JWT payload."""
  if _MOCK_MODE:
    return {"sub": "mock-user", "is_admin": True}

  if not credentials:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

  return _decode_token(credentials.credentials)


def require_admin(user: dict = Depends(require_auth)) -> dict:
  """Require the caller to be an admin (is_admin claim in JWT or profiles table)."""
  if _MOCK_MODE:
    return user

  is_admin = user.get("is_admin") or user.get("app_metadata", {}).get("is_admin", False)
  if not is_admin:
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
  return user
