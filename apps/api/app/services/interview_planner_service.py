"""
Interview planner (placeholder): future hook for structured question plans and rubric mapping.

When integrating an LLM, persist `plan_id` / `prompt_version` on the session or audit log
so each interview path remains auditable for human reviewers.
"""

INTERVIEW_PLANNER_VERSION = "placeholder_v0"


def describe_default_plan() -> dict:
  """Return metadata for the current deterministic phase sequence (no LLM)."""
  return {
    "planner_version": INTERVIEW_PLANNER_VERSION,
    "description": "Fixed phase sequence with heuristic follow-ups; replace with LLM planner when ready.",
  }
