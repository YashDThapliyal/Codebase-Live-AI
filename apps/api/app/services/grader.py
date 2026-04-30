from app.models.schemas import InterviewMessage, RedFlag, Scorecard


def build_mock_scorecard(session_id: str, transcript: list[InterviewMessage]) -> Scorecard:
  evidence = [
    "Candidate explained concrete tradeoff decisions in technical discussion.",
    "Candidate referenced ownership in at least one production-like example.",
  ]

  if transcript:
    evidence.append(f"Transcript contained {len(transcript)} captured turns for review.")

  red_flags = [
    RedFlag(
      label="Limited measurable outcomes",
      severity="low",
      evidence="Some answers lacked quantifiable impact.",
    )
  ]

  return Scorecard(
    session_id=session_id,
    technical_score=8,
    communication_score=7,
    ownership_score=8,
    alignment_score=7,
    match_score=80,
    strengths=["Solid technical fundamentals", "Clear architecture reasoning"],
    growth_areas=["Add more measurable impact metrics in examples"],
    red_flags=red_flags,
    evidence=evidence,
  )
