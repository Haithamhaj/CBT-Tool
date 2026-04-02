# Auth Setup Checklist For Owner

## In Supabase Dashboard
1. Open `Authentication` -> `Providers`.
2. Enable `Email`.
3. Enable `Magic Link`.
4. Keep signup open so new users can create accounts.
5. Set `Site URL`:
   - local: `http://localhost:3000`
   - production: your real app URL
6. Add `Redirect URLs`:
   - `http://localhost:3000/auth/callback`
   - production callback URL later

## After The First Login
1. Sign in with your own email through Magic Link.
2. Run the facilitator upgrade SQL:
   - `select public.promote_user_to_facilitator('your-email@example.com');`

## Before Deployment
1. Add the Supabase env vars to local and deployment environments.
2. Run all migrations, including:
   - `202604020001_supabase_auth_profile_sync.sql`
3. Test login, callback, logout, session persistence, and route protection.
