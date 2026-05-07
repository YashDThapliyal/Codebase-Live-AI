"""Persist grading results and advance session lifecycle for reviewer workflow."""

from fastapi import HTTPException

from app.models.schemas import InterviewLifecycleStatus, Scorecard
from typing import Any
from app.services.audit_service import log_audit
from app.services.grading_service import grade_session_from_transcript


def run_grading(uow: Any, session_id: str) -> Scorecard:
  session = uow.interviews.get_session(session_id)
  if not session:
    raise HTTPException(status_code=404, detail="Session not found")

  existing = uow.scorecards.get_for_session(session_id)
  if existing is not None:
    if session.lifecycle_status != InterviewLifecycleStatus.reviewed:
      session.lifecycle_status = InterviewLifecycleStatus.reviewed
      uow.interviews.update_session(session)
    return existing

  if session.lifecycle_status not in (
    InterviewLifecycleStatus.completed,
    InterviewLifecycleStatus.grading,
  ):
    raise HTTPException(
      status_code=409,
      detail="Interview must be completed before grading",
    )

  session.lifecycle_status = InterviewLifecycleStatus.grading
  uow.interviews.update_session(session)

  transcript = uow.interviews.list_messages(session_id)
  scorecard = grade_session_from_transcript(session_id, transcript)
  uow.scorecards.upsert(scorecard)

  session.lifecycle_status = InterviewLifecycleStatus.reviewed
  uow.interviews.update_session(session)

  log_audit(
    uow,
    action="grading.complete",
    entity_type="interview_session",
    entity_id=session_id,
    detail=f"match_score={scorecard.match_score}",
  )
  return scorecard
