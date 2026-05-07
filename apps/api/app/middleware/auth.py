from typing import Optional

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.auth.session import verify_session_token
from app.auth.store import AuthStore
from app.config import settings
from app.db.client import get_unit_of_work

SESSION_COOKIE_NAME = "clai_session"

_bearer = HTTPBearer(auto_error=False)


def _extract_token(
  request: Request,
  credentials: Optional[HTTPAuthorizationCredentials],
) -> Optional[str]:
  if credentials and credentials.credentials:
    return credentials.credentials
  return request.cookies.get(SESSION_COOKIE_NAME)


def require_auth(
  request: Request,
  credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
) -> dict:
  token = _extract_token(request, credentials)
  if not token:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

  try:
    payload = verify_session_token(token, settings.auth_secret)
  except ValueError:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")

  user_id = payload.get("sub")
  if not isinstance(user_id, str) or not user_id.strip():
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session payload")

  uow = get_unit_of_work()
  user = AuthStore(uow.conn).get_by_id(user_id.strip())
  if not user:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User no longer exists")

  return {"sub": user.id, "email": user.email, "role": user.role}


def require_admin(user: dict = Depends(require_auth)) -> dict:
  if user.get("role") != "admin":
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
  return user
