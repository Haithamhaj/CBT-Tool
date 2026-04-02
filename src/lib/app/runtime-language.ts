import { cookies } from "next/headers";
import { isAppLanguage, type AppLanguage } from "../i18n/shared";

export async function getCurrentLanguage(): Promise<AppLanguage> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get("cbt_ui_lang")?.value;
  return isAppLanguage(cookieValue) ? cookieValue : "en";
}
