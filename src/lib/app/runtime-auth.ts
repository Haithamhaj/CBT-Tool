import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { User } from "../../contracts";
import { getAppRepository } from "./repository-provider";

export const SESSION_COOKIE = "cbt_session_user_id";

export async function getCurrentSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!userId) {
    return null;
  }

  return (await getAppRepository().getUser(userId)) ?? null;
}

export async function requireCurrentSessionUser(): Promise<User> {
  const user = await getCurrentSessionUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
