from app.models.schemas import ResumeSummary


def parse_resume_mock(_resume_text: str | None) -> ResumeSummary:
  return ResumeSummary(
    skills=["Python", "FastAPI", "PostgreSQL", "React"],
    projects=["Interview platform", "Event-driven API service"],
    experience=["Built backend services", "Shipped production features"],
    suggested_probe_topics=[
      "API design tradeoffs",
      "Reliability and observability",
      "Ownership under ambiguity",
    ],
  )
