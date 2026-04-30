# Codebase Live-Screen

## Project Overview

**Codebase Live-Screen** is a Mercor-style AI interview portal for Codebase applicants. The goal is to create a natural, voice-to-voice interview experience where an AI interviewer can evaluate a candidate’s technical depth, project ownership, problem-solving ability, communication style, and fit with Codebase’s mission.

The platform currently includes a **Next.js frontend**, a **FastAPI backend**, and an implemented **OpenAI Realtime voice interview MVP** using WebRTC. The product is currently mock-first in several areas, but the core realtime voice path is functional: the browser can connect to the OpenAI Realtime API through backend-minted ephemeral credentials, conduct a live voice session, and display session/debug information in the frontend.

The current project state is best described as:

> A polished mock-first interview platform with a real realtime voice interview MVP.  
> The next phase is persistence, live data wiring, auth, resume ingestion, and production hardening.

---

## TODOs
## Completed

- [x] Set up monorepo structure for frontend, backend, database migrations, and docs.
- [x] Built candidate-facing interview flow: login, lobby, interview, and completion pages.
- [x] Implemented a working OpenAI Realtime voice interview MVP using WebRTC.
- [x] Added backend endpoint for secure ephemeral Realtime credential creation.
- [x] Added voice interview UI states, debug panel, language selector, and fallback handling.
- [x] Built FastAPI backend route scaffolding for candidates, interviews, grading, admin, and realtime.
- [x] Added mock interview phase logic, follow-up behavior, resume summary, and scorecard generation.
- [x] Built admin review UI for applicant list, transcript, scorecard, notes, and red flags.
- [x] Added Supabase migration scaffolding for future persistence.

## Need to Have

- [ ] Connect frontend, backend, and Supabase so the app uses real persisted data.
- [ ] Persist realtime voice transcripts and make them available in the admin dashboard.
- [ ] Add real candidate and admin authentication/session management.
- [ ] Implement real resume upload, storage, parsing, and resume-aware interview prompts.
- [ ] Replace mock interviewer and mock grader with real LLM-driven interview and scoring logic.
- [ ] Wire admin dashboard to live backend data instead of frontend mock data.
- [ ] Harden realtime voice reliability, reconnect behavior, error handling, and clean interview ending.
- [ ] Update README/docs to accurately reflect that realtime voice MVP is already implemented.

## Nice to Have

- [ ] Add analytics dashboard for applicant funnel, scores, and completion rates.
- [ ] Add richer scorecard visualizations and evidence-linked scoring.
- [ ] Add interview playback or timestamped transcript review.
- [ ] Add role-specific question banks and rubric customization.
- [ ] Add candidate email notifications and scheduling support.
- [ ] Add observability, automated tests, CI/CD, and deployment hardening.
