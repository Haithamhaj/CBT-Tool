# Real Runtime Setup

## Purpose
This document defines the minimum real runtime setup for the MVP shell.

## Required Environment
- `DATABASE_URL`

The app runtime now expects a real Postgres-compatible database connection string. The app repository no longer falls back to in-memory storage.

## Migration Execution
Run migrations in order:

1. base schema
   - [`/Users/haitham/development/CBT Tool/supabase/migrations/202604010001_initial_schema.sql`](/Users/haitham/development/CBT%20Tool/supabase/migrations/202604010001_initial_schema.sql)
2. auth/RLS policies
   - [`/Users/haitham/development/CBT Tool/supabase/migrations/202604010002_rls_policies.sql`](/Users/haitham/development/CBT%20Tool/supabase/migrations/202604010002_rls_policies.sql)

Example:

```bash
psql "$DATABASE_URL" -f supabase/migrations/202604010001_initial_schema.sql
psql "$DATABASE_URL" -f supabase/migrations/202604010002_rls_policies.sql
```

## Seed Execution
Generate seed SQL:

```bash
npm run seed:generate
```

Load the generated seed file:

```bash
psql "$DATABASE_URL" -f supabase/seed.sql
```

## Start The App

```bash
DATABASE_URL="postgres://..." npm run dev
```

## Persistence Across Restarts
Persistence now depends on the database, not process memory.

Expected behavior:
- create a session
- restart the Next.js process
- log in again
- open `/sessions`
- the prior session should still be present

This is the operational persistence check for MVP runtime realism.

## Minimal Auth Runtime
- login is email-based against `public.users`
- successful login sets an HTTP-only session cookie
- app routes resolve the current user from the cookie server-side
- logout clears the cookie

This is intentionally minimal and sufficient for MVP identity resolution, not production-grade authentication.
