"""
Resume parsing service boundary.

Delegates to mock parsing today; swap implementation for real extraction later.
"""

from app.models.schemas import ResumeSummary
from app.services.resume_parser import parse_resume_mock


def parse_resume(resume_text: str | None) -> ResumeSummary:
  """Parse resume text into structured hints for interview planning (mock)."""
  return parse_resume_mock(resume_text)
