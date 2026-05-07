"""Database access: SQLite-backed unit of work for local MVP."""

import os

from app.config import settings
from app.repositories.sqlite import build_sqlite_uow

_default_uow = None


def get_unit_of_work():
  global _default_uow
  if _default_uow is None:
    path = os.environ.get("SQLITE_DB_PATH", settings.sqlite_db_path)
    _default_uow = build_sqlite_uow(path)
  return _default_uow


def reset_unit_of_work_for_tests(path: str):
  global _default_uow
  _default_uow = build_sqlite_uow(path)
  return _default_uow
