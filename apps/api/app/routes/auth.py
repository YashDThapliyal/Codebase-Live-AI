import hashlib
import os

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from supabase import create_client

router = APIRouter()

# Deterministic password derived from email + server secret.
# Candidates never see or type this — the backend handles it entirely.
_SECRET = os.environ.get("AUTH_SECRET", "interview-app-secret")


def _password_for(email: str) -> str:
  return hashlib.sha256(f"{_SECRET}:{email}".encode()).hexdigest()


class LoginRequest(BaseModel):
  email: str
  full_name: str


class LoginResponse(BaseModel):
  access_token: str
  refresh_token: str
  user_id: str


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
  url = os.environ.get("SUPABASE_URL")
  service_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

  if not url or not service_key:
    return LoginResponse(
      access_token="mock-token",
      refresh_token="mock-refresh",
      user_id="mock-user",
    )

  admin = create_client(url, service_key)
  password = _password_for(payload.email)

  # Try to sign in first.
  anon_key = os.environ.get("SUPABASE_ANON_KEY", "")
  client = create_client(url, anon_key)
  sign_in = client.auth.sign_in_with_password({"email": payload.email, "password": password})

  if sign_in.user:
    # Update name in case it changed.
    admin.auth.admin.update_user_by_id(
      sign_in.user.id,
      {"user_metadata": {"full_name": payload.full_name}},
    )
    return LoginResponse(
      access_token=sign_in.session.access_token,
      refresh_token=sign_in.session.refresh_token,
      user_id=sign_in.user.id,
    )

  # User doesn't exist — create them.
  created = admin.auth.admin.create_user({
    "email": payload.email,
    "password": password,
    "email_confirm": True,
    "user_metadata": {"full_name": payload.full_name},
  })

  sign_in2 = client.auth.sign_in_with_password({"email": payload.email, "password": password})
  if not sign_in2.user:
    raise HTTPException(status_code=500, detail="Failed to create session")

  return LoginResponse(
    access_token=sign_in2.session.access_token,
    refresh_token=sign_in2.session.refresh_token,
    user_id=sign_in2.user.id,
  )
