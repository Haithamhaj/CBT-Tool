"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../src/components/language-provider";
import { createSupabaseBrowserClient } from "../../src/lib/supabase/browser";

const hasSupabaseAuth =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const devFallbackEmails = [
  "trainee.one@example.com",
  "trainee.two@example.com",
  "facilitator@example.com"
];
const MAGIC_LINK_COOLDOWN_SECONDS = 60;
const MAGIC_LINK_COOLDOWN_KEY = "cbt-magic-link-cooldown-until";

export default function LoginPage() {
  const { language, setLanguage, t, translateServerText } = useLanguage();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownSecondsLeft, setCooldownSecondsLeft] = useState(0);
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

  useEffect(() => {
    if (!hasSupabaseAuth) {
      return;
    }

    const storedUntil = window.localStorage.getItem(MAGIC_LINK_COOLDOWN_KEY);
    if (!storedUntil) {
      return;
    }

    const remainingMs = Number(storedUntil) - Date.now();
    if (remainingMs <= 0) {
      window.localStorage.removeItem(MAGIC_LINK_COOLDOWN_KEY);
      return;
    }

    setCooldownSecondsLeft(Math.ceil(remainingMs / 1000));
  }, []);

  useEffect(() => {
    if (cooldownSecondsLeft <= 0) {
      if (hasSupabaseAuth) {
        window.localStorage.removeItem(MAGIC_LINK_COOLDOWN_KEY);
      }
      return;
    }

    const timer = window.setInterval(() => {
      setCooldownSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldownSecondsLeft]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cooldownSecondsLeft > 0) {
      setError(t(language, "magicLinkCooldownActive", cooldownSecondsLeft));
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (hasSupabaseAuth && supabase) {
        const { error: signInError } = await supabase.auth.signInWithOtp({
          email: email.trim().toLowerCase(),
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });

        if (signInError) {
          setError(signInError.message);
          setIsLoading(false);
          return;
        }

        setSuccess(t(language, "magicLinkSent"));
        setCooldownSecondsLeft(MAGIC_LINK_COOLDOWN_SECONDS);
        window.localStorage.setItem(
          MAGIC_LINK_COOLDOWN_KEY,
          String(Date.now() + MAGIC_LINK_COOLDOWN_SECONDS * 1000)
        );
        setIsLoading(false);
        return;
      }

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
            {hasSupabaseAuth ? t(language, "loginMagicLinkSubtitle") : t(language, "loginDevFallbackSubtitle")}
          </p>
        </div>

        {!hasSupabaseAuth ? (
          <div className="callout callout-advisory stack">
            <strong>{t(language, "devFallbackMode")}</strong>
            <div className="muted">{t(language, "devFallbackHint")}</div>
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

        <form className="stack" onSubmit={handleLogin}>
          <label className="field">
            <span>{t(language, "email")}</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
            />
          </label>

          {error ? <div className="error">{translateServerText(error)}</div> : null}
          {success ? <div className="success">{success}</div> : null}
          {hasSupabaseAuth && cooldownSecondsLeft > 0 ? (
            <div className="callout callout-advisory stack">
              <strong>{t(language, "magicLinkCheckInboxTitle")}</strong>
              <div className="muted">{t(language, "magicLinkCooldownNotice", cooldownSecondsLeft)}</div>
              <div className="muted">{t(language, "magicLinkDeliveryHelp")}</div>
            </div>
          ) : null}

          <button type="submit" disabled={isLoading || cooldownSecondsLeft > 0}>
            {isLoading
              ? t(language, "signingIn")
              : cooldownSecondsLeft > 0
                ? t(language, "magicLinkResendIn", cooldownSecondsLeft)
              : hasSupabaseAuth
                ? t(language, "sendMagicLink")
                : t(language, "signIn")}
          </button>
        </form>
      </div>
    </div>
  );
}
