# Data Model

## Core Entities

- Candidate
- InterviewSession
- InterviewMessage
- Scorecard
- ReviewerNote
- AuditLog (future governance)

## Relationships

- Candidate 1:N InterviewSession
- InterviewSession 1:N InterviewMessage
- InterviewSession 1:1 Scorecard
- Candidate 1:N ReviewerNote

## Notes

- Current runtime uses in-memory mock DB for local development speed
- SQL migrations are provided for Supabase/Postgres readiness
- RLS is placeholder-only and must be hardened before production
