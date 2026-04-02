"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRuntimeAuth } from "./runtime-auth-provider";
import { useLanguage } from "./language-provider";

export function NavShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser } = useRuntimeAuth();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { href: "/practice/setup", label: t(language, "navPracticeSetup") },
    { href: "/reference", label: t(language, "navReferenceHub") },
    { href: "/sessions", label: t(language, "navSessions") },
    { href: "/progress", label: t(language, "navProgress") }
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <strong>{t(language, "appTitle")}</strong>
          <span>{t(language, "appSubtitle")}</span>
        </div>

        <label className="field">
          <span>{t(language, "language")}</span>
          <select value={language} onChange={(event) => setLanguage(event.target.value as "en" | "ar")}>
            <option value="en">{t(language, "languageEnglish")}</option>
            <option value="ar">{t(language, "languageArabic")}</option>
          </select>
        </label>

        <nav className="nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "nav-link active" : "nav-link"}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="current-user">
          <div>{currentUser.name}</div>
          <small>
            {currentUser.role} · {currentUser.level}
          </small>
          <small>{currentUser.email}</small>
        </div>

        <button className="secondary" onClick={handleLogout}>
          {t(language, "logout")}
        </button>
      </aside>

      <main className="content">{children}</main>
    </div>
  );
}
