"""
Grading service: evidence-linked heuristic scorecards for human review (not auto-hire).

Future LLM grading should implement the same `Scorecard` contract and set `prompt_version`.
"""

from app.models.schemas import InterviewMessage, Scorecard
from app.services.grader import build_heuristic_scorecard


def grade_session_from_transcript(session_id: str, transcript: list[InterviewMessage]) -> Scorecard:
  """Build and return a scorecard from the persisted transcript."""
  return build_heuristic_scorecard(session_id, transcript)
