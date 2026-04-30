-- 002_rls.sql
-- Placeholder RLS policies for future auth integration.

alter table candidates enable row level security;
alter table interview_sessions enable row level security;
alter table interview_messages enable row level security;

-- TODO: replace permissive placeholders with role-scoped policies.
create policy "placeholder_candidates_select" on candidates
  for select using (true);

create policy "placeholder_sessions_select" on interview_sessions
  for select using (true);

create policy "placeholder_messages_select" on interview_messages
  for select using (true);

comment on table candidates is 'RLS placeholder enabled; integrate with auth and reviewer roles later.';
comment on table interview_sessions is 'RLS placeholder enabled; tighten access by candidate/reviewer identity.';
comment on table interview_messages is 'RLS placeholder enabled; restrict transcript visibility in production.';
