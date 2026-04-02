"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "../../src/components/language-provider";

type SessionListItem = {
  session: {
    id: string;
    case_id: string;
    stage: string;
    selected_tool: string;
    state: string;
    current_step: string | null;
    created_at: string;
  };
  latest_score: {
    adjusted_score: number;
    outcome: string;
  } | null;
};

const resumableStates = new Set(["in_progress", "blocked_validation", "ready"]);

export default function SessionsPage() {
  const { language, t, labelForStage, labelForState, labelForTool, translateServerText } = useLanguage();
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/sessions")
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) {
          throw new Error(translateServerText(body.error ?? "Unable to load sessions."));
        }
        setSessions(body);
      })
      .catch((err: Error) => setError(err.message));
  }, [translateServerText]);

  return (
    <div className="page">
      <div>
        <h1>{t(language, "sessionsTitle")}</h1>
        <p className="muted">{t(language, "sessionsSubtitle")}</p>
      </div>

      {error ? <div className="panel error">{error}</div> : null}

      <div className="panel stack">
        {sessions.length > 0 ? (
          <div className="list">
            {sessions.map(({ session, latest_score }) => {
              const target = resumableStates.has(session.state)
                ? `/session/${session.id}`
                : `/review/${session.id}`;

              return (
                <div key={session.id} className="list-item">
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <div>
                      <strong>{session.case_id}</strong> <span className="badge">{labelForStage(session.stage)}</span>
                    </div>
                    <Link href={target} className="badge">
                      {resumableStates.has(session.state) ? t(language, "continue") : t(language, "openReview")}
                    </Link>
                  </div>
                  <div className="muted">
                    {labelForTool(session.selected_tool)} · {labelForState(session.state)}
                    {latest_score ? ` · ${t(language, "adjustedScore")} ${latest_score.adjusted_score}` : ""}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="muted">{t(language, "noSessions")}</div>
        )}
      </div>
    </div>
  );
}
