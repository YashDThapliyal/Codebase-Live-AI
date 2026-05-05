"""
Heuristic grader: variable scores and evidence tied to actual transcript lines.

Does not claim capabilities beyond pattern matching on text; avoids unsupported claims.
"""

import re
from typing import List

from app.models.schemas import InterviewMessage, RedFlag, Scorecard


def _candidate_utterances(transcript: list[InterviewMessage]) -> list[str]:
  return [m.content.strip() for m in transcript if m.sender == "candidate" and m.content.strip()]


def _snippet(text: str, max_len: int = 120) -> str:
  t = re.sub(r"\s+", " ", text).strip()
  if len(t) <= max_len:
    return t
  return t[: max_len - 1] + "…"


def build_heuristic_scorecard(session_id: str, transcript: list[InterviewMessage]) -> Scorecard:
  """
  Derive scores and evidence from transcript statistics and light keyword cues.

  Evidence bullets reference real candidate message snippets when available.
  """
  candidates = _candidate_utterances(transcript)
  word_counts = [len(u.split()) for u in candidates]
  avg_words = sum(word_counts) / len(word_counts) if word_counts else 0
  total_candidate_turns = len(candidates)
  total_turns = len(transcript)

  combined = " ".join(candidates).lower()
  tech_hits = sum(
    1
    for kw in (
      "api",
      "database",
      "sql",
      "latency",
      "cache",
      "queue",
      "deploy",
      "kubernetes",
      "docker",
      "microservice",
      "test",
      "monitor",
      "observability",
      "tradeoff",
      "scale",
    )
    if kw in combined
  )
  ownership_hits = sum(
    1 for phrase in ("i owned", "i led", "my team", "production", "on-call", "incident") if phrase in combined
  )
  align_hits = sum(
    1 for phrase in ("stakeholder", "user", "customer", "priority", "constraint", "goal") if phrase in combined
  )

  technical_score = min(10, max(3, 4 + min(4, tech_hits // 2) + (1 if avg_words > 25 else 0)))
  communication_score = min(10, max(3, 4 + min(3, int(avg_words // 20)) + (1 if total_candidate_turns >= 4 else 0)))
  ownership_score = min(10, max(3, 4 + min(4, ownership_hits + (1 if "ship" in combined or "launch" in combined else 0))))
  alignment_score = min(10, max(3, 4 + min(3, align_hits)))

  match_score = int(
    round(
      (technical_score + communication_score + ownership_score + alignment_score) / 40 * 100
    )
  )

  evidence: List[str] = []
  if candidates:
    evidence.append(
      f"Candidate provided {total_candidate_turns} answer turn(s); example: “{_snippet(candidates[0])}”"
    )
    if len(candidates) > 1:
      evidence.append(f"Later answer excerpt: “{_snippet(candidates[-1])}”")
  else:
    evidence.append("No candidate answers were captured in the transcript; scores reflect absence of content.")

  if total_turns:
    evidence.append(f"Transcript length: {total_turns} total message(s) including interviewer prompts.")

  if avg_words < 15 and candidates:
    evidence.append("Several answers are short on detail (low average word count per answer).")

  strengths: List[str] = []
  growth_areas: List[str] = []

  if tech_hits >= 2:
    strengths.append("Uses technical vocabulary and concrete implementation context in answers.")
  else:
    growth_areas.append("Add more specific technical detail (design, constraints, validation, or metrics).")

  if ownership_hits >= 1:
    strengths.append("References ownership, delivery, or production-like responsibility.")
  else:
    growth_areas.append("Clarify personal ownership and impact with a concrete example.")

  if communication_score >= 7:
    strengths.append("Responses are generally structured and sufficiently detailed for review.")
  elif candidates:
    growth_areas.append("Expand answers with situation, action, and measurable outcome where possible.")

  if align_hits >= 1:
    strengths.append("Mentions priorities, users, or constraints relevant to team alignment.")
  elif candidates:
    growth_areas.append("Connect work to user or business constraints to demonstrate product thinking.")

  red_flags: List[RedFlag] = []
  if total_candidate_turns == 0 and total_turns > 0:
    red_flags.append(
      RedFlag(
        label="No candidate responses captured",
        severity="high",
        evidence="Transcript contains interviewer lines but no candidate answers to evaluate.",
      )
    )
  elif avg_words < 8 and total_candidate_turns >= 2:
    red_flags.append(
      RedFlag(
        label="Very brief answers",
        severity="medium",
        evidence="Average answer length is extremely short; limited substance for evidence-based review.",
      )
    )

  if re.search(r"\b(i don't know|idk|no idea)\b", combined):
    red_flags.append(
      RedFlag(
        label="Explicit uncertainty without follow-up",
        severity="low",
        evidence="Candidate stated uncertainty; verify depth in a follow-up interview if proceeding.",
      )
    )

  return Scorecard(
    session_id=session_id,
    technical_score=technical_score,
    communication_score=communication_score,
    ownership_score=ownership_score,
    alignment_score=alignment_score,
    match_score=match_score,
    strengths=strengths or ["Completed the structured interview flow."]
    if candidates
    else ["Insufficient candidate content to highlight strengths."],
    growth_areas=growth_areas or ["Provide richer examples if invited to a follow-up round."],
    red_flags=red_flags,
    evidence=evidence,
    grader_version="heuristic_v1",
    prompt_version=None,
  )


# Backward-compatible name used in earlier code paths
def build_mock_scorecard(session_id: str, transcript: list[InterviewMessage]) -> Scorecard:
  return build_heuristic_scorecard(session_id, transcript)
