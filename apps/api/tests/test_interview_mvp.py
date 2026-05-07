"""End-to-end API coverage for text interview MVP and admin review with local auth."""

from fastapi.testclient import TestClient


def _register_and_login(
  client: TestClient,
  *,
  email: str,
  password: str = "password123",
  role: str = "candidate",
):
  r = client.post("/auth/register", json={"email": email, "password": password, "role": role})
  assert r.status_code == 200


def _create_candidate(client: TestClient, email: str = "test@example.com") -> str:
  r = client.post(
    "/candidates",
    json={"full_name": "Test User", "email": email, "role_applied": "Engineer"},
  )
  assert r.status_code == 200
  return r.json()["id"]


def test_register_login_me_and_duplicate_email(client: TestClient):
  r = client.post("/auth/register", json={"email": "candidate@example.com", "password": "password123"})
  assert r.status_code == 200

  r = client.get("/auth/me")
  assert r.status_code == 200
  assert r.json()["email"] == "candidate@example.com"

  r = client.post("/auth/register", json={"email": "candidate@example.com", "password": "password123"})
  assert r.status_code == 409

  r = client.post("/auth/login", json={"email": "candidate@example.com", "password": "wrongpass"})
  assert r.status_code == 401

  r = client.post("/auth/login", json={"email": "candidate@example.com", "password": "password123"})
  assert r.status_code == 200


def test_create_candidate_requires_auth(client: TestClient):
  r = client.post(
    "/candidates",
    json={"full_name": "No Auth", "email": "noauth@example.com", "role_applied": "Engineer"},
  )
  assert r.status_code == 401


def test_start_begin_message_end_grade_admin_detail(client: TestClient):
  _register_and_login(client, email="candidate@example.com")
  cid = _create_candidate(client, email="candidate@example.com")

  r = client.post("/interviews/start", json={"candidate_id": cid})
  assert r.status_code == 200
  session = r.json()
  sid = session["id"]
  assert session["lifecycle_status"] == "lobby"
  assert session.get("interviewer_prompt_version") == "deterministic_v1"

  r = client.post(f"/interviews/{sid}/begin")
  assert r.status_code == 200
  assert r.json()["lifecycle_status"] == "active"

  tr = client.get(f"/interviews/{sid}/transcript")
  assert tr.status_code == 200
  assert len(tr.json()) >= 1

  r = client.post(f"/interviews/{sid}/message", json={"message": "I shipped a FastAPI service with idempotent APIs and on-call ownership."})
  assert r.status_code == 200
  assert r.json()["phase"] in (
    "intro",
    "resume_deep_dive",
    "technical_probe",
    "behavioral_alignment",
    "candidate_questions",
    "closing",
  )

  r = client.post(f"/interviews/{sid}/end")
  assert r.status_code == 200
  assert r.json()["lifecycle_status"] == "completed"

  r = client.post(f"/grading/{sid}")
  assert r.status_code == 200
  sc = r.json()
  assert "match_score" in sc
  assert sc["grader_version"] == "heuristic_v1"
  assert sc["evidence"]

  # Candidate should not access admin routes.
  r = client.get("/admin/applicants")
  assert r.status_code == 403

  # Admin login for admin review access.
  admin_client = TestClient(client.app)
  admin_client.post("/auth/register", json={"email": "admin@example.com", "password": "password123", "role": "admin"})

  r = admin_client.get("/admin/applicants")
  assert r.status_code == 200
  rows = r.json()
  assert len(rows) >= 1
  assert any(row["candidate"]["id"] == cid for row in rows)

  r = admin_client.get(f"/admin/applicants/{cid}")
  assert r.status_code == 200
  detail = r.json()
  assert detail["scorecard"] is not None
  assert detail["session"]["lifecycle_status"] == "reviewed"
  assert detail["transcript"]


def test_empty_message_rejected(client: TestClient):
  _register_and_login(client, email="candidate2@example.com")
  cid = _create_candidate(client, email="candidate2@example.com")
  r = client.post("/interviews/start", json={"candidate_id": cid})
  sid = r.json()["id"]
  client.post(f"/interviews/{sid}/begin")
  r = client.post(f"/interviews/{sid}/message", json={"message": "   "})
  assert r.status_code == 400
