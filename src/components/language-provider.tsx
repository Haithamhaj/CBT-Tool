"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  directionForLanguage,
  LANGUAGE_COOKIE,
  type AppLanguage,
  isAppLanguage
} from "../lib/i18n/shared";
import {
  labelForDifficulty,
  labelForOutcome,
  labelForSeverity,
  labelForStage,
  labelForState,
  labelForStep,
  labelForTool,
  t,
  translateDriftAction,
  translateDriftMessage,
  translateRecommendation,
  translateServerText,
  translateTopIssue
} from "../lib/i18n/messages";

type LanguageContextValue = {
  language: AppLanguage;
  dir: "ltr" | "rtl";
  setLanguage: (language: AppLanguage) => void;
  t: typeof t;
  labelForStage: (stage: string) => string;
  labelForTool: (tool: string) => string;
  labelForState: (state: string) => string;
  labelForStep: (step: string) => string;
  labelForOutcome: (outcome: string) => string;
  labelForSeverity: (severity: string) => string;
  labelForDifficulty: (difficulty: string) => string;
  translateServerText: (text: string | null | undefined) => string;
  translateDriftMessage: (driftId: string, fallback: string) => string;
  translateDriftAction: (driftId: string, fallback: string) => string;
  translateRecommendation: (text: string | null | undefined) => string;
  translateTopIssue: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLanguage
}: {
  children: React.ReactNode;
  initialLanguage: AppLanguage;
}) {
  const [language, setLanguageState] = useState<AppLanguage>(initialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = directionForLanguage(language);
  }, [language]);

  function setLanguage(nextLanguage: AppLanguage) {
    setLanguageState(nextLanguage);
    document.cookie = `${LANGUAGE_COOKIE}=${nextLanguage}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    window.location.reload();
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        dir: directionForLanguage(language),
        setLanguage,
        t: (selectedLanguage, key, value) => t(selectedLanguage, key, value),
        labelForStage: (stage) => labelForStage(language, stage),
        labelForTool: (tool) => labelForTool(language, tool),
        labelForState: (state) => labelForState(language, state),
        labelForStep: (step) => labelForStep(language, step),
        labelForOutcome: (outcome) => labelForOutcome(language, outcome),
        labelForSeverity: (severity) => labelForSeverity(language, severity),
        labelForDifficulty: (difficulty) => labelForDifficulty(language, difficulty),
        translateServerText: (text) => translateServerText(language, text),
        translateDriftMessage: (driftId, fallback) => translateDriftMessage(language, driftId, fallback),
        translateDriftAction: (driftId, fallback) => translateDriftAction(language, driftId, fallback),
        translateRecommendation: (text) => translateRecommendation(language, text),
        translateTopIssue: (text) => translateTopIssue(language, text)
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}

export function readClientLanguage(value: string | null | undefined): AppLanguage {
  return isAppLanguage(value) ? value : "en";
}
