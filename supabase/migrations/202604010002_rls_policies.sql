create or replace function public.current_app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.users where id = auth.uid();
$$;

create or replace function public.is_facilitator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_role() = 'facilitator', false);
$$;

create or replace function public.is_assigned_facilitator(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    where u.id = target_user_id
      and u.facilitator_id = auth.uid()
      and public.is_facilitator()
  );
$$;

create or replace function public.handle_auth_user_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  derived_name text;
  derived_role text;
  derived_level text;
  derived_facilitator_id uuid;
begin
  derived_name := coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));
  derived_role := case
    when new.raw_user_meta_data->>'role' in ('trainee', 'facilitator') then new.raw_user_meta_data->>'role'
    else 'trainee'
  end;
  derived_level := case
    when new.raw_user_meta_data->>'level' in ('beginner', 'intermediate', 'advanced') then new.raw_user_meta_data->>'level'
    else 'beginner'
  end;
  derived_facilitator_id := nullif(new.raw_user_meta_data->>'facilitator_id', '')::uuid;

  insert into public.users (id, email, name, role, level, facilitator_id)
  values (new.id, new.email, derived_name, derived_role, derived_level, derived_facilitator_id)
  on conflict (id) do nothing;

  return new;
end;
$$;

create or replace function public.handle_auth_user_deleted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.users where id = old.id;
  return old;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_auth_user_created();

drop trigger if exists on_auth_user_deleted on auth.users;
create trigger on_auth_user_deleted
after delete on auth.users
for each row execute procedure public.handle_auth_user_deleted();

alter table public.users enable row level security;
alter table public.cases enable row level security;
alter table public.sessions enable row level security;
alter table public.attempts enable row level security;
alter table public.drift_events enable row level security;
alter table public.progress_snapshots enable row level security;

drop policy if exists "users_select_self_or_assigned" on public.users;
create policy "users_select_self_or_assigned"
on public.users
for select
using (
  id = auth.uid()
  or public.is_assigned_facilitator(id)
);

drop policy if exists "users_update_self" on public.users;
create policy "users_update_self"
on public.users
for update
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "cases_read_authenticated" on public.cases;
create policy "cases_read_authenticated"
on public.cases
for select
using (auth.uid() is not null);

drop policy if exists "sessions_owner_only" on public.sessions;
create policy "sessions_owner_only"
on public.sessions
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "attempts_owner_only" on public.attempts;
create policy "attempts_owner_only"
on public.attempts
for all
using (
  exists (
    select 1 from public.sessions s
    where s.id = attempts.session_id
      and s.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.sessions s
    where s.id = attempts.session_id
      and s.user_id = auth.uid()
  )
);

drop policy if exists "drift_events_owner_only" on public.drift_events;
create policy "drift_events_owner_only"
on public.drift_events
for all
using (
  exists (
    select 1 from public.sessions s
    where s.id = drift_events.session_id
      and s.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.sessions s
    where s.id = drift_events.session_id
      and s.user_id = auth.uid()
  )
);

drop policy if exists "progress_owner_or_assigned_facilitator" on public.progress_snapshots;
create policy "progress_owner_or_assigned_facilitator"
on public.progress_snapshots
for select
using (
  user_id = auth.uid()
  or public.is_assigned_facilitator(user_id)
);

drop policy if exists "progress_owner_only_write" on public.progress_snapshots;
create policy "progress_owner_only_write"
on public.progress_snapshots
for insert
with check (user_id = auth.uid());

drop policy if exists "progress_owner_only_update" on public.progress_snapshots;
create policy "progress_owner_only_update"
on public.progress_snapshots
for update
using (user_id = auth.uid())
with check (user_id = auth.uid());
