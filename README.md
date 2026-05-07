# Codebase Live AI

Codebase Live AI is an **evidence-based interview review platform** for Codebase recruitment — not an auto-hiring bot. The system helps run consistent interviews, persist transcripts, generate evidence-linked scorecards, and support human reviewers.

Candidates complete a guided interview (text-first MVP), transcripts and scorecards are stored, and admins review applicants in a lightweight dashboard.

## Why This Repo Is Structured This Way

This project is intentionally optimized for a small team where humans focus on AI logic, backend/data, integration, and QA.

The frontend is scaffolded and generated so the team does **not** spend excessive time building UI from scratch. It is modern, Tailwind-based, mock-data friendly, and easy to replace later.

## Architecture

- Monorepo layout with clear ownership boundaries
- `apps/web`: Next.js + React + TypeScript + Tailwind frontend (calls the API for candidate + admin flows)
- `apps/api`: FastAPI backend with a **repository layer** over **local SQLite** for MVP auth + persistence
- `supabase/migrations`: Supabase-ready SQL schema + placeholder RLS
- `docs`: project spec, contracts, phase planning, scoring rubric, ownership docs

### Product direction

- **Text interview** is the reliable MVP path (persisted Q&A, grading, admin review).
- **Voice (OpenAI Realtime)** is **progressive enhancement**: optional, requires `OPENAI_API_KEY` on the backend only, and the UI falls back to text when unavailable.

## Team Split

- Person 1: AI Interview Engine Owner
- Person 2: Backend / Data / Supabase Owner
- Person 3: Product Integration / Admin Review / QA Owner
- Codex: Frontend scaffold generation and extension points

See: `docs/TEAM_SPLIT.md`.

## Local Setup

### Prerequisites

- Node.js 20+
- Python 3.11+
- pip

### 1) Clone and configure

```bash
cp .env.example .env
```

Set `NEXT_PUBLIC_API_URL` if the API is not on `http://localhost:8000`. Leave `NEXT_PUBLIC_USE_MOCK_DATA` unset (or empty) so the web app uses the live API.

### 2) Run API

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3) Run Web

```bash
cd apps/web
npm install
npm run dev
```

Web runs on `http://localhost:3000`, API on `http://localhost:8000`.

### 4) Backend tests

```bash
cd apps/api
source .venv/bin/activate
pytest
```

### 5) Candidate → admin demo flow

1. Open `/candidate/login`, submit the form (creates a candidate via `POST /candidates`).
2. In `/candidate/lobby`, click **Start Text Interview** (`POST /interviews/start`).
3. Complete the text interview at `/candidate/interview`; **End interview** runs `POST /interviews/{id}/end` and `POST /grading/{id}`.
4. Open `/admin/applicants` to see persisted applicants and scorecards.

## Environment Variables

See `.env.example`.

- `NEXT_PUBLIC_API_URL` — frontend API base URL
- `NEXT_PUBLIC_USE_MOCK_DATA` — set to `true` only for offline demos using `apps/web/lib/mockData.ts`
- `AUTH_SECRET` — required for local session token signing
- `SQLITE_DB_PATH` — optional custom SQLite file path (defaults to `data/codebase_live_ai.db`)
- `OPENAI_API_KEY` is backend-only (Realtime voice); never expose in frontend code

## Development Roadmap

- Milestone 1: Working scaffold with mock data (historical)
- **Current:** Text + voice-capable MVP with SQLite persistence, local email/password auth, heuristic evidence-linked scorecards, admin API-backed views
- Later: Supabase adapter implementing the same repository protocols, LLM-backed interviewer/grader with auditable `prompt_version`

Detailed plan: `docs/PHASE_PLAN.md`.

## Parallel Work Guidance

Each owner should mostly stay inside their owned paths to reduce merge conflicts.

- Person 1 works in `apps/api/app/services/*` + AI docs
- Person 2 works in API routes/models/db + migrations + contracts
- Person 3 works in admin UI + web integration layer + QA docs

When changing cross-cutting contracts, update:

- `docs/API_CONTRACT.md`
- `apps/web/lib/types.ts`
- `apps/api/app/models/schemas.py`

## Current Scope

- Text interview flow with lifecycle states and persisted transcript
- Heuristic grader with transcript-derived evidence (no LLM required)
- Admin list/detail backed by API
- Realtime voice scaffold (optional; not required for MVP)
- Supabase-ready migration placeholders; production RLS not hardened
