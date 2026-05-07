# Codebase Live AI

Codebase Live AI is an evidence-based interview review platform for Codebase recruiting. It helps candidates complete a structured interview, stores the transcript, generates an evidence-linked scorecard, and gives human reviewers a lightweight admin view for final review.

The goal is not to auto-hire candidates. The app is built around human-in-the-loop review: AI-assisted interviewing and grading create consistent evidence, while the final decision still belongs to the reviewer.

## What It Does

- Runs a guided candidate interview through a clean web flow.
- Supports both text interview and optional OpenAI Realtime voice interview.
- Persists users, candidates, interview sessions, transcripts, and scorecards in local SQLite.
- Generates heuristic scorecards with transcript-backed evidence, red flags, strengths, and interview lifecycle status.
- Provides an admin applicant list and applicant detail view for reviewing transcripts and scorecards.
- Uses local email/password auth with signed session cookies and role-based admin protection.

## Tech Stack

- `apps/web`: Next.js, React, TypeScript, and Tailwind CSS.
- `apps/api`: FastAPI, Pydantic, SQLite, and pytest.
- `docs`: API contract, data model, scoring rubric, phase plan, and team ownership notes.
- `supabase/migrations`: Supabase-ready schema work for a future hosted database adapter.

## Current Product State

The project is a working MVP with a complete candidate-to-admin review loop.

Candidates can register or log in, create their applicant profile, enter the interview lobby, complete a text or voice-capable interview, and finish the session. The backend stores the session transcript and can produce a scorecard. Admin users can then open the applicant dashboard, see submitted candidates, inspect interview transcripts, and review the generated scorecard.

The text interview path is the most reliable demo path. Voice interview support is included as a progressive enhancement through OpenAI Realtime and can be enabled by adding a backend `OPENAI_API_KEY`.

## Project Structure

```text
.
+-- apps
|   +-- api          # FastAPI backend, auth, repositories, interview services, tests
|   +-- web          # Next.js frontend for candidate and admin flows
+-- docs             # Product spec, API contract, rubric, data model, planning docs
+-- supabase         # Supabase migration/schema groundwork
+-- .env.example     # Local environment template
```

## Running Locally

### Prerequisites

- Node.js 20+
- Python 3.11+
- pip

### 1. Configure Environment

From the repo root:

```bash
cp .env.example .env
```

For local development, the defaults are enough for the text interview flow. Set `AUTH_SECRET` to any long random string before sharing or demoing the app. Add `OPENAI_API_KEY` only if you want to test Realtime voice.

Important environment variables:

- `NEXT_PUBLIC_API_URL`: frontend API base URL, defaulting to `http://localhost:8000`.
- `NEXT_PUBLIC_USE_MOCK_DATA`: set to `true` only for offline/mock frontend demos.
- `AUTH_SECRET`: secret used to sign local session tokens.
- `SQLITE_DB_PATH`: SQLite database location, defaulting to `data/codebase_live_ai.db` from `apps/api`.
- `OPENAI_API_KEY`: backend-only key for optional Realtime voice support.
- `OPENAI_REALTIME_MODEL`: realtime model name used by the voice session endpoint.

### 2. Run the API

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API runs at `http://localhost:8000`.

### 3. Run the Web App

In a second terminal:

```bash
cd apps/web
npm install
npm run dev
```

The web app runs at `http://localhost:3000`.

## Demo Flow

1. Open `http://localhost:3000`.
2. Go to `/candidate/login` and create or log in as a candidate.
3. Complete the candidate profile and enter the lobby.
4. Start the interview, answer the questions, and end the session.
5. Create or log in as an admin user, then open `/admin/applicants`.
6. Review the applicant detail page with transcript, lifecycle status, and scorecard.

For API-level details, see `docs/API_CONTRACT.md`.

## Running Tests

Backend tests cover auth, candidate creation, interview lifecycle, transcript persistence, grading, and admin review access.

```bash
cd apps/api
source .venv/bin/activate
pytest
```

The web app also has standard Next.js scripts:

```bash
cd apps/web
npm run build
npm run lint
```

## Key API Areas

- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
- `POST /candidates`, `GET /candidates`, `GET /candidates/{candidate_id}`
- `POST /interviews/start`, `POST /interviews/{session_id}/begin`
- `POST /interviews/{session_id}/message`, `GET /interviews/{session_id}/transcript`
- `POST /interviews/{session_id}/end`
- `POST /grading/{session_id}`
- `GET /admin/applicants`, `GET /admin/applicants/{candidate_id}`
- `POST /realtime/session` for optional OpenAI Realtime voice setup

## What Is Implemented

- Local auth with candidate/admin roles.
- SQLite-backed repository layer for MVP persistence.
- Candidate login, lobby, interview, and completion screens.
- Text interview flow with persisted Q&A transcript.
- Optional browser voice interview path using OpenAI Realtime sessions.
- Interview lifecycle tracking from lobby through reviewed.
- Heuristic grader with evidence pulled from the candidate transcript.
- Admin applicant list and detail review pages backed by the API.
- API tests for the core candidate-to-admin workflow.

## Next Steps

Most of the MVP is in place. The remaining work is mainly production polish:

- Add the Supabase/Postgres repository adapter for hosted persistence.
- Replace or augment heuristic grading with an LLM-backed grader and stored prompt versions.
- Add admin search/filtering and reviewer note editing.
- Harden production auth settings, structured API errors, and deployment configuration.

## Supporting Docs

- `docs/PROJECT_SPEC.md`: product and MVP scope.
- `docs/API_CONTRACT.md`: backend API behavior.
- `docs/DATA_MODEL.md`: core data model.
- `docs/RUBRIC.md`: scoring rubric.
- `docs/PHASE_PLAN.md`: implementation phases.
- `docs/NEXT_STEPS.md`: fuller follow-up checklist.
