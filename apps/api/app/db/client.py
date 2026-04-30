"""Database client abstraction.

Mock DB is active in MVP. Supabase client integration should be added here later.
"""

from app.db.mock_db import mock_db


def get_db():
  return mock_db
