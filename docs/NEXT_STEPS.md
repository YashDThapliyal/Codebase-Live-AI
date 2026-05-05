# Next Steps

## Person 1 (AI Interview Engine) Next Tasks

- Optional LLM-backed interviewer with the same `InterviewTurnResponse` boundary; record `prompt_version` on sessions or audit log.
- Tune phase-specific follow-up logic in `interviewer_service` / `interview_controller`.
- Realtime API contract hardening when voice becomes production-critical.

## Person 2 (Backend / Data / Supabase) Next Tasks

- Implement Postgres/Supabase repositories conforming to `app/repositories/protocols.py`.
- Map `InterviewLifecycleStatus` to `interview_sessions.status` (or rename column) in migrations.
- Harden request/response validation and structured API errors.
- Persist `AuditLogEntry` to a durable table.

## Person 3 (Product Integration / Admin Review / QA) Next Tasks

- Admin filtering/search and export for review workflows.
- Optional: reviewer note authoring via API (create/update) with auth.
- QA scripts for candidate → grading → admin list on staging with real Supabase.

## Integration Checklist

- Backend Pydantic schemas match `apps/web/lib/types.ts`.
- Text interview completes with transcript + grading + admin visibility.
- Grading output references transcript content in `evidence` (heuristic MVP).
- Voice path remains optional; failures fall back to text in the UI.

## Demo Checklist

- Candidate: login → lobby → start session → text interview → end → grading.
- Admin: applicants list sorts scored rows first; pending scorecards show gracefully.
- Detail: session lifecycle, transcript, scorecard evidence, red flags, notes.
