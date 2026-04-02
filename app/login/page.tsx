"use client";

import { useState } from "react";
import { useLanguage } from "../../src/components/language-provider";

export default function LoginPage() {
  const { language, setLanguage, t, translateServerText } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const body = await response.json();
    if (!response.ok) {
      setError(translateServerText(body.error ?? "Unable to sign in."));
      setIsLoading(false);
      return;
    }

    window.location.href = "/practice/setup";
  }

  return (
    <div className="page" style={{ maxWidth: 480, margin: "80px auto" }}>
      <div className="panel stack">
        <label className="field">
          <span>{t(language, "language")}</span>
          <select value={language} onChange={(event) => setLanguage(event.target.value as "en" | "ar")}>
            <option value="en">{t(language, "languageEnglish")}</option>
            <option value="ar">{t(language, "languageArabic")}</option>
          </select>
        </label>

        <div>
          <h1>{t(language, "loginTitle")}</h1>
          <p className="muted">{t(language, "loginSubtitle")}</p>
        </div>

        <form className="stack" onSubmit={handleLogin}>
          <label className="field">
            <span>{t(language, "email")}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="trainee.one@example.com"
            />
          </label>

          {error ? <div className="error">{error}</div> : null}

          <button type="submit" disabled={isLoading}>
            {isLoading ? t(language, "signingIn") : t(language, "signIn")}
          </button>
        </form>
      </div>
    </div>
  );
}
