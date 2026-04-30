"""Supabase-backed database implementation.

Uses the service role key so all writes bypass RLS; RLS is enforced
on the client side (frontend direct queries) but not here.
"""

import os
from typing import Dict, List, Optional

from supabase import Client, create_client

from app.models.schemas import (
  Candidate,
  InterviewMessage,
  InterviewSession,
  ReviewerNote,
  Scorecard,
  RedFlag,
)


def _make_client() -> Client:
  url = os.environ["SUPABASE_URL"]
  key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
  return create_client(url, key)


class _CandidateDict:
  """Dict-like proxy for candidates stored in Supabase."""

  def __init__(self, client: Client):
    self._c = client

  def get(self, candidate_id: str) -> Optional[Candidate]:
    res = self._c.table("candidates").select("*").eq("id", candidate_id).maybe_single().execute()
    return Candidate(**res.data) if res.data else None

  def __contains__(self, candidate_id: str) -> bool:
    return self.get(candidate_id) is not None

  def __setitem__(self, candidate_id: str, candidate: Candidate):
    self._c.table("candidates").upsert(candidate.model_dump()).execute()

  def values(self) -> List[Candidate]:
    res = self._c.table("candidates").select("*").execute()
    return [Candidate(**row) for row in (res.data or [])]


class _SessionDict:
  """Dict-like proxy for interview_sessions stored in Supabase."""

  def __init__(self, client: Client):
    self._c = client

  def get(self, session_id: str) -> Optional[InterviewSession]:
    res = self._c.table("interview_sessions").select("*").eq("id", session_id).maybe_single().execute()
    return InterviewSession(**res.data) if res.data else None

  def __contains__(self, session_id: str) -> bool:
    return self.get(session_id) is not None

  def __setitem__(self, session_id: str, session: InterviewSession):
    self._c.table("interview_sessions").upsert(session.model_dump()).execute()

  def values(self) -> List[InterviewSession]:
    res = self._c.table("interview_sessions").select("*").execute()
    return [InterviewSession(**row) for row in (res.data or [])]


class _MessageDict:
  """Dict-like proxy for interview_messages stored in Supabase."""

  def __init__(self, client: Client):
    self._c = client

  def get(self, session_id: str, default=None) -> List[InterviewMessage]:
    res = (
      self._c.table("interview_messages")
      .select("*")
      .eq("session_id", session_id)
      .order("created_at")
      .execute()
    )
    return [InterviewMessage(**row) for row in (res.data or [])]

  def __setitem__(self, session_id: str, messages: List[InterviewMessage]):
    # Full replace — used when initialising a new session with an empty list.
    if not messages:
      return
    self._c.table("interview_messages").upsert(
      [m.model_dump() for m in messages]
    ).execute()

  def append(self, session_id: str, message: InterviewMessage):
    self._c.table("interview_messages").insert(message.model_dump()).execute()


class _MessageList:
  """List-like proxy bound to a single session_id for append calls."""

  def __init__(self, proxy: "_MessageDict", session_id: str, items: List[InterviewMessage]):
    self._proxy = proxy
    self._session_id = session_id
    self._items = items

  def append(self, message: InterviewMessage):
    self._proxy.append(self._session_id, message)
    self._items.append(message)

  def __iter__(self):
    return iter(self._items)

  def __len__(self):
    return len(self._items)

  def __getitem__(self, idx):
    return self._items[idx]


class _MessageDictWithAppend(_MessageDict):
  """Extended proxy that returns a list-like object supporting .append."""

  def get(self, session_id: str, default=None):  # type: ignore[override]
    items = super().get(session_id, default)
    return _MessageList(self, session_id, items)

  def __setitem__(self, session_id: str, messages):
    if isinstance(messages, _MessageList):
      messages = list(messages)
    super().__setitem__(session_id, messages)


class _ScorecardDict:
  """Dict-like proxy for scorecards stored in Supabase."""

  def __init__(self, client: Client):
    self._c = client

  def get(self, session_id: str) -> Optional[Scorecard]:
    res = self._c.table("scorecards").select("*").eq("session_id", session_id).maybe_single().execute()
    if not res.data:
      return None
    row = res.data
    row["red_flags"] = [RedFlag(**f) for f in (row.get("red_flags") or [])]
    return Scorecard(**row)

  def __setitem__(self, session_id: str, scorecard: Scorecard):
    self._c.table("scorecards").upsert(scorecard.model_dump()).execute()


class _NoteDict:
  """Dict-like proxy for reviewer_notes stored in Supabase."""

  def __init__(self, client: Client):
    self._c = client

  def get(self, candidate_id: str, default=None) -> List[ReviewerNote]:
    res = (
      self._c.table("reviewer_notes")
      .select("*")
      .eq("candidate_id", candidate_id)
      .order("created_at")
      .execute()
    )
    return [ReviewerNote(**row) for row in (res.data or [])]


class SupabaseDB:
  """Drop-in replacement for MockDB backed by Supabase."""

  def __init__(self):
    client = _make_client()
    self.candidates = _CandidateDict(client)
    self.sessions = _SessionDict(client)
    self.messages = _MessageDictWithAppend(client)
    self.scorecards = _ScorecardDict(client)
    self.notes = _NoteDict(client)
