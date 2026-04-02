"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HelpTip } from "../../../src/components/help-tip";
import { useLanguage } from "../../../src/components/language-provider";
import { localizeCaseDisplay } from "../../../src/lib/i18n/case-display";

type SessionView = {
  session: {
    id: string;
    current_step: string | null;
    stage: string;
    selected_tool: string;
    session_goal: string;
    state: string;
  };
  case: {
    id: string;
    title: string;
    theme?: string;
    presenting_complaint: string;
  } | null;
  attempts: Array<{
    id: string;
    step_name: string;
    validation_output: { passed: boolean; blocking_errors: string[]; warnings: string[] };
      evaluator_outputs?: Array<{
      evaluator_name: string;
      provider_name: string;
      output_language?: "en" | "ar";
      response_source: string;
      fallback_used: boolean;
      fallback_reason: string | null;
      latency_ms: number;
      output: Record<string, unknown> | null;
    }>;
  }>;
  drift_events: Array<{ id: string; drift_id: string; message: string; severity: string; corrective_action: string }>;
};

export default function SessionPage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const {
    language,
    t,
    labelForStage,
    labelForTool,
    labelForState,
    labelForStep,
    labelForSeverity,
    translateServerText,
    translateDriftMessage,
    translateDriftAction
  } = useLanguage();
  const [view, setView] = useState<SessionView | null>(null);
  const [text, setText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [homeworkText, setHomeworkText] = useState("");
  const [error, setError] = useState("");
  const [lastResult, setLastResult] = useState<Record<string, unknown> | null>(null);

  async function loadSession() {
    const response = await fetch(`/api/session/${params.sessionId}`);
    const body = await response.json();
    if (!response.ok) {
      setError(translateServerText(body.error ?? "Unable to load session."));
      return;
    }
    setView(body);
  }

  useEffect(() => {
    loadSession();
  }, [params.sessionId]);

  async function handleSubmit() {
    if (!view) return;

    setError("");
    const payload =
      view.session.current_step === "summary_and_homework"
        ? {
            text: summaryText || "summary",
            summary_text: summaryText,
            homework_text: homeworkText,
            language
          }
        : {
            text,
            language
          };

    const response = await fetch("/api/practice/step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: params.sessionId,
        step_name: view.session.current_step,
        input_payload: payload
      })
    });

    const body = await response.json();
    setLastResult(body);

    if (!response.ok) {
      setError(translateServerText(body.error ?? "Unable to submit step."));
      return;
    }

    if (body.session?.state === "reviewed" || body.session?.state === "needs_revision") {
      router.push(`/review/${params.sessionId}`);
      return;
    }

    setText("");
    await loadSession();
  }

  if (!view) {
    return <div className="page"><div className="panel">{t(language, "loadingSession")}</div></div>;
  }

  const currentStep = view.session.current_step ?? "guided_input";
  const latestAttempt = view.attempts[view.attempts.length - 1] ?? null;
  const localizedCase = view.case ? localizeCaseDisplay(language, view.case) : null;
  const canOpenReview = ["review_pending", "reviewed", "needs_revision", "completed"].includes(view.session.state);
  const latestValidation = (lastResult?.attempt as { validation_output?: { blocking_errors?: string[]; warnings?: string[]; passed?: boolean } } | undefined)?.validation_output;
  const visibleEvaluatorOutputs = (latestAttempt?.evaluator_outputs ?? []).filter(
    (entry) => !entry.output_language || entry.output_language === language
  );

  return (
    <div className="page">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h1>{t(language, "sessionStepTitle")}</h1>
          <p className="muted">{t(language, "sessionStepSubtitle")}</p>
        </div>
        {canOpenReview ? (
          <Link href={`/review/${params.sessionId}`} className="badge">
            {t(language, "openReview")}
          </Link>
        ) : (
          <span className="badge">{t(language, "reviewUnavailable")}</span>
        )}
      </div>

      {!canOpenReview && currentStep === "summary_and_homework" && view.session.state === "blocked_validation" ? (
        <div className="muted">{t(language, "clearValidationGuidance")}</div>
      ) : null}
      {!canOpenReview && !(currentStep === "summary_and_homework" && view.session.state === "blocked_validation") ? (
        <div className="muted">{t(language, "reviewUnavailableHint")}</div>
      ) : null}

      <div className="panel stack">
        <div className="row">
          <span className="badge">{localizedCase?.title ?? t(language, "case")}</span>
          <span className="badge">{labelForStage(view.session.stage)}</span>
          <span className="badge">{labelForTool(view.session.selected_tool)}</span>
          <span className="badge">{labelForState(view.session.state)}</span>
        </div>

        <div>
          <strong>{t(language, "sessionGoal")}</strong>
          <p className="muted">{view.session.session_goal}</p>
        </div>

        <div>
          <strong>{t(language, "caseContext")}</strong>
          <p className="muted">{localizedCase?.presenting_complaint}</p>
        </div>
      </div>

      <div className="panel stack">
        <h2>{t(language, "currentStep")}: {labelForStep(currentStep)}</h2>

        {currentStep === "summary_and_homework" ? (
          <>
            <label className="field">
              <span className="field-label">
                {t(language, "sessionSummary")}
                <HelpTip label={t(language, "sessionSummary")} content={t(language, "helpSessionSummary")} />
              </span>
              <textarea
                value={summaryText}
                onChange={(event) => setSummaryText(event.target.value)}
                placeholder={t(language, "placeholderSessionSummary")}
              />
            </label>
            <label className="field">
              <span className="field-label">
                {t(language, "homework")}
                <HelpTip label={t(language, "homework")} content={t(language, "helpHomework")} />
              </span>
              <textarea
                value={homeworkText}
                onChange={(event) => setHomeworkText(event.target.value)}
                placeholder={t(language, "placeholderHomework")}
              />
            </label>
          </>
        ) : (
          <label className="field">
            <span className="field-label">
              {t(language, "stepInput")}
              <HelpTip label={t(language, "stepInput")} content={t(language, "helpStepInput")} />
            </span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={t(language, "placeholderStepInput")}
            />
          </label>
        )}

        {error ? <div className="error">{error}</div> : null}

        <div className="row">
          <button onClick={handleSubmit}>{t(language, "submitStep")}</button>
        </div>
      </div>

      {lastResult ? (
        <div className="panel stack">
          <h2>{t(language, "latestResult")}</h2>
          {"attempt" in lastResult && lastResult.attempt ? (
            <div className="list">
              <div className="list-item">
                <strong>{t(language, "validation")}</strong>
                <div className="muted">
                  {t(language, "passed")}: {latestValidation?.passed ? t(language, "yes") : t(language, "no")}
                </div>
                {latestValidation?.blocking_errors?.length ? (
                  <div className="stack" style={{ marginTop: 12 }}>
                    <strong>{t(language, "blockingIssues")}</strong>
                    <div className="muted">{t(language, "clearValidationGuidance")}</div>
                    <div className="list">
                      {latestValidation.blocking_errors.map((message) => (
                        <div key={message} className="list-item">{translateServerText(message)}</div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {latestValidation?.warnings?.length ? (
                  <div className="stack" style={{ marginTop: 12 }}>
                    <strong>{t(language, "warnings")}</strong>
                    <div className="list">
                      {latestValidation.warnings.map((message) => (
                        <div key={message} className="list-item">{translateServerText(message)}</div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {"drift_events" in lastResult && Array.isArray(lastResult.drift_events) && lastResult.drift_events.length > 0 ? (
            <div className="list">
              {lastResult.drift_events.map((drift) => {
                const driftRecord = drift as { id: string; drift_id: string; severity: string; message: string; corrective_action: string };
                return (
                  <div key={driftRecord.id} className="list-item">
                    <strong>{driftRecord.drift_id}</strong> <span className="badge">{labelForSeverity(driftRecord.severity)}</span>
                    <div>{translateDriftMessage(driftRecord.drift_id, driftRecord.message)}</div>
                    <div className="muted">{translateDriftAction(driftRecord.drift_id, driftRecord.corrective_action)}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="muted">{t(language, "noDriftEvents")}</div>
          )}
        </div>
      ) : null}

      {visibleEvaluatorOutputs.length ? (
        <div className="panel stack">
          <h2>{t(language, "evaluatorOutput")}</h2>
          <div className="list">
            {visibleEvaluatorOutputs.map((entry, index) => (
              <div key={`${entry.evaluator_name}-${index}`} className="list-item">
                <div className="row">
                  <strong>{entry.evaluator_name}</strong>
                  <span className="badge">{entry.provider_name}</span>
                  <span className="badge">{entry.response_source}</span>
                  {entry.fallback_used ? <span className="badge">fallback</span> : null}
                  {entry.fallback_reason ? <span className="badge">{entry.fallback_reason}</span> : null}
                  <span className="badge">{entry.latency_ms} ms</span>
                </div>
                {"label" in (entry.output ?? {}) ? (
                  <div className="muted">
                    Label: {(entry.output as { label?: string }).label} · confidence{" "}
                    {String((entry.output as { confidence?: number }).confidence ?? "")}
                  </div>
                ) : null}
                {"explanation" in (entry.output ?? {}) ? (
                  <div>{String((entry.output as { explanation?: string }).explanation ?? "")}</div>
                ) : null}
                {"next_revision" in (entry.output ?? {}) ? (
                  <div>{String((entry.output as { next_revision?: string }).next_revision ?? "")}</div>
                ) : null}
                {"ai_drifts" in (entry.output ?? {}) ? (
                  <div className="list">
                    {((entry.output as {
                      ai_drifts?: Array<{
                        drift_id: string;
                        severity: string;
                        rationale: string;
                        corrective_action: string;
                      }>;
                    }).ai_drifts ?? []).map((drift) => (
                      <div key={drift.drift_id} className="list-item">
                        <strong>{drift.drift_id}</strong> <span className="badge">{labelForSeverity(drift.severity)}</span>
                        <div>{drift.rationale}</div>
                        <div className="muted">{drift.corrective_action}</div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
