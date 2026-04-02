# Auth and User Mapping

## Purpose
This document defines the explicit relationship between Supabase `auth.users` and application-level `public.users` for MVP.

## Source of Truth

### Identity source of truth
- Authentication identity lives in `auth.users`.
- The canonical user ID for the application is `auth.users.id`.

### Profile and role source of truth
- Application profile, role, level, and facilitator assignment live in `public.users`.
- `public.users.id` must always equal `auth.users.id`.
- `public.users.role` is the application role source of truth.

This means auth owns identity, while public schema owns authorization-facing application state.

## Table Relationship

### `auth.users`
Used for:
- sign-up and sign-in
- verified email identity
- auth lifecycle events

### `public.users`
Used for:
- `role`
- `level`
- `facilitator_id`
- display name used by the app
- cohort access decisions

## Sync Strategy

### On auth user creation
When a record is created in `auth.users`:
- insert a matching row into `public.users`
- reuse the same UUID
- copy email
- derive name from `raw_user_meta_data.name` or email prefix
- derive role from `raw_user_meta_data.role` if valid, otherwise default to `trainee`
- derive level from `raw_user_meta_data.level` if valid, otherwise default to `beginner`
- derive `facilitator_id` from metadata only if explicitly present and valid

### On auth user deletion
When a record is deleted from `auth.users`:
- delete the matching row from `public.users`
- all owned sessions, attempts, drifts, and progress snapshots cascade through foreign keys

### On sign-in
On sign-in:
- do not recreate the user
- do not trust JWT role claims as the application role source
- read `public.users` by `auth.uid()`
- fail closed if the `public.users` row does not exist

## Lifecycle Events

### User create
1. user signs up or is created by admin
2. `auth.users` row is inserted
3. trigger creates `public.users` row
4. app reads `public.users.role` and `public.users.level`

### User sign-in
1. auth validates identity
2. app resolves `auth.uid()`
3. app loads `public.users`
4. app authorizes using `public.users.role`

### User delete
1. auth user is removed
2. trigger deletes `public.users`
3. cascades remove owned relational data

## Role Handling Rules
- The database role source of truth is `public.users.role`.
- JWT custom claims may be added later for convenience, but they are not authoritative in MVP.
- Facilitator assignment is stored only in `public.users.facilitator_id`.

## Failure Handling
- If `auth.uid()` exists but `public.users` is missing, return unauthorized and log a data integrity error.
- If metadata includes an invalid role or level, fallback to safe defaults and require admin correction later.

## Operational Notes
- Seed SQL for MVP inserts application rows into `public.users`.
- Real authenticated users should be created through Supabase Auth so the sync trigger remains the normal production path.
- For local development, seeded `public.users` are sufficient to test services and policies.

## Execution Method
- Apply migrations first.
- Run the seed generator:
  - `npm run seed:generate`
- Load the generated SQL:
  - `psql "$SUPABASE_DB_URL" -f supabase/seed.sql`
  - or use `supabase db reset` if the local Supabase workflow is added later

## Ready-to-build blockers remaining
- None for MVP auth/user mapping.
