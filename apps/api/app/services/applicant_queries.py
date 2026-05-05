"""Assemble admin applicant views from repositories (read models for human review)."""

from typing import List, Optional

from app.models.schemas import ApplicantDetail, InterviewSession
from app.repositories.memory import InMemoryUnitOfWork


def _latest_session(uow: InMemoryUnitOfWork, candidate_id: str) -> Optional[InterviewSession]:
  sessions = uow.interviews.list_sessions_for_candidate(candidate_id)
  if not sessions:
    return None
  return max(sessions, key=lambda s: s.started_at)


def build_applicant_detail(uow: InMemoryUnitOfWork, candidate_id: str) -> Optional[ApplicantDetail]:
  candidate = uow.candidates.get(candidate_id)
  if not candidate:
    return None
  session = _latest_session(uow, candidate_id)
  if not session:
    return None
  transcript = uow.interviews.list_messages(session.id)
  scorecard = uow.scorecards.get_for_session(session.id)
  notes = uow.reviewer_notes.list_for_candidate(candidate_id)
  return ApplicantDetail(
    candidate=candidate,
    session=session,
    transcript=transcript,
    scorecard=scorecard,
    reviewer_notes=notes,
  )


def list_applicant_summaries(uow: InMemoryUnitOfWork) -> List[ApplicantDetail]:
  """One row per candidate who has at least one session, using the latest session."""
  candidate_ids = {s.candidate_id for s in uow.interviews.list_sessions()}
  details: List[ApplicantDetail] = []
  for cid in candidate_ids:
    d = build_applicant_detail(uow, cid)
    if d:
      details.append(d)

  def sort_key(d: ApplicantDetail) -> tuple:
    if d.scorecard is None:
      return (1, 0)
    return (0, -d.scorecard.match_score)

  details.sort(key=sort_key)
  return details
