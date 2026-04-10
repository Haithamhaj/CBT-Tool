export const SUPABASE_ENV_KEYS = {
  url: "NEXT_PUBLIC_SUPABASE_URL",
  anonKey: "NEXT_PUBLIC_SUPABASE_ANON_KEY"
} as const;

export function getAppAuthMode() {
  const value = process.env.NEXT_PUBLIC_APP_AUTH_MODE;
  return value === "shared-password" || value === "email-only" ? value : null;
}

export function isAppManagedAuthEnabled() {
  return getAppAuthMode() !== null;
}

export function isSharedPasswordAuthEnabled() {
  return getAppAuthMode() === "shared-password";
}

export function isEmailOnlyAuthEnabled() {
  return getAppAuthMode() === "email-only";
}

export function requireAppAccessPassword() {
  const value = process.env.APP_ACCESS_PASSWORD;
  if (!value) {
    throw new Error("APP_ACCESS_PASSWORD is required when shared-password auth is enabled.");
  }
  return value;
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function isVercelPreviewEnvironment() {
  return process.env.VERCEL_ENV === "preview";
}

export function isPreviewAccessEnabled() {
  return !isSupabaseConfigured() || isVercelPreviewEnvironment();
}

export function requireSupabaseUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required for Supabase Auth.");
  }
  return value;
}

export function requireSupabaseAnonKey() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!value) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required for Supabase Auth.");
  }
  return value;
}
