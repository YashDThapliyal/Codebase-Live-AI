-- 001_init.sql
-- Core candidate + interview transcript tables

create table if not exists candidates (
  id text primary key,
  full_name text not null,
  email text not null unique,
  role_applied text not null,
  created_at timestamptz not null default now()
);

create table if not exists interview_sessions (
  id text primary key,
  candidate_id text not null references candidates(id) on delete cascade,
  phase text not null,
  status text not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

create table if not exists interview_messages (
  id text primary key,
  session_id text not null references interview_sessions(id) on delete cascade,
  sender text not null,
  content text not null,
  phase text not null,
  created_at timestamptz not null default now()
);
