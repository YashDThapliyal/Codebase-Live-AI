# Codebase Live AI

Codebase Live AI is an AI-powered live interview screening platform for Codebase recruitment.

Candidates complete a guided AI interview, interview transcripts are stored, a post-interview grader agent produces evidence-based scorecards, and admins review applicants in a lightweight dashboard.

## Why This Repo Is Structured This Way

This project is intentionally optimized for a 3-person team where humans focus on AI logic, backend/data, integration, and QA.

The frontend is scaffolded and generated so the team does **not** spend excessive time building UI from scratch. It is modern, Tailwind-based, mock-data friendly, and easy to replace later.

## Architecture

- Monorepo layout with clear ownership boundaries
- `apps/web`: Next.js + React + TypeScript + Tailwind frontend
- `apps/api`: FastAPI backend with mock in-memory data
- `supabase/migrations`: Supabase-ready SQL schema + placeholder RLS
- `docs`: project spec, contracts, phase planning, scoring rubric, ownership docs

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

## Environment Variables

See `.env.example`.

- `NEXT_PUBLIC_API_URL` for frontend API base URL
- Supabase variables are placeholders for future integration
- `OPENAI_API_KEY` is backend-only usage; never expose in frontend code

## Development Roadmap

- Milestone 1: Working scaffold with mock data (this repo state)
- Milestone 2: Text-based interview MVP end-to-end
- Later: Voice interview via OpenAI Realtime API (scaffold only right now)

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

- Text interview flow only
- Mock resume parsing and mock grading
- Mock backend data store
- Supabase-ready migration placeholders
- Realtime voice support deferred (scaffold and docs only)
