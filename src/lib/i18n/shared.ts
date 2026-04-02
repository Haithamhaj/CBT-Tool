export const LANGUAGE_COOKIE = "cbt_ui_lang";
export const supportedLanguages = ["en", "ar"] as const;

export type AppLanguage = (typeof supportedLanguages)[number];

export function isAppLanguage(value: string | null | undefined): value is AppLanguage {
  return Boolean(value && supportedLanguages.includes(value as AppLanguage));
}

export function directionForLanguage(language: AppLanguage) {
  return language === "ar" ? "rtl" : "ltr";
}
