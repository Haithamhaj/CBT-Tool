# First Login Profile Sync Spec

## Source Of Truth
- Authentication identity: `auth.users`
- App role/profile data: `public.users`

## Default New User Behavior
- A new auth user gets a `public.users` row automatically.
- Defaults:
  - `role = trainee`
  - `level = beginner`
  - `facilitator_id = null`

## Sync Logic
- Primary mechanism: database trigger on `auth.users`
- Secondary safeguard: app-level `ensureUserProfile()` during session resolution

## Facilitator Upgrade
- Not automatic.
- Manual owner action only.
- Upgrade path:
  - `select public.promote_user_to_facilitator('owner-email@example.com');`

## Production Rule
- The old manual email lookup flow must not be the production login path.
- Only Supabase Auth is the real runtime path.
