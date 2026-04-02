"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../../src/components/language-provider";
import { useRuntimeAuth } from "../../src/components/runtime-auth-provider";

type ProgressPayload = {
  average_score: number;
  recent_sessions: Array<{
    id: string;
    case_id: string;
    stage: string;
    state: string;
    score: { adjusted_score: number } | null;
  }>;
  repeated_drift_patterns: Array<{ drift_id: string; count: number }>;
  recommended_next_practice_area: string;
};

export default function ProgressPage() {
  const { currentUser } = useRuntimeAuth();
  const { language, t, labelForStage, labelForState, translateRecommendation, translateServerText } = useLanguage();
  const [progress, setProgress] = useState<ProgressPayload | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/progress/${currentUser.id}`)
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) {
          throw new Error(translateServerText(body.error ?? "Unable to load progress."));
        }
        setProgress(body);
      })
      .catch((err: Error) => setError(err.message));
  }, [currentUser.id, translateServerText]);

  if (error) {
    return <div className="page"><div className="panel error">{error}</div></div>;
  }

  if (!progress) {
    return <div className="page"><div className="panel">{t(language, "loadingProgress")}</div></div>;
  }

  return (
    <div className="page">
      <div>
        <h1>{t(language, "progressTitle")}</h1>
        <p className="muted">{t(language, "progressSubtitle")}</p>
      </div>

      <div className="grid">
        <div className="panel">
          <strong>{t(language, "averageScore")}</strong>
          <div style={{ marginTop: 8 }}>{progress.average_score}</div>
        </div>
        <div className="panel">
          <strong>{t(language, "nextPracticeArea")}</strong>
          <div style={{ marginTop: 8 }}>{translateRecommendation(progress.recommended_next_practice_area)}</div>
        </div>
      </div>

      <div className="panel stack">
        <h2>{t(language, "recentSessions")}</h2>
        {progress.recent_sessions.length > 0 ? (
          <div className="list">
            {progress.recent_sessions.map((session) => (
              <div key={session.id} className="list-item">
                <strong>{session.case_id}</strong> <span className="badge">{labelForStage(session.stage)}</span>
                <div className="muted">
                  {labelForState(session.state)} · {t(language, "adjustedScore")} {session.score?.adjusted_score ?? "pending"}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="muted">{t(language, "noRecentSessions")}</div>
        )}
      </div>

      <div className="panel stack">
        <h2>{t(language, "repeatedDriftPatterns")}</h2>
        {progress.repeated_drift_patterns.length > 0 ? (
          <div className="list">
            {progress.repeated_drift_patterns.map((drift) => (
              <div key={drift.drift_id} className="list-item">
                <strong>{drift.drift_id}</strong>
                <div className="muted">{t(language, "occurrences", drift.count)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="muted">{t(language, "noRepeatedDrifts")}</div>
        )}
      </div>
    </div>
  );
}
