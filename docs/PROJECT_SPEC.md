# Project Spec: Codebase Live AI

## Summary

Codebase Live AI is an AI live interview screening portal for Codebase recruitment.

It supports:
- Candidate text interview flow
- Resume-aware technical probing
- Post-interview grading with evidence requirements
- Admin dashboard for applicant review
- Future voice-to-voice interview support using OpenAI Realtime APIs

## Core Product Flow

1. Candidate enters login flow
2. Candidate uploads resume (placeholder in MVP)
3. AI interviewer runs phased interview
4. Transcript is persisted
5. Grader agent produces structured scorecard
6. Admin reviews applicants, transcript, scorecard, and red flags

## Non-Goals (Current Phase)

- Full realtime voice interview implementation
- Production auth and RLS hardening
- Final visual design system

## Technical Goals

- Mock-first local run without external dependencies
- Clean separation between AI services and API routes
- Supabase-ready schema evolution path
- Frontend scaffold easy to swap or refine later
