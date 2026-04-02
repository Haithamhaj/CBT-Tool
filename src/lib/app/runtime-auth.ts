import type { User as SupabaseAuthUser } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "../../contracts";
import { DEV_SESSION_COOKIE } from "../auth/constants";
import { createSupabaseServerComponentClient } from "../supabase/server";
import { isSupabaseConfigured } from "../supabase/env";
import { getAppRepository } from "./repository-provider";

function defaultDisplayName(authUser: SupabaseAuthUser) {
  const metadataName = authUser.user_metadata?.name;
  if (typeof metadataName === "string" && metadataName.trim().length > 0) {
    return metadataName.trim();
  }

  const email = authUser.email ?? "trainee";
  return email.split("@")[0];
}

async function getSupabaseSessionUser(): Promise<User | null> {
  const supabase = await createSupabaseServerComponentClient();
  const {
    data: { user: authUser }
  } = await supabase.auth.getUser();

  if (!authUser?.email) {
    return null;
  }

  const repository = getAppRepository();
  const existing = await repository.getUser(authUser.id);
  if (existing) {
    return existing;
  }

  return repository.ensureUserProfile({
    id: authUser.id,
    email: authUser.email,
    name: defaultDisplayName(authUser)
  });
}

async function getDevSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(DEV_SESSION_COOKIE)?.value;

  if (!userId) {
    return null;
  }

  return (await getAppRepository().getUser(userId)) ?? null;
}

export async function getCurrentSessionUser(): Promise<User | null> {
  if (isSupabaseConfigured()) {
    return getSupabaseSessionUser();
  }

  return getDevSessionUser();
}

export async function requireCurrentSessionUser(): Promise<User> {
  const user = await getCurrentSessionUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
