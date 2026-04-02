# DB-Backed Verification

## What Is Now Truly DB-Backed
- Repository persistence is SQL-backed through [`src/lib/db/sql-repository.ts`](/Users/haitham/development/CBT%20Tool/src/lib/db/sql-repository.ts).
- A Postgres-compatible repository implementation exists in [`src/lib/db/postgres-repository.ts`](/Users/haitham/development/CBT%20Tool/src/lib/db/postgres-repository.ts).
- Services now persist:
  - `sessions`
  - `attempts`
  - `drift_events`
  - `score_snapshot` on attempts
  - `progress_snapshots` after scored review completion
- Minimal route bindings exist in [`src/lib/routes`](/Users/haitham/development/CBT%20Tool/src/lib/routes).

## What Is Still Mocked or Deferred
- True Supabase-hosted runtime wiring is deferred.
- Actual Postgres-enforced RLS execution still requires a real Postgres/Supabase instance.
- AI evaluator persistence remains out of scope.
- Framework-specific `app/api` route files are deferred; current route bindings are framework-neutral.

## What Is Now Safe To Connect To A Minimal App Shell
- practice setup
- session start
- guided step submission
- review retrieval
- progress retrieval
