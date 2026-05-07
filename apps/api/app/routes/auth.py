import re

from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel

from app.auth.session import create_session_token
from app.auth.store import AuthStore
from app.config import settings
from app.db.client import get_unit_of_work
from app.middleware.auth import SESSION_COOKIE_NAME, require_auth
from app.utils.time import now_iso

router = APIRouter()


class RegisterRequest(BaseModel):
  email: str
  password: str
  role: str = "candidate"


class LoginRequest(BaseModel):
  email: str
  password: str


class AuthResponse(BaseModel):
  user_id: str
  email: str
  role: str


def _normalize_email(email: str) -> str:
  return email.strip().lower()


def _validate_password(password: str) -> None:
  if len(password) < 8:
    raise HTTPException(status_code=400, detail="Password must be at least 8 characters")


def _validate_email(email: str) -> None:
  if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
    raise HTTPException(status_code=400, detail="Invalid email format")


def _set_session_cookie(response: Response, token: str) -> None:
  response.set_cookie(
    key=SESSION_COOKIE_NAME,
    value=token,
    httponly=True,
    secure=False,
    samesite="lax",
    max_age=60 * 60 * 24 * 7,
    path="/",
  )


@router.post("/register", response_model=AuthResponse)
def register(payload: RegisterRequest, response: Response):
  email = _normalize_email(payload.email)
  _validate_email(email)
  _validate_password(payload.password)
  role = payload.role if payload.role in ("candidate", "admin") else "candidate"

  uow = get_unit_of_work()
  store = AuthStore(uow.conn)
  try:
    user = store.create_user(email=email, password=payload.password, role=role, created_at=now_iso())
  except ValueError as exc:
    raise HTTPException(status_code=409, detail=str(exc))

  token = create_session_token(user.id, user.role, settings.auth_secret)
  _set_session_cookie(response, token)
  return AuthResponse(user_id=user.id, email=user.email, role=user.role)


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, response: Response):
  email = _normalize_email(payload.email)
  _validate_email(email)

  uow = get_unit_of_work()
  store = AuthStore(uow.conn)
  user = store.authenticate(email=email, password=payload.password)
  if not user:
    raise HTTPException(status_code=401, detail="Invalid email or password")

  token = create_session_token(user.id, user.role, settings.auth_secret)
  _set_session_cookie(response, token)
  return AuthResponse(user_id=user.id, email=user.email, role=user.role)


@router.post("/logout")
def logout(response: Response):
  response.delete_cookie(SESSION_COOKIE_NAME, path="/")
  return {"ok": True}


@router.get("/me", response_model=AuthResponse)
def me(user: dict = Depends(require_auth)):
  return AuthResponse(user_id=user["sub"], email=user["email"], role=user["role"])
