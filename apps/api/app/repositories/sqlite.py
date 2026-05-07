import json
import os
import sqlite3
from dataclasses import dataclass
from typing import List, Optional

from app.models.schemas import (
  AuditLogEntry,
  Candidate,
  InterviewLifecycleStatus,
  InterviewMessage,
  InterviewPhase,
  InterviewSession,
  RedFlag,
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


def _dict_factory(cursor: sqlite3.Cursor, row: sqlite3.Row):
  d = {}
  for idx, col in enumerate(cursor.description):
    d[col[0]] = row[idx]
  return d


def init_sqlite(path: str) -> sqlite3.Connection:
  os.makedirs(os.path.dirname(path), exist_ok=True)
  conn = sqlite3.connect(path, check_same_thread=False)
  conn.row_factory = _dict_factory

  conn.executescript(
    """
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS candidates (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      role_applied TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS interview_sessions (
      id TEXT PRIMARY KEY,
      candidate_id TEXT NOT NULL,
      phase TEXT NOT NULL,
      lifecycle_status TEXT NOT NULL,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      interviewer_prompt_version TEXT
    );

    CREATE TABLE IF NOT EXISTS interview_messages (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      sender TEXT NOT NULL,
      content TEXT NOT NULL,
      phase TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS scorecards (
      session_id TEXT PRIMARY KEY,
      technical_score INTEGER NOT NULL,
      communication_score INTEGER NOT NULL,
      ownership_score INTEGER NOT NULL,
      alignment_score INTEGER NOT NULL,
      match_score INTEGER NOT NULL,
      strengths TEXT NOT NULL,
      growth_areas TEXT NOT NULL,
      red_flags TEXT NOT NULL,
      evidence TEXT NOT NULL,
      grader_version TEXT NOT NULL,
      prompt_version TEXT
    );

    CREATE TABLE IF NOT EXISTS reviewer_notes (
      id TEXT PRIMARY KEY,
      candidate_id TEXT NOT NULL,
      note TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      detail TEXT
    );
    """
  )
  conn.commit()
  return conn


class SQLiteCandidateRepository(CandidateRepository):
  def __init__(self, conn: sqlite3.Connection):
    self._c = conn

  def create(self, candidate: Candidate) -> Candidate:
    self._c.execute(
      "INSERT OR REPLACE INTO candidates (id, full_name, email, role_applied, created_at) VALUES (?, ?, ?, ?, ?)",
      (candidate.id, candidate.full_name, candidate.email, candidate.role_applied, candidate.created_at),
    )
    self._c.commit()
    return candidate

  def get(self, candidate_id: str) -> Optional[Candidate]:
    row = self._c.execute("SELECT * FROM candidates WHERE id = ?", (candidate_id,)).fetchone()
    return Candidate(**row) if row else None

  def list_all(self) -> List[Candidate]:
    rows = self._c.execute("SELECT * FROM candidates ORDER BY created_at DESC").fetchall()
    return [Candidate(**r) for r in rows]


class SQLiteInterviewRepository(InterviewRepository):
  def __init__(self, conn: sqlite3.Connection):
    self._c = conn

  def create_session(self, session: InterviewSession) -> InterviewSession:
    self._c.execute(
      "INSERT OR REPLACE INTO interview_sessions (id, candidate_id, phase, lifecycle_status, started_at, ended_at, interviewer_prompt_version) VALUES (?, ?, ?, ?, ?, ?, ?)",
      (
        session.id,
        session.candidate_id,
        session.phase.value,
        session.lifecycle_status.value,
        session.started_at,
        session.ended_at,
        session.interviewer_prompt_version,
      ),
    )
    self._c.commit()
    return session

  def get_session(self, session_id: str) -> Optional[InterviewSession]:
    row = self._c.execute("SELECT * FROM interview_sessions WHERE id = ?", (session_id,)).fetchone()
    if not row:
      return None
    return InterviewSession(
      id=row["id"],
      candidate_id=row["candidate_id"],
      phase=InterviewPhase(row["phase"]),
      lifecycle_status=InterviewLifecycleStatus(row["lifecycle_status"]),
      started_at=row["started_at"],
      ended_at=row.get("ended_at"),
      interviewer_prompt_version=row.get("interviewer_prompt_version"),
    )

  def update_session(self, session: InterviewSession) -> InterviewSession:
    return self.create_session(session)

  def list_sessions_for_candidate(self, candidate_id: str) -> List[InterviewSession]:
    rows = self._c.execute("SELECT * FROM interview_sessions WHERE candidate_id = ? ORDER BY started_at DESC", (candidate_id,)).fetchall()
    return [
      InterviewSession(
        id=r["id"],
        candidate_id=r["candidate_id"],
        phase=InterviewPhase(r["phase"]),
        lifecycle_status=InterviewLifecycleStatus(r["lifecycle_status"]),
        started_at=r["started_at"],
        ended_at=r.get("ended_at"),
        interviewer_prompt_version=r.get("interviewer_prompt_version"),
      )
      for r in rows
    ]

  def list_sessions(self) -> List[InterviewSession]:
    rows = self._c.execute("SELECT * FROM interview_sessions ORDER BY started_at DESC").fetchall()
    return [
      InterviewSession(
        id=r["id"],
        candidate_id=r["candidate_id"],
        phase=InterviewPhase(r["phase"]),
        lifecycle_status=InterviewLifecycleStatus(r["lifecycle_status"]),
        started_at=r["started_at"],
        ended_at=r.get("ended_at"),
        interviewer_prompt_version=r.get("interviewer_prompt_version"),
      )
      for r in rows
    ]

  def append_message(self, message: InterviewMessage) -> InterviewMessage:
    self._c.execute(
      "INSERT OR REPLACE INTO interview_messages (id, session_id, sender, content, phase, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      (message.id, message.session_id, message.sender, message.content, message.phase.value, message.created_at),
    )
    self._c.commit()
    return message

  def list_messages(self, session_id: str) -> List[InterviewMessage]:
    rows = self._c.execute(
      "SELECT * FROM interview_messages WHERE session_id = ? ORDER BY created_at ASC", (session_id,)
    ).fetchall()
    return [
      InterviewMessage(
        id=r["id"],
        session_id=r["session_id"],
        sender=r["sender"],
        content=r["content"],
        phase=InterviewPhase(r["phase"]),
        created_at=r["created_at"],
      )
      for r in rows
    ]


class SQLiteScorecardRepository(ScorecardRepository):
  def __init__(self, conn: sqlite3.Connection):
    self._c = conn

  def upsert(self, scorecard: Scorecard) -> Scorecard:
    self._c.execute(
      """
      INSERT OR REPLACE INTO scorecards
      (session_id, technical_score, communication_score, ownership_score, alignment_score, match_score,
       strengths, growth_areas, red_flags, evidence, grader_version, prompt_version)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      """,
      (
        scorecard.session_id,
        scorecard.technical_score,
        scorecard.communication_score,
        scorecard.ownership_score,
        scorecard.alignment_score,
        scorecard.match_score,
        json.dumps(scorecard.strengths),
        json.dumps(scorecard.growth_areas),
        json.dumps([rf.model_dump() for rf in scorecard.red_flags]),
        json.dumps(scorecard.evidence),
        scorecard.grader_version,
        scorecard.prompt_version,
      ),
    )
    self._c.commit()
    return scorecard

  def get_for_session(self, session_id: str) -> Optional[Scorecard]:
    row = self._c.execute("SELECT * FROM scorecards WHERE session_id = ?", (session_id,)).fetchone()
    if not row:
      return None
    return Scorecard(
      session_id=row["session_id"],
      technical_score=row["technical_score"],
      communication_score=row["communication_score"],
      ownership_score=row["ownership_score"],
      alignment_score=row["alignment_score"],
      match_score=row["match_score"],
      strengths=json.loads(row["strengths"]),
      growth_areas=json.loads(row["growth_areas"]),
      red_flags=[RedFlag(**rf) for rf in json.loads(row["red_flags"])],
      evidence=json.loads(row["evidence"]),
      grader_version=row["grader_version"],
      prompt_version=row.get("prompt_version"),
    )


class SQLiteReviewerNoteRepository(ReviewerNoteRepository):
  def __init__(self, conn: sqlite3.Connection):
    self._c = conn

  def list_for_candidate(self, candidate_id: str) -> List[ReviewerNote]:
    rows = self._c.execute(
      "SELECT * FROM reviewer_notes WHERE candidate_id = ? ORDER BY created_at ASC", (candidate_id,)
    ).fetchall()
    return [ReviewerNote(**r) for r in rows]

  def create(self, note: ReviewerNote) -> ReviewerNote:
    self._c.execute(
      "INSERT OR REPLACE INTO reviewer_notes (id, candidate_id, note, created_at) VALUES (?, ?, ?, ?)",
      (note.id, note.candidate_id, note.note, note.created_at),
    )
    self._c.commit()
    return note


class SQLiteAuditLogRepository(AuditLogRepository):
  def __init__(self, conn: sqlite3.Connection):
    self._c = conn

  def append(self, entry: AuditLogEntry) -> AuditLogEntry:
    self._c.execute(
      "INSERT OR REPLACE INTO audit_logs (id, action, entity_type, entity_id, created_at, detail) VALUES (?, ?, ?, ?, ?, ?)",
      (entry.id, entry.action, entry.entity_type, entry.entity_id, entry.created_at, entry.detail),
    )
    self._c.commit()
    return entry

  def list_recent(self, limit: int = 100) -> List[AuditLogEntry]:
    rows = self._c.execute(
      "SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT ?", (limit,)
    ).fetchall()
    return [AuditLogEntry(**r) for r in rows]


@dataclass
class SQLiteUnitOfWork:
  conn: sqlite3.Connection
  candidates: SQLiteCandidateRepository
  interviews: SQLiteInterviewRepository
  scorecards: SQLiteScorecardRepository
  reviewer_notes: SQLiteReviewerNoteRepository
  audit_logs: SQLiteAuditLogRepository


def build_sqlite_uow(path: str) -> SQLiteUnitOfWork:
  conn = init_sqlite(path)
  return SQLiteUnitOfWork(
    conn=conn,
    candidates=SQLiteCandidateRepository(conn),
    interviews=SQLiteInterviewRepository(conn),
    scorecards=SQLiteScorecardRepository(conn),
    reviewer_notes=SQLiteReviewerNoteRepository(conn),
    audit_logs=SQLiteAuditLogRepository(conn),
  )
