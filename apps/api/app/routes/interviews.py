from fastapi import APIRouter, Depends, HTTPException

from app.db.client import get_unit_of_work
from app.middleware.auth import require_auth
from app.models.schemas import (
  InterviewMessage,
  InterviewSession,
  InterviewTranscriptAppendRequest,
  InterviewMessageRequest,
  InterviewTurnResponse,
  InterviewStartRequest,
)
from app.services.interview_flow import (
  append_transcript_message,
  begin_session,
  end_session,
  post_candidate_message,
  start_session,
)

router = APIRouter()


@router.post("/start", response_model=InterviewSession)
def start_interview(payload: InterviewStartRequest, _user: dict = Depends(require_auth)):
  uow = get_unit_of_work()
  return start_session(uow, payload)


@router.post("/{session_id}/begin", response_model=InterviewSession)
def begin_interview(session_id: str, _user: dict = Depends(require_auth)):
  uow = get_unit_of_work()
  return begin_session(uow, session_id)


@router.get("/{session_id}", response_model=InterviewSession)
def get_interview_session(session_id: str, _user: dict = Depends(require_auth)):
  uow = get_unit_of_work()
  session = uow.interviews.get_session(session_id)
  if not session:
    raise HTTPException(status_code=404, detail="Session not found")
  return session


@router.get("/{session_id}/transcript", response_model=list[InterviewMessage])
def get_transcript(session_id: str, _user: dict = Depends(require_auth)):
  uow = get_unit_of_work()
  if not uow.interviews.get_session(session_id):
    raise HTTPException(status_code=404, detail="Session not found")
  return uow.interviews.list_messages(session_id)


@router.post("/{session_id}/message", response_model=InterviewTurnResponse)
def post_interview_message(session_id: str, payload: InterviewMessageRequest, _user: dict = Depends(require_auth)):
  uow = get_unit_of_work()
  return post_candidate_message(uow, session_id, payload.message)


@router.post("/{session_id}/transcript-message", response_model=InterviewMessage)
def post_transcript_message(
  session_id: str,
  payload: InterviewTranscriptAppendRequest,
  _user: dict = Depends(require_auth),
):
  uow = get_unit_of_work()
  return append_transcript_message(uow, session_id, payload)


@router.post("/{session_id}/end", response_model=InterviewSession)
def end_interview(session_id: str, _user: dict = Depends(require_auth)):
  uow = get_unit_of_work()
  return end_session(uow, session_id)
