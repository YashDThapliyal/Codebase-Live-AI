import sqlite3
import uuid
from dataclasses import dataclass
from typing import Optional

from app.auth.passwords import hash_password, verify_password


@dataclass
class AuthUser:
  id: str
  email: str
  password_hash: str
  role: str
  created_at: str


class AuthStore:
  def __init__(self, conn: sqlite3.Connection):
    self._conn = conn

  def get_by_email(self, email: str) -> Optional[AuthUser]:
    row = self._conn.execute(
      "SELECT id, email, password_hash, role, created_at FROM users WHERE email = ?",
      (email.lower(),),
    ).fetchone()
    if not row:
      return None
    return AuthUser(
      id=row["id"],
      email=row["email"],
      password_hash=row["password_hash"],
      role=row["role"],
      created_at=row["created_at"],
    )

  def get_by_id(self, user_id: str) -> Optional[AuthUser]:
    if not isinstance(user_id, str) or not user_id.strip():
      return None
    row = self._conn.execute(
      "SELECT id, email, password_hash, role, created_at FROM users WHERE id = ?",
      (user_id.strip(),),
    ).fetchone()
    if not row:
      return None
    return AuthUser(
      id=row["id"],
      email=row["email"],
      password_hash=row["password_hash"],
      role=row["role"],
      created_at=row["created_at"],
    )

  def create_user(self, email: str, password: str, role: str, created_at: str) -> AuthUser:
    existing = self.get_by_email(email)
    if existing:
      raise ValueError("Email already registered")

    user = AuthUser(
      id=f"usr_{uuid.uuid4().hex[:10]}",
      email=email.lower(),
      password_hash=hash_password(password),
      role=role,
      created_at=created_at,
    )
    self._conn.execute(
      "INSERT INTO users (id, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)",
      (user.id, user.email, user.password_hash, user.role, user.created_at),
    )
    self._conn.commit()
    return user

  def authenticate(self, email: str, password: str) -> Optional[AuthUser]:
    user = self.get_by_email(email)
    if not user:
      return None
    if not verify_password(password, user.password_hash):
      return None
    return user
