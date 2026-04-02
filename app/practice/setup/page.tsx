"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { HelpTip } from "../../../src/components/help-tip";
import { useLanguage } from "../../../src/components/language-provider";
import { localizeCaseDisplay } from "../../../src/lib/i18n/case-display";

type CaseRecord = {
  id: string;
  title: string;
  difficulty: string;
  theme: string;
  recommended_tools: string[];
  stage_suitability: string[];
  presenting_complaint: string;
};

const stageOptions = [
  "foundations",
  "session_structure",
  "core_tools",
  "deeper_formulation",
  "treatment_planning",
  "full_simulation"
];

export default function PracticeSetupPage() {
  const router = useRouter();
  const { language, t, labelForStage, labelForTool, translateServerText, labelForDifficulty } = useLanguage();
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [caseId, setCaseId] = useState("");
  const [stage, setStage] = useState("foundations");
  const [tool, setTool] = useState("");
  const [goal, setGoal] = useState("");
  const [rationale, setRationale] = useState("");
  const [error, setError] = useState("");
  const [validationMessages, setValidationMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/cases")
      .then((response) => response.json())
      .then((data) => {
        setCases(data);
        if (data[0]) {
          setCaseId(data[0].id);
          setTool(data[0].recommended_tools[0] ?? "");
        }
      });
  }, []);

  const selectedCase = useMemo(
    () => {
      const caseRecord = cases.find((entry) => entry.id === caseId) ?? null;
      return caseRecord ? localizeCaseDisplay(language, caseRecord) : null;
    },
    [cases, caseId, language]
  );

  const localizedCases = useMemo(
    () => cases.map((caseRecord) => localizeCaseDisplay(language, caseRecord)),
    [cases, language]
  );

  useEffect(() => {
    if (!selectedCase) {
      return;
    }

    if (!selectedCase.stage_suitability.includes(stage)) {
      setStage(selectedCase.stage_suitability[0] ?? "foundations");
    }

    if (!selectedCase.recommended_tools.includes(tool)) {
      setTool(selectedCase.recommended_tools[0] ?? "");
    }
  }, [selectedCase, stage, tool]);

  async function handleStartSession() {
    setIsLoading(true);
    setError("");
    setValidationMessages([]);

    const setupResponse = await fetch("/api/practice/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        case_id: caseId,
        stage,
        selected_tool: tool,
        session_goal: goal,
        rationale
      })
    });

    const setupBody = await setupResponse.json();

    if (!setupResponse.ok || !setupBody.created || !setupBody.session) {
      setValidationMessages(
        (setupBody.validation?.blocking_errors ?? []).map((message: string) =>
          translateServerText(message)
        )
      );
      setError(translateServerText(setupBody.error ?? "Unable to create the session."));
      setIsLoading(false);
      return;
    }

    const startResponse = await fetch("/api/practice/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: setupBody.session.id
      })
    });

    const startBody = await startResponse.json();
    if (!startResponse.ok || !startBody.id) {
      setError(translateServerText(startBody.error ?? "Unable to start the session."));
      setIsLoading(false);
      return;
    }

    router.push(`/session/${startBody.id}`);
  }

  return (
    <div className="page">
      <div>
        <h1>{t(language, "practiceSetupTitle")}</h1>
        <p className="muted">{t(language, "practiceSetupSubtitle")}</p>
      </div>

      <div className="panel stack">
        <div className="grid">
          <label className="field">
            <span>{t(language, "case")}</span>
            <select value={caseId} onChange={(event) => setCaseId(event.target.value)}>
              {localizedCases.map((caseRecord) => (
                <option key={caseRecord.id} value={caseRecord.id}>
                  {caseRecord.title}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>{t(language, "stage")}</span>
            <select value={stage} onChange={(event) => setStage(event.target.value)}>
              {stageOptions.map((option) => (
                <option
                  key={option}
                  value={option}
                  disabled={selectedCase ? !selectedCase.stage_suitability.includes(option) : false}
                >
                  {labelForStage(option)}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>{t(language, "tool")}</span>
            <select value={tool} onChange={(event) => setTool(event.target.value)}>
              {(selectedCase?.recommended_tools ?? []).map((option) => (
                <option key={option} value={option}>
                  {labelForTool(option)}
                </option>
              ))}
            </select>
          </label>
        </div>

        {selectedCase ? (
          <div className="panel">
            <strong>{selectedCase.title}</strong>
            <div className="row" style={{ marginTop: 8 }}>
              <span className="badge">{labelForDifficulty(selectedCase.difficulty)}</span>
              <span className="badge">{selectedCase.theme}</span>
            </div>
            <p className="muted">{selectedCase.presenting_complaint}</p>
          </div>
        ) : null}

        <label className="field">
          <span className="field-label">
            {t(language, "sessionGoal")}
            <HelpTip label={t(language, "sessionGoal")} content={t(language, "helpSessionGoal")} />
          </span>
          <input
            value={goal}
            onChange={(event) => setGoal(event.target.value)}
            placeholder={t(language, "placeholderSessionGoal")}
          />
        </label>

        <label className="field">
          <span className="field-label">
            {t(language, "toolRationale")}
            <HelpTip label={t(language, "toolRationale")} content={t(language, "helpToolRationale")} />
          </span>
          <textarea
            value={rationale}
            onChange={(event) => setRationale(event.target.value)}
            placeholder={t(language, "placeholderToolRationale")}
          />
        </label>

        {error ? <div className="error">{error}</div> : null}
        {validationMessages.length > 0 ? (
          <div className="panel stack">
            <strong>{t(language, "blockingIssues")}</strong>
            <div className="muted">{t(language, "clearValidationGuidance")}</div>
            <div className="list">
              {validationMessages.map((message) => (
                <div key={message} className="list-item">{message}</div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="row">
          <button onClick={handleStartSession} disabled={isLoading}>
            {isLoading ? t(language, "starting") : t(language, "startSession")}
          </button>
        </div>
      </div>
    </div>
  );
}
