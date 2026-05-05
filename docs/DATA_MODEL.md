# Data Model

## Core Entities

- **Candidate** — applicant profile (`candidates` table in SQL migrations).
- **InterviewSession** — one run of an interview; includes **interview phase** (rubric section) and **lifecycle status** (workflow).
- **InterviewMessage** — one line from `ai` or `candidate`, tied to a session and phase.
- **Scorecard** — heuristic or future LLM output; includes `grader_version` and optional `prompt_version` for auditability.
- **ReviewerNote** — human reviewer comments (stored per candidate).
- **AuditLogEntry** — append-only in-memory audit trail in the MVP backend (mirror to `audit_logs` table when moving to Postgres).

## Interview phase vs lifecycle

- **Phase** (`InterviewPhase`): `intro`, `resume_deep_dive`, `technical_probe`, `behavioral_alignment`, `candidate_questions`, `closing` — where the interviewer is in the structured script.
- **Lifecycle** (`InterviewLifecycleStatus`): `created`, `lobby`, `active`, `completed`, `grading`, `reviewed` — operational state for evidence-based review (not auto-hire).

## Relationships

- Candidate 1:N InterviewSession
- InterviewSession 1:N InterviewMessage
- InterviewSession 0:1 Scorecard (after grading)
- Candidate 1:N ReviewerNote

## Persistence (implementation)

- **Runtime (local default):** in-memory stores behind repository protocols (`app/repositories/memory.py`). Process restart clears data.
- **SQL:** `supabase/migrations/001_init.sql` defines `interview_sessions.status` as text — store **`lifecycle_status`** string values there when implementing the Postgres adapter. Add scorecard and audit tables in later migrations as needed (`003_scorecards.sql` exists for scorecard-shaped data).
- **RLS** is placeholder-only; must be hardened before production.

## Repository layer

Application code uses:

- `CandidateRepository`, `InterviewRepository`, `ScorecardRepository`, `ReviewerNoteRepository`, `AuditLogRepository`

Swap **in-memory** implementations for Supabase/Postgres without changing route handlers.
