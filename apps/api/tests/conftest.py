import pytest
from fastapi.testclient import TestClient

from app.repositories.memory import reset_unit_of_work_for_tests
from main import app


@pytest.fixture()
def client():
  reset_unit_of_work_for_tests()
  with TestClient(app) as c:
    yield c
