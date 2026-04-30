-- 002_rls.sql
-- Row-level security policies scoped by auth identity and admin role.

alter table candidates enable row level security;
alter table interview_sessions enable row level security;
alter table interview_messages enable row level security;

-- Helper: returns true if the calling user is an admin.
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- candidates: owner (matched by email in profiles) or admin can select.
-- Insert/update/delete done server-side with service role key (bypasses RLS).
drop policy if exists "placeholder_candidates_select" on candidates;
create policy "candidates_select" on candidates
  for select using (
    public.is_admin()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.full_name = candidates.full_name
    )
  );

-- interview_sessions: candidates see their own sessions; admins see all.
drop policy if exists "placeholder_sessions_select" on interview_sessions;
create policy "sessions_select" on interview_sessions
  for select using (
    public.is_admin()
    or exists (
      select 1 from candidates c
      join public.profiles p on p.full_name = c.full_name
      where c.id = interview_sessions.candidate_id and p.id = auth.uid()
    )
  );

-- interview_messages: same scope as sessions.
drop policy if exists "placeholder_messages_select" on interview_messages;
create policy "messages_select" on interview_messages
  for select using (
    public.is_admin()
    or exists (
      select 1 from interview_sessions s
      join candidates c on c.id = s.candidate_id
      join public.profiles p on p.full_name = c.full_name
      where s.id = interview_messages.session_id and p.id = auth.uid()
    )
  );
