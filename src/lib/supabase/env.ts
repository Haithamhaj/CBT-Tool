export const SUPABASE_ENV_KEYS = {
  url: "NEXT_PUBLIC_SUPABASE_URL",
  anonKey: "NEXT_PUBLIC_SUPABASE_ANON_KEY"
} as const;

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
