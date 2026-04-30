from app.models.schemas import InterviewPhase

PHASE_SEQUENCE = [
  InterviewPhase.intro,
  InterviewPhase.resume_deep_dive,
  InterviewPhase.technical_probe,
  InterviewPhase.behavioral_alignment,
  InterviewPhase.candidate_questions,
  InterviewPhase.closing,
]


def next_phase(current: InterviewPhase) -> InterviewPhase:
  idx = PHASE_SEQUENCE.index(current)
  if idx >= len(PHASE_SEQUENCE) - 1:
    return InterviewPhase.closing
  return PHASE_SEQUENCE[idx + 1]


def should_advance_phase(answer_count_in_phase: int) -> bool:
  # Keep this simple for MVP. Person 1 can tune thresholds per phase.
  return answer_count_in_phase >= 2
