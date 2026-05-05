"""End-to-end API coverage for text interview MVP and admin review."""

from fastapi.testclient import TestClient


def _create_candidate(client: TestClient) -> str:
  r = client.post(
    "/candidates",
    json={"full_name": "Test User", "email": "test@example.com", "role_applied": "Engineer"},
  )
  assert r.status_code == 200
  return r.json()["id"]


def test_create_candidate(client: TestClient):
  cid = _create_candidate(client)
  assert cid.startswith("cand_")


def test_start_begin_message_end_grade_admin_detail(client: TestClient):
  cid = _create_candidate(client)

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

  r = client.get("/admin/applicants")
  assert r.status_code == 200
  rows = r.json()
  assert len(rows) >= 1
  assert any(row["candidate"]["id"] == cid for row in rows)

  r = client.get(f"/admin/applicants/{cid}")
  assert r.status_code == 200
  detail = r.json()
  assert detail["scorecard"] is not None
  assert detail["session"]["lifecycle_status"] == "reviewed"
  assert detail["transcript"]


def test_empty_message_rejected(client: TestClient):
  cid = _create_candidate(client)
  r = client.post("/interviews/start", json={"candidate_id": cid})
  sid = r.json()["id"]
  client.post(f"/interviews/{sid}/begin")
  r = client.post(f"/interviews/{sid}/message", json={"message": "   "})
  assert r.status_code == 400
