# RLS Policy Plan

## Purpose
This document explains the MVP row-level security rules and the access boundaries enforced in SQL.

## Principles
- Deny by default.
- Use `auth.uid()` as the identity anchor.
- Use `public.users.role` and `public.users.facilitator_id` for application authorization.
- Keep facilitator access narrower than trainee self-access.

## Trainee Access
- A trainee can read and write only their own `sessions`.
- A trainee can read and write only `attempts` belonging to their own sessions.
- A trainee can read and write only `drift_events` belonging to their own sessions.
- A trainee can read their own `progress_snapshots`.
- A trainee can read their own `public.users` row.
- A trainee can read `cases`.

## Facilitator Access
- A facilitator can read their own `public.users` row.
- A facilitator can read `public.users` rows for assigned trainees where `public.users.facilitator_id = auth.uid()`.
- A facilitator can read `progress_snapshots` for assigned trainees.
- A facilitator cannot read trainee `sessions`, `attempts`, or `drift_events` in MVP.

## Tables Covered
- `public.users`
- `public.cases`
- `public.sessions`
- `public.attempts`
- `public.drift_events`
- `public.progress_snapshots`

## Helper Functions
- `public.current_app_role()`
- `public.is_facilitator()`
- `public.is_assigned_facilitator(target_user_id uuid)`

These helpers keep the policies short and explicit.

## Execution Method
- Apply [`/Users/haitham/development/CBT Tool/supabase/migrations/202604010002_rls_policies.sql`](/Users/haitham/development/CBT%20Tool/supabase/migrations/202604010002_rls_policies.sql) after the base schema migration.

## Ready-to-build blockers remaining
- None for MVP RLS.
