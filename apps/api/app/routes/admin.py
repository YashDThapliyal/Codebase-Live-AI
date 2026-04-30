from fastapi import APIRouter, Depends, HTTPException

from app.db.client import get_db
from app.middleware.auth import require_admin
from app.models.schemas import ApplicantDetail, ReviewerNote
from app.services.grader import build_mock_scorecard

router = APIRouter()


@router.get("/applicants", response_model=list[ApplicantDetail])
def list_applicants(_user: dict = Depends(require_admin)):
  db = get_db()
  details: list[ApplicantDetail] = []

  for session in db.sessions.values():
    candidate = db.candidates.get(session.candidate_id)
    if not candidate:
      continue
    transcript = db.messages.get(session.id, [])
    scorecard = db.scorecards.get(session.id) or build_mock_scorecard(session.id, transcript)
    notes = db.notes.get(candidate.id, [])
    details.append(
      ApplicantDetail(
        candidate=candidate,
        session=session,
        transcript=transcript,
        scorecard=scorecard,
        reviewer_notes=notes,
      )
    )

  details.sort(key=lambda d: d.scorecard.match_score, reverse=True)
  return details


@router.get("/applicants/{candidate_id}", response_model=ApplicantDetail)
def get_applicant_detail(candidate_id: str, _user: dict = Depends(require_admin)):
  db = get_db()

  candidate = db.candidates.get(candidate_id)
  if not candidate:
    raise HTTPException(status_code=404, detail="Candidate not found")

  session = next((s for s in db.sessions.values() if s.candidate_id == candidate_id), None)
  if not session:
    raise HTTPException(status_code=404, detail="No interview session found for candidate")

  transcript = db.messages.get(session.id, [])
  scorecard = db.scorecards.get(session.id) or build_mock_scorecard(session.id, transcript)
  notes = db.notes.get(candidate.id, [])

  if not notes:
    notes = [
      ReviewerNote(
        id="note_placeholder",
        candidate_id=candidate.id,
        note="Reviewer note placeholder for integration phase.",
        created_at=session.started_at,
      )
    ]

  return ApplicantDetail(
    candidate=candidate,
    session=session,
    transcript=transcript,
    scorecard=scorecard,
    reviewer_notes=notes,
  )
