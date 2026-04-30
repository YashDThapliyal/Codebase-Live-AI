"""Database client abstraction.

Returns SupabaseDB when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set;
falls back to the in-memory MockDB for local development without credentials.
"""

import os

_db = None


def get_db():
  global _db
  if _db is None:
    if os.environ.get("SUPABASE_URL") and os.environ.get("SUPABASE_SERVICE_ROLE_KEY"):
      from app.db.supabase_db import SupabaseDB
      _db = SupabaseDB()
    else:
      from app.db.mock_db import mock_db
      _db = mock_db
  return _db
