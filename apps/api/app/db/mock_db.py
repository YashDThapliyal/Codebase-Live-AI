from datetime import datetime
from typing import Dict, List

from app.models.schemas import Candidate, InterviewMessage, InterviewSession, ReviewerNote, Scorecard


class MockDB:
  def __init__(self):
    self.candidates: Dict[str, Candidate] = {}
    self.sessions: Dict[str, InterviewSession] = {}
    self.messages: Dict[str, List[InterviewMessage]] = {}
    self.scorecards: Dict[str, Scorecard] = {}
    self.notes: Dict[str, List[ReviewerNote]] = {}


mock_db = MockDB()


def now_iso() -> str:
  return datetime.utcnow().isoformat()
