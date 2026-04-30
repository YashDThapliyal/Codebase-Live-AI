import uuid

from fastapi import APIRouter, HTTPException

from app.db.client import get_db
from app.db.mock_db import now_iso
from app.models.schemas import (
  InterviewMessage,
  InterviewMessageRequest,
  InterviewPhase,
  InterviewSession,
  InterviewStartRequest,
  InterviewTurnResponse,
)
from app.services.interviewer import generate_interviewer_turn
from app.services.resume_parser import parse_resume_mock

router = APIRouter()


@router.post("/start", response_model=InterviewSession)
def start_interview(payload: InterviewStartRequest):
  db = get_db()
  if payload.candidate_id not in db.candidates:
    raise HTTPException(status_code=404, detail="Candidate not found")

  _ = parse_resume_mock(payload.resume_text)

  session = InterviewSession(
    id=f"sess_{uuid.uuid4().hex[:8]}",
    candidate_id=payload.candidate_id,
    phase=InterviewPhase.intro,
    status="active",
    started_at=now_iso(),
  )
  db.sessions[session.id] = session
  db.messages[session.id] = []
  return session


@router.post("/{session_id}/message", response_model=InterviewTurnResponse)
def post_interview_message(session_id: str, payload: InterviewMessageRequest):
  db = get_db()
  session = db.sessions.get(session_id)
  if not session:
    raise HTTPException(status_code=404, detail="Session not found")

  candidate_message = InterviewMessage(
    id=f"msg_{uuid.uuid4().hex[:8]}",
    session_id=session_id,
    sender="candidate",
    content=payload.message,
    phase=session.phase,
    created_at=now_iso(),
  )
  db.messages[session_id].append(candidate_message)

  answer_count_in_phase = len([m for m in db.messages[session_id] if m.sender == "candidate" and m.phase == session.phase])

  turn = generate_interviewer_turn(session.phase, payload.message, answer_count_in_phase)

  ai_message = InterviewMessage(
    id=f"msg_{uuid.uuid4().hex[:8]}",
    session_id=session_id,
    sender="ai",
    content=turn.message,
    phase=turn.phase,
    created_at=now_iso(),
  )
  db.messages[session_id].append(ai_message)

  session.phase = turn.phase
  db.sessions[session_id] = session
  return turn


@router.post("/{session_id}/end", response_model=InterviewSession)
def end_interview(session_id: str):
  db = get_db()
  session = db.sessions.get(session_id)
  if not session:
    raise HTTPException(status_code=404, detail="Session not found")

  session.status = "completed"
  session.ended_at = now_iso()
  db.sessions[session_id] = session
  return session
