"""
Interviewer service: deterministic, transcript-aware interviewer turns for text MVP.

Future LLM integration should replace `generate_interviewer_turn` internals while
keeping the same boundary and returning `InterviewTurnResponse`.
"""

from app.models.schemas import InterviewPhase, InterviewTurnResponse
from app.services.interview_controller import next_phase, should_advance_phase

PHASE_QUESTIONS = {
  InterviewPhase.intro: "Tell me briefly about your background and what role you are targeting.",
  InterviewPhase.resume_deep_dive: "From your resume, which project best reflects production ownership and why?",
  InterviewPhase.technical_probe: "Describe a technical challenge you solved and the tradeoffs you considered.",
  InterviewPhase.behavioral_alignment: "Tell me about a time you handled ambiguity with limited guidance.",
  InterviewPhase.candidate_questions: "What questions do you have about the team, role, or codebase expectations?",
  InterviewPhase.closing: "Thanks for your time. Any final point you want reviewers to remember?",
}

INTERVIEWER_PROMPT_VERSION = "deterministic_v1"


def opening_message_for_phase(phase: InterviewPhase) -> str:
  """First interviewer line shown when a session moves from lobby to active."""
  return PHASE_QUESTIONS[phase]


def generate_interviewer_turn(
  current_phase: InterviewPhase,
  candidate_message: str,
  answer_count_in_phase: int,
) -> InterviewTurnResponse:
  """
  Produce the next AI interviewer turn given the candidate's latest answer.

  Short answers get a follow-up in the same phase without advancing the rubric phase.
  """
  short_answer = len(candidate_message.strip().split()) < 12

  if short_answer and current_phase != InterviewPhase.closing:
    return InterviewTurnResponse(
      message="Thanks. Can you add one concrete example with outcome, ownership, and impact?",
      phase=current_phase,
      should_continue=True,
    )

  if should_advance_phase(answer_count_in_phase):
    phase = next_phase(current_phase)
  else:
    phase = current_phase

  should_continue = phase != InterviewPhase.closing

  return InterviewTurnResponse(
    message=PHASE_QUESTIONS[phase],
    phase=phase,
    should_continue=should_continue,
  )
