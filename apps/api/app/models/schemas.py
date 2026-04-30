from enum import Enum
from typing import List, Literal, Optional

from pydantic import BaseModel, Field


class InterviewPhase(str, Enum):
  intro = "intro"
  resume_deep_dive = "resume_deep_dive"
  technical_probe = "technical_probe"
  behavioral_alignment = "behavioral_alignment"
  candidate_questions = "candidate_questions"
  closing = "closing"


class Candidate(BaseModel):
  id: str
  full_name: str
  email: str
  role_applied: str
  created_at: str


class InterviewSession(BaseModel):
  id: str
  candidate_id: str
  phase: InterviewPhase
  status: Literal["active", "completed"]
  started_at: str
  ended_at: Optional[str] = None


class InterviewMessage(BaseModel):
  id: str
  session_id: str
  sender: Literal["ai", "candidate"]
  content: str
  phase: InterviewPhase
  created_at: str


class RedFlag(BaseModel):
  label: str
  severity: Literal["low", "medium", "high"]
  evidence: str


class Scorecard(BaseModel):
  session_id: str
  technical_score: int = Field(ge=1, le=10)
  communication_score: int = Field(ge=1, le=10)
  ownership_score: int = Field(ge=1, le=10)
  alignment_score: int = Field(ge=1, le=10)
  match_score: int = Field(ge=0, le=100)
  strengths: List[str]
  growth_areas: List[str]
  red_flags: List[RedFlag]
  evidence: List[str]


class ReviewerNote(BaseModel):
  id: str
  candidate_id: str
  note: str
  created_at: str


class ResumeSummary(BaseModel):
  skills: List[str]
  projects: List[str]
  experience: List[str]
  suggested_probe_topics: List[str]


class CandidateCreateRequest(BaseModel):
  full_name: str
  email: str
  role_applied: str


class InterviewStartRequest(BaseModel):
  candidate_id: str
  resume_text: Optional[str] = None


class InterviewMessageRequest(BaseModel):
  message: str


class InterviewTurnResponse(BaseModel):
  message: str
  phase: InterviewPhase
  should_continue: bool


class ApplicantDetail(BaseModel):
  candidate: Candidate
  session: InterviewSession
  transcript: List[InterviewMessage]
  scorecard: Scorecard
  reviewer_notes: List[ReviewerNote]
