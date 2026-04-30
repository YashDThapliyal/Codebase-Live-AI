-- 003_scorecards.sql
-- Scorecards, reviewer notes, and audit logs

create table if not exists scorecards (
  session_id text primary key references interview_sessions(id) on delete cascade,
  technical_score int not null,
  communication_score int not null,
  ownership_score int not null,
  alignment_score int not null,
  match_score int not null,
  strengths jsonb not null default '[]'::jsonb,
  growth_areas jsonb not null default '[]'::jsonb,
  red_flags jsonb not null default '[]'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists reviewer_notes (
  id text primary key,
  candidate_id text not null references candidates(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id bigserial primary key,
  actor text,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
