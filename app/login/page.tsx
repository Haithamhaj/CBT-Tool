"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../src/components/language-provider";
import { createSupabaseBrowserClient } from "../../src/lib/supabase/browser";

const appAuthMode =
  process.env.NEXT_PUBLIC_APP_AUTH_MODE === "shared-password" || process.env.NEXT_PUBLIC_APP_AUTH_MODE === "email-only"
    ? process.env.NEXT_PUBLIC_APP_AUTH_MODE
    : null;
const appManagedAuthEnabled = appAuthMode !== null;
const sharedPasswordAuthEnabled = appAuthMode === "shared-password";
const emailOnlyAuthEnabled = appAuthMode === "email-only";
const hasSupabaseAuth =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const previewAccessEnabled =
  !appManagedAuthEnabled && (!hasSupabaseAuth || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview");

const devFallbackEmails = [
  "advancedhaitham.haj@gmail.com",
  "haitham.haj@gmail.com",
  "trainee.one@example.com",
  "trainee.two@example.com",
  "facilitator@example.com"
];

export default function LoginPage() {
  const { language, setLanguage, t, translateServerText } = useLanguage();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useMemo(
    () => (hasSupabaseAuth ? createSupabaseBrowserClient() : null),
    []
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("error") === "authCallbackFailed") {
      setError(t(language, "authCallbackFailed"));
    }
  }, [language, t]);

  async function handlePreviewAccessLogin() {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/dev-login", {
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

      window.location.href = "/reference";
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : t(language, "errorUnableStartSession")
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (appManagedAuthEnabled) {
        const endpoint = mode === "signin" ? "/api/auth/app-login" : "/api/auth/app-signup";
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
            name: name.trim()
          })
        });

        const body = await response.json();
        if (!response.ok) {
          setError(translateServerText(body.error ?? "Unable to sign in."));
          setIsLoading(false);
          return;
        }

        window.location.href = "/reference";
        setIsLoading(false);
        return;
      }

      if (hasSupabaseAuth && supabase) {
        if (mode === "signin") {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password
          });

          if (signInError) {
            setError(signInError.message);
            setIsLoading(false);
            return;
          }

          window.location.href = "/reference";
          setIsLoading(false);
          return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              name: name.trim() || email.trim().split("@")[0]
            }
          }
        });

        if (signUpError) {
          setError(signUpError.message);
          setIsLoading(false);
          return;
        }

        if (data.session) {
          window.location.href = "/reference";
          setIsLoading(false);
          return;
        }

        setSuccess(t(language, "signupNeedsEmailConfig"));
        setIsLoading(false);
        return;
      }

      await handlePreviewAccessLogin();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : t(language, "errorUnableStartSession")
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="page" style={{ maxWidth: 520, margin: "80px auto" }}>
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
          <p className="muted">
            {emailOnlyAuthEnabled
              ? mode === "signin"
                ? t(language, "loginEmailOnlySubtitle")
                : t(language, "signupEmailOnlySubtitle")
              : sharedPasswordAuthEnabled
              ? mode === "signin"
                ? t(language, "loginSharedPasswordSubtitle")
                : t(language, "signupSharedPasswordSubtitle")
              : hasSupabaseAuth
              ? mode === "signin"
                ? t(language, "loginPasswordSubtitle")
                : t(language, "signupPasswordSubtitle")
              : t(language, "loginDevFallbackSubtitle")}
          </p>
        </div>

        {previewAccessEnabled ? (
          <div className="callout callout-advisory stack">
            <strong>{t(language, hasSupabaseAuth ? "previewAccessMode" : "devFallbackMode")}</strong>
            <div className="muted">
              {t(language, hasSupabaseAuth ? "previewAccessHint" : "devFallbackHint")}
            </div>
            <div className="emotion-chips">
              {devFallbackEmails.map((fallbackEmail) => (
                <button
                  key={fallbackEmail}
                  type="button"
                  className="secondary"
                  onClick={() => setEmail(fallbackEmail)}
                >
                  {fallbackEmail}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {appManagedAuthEnabled || hasSupabaseAuth ? (
          <div className="row" style={{ gap: 10 }}>
            <button
              type="button"
              className={mode === "signin" ? undefined : "secondary"}
              onClick={() => {
                setMode("signin");
                setError("");
                setSuccess("");
              }}
            >
              {t(language, "signIn")}
            </button>
            <button
              type="button"
              className={mode === "signup" ? undefined : "secondary"}
              onClick={() => {
                setMode("signup");
                setError("");
                setSuccess("");
              }}
            >
              {t(language, "createAccount")}
            </button>
          </div>
        ) : null}

        <form className="stack" onSubmit={handleLogin}>
          {(appManagedAuthEnabled || hasSupabaseAuth) && mode === "signup" ? (
            <label className="field">
              <span>{t(language, "fullName")}</span>
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder={t(language, "fullNamePlaceholder")} />
            </label>
          ) : null}

          <label className="field">
            <span>{t(language, "email")}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
            />
          </label>

          {(!emailOnlyAuthEnabled && appManagedAuthEnabled) || hasSupabaseAuth ? (
            <label className="field">
              <span>{t(language, "password")}</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </label>
          ) : null}

          {error ? <div className="error">{translateServerText(error)}</div> : null}
          {success ? <div className="success">{success}</div> : null}
          {emailOnlyAuthEnabled ? <div className="muted">{t(language, "emailOnlyAuthNote")}</div> : null}
          {sharedPasswordAuthEnabled ? <div className="muted">{t(language, "sharedPasswordAuthNote")}</div> : null}
          {!appManagedAuthEnabled && hasSupabaseAuth ? <div className="muted">{t(language, "passwordAuthNote")}</div> : null}

          {previewAccessEnabled ? (
            <button
              type="button"
              className="secondary"
              onClick={handlePreviewAccessLogin}
              disabled={isLoading || email.trim().length === 0}
            >
              {t(language, "previewAccessButton")}
            </button>
          ) : null}

          <button type="submit" disabled={isLoading}>
            {isLoading
              ? t(language, "signingIn")
              : appManagedAuthEnabled || hasSupabaseAuth
                ? mode === "signin"
                  ? t(language, "signIn")
                  : t(language, "createAccount")
                : t(language, "signIn")}
          </button>
        </form>
      </div>
    </div>
  );
}
