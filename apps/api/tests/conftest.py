import os

import pytest
from fastapi.testclient import TestClient

from app.db.client import reset_unit_of_work_for_tests
from main import app


@pytest.fixture()
def client(tmp_path):
  db_path = tmp_path / "test_codebase_live_ai.db"
  os.environ["SQLITE_DB_PATH"] = str(db_path)
  reset_unit_of_work_for_tests(str(db_path))
  with TestClient(app) as c:
    yield c
