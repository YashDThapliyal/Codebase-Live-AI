"""
Interview session orchestration: lifecycle rules and persistence (no HTTP concerns).

Routes should delegate here and repositories should not be called directly from handlers
except through this layer.
"""

import uuid

from fastapi import HTTPException

from app.models.schemas import (
  InterviewLifecycleStatus,
  InterviewMessage,
  InterviewPhase,
  InterviewSession,
  InterviewStartRequest,
  InterviewTurnResponse,
)
from app.repositories.memory import InMemoryUnitOfWork
from app.services.audit_service import log_audit
from app.services.interviewer_service import (
  INTERVIEWER_PROMPT_VERSION,
  generate_interviewer_turn,
  opening_message_for_phase,
)
from app.services.resume_parser_service import parse_resume
from app.utils.time import now_iso


def start_session(uow: InMemoryUnitOfWork, payload: InterviewStartRequest) -> InterviewSession:
  if uow.candidates.get(payload.candidate_id) is None:
    raise HTTPException(status_code=404, detail="Candidate not found")

  _ = parse_resume(payload.resume_text)

  session = InterviewSession(
    id=f"sess_{uuid.uuid4().hex[:8]}",
    candidate_id=payload.candidate_id,
    phase=InterviewPhase.intro,
    lifecycle_status=InterviewLifecycleStatus.lobby,
    started_at=now_iso(),
    interviewer_prompt_version=INTERVIEWER_PROMPT_VERSION,
  )
  uow.interviews.create_session(session)
  log_audit(
    uow,
    action="interview.start",
    entity_type="interview_session",
    entity_id=session.id,
    detail="lifecycle=lobby",
  )
  return session


def begin_session(uow: InMemoryUnitOfWork, session_id: str) -> InterviewSession:
  session = uow.interviews.get_session(session_id)
  if not session:
    raise HTTPException(status_code=404, detail="Session not found")

  if session.lifecycle_status == InterviewLifecycleStatus.active:
    return session

  if session.lifecycle_status != InterviewLifecycleStatus.lobby:
    raise HTTPException(
      status_code=409,
      detail=f"Session cannot begin from lifecycle {session.lifecycle_status.value}",
    )

  opener = opening_message_for_phase(session.phase)
  ai_message = InterviewMessage(
    id=f"msg_{uuid.uuid4().hex[:8]}",
    session_id=session_id,
    sender="ai",
    content=opener,
    phase=session.phase,
    created_at=now_iso(),
  )
  uow.interviews.append_message(ai_message)
  session.lifecycle_status = InterviewLifecycleStatus.active
  uow.interviews.update_session(session)
  log_audit(
    uow,
    action="interview.begin",
    entity_type="interview_session",
    entity_id=session_id,
    detail="lifecycle=active",
  )
  return session


def post_candidate_message(
  uow: InMemoryUnitOfWork, session_id: str, raw_message: str
) -> InterviewTurnResponse:
  text = raw_message.strip()
  if not text:
    raise HTTPException(status_code=400, detail="Message cannot be empty")

  session = uow.interviews.get_session(session_id)
  if not session:
    raise HTTPException(status_code=404, detail="Session not found")

  if session.lifecycle_status == InterviewLifecycleStatus.lobby:
    begin_session(uow, session_id)
    session = uow.interviews.get_session(session_id)
    assert session is not None

  if session.lifecycle_status != InterviewLifecycleStatus.active:
    raise HTTPException(
      status_code=409,
      detail=f"Interview not accepting messages in state {session.lifecycle_status.value}",
    )

  messages = uow.interviews.list_messages(session_id)
  candidate_message = InterviewMessage(
    id=f"msg_{uuid.uuid4().hex[:8]}",
    session_id=session_id,
    sender="candidate",
    content=text,
    phase=session.phase,
    created_at=now_iso(),
  )
  uow.interviews.append_message(candidate_message)

  answer_count_in_phase = len(
    [m for m in messages + [candidate_message] if m.sender == "candidate" and m.phase == session.phase]
  )

  turn = generate_interviewer_turn(session.phase, text, answer_count_in_phase)

  ai_message = InterviewMessage(
    id=f"msg_{uuid.uuid4().hex[:8]}",
    session_id=session_id,
    sender="ai",
    content=turn.message,
    phase=turn.phase,
    created_at=now_iso(),
  )
  uow.interviews.append_message(ai_message)

  session.phase = turn.phase
  uow.interviews.update_session(session)
  return turn


def end_session(uow: InMemoryUnitOfWork, session_id: str) -> InterviewSession:
  session = uow.interviews.get_session(session_id)
  if not session:
    raise HTTPException(status_code=404, detail="Session not found")

  if session.lifecycle_status in (
    InterviewLifecycleStatus.completed,
    InterviewLifecycleStatus.grading,
    InterviewLifecycleStatus.reviewed,
  ):
    return session

  session.lifecycle_status = InterviewLifecycleStatus.completed
  session.ended_at = now_iso()
  uow.interviews.update_session(session)
  log_audit(
    uow,
    action="interview.end",
    entity_type="interview_session",
    entity_id=session_id,
    detail="lifecycle=completed",
  )
  return session
