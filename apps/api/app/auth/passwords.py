import base64
import hashlib
import hmac
import os

_ITERATIONS = 120_000


def hash_password(password: str) -> str:
  salt = os.urandom(16)
  digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, _ITERATIONS)
  return f"pbkdf2_sha256${_ITERATIONS}${base64.b64encode(salt).decode()}${base64.b64encode(digest).decode()}"


def verify_password(password: str, password_hash: str) -> bool:
  try:
    algo, iters, salt_b64, digest_b64 = password_hash.split("$", 3)
    if algo != "pbkdf2_sha256":
      return False
    salt = base64.b64decode(salt_b64)
    expected = base64.b64decode(digest_b64)
    check = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, int(iters))
    return hmac.compare_digest(check, expected)
  except Exception:
    return False
