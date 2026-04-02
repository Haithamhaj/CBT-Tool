"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { HelpTip } from "../../../src/components/help-tip";
import { useLanguage } from "../../../src/components/language-provider";

type ReviewPayload = {
  session: { id: string; state: string };
  attempts: Array<{
    id: string;
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
  drift_events: Array<{ id: string; drift_id: string; message: string; severity: string }>;
  score_snapshot: {
    adjusted_score: number;
    raw_score: number;
    outcome: string;
    top_issues: string[];
    recommended_next_practice_area: string;
  } | null;
};

export default function ReviewPage() {
  const params = useParams<{ sessionId: string }>();
  const {
    language,
    t,
    labelForOutcome,
    labelForSeverity,
    translateRecommendation,
    translateTopIssue,
    translateDriftMessage,
    translateServerText
  } = useLanguage();
  const [review, setReview] = useState<ReviewPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: params.sessionId,
        language
      })
    })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) {
          throw new Error(translateServerText(body.error ?? "Unable to load review."));
        }
        setReview(body);
      })
      .catch((err: Error) => setError(err.message));
  }, [params.sessionId, language, translateServerText]);

  if (error) {
    return <div className="page"><div className="panel error">{error}</div></div>;
  }

  if (!review) {
    return <div className="page"><div className="panel">{t(language, "reviewLoading")}</div></div>;
  }

  const advisoryEntries = review.attempts
    .flatMap((attempt) => attempt.evaluator_outputs ?? [])
    .filter((entry) => !entry.output_language || entry.output_language === language);

  const feedbackEntry = advisoryEntries.find((entry) => entry.evaluator_name === "feedback_coach");
  const driftDetectorEntry = advisoryEntries.find((entry) => entry.evaluator_name === "drift_detector");
  const sessionSynthesizerEntry = advisoryEntries.find((entry) => entry.evaluator_name === "session_evaluator");
  const deterministicTopAction =
    translateRecommendation(review.score_snapshot?.recommended_next_practice_area) ||
    t(language, "recommendationDefault");
  const advisoryNextFocus =
    String((sessionSynthesizerEntry?.output as { recommended_next_focus?: string } | undefined)?.recommended_next_focus ?? "");

  return (
    <div className="page">
      <div>
        <h1>{t(language, "review")}</h1>
        <p className="muted">{t(language, "reviewSubtitle")}</p>
      </div>

      <div className="section-label">{t(language, "officialReview")}</div>

      <div className="panel stack official-panel">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="title-with-help">
            {t(language, "scoreSummary")}
            <HelpTip label={t(language, "officialReview")} content={t(language, "helpOfficialReview")} />
          </h2>
          <span className="badge authority-badge">{t(language, "deterministicNote")}</span>
        </div>
        {review.score_snapshot ? (
          <>
            <div className="grid">
              <div className="list-item emphasis-card">
                <strong>{t(language, "outcome")}</strong>
                <div>{labelForOutcome(review.score_snapshot.outcome)}</div>
              </div>
              <div className="list-item">
                <strong>{t(language, "adjustedScore")}</strong>
                <div>{review.score_snapshot.adjusted_score}</div>
              </div>
              <div className="list-item">
                <strong>{t(language, "rawScore")}</strong>
                <div>{review.score_snapshot.raw_score}</div>
              </div>
            </div>
            <div className="callout callout-official">
              <div className="title-with-help">
                <strong>{t(language, "nextAction")}</strong>
                <HelpTip label={t(language, "nextAction")} content={t(language, "helpNextAction")} />
              </div>
              <div>{deterministicTopAction}</div>
            </div>
          </>
        ) : (
          <div className="muted">{t(language, "scorePending")}</div>
        )}
      </div>

      <div className="panel stack official-panel">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2>{t(language, "deterministicDriftSummary")}</h2>
          <span className="badge authority-badge">{t(language, "authoritativeNote")}</span>
        </div>
        {review.drift_events.length > 0 ? (
          <div className="list">
            {review.drift_events.map((drift) => (
              <div key={drift.id} className="list-item">
                <strong>{drift.drift_id}</strong> <span className="badge">{labelForSeverity(drift.severity)}</span>
                <div>{translateDriftMessage(drift.drift_id, drift.message)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="muted">{t(language, "noDriftsRecorded")}</div>
        )}
        {review.score_snapshot?.top_issues?.length ? (
          <div className="list">
            {review.score_snapshot.top_issues.map((issue) => (
              <div key={issue} className="list-item">
                <strong>{t(language, "topIssue")}</strong>
                <div>{translateTopIssue(issue)}</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="section-label">{t(language, "advisoryGuidance")}</div>

      {feedbackEntry?.output ? (
        <div className="panel stack advisory-panel">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="title-with-help">
              Step Coaching
              <HelpTip label={t(language, "advisoryGuidance")} content={t(language, "helpAdvisoryGuidance")} />
            </h2>
            <span className="badge advisory-badge">{t(language, "advisoryNote")}</span>
          </div>
          <div className="row">
            <span className="badge">{feedbackEntry.provider_name}</span>
            <span className="badge">{feedbackEntry.response_source}</span>
            {feedbackEntry.fallback_used ? <span className="badge">{t(language, "fallback")}</span> : null}
            {feedbackEntry.fallback_reason ? <span className="badge">{feedbackEntry.fallback_reason}</span> : null}
            <span className="badge">{t(language, "latency", feedbackEntry.latency_ms)}</span>
          </div>
          {"what_was_done_well" in feedbackEntry.output ? (
            <div className="list">
              {((feedbackEntry.output as { what_was_done_well?: string[] }).what_was_done_well ?? []).map((item) => (
                <div key={item} className="list-item">
                  <strong>{t(language, "didWell")}</strong>
                  <div>{item}</div>
                </div>
              ))}
            </div>
          ) : null}
          {"top_issues" in feedbackEntry.output ? (
            <div className="list">
              {((feedbackEntry.output as { top_issues?: string[] }).top_issues ?? []).map((item) => (
                <div key={item} className="list-item">
                  <strong>{t(language, "topIssue")}</strong>
                  <div>{item}</div>
                </div>
              ))}
            </div>
          ) : null}
          {"next_revision" in feedbackEntry.output ? (
            <div className="list-item emphasis-card">
              <strong>{t(language, "nextRevision")}</strong>
              <div>{String((feedbackEntry.output as { next_revision?: string }).next_revision ?? "")}</div>
            </div>
          ) : null}
        </div>
      ) : null}

      {driftDetectorEntry?.output && "ai_drifts" in driftDetectorEntry.output ? (
        <div className="panel stack advisory-panel">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <h2>{t(language, "aiOnlyDriftHints")}</h2>
            <span className="badge advisory-badge">{t(language, "advisoryNote")}</span>
          </div>
          <div className="row">
            <span className="badge">{driftDetectorEntry.provider_name}</span>
            <span className="badge">{driftDetectorEntry.response_source}</span>
            {driftDetectorEntry.fallback_used ? <span className="badge">{t(language, "fallback")}</span> : null}
            {driftDetectorEntry.fallback_reason ? <span className="badge">{driftDetectorEntry.fallback_reason}</span> : null}
            <span className="badge">{t(language, "latency", driftDetectorEntry.latency_ms)}</span>
          </div>
          {((driftDetectorEntry.output as {
            ai_drifts?: Array<{
              drift_id: string;
              severity: string;
              rationale: string;
              corrective_action: string;
            }>;
          }).ai_drifts ?? []).length > 0 ? (
            <div className="list">
              {((driftDetectorEntry.output as {
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
          ) : (
            <div className="muted">{t(language, "noAiDrifts")}</div>
          )}
        </div>
      ) : null}

      {sessionSynthesizerEntry?.output && "session_summary" in sessionSynthesizerEntry.output ? (
        <div className="panel stack advisory-panel">
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <h2>{t(language, "sessionSynthesis")}</h2>
            <span className="badge advisory-badge">{t(language, "advisoryNote")}</span>
          </div>
          <div className="row">
            <span className="badge">{sessionSynthesizerEntry.provider_name}</span>
            <span className="badge">{sessionSynthesizerEntry.response_source}</span>
            {sessionSynthesizerEntry.fallback_used ? <span className="badge">{t(language, "fallback")}</span> : null}
            {sessionSynthesizerEntry.fallback_reason ? <span className="badge">{sessionSynthesizerEntry.fallback_reason}</span> : null}
          </div>
          <div className="callout callout-advisory">
            <div className="title-with-help">
              <strong>{t(language, "nextFocus")}</strong>
              <HelpTip label={t(language, "nextFocus")} content={t(language, "helpNextFocus")} />
            </div>
            <div>{advisoryNextFocus || t(language, "noSynthesisFocus")}</div>
          </div>
          <div className="list-item">
            <strong>{t(language, "summary")}</strong>
            <div>{String((sessionSynthesizerEntry.output as { session_summary?: string }).session_summary ?? "")}</div>
          </div>
          <div className="list-item">
            <strong>{t(language, "primaryLearningPattern")}</strong>
            <div>{String((sessionSynthesizerEntry.output as { primary_learning_pattern?: string }).primary_learning_pattern ?? "")}</div>
          </div>
          <div className="list">
            {((sessionSynthesizerEntry.output as { evidence_based_strengths?: string[] }).evidence_based_strengths ?? []).map((item) => (
              <div key={item} className="list-item">
                <strong>{t(language, "strength")}</strong>
                <div>{item}</div>
              </div>
            ))}
          </div>
          <div className="list-item">
            <strong>{t(language, "priorityImprovementArea")}</strong>
            <div>{String((sessionSynthesizerEntry.output as { priority_improvement_area?: string }).priority_improvement_area ?? "")}</div>
          </div>
          <div className="list-item">
            <strong>{t(language, "recommendedNextFocus")}</strong>
            <div>{String((sessionSynthesizerEntry.output as { recommended_next_focus?: string }).recommended_next_focus ?? "")}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
