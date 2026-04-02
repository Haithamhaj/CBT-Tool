import "./globals.css";
import { DevAuthProvider } from "../src/components/dev-auth-provider";
import { LanguageProvider } from "../src/components/language-provider";
import { NavShell } from "../src/components/nav-shell";
import { getCurrentSessionUser } from "../src/lib/app/runtime-auth";
import { getCurrentLanguage } from "../src/lib/app/runtime-language";
import { directionForLanguage } from "../src/lib/i18n/shared";

export const metadata = {
  title: "CBT MVP Shell",
  description: "Minimal CBT training MVP shell"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentSessionUser();
  const language = await getCurrentLanguage();

  return (
    <html lang={language} dir={directionForLanguage(language)}>
      <body>
        <LanguageProvider initialLanguage={language}>
          {currentUser ? (
            <DevAuthProvider currentUser={currentUser}>
              <NavShell>{children}</NavShell>
            </DevAuthProvider>
          ) : (
            children
          )}
        </LanguageProvider>
      </body>
    </html>
  );
}
