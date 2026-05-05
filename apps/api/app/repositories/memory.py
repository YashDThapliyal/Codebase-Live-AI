from dataclasses import dataclass, field
from typing import Dict, List, Optional

from app.models.schemas import (
  AuditLogEntry,
  Candidate,
  InterviewMessage,
  InterviewSession,
  ReviewerNote,
  Scorecard,
)
from app.repositories.protocols import (
  AuditLogRepository,
  CandidateRepository,
  InterviewRepository,
  ReviewerNoteRepository,
  ScorecardRepository,
)


@dataclass
class InMemoryStores:
  """Mutable stores for in-process MVP; replace with Postgres/Supabase adapter later."""

  candidates: Dict[str, Candidate] = field(default_factory=dict)
  sessions: Dict[str, InterviewSession] = field(default_factory=dict)
  messages: Dict[str, List[InterviewMessage]] = field(default_factory=dict)
  scorecards: Dict[str, Scorecard] = field(default_factory=dict)
  notes: Dict[str, List[ReviewerNote]] = field(default_factory=dict)
  audit_logs: List[AuditLogEntry] = field(default_factory=list)


class InMemoryCandidateRepository(CandidateRepository):
  def __init__(self, stores: InMemoryStores):
    self._s = stores

  def create(self, candidate: Candidate) -> Candidate:
    self._s.candidates[candidate.id] = candidate
    return candidate

  def get(self, candidate_id: str) -> Optional[Candidate]:
    return self._s.candidates.get(candidate_id)

  def list_all(self) -> List[Candidate]:
    return list(self._s.candidates.values())


class InMemoryInterviewRepository(InterviewRepository):
  def __init__(self, stores: InMemoryStores):
    self._s = stores

  def create_session(self, session: InterviewSession) -> InterviewSession:
    self._s.sessions[session.id] = session
    self._s.messages.setdefault(session.id, [])
    return session

  def get_session(self, session_id: str) -> Optional[InterviewSession]:
    return self._s.sessions.get(session_id)

  def update_session(self, session: InterviewSession) -> InterviewSession:
    self._s.sessions[session.id] = session
    return session

  def list_sessions_for_candidate(self, candidate_id: str) -> List[InterviewSession]:
    return [s for s in self._s.sessions.values() if s.candidate_id == candidate_id]

  def list_sessions(self) -> List[InterviewSession]:
    return list(self._s.sessions.values())

  def append_message(self, message: InterviewMessage) -> InterviewMessage:
    self._s.messages.setdefault(message.session_id, []).append(message)
    return message

  def list_messages(self, session_id: str) -> List[InterviewMessage]:
    return list(self._s.messages.get(session_id, []))


class InMemoryScorecardRepository(ScorecardRepository):
  def __init__(self, stores: InMemoryStores):
    self._s = stores

  def upsert(self, scorecard: Scorecard) -> Scorecard:
    self._s.scorecards[scorecard.session_id] = scorecard
    return scorecard

  def get_for_session(self, session_id: str) -> Optional[Scorecard]:
    return self._s.scorecards.get(session_id)


class InMemoryReviewerNoteRepository(ReviewerNoteRepository):
  def __init__(self, stores: InMemoryStores):
    self._s = stores

  def list_for_candidate(self, candidate_id: str) -> List[ReviewerNote]:
    return list(self._s.notes.get(candidate_id, []))

  def create(self, note: ReviewerNote) -> ReviewerNote:
    self._s.notes.setdefault(note.candidate_id, []).append(note)
    return note


class InMemoryAuditLogRepository(AuditLogRepository):
  def __init__(self, stores: InMemoryStores):
    self._s = stores

  def append(self, entry: AuditLogEntry) -> AuditLogEntry:
    self._s.audit_logs.append(entry)
    return entry

  def list_recent(self, limit: int = 100) -> List[AuditLogEntry]:
    return self._s.audit_logs[-limit:]


@dataclass
class InMemoryUnitOfWork:
  stores: InMemoryStores
  candidates: InMemoryCandidateRepository
  interviews: InMemoryInterviewRepository
  scorecards: InMemoryScorecardRepository
  reviewer_notes: InMemoryReviewerNoteRepository
  audit_logs: InMemoryAuditLogRepository


def build_in_memory_uow(stores: Optional[InMemoryStores] = None) -> InMemoryUnitOfWork:
  s = stores or InMemoryStores()
  return InMemoryUnitOfWork(
    stores=s,
    candidates=InMemoryCandidateRepository(s),
    interviews=InMemoryInterviewRepository(s),
    scorecards=InMemoryScorecardRepository(s),
    reviewer_notes=InMemoryReviewerNoteRepository(s),
    audit_logs=InMemoryAuditLogRepository(s),
  )


# Singleton stores for the running process (MVP)
_default_stores = InMemoryStores()
_default_uow = build_in_memory_uow(_default_stores)


def get_unit_of_work() -> InMemoryUnitOfWork:
  return _default_uow


def reset_unit_of_work_for_tests() -> InMemoryUnitOfWork:
  """Test helper: replace stores with empty state."""
  global _default_stores, _default_uow
  _default_stores = InMemoryStores()
  _default_uow = build_in_memory_uow(_default_stores)
  return _default_uow
