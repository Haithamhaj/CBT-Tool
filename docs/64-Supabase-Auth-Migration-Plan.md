# Supabase Auth Migration Plan

## Target
- Replace the old local/manual login flow as the real app path.
- Use `Supabase Auth` with `Magic Link`.
- Allow `open signup`.
- Ensure every authenticated user gets a `public.users` profile.
- Default new users to `trainee`.

## Code Path
1. Login page sends a magic link through Supabase Auth.
2. Supabase redirects back to `/auth/callback`.
3. Callback exchanges the auth code for a session.
4. Middleware refreshes and protects the session on each request.
5. Server-side session resolution reads the Supabase user and loads the matching `public.users` row.
6. If the row is missing, the app creates a safe default trainee profile as a fallback safeguard.

## Development Fallback
- If Supabase env vars are missing, the app exposes a clearly isolated local fallback sign-in path using seeded users.
- This path is for development only and is not the production auth architecture.
