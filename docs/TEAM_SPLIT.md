# Team Split

## Person 1: AI Interview Engine Owner
Owns:
- `apps/api/app/services/interview_controller.py`
- `apps/api/app/services/interviewer.py`
- `apps/api/app/services/grader.py`
- `apps/api/app/services/resume_parser.py`
- `apps/api/app/services/realtime.py`
- `docs/RUBRIC.md`
- `docs/REALTIME_PLAN.md`

Builds:
- Interview phase state machine
- Resume-aware question generation
- Follow-up logic
- Mock grader agent
- Scorecard structure
- Future OpenAI Realtime API integration plan

## Person 2: Backend / Data / Supabase Owner
Owns:
- `apps/api/main.py`
- `apps/api/app/routes/**`
- `apps/api/app/models/**`
- `apps/api/app/db/**`
- `supabase/**`
- `docs/API_CONTRACT.md`
- `docs/DATA_MODEL.md`

Builds:
- FastAPI app
- Candidate/session/message/scorecard routes
- Mock DB first
- Supabase-ready schema and migrations
- Storage/auth/RLS placeholders
- Clean backend API contracts

## Person 3: Product Integration / Admin Review / QA Owner
Owns:
- `apps/web/app/admin/**`
- `apps/web/components/admin/**`
- `apps/web/lib/api.ts`
- `apps/web/lib/types.ts`
- `docs/PHASE_PLAN.md`
- `docs/NEXT_STEPS.md`

Builds:
- Admin review dashboard behavior
- Applicant roster
- Candidate detail page
- Transcript viewer
- Scorecard viewer
- Reviewer notes placeholder
- End-to-end demo flow
- Integration QA

## Codex-Generated Frontend Scaffold
Frontend scaffold has been generated to reduce manual UI work.

Guidelines:
- Keep UI changes simple and demo-focused
- Prioritize backend/AI integration over pixel polish
- Treat current frontend as replaceable scaffolding
