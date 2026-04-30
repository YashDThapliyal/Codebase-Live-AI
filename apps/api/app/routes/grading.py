from fastapi import APIRouter, HTTPException

from app.db.client import get_db
from app.models.schemas import Scorecard
from app.services.grader import build_mock_scorecard

router = APIRouter()


@router.post("/{session_id}", response_model=Scorecard)
def grade_session(session_id: str):
  db = get_db()
  session = db.sessions.get(session_id)
  if not session:
    raise HTTPException(status_code=404, detail="Session not found")

  transcript = db.messages.get(session_id, [])
  scorecard = build_mock_scorecard(session_id, transcript)
  db.scorecards[session_id] = scorecard
  return scorecard
