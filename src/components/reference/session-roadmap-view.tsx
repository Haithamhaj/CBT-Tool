"use client";

import { useState } from "react";
import type { SessionMapItem } from "../../lib/i18n/reference-hub-content";
import type { RoadmapContent } from "../../lib/i18n/session-roadmap-content";
import {
  deriveSessionStatus,
  summarizeChecklist,
  type RoadmapChecklistState
} from "../../lib/session-roadmap";

type SessionRoadmapViewProps = {
  sessions: SessionMapItem[];
  labels: RoadmapContent;
  checklistState: RoadmapChecklistState;
  onToggle?: (sessionKey: string, itemIndex: number) => void;
  pdfHref?: string;
};

export function SessionRoadmapView({
  sessions,
  labels,
  checklistState,
  onToggle,
  pdfHref
}: SessionRoadmapViewProps) {
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(0);
  const selectedSession = sessions[selectedSessionIndex] ?? sessions[0];

  return (
    <div className="page lecture-page session-roadmap-page stack">
      <section className="panel session-roadmap-hero stack">
        <div className="row session-roadmap-toolbar">
          <div className="stack">
            <span className="section-label">{labels.timelineTitle}</span>
            <h1 className="lecture-title">{labels.pageTitle}</h1>
            <p className="muted">{labels.pageIntro}</p>
          </div>

          {pdfHref ? (
            <a href={pdfHref} target="_blank" rel="noreferrer" className="lecture-action-link print-hidden">
              {labels.openPdfLabel}
            </a>
          ) : null}
        </div>

        <div className="callout callout-advisory">{labels.savedHint}</div>
      </section>

      <section className="panel stack">
        <div className="stack">
          <span className="section-label">{labels.timelineTitle}</span>
          <h2>{labels.flowTitle}</h2>
          <p className="muted">{labels.flowIntro}</p>
        </div>

        <div className="session-roadmap-flow" aria-label={labels.timelineTitle}>
          {sessions.map((session, index) => {
            const values = checklistState[session.session] ?? [];
            const status = deriveSessionStatus(values);
            const summary = summarizeChecklist(values);
            const isActive = selectedSessionIndex === index;

            return (
              <button
                key={session.session}
                type="button"
                className={isActive ? `session-roadmap-flow-node active status-${status}` : `session-roadmap-flow-node status-${status}`}
                onClick={() => setSelectedSessionIndex(index)}
                aria-pressed={isActive}
              >
                <span className="session-roadmap-stage-number">{index + 1}</span>
                <span className="stack">
                  <strong>{session.session}</strong>
                  <span className="muted">{labels.statusLabels[status]}</span>
                  <span className="badge subtle">
                    {summary.completed}/{summary.total}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <article className="session-roadmap-focus-card">
          <div className="row" style={{ justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
            <div className="stack">
              <strong>{selectedSession.session}</strong>
              <p>{selectedSession.purpose}</p>
            </div>
            <span className="badge">{selectedSession.tools.join(" • ")}</span>
          </div>

          <div className="session-roadmap-focus-grid">
            <section className="reference-card session-roadmap-detail-card">
              <strong>{labels.whatToDoTitle}</strong>
              <div className="list">
                {selectedSession.dynamicFlow.whatToDo.map((item) => (
                  <div key={item} className="list-item">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="reference-card session-roadmap-detail-card">
              <strong>{labels.therapeuticBenefitTitle}</strong>
              <div className="list">
                {selectedSession.dynamicFlow.therapeuticBenefit.map((item) => (
                  <div key={item} className="list-item">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="reference-card session-roadmap-detail-card">
              <strong>{labels.whatNextTitle}</strong>
              <div className="list">
                {selectedSession.dynamicFlow.whatNext.map((item) => (
                  <div key={item} className="list-item">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="reference-card session-roadmap-detail-card">
              <strong>{labels.doNotAdvanceTitle}</strong>
              <div className="list">
                {selectedSession.dynamicFlow.doNotAdvanceIf.map((item) => (
                  <div key={item} className="list-item">
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="session-roadmap-guidance-grid">
            <div className="callout callout-official">
              <strong>{labels.nextStepLabel}:</strong>
              <p>{selectedSession.dynamicFlow.whatNext.join(" • ")}</p>
            </div>
            <div className="callout callout-advisory">
              <strong>{labels.warningLabel}:</strong>
              <p>{selectedSession.dynamicFlow.doNotAdvanceIf.join(" • ")}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="panel stack">
        <h2>{labels.summaryTitle}</h2>
        <p className="muted">{labels.summaryText}</p>
      </section>

      <div className="reference-sequence">
        {sessions.map((session, index) => {
          const values = checklistState[session.session] ?? [];
          const status = deriveSessionStatus(values);
          const summary = summarizeChecklist(values);

          return (
            <article key={session.session} className={`reference-sequence-card session-roadmap-card status-${status}`}>
              <div className="sequence-index">{index + 1}</div>
              <div className="stack">
                <div className="row" style={{ justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                  <div className="stack">
                    <strong>{session.session}</strong>
                    <p>{session.purpose}</p>
                  </div>

                  <div className="session-roadmap-status-block">
                    <span className="section-label">{labels.statusTitle}</span>
                    <strong>{labels.statusLabels[status]}</strong>
                    <span className="muted">
                      {labels.progressTitle}: {summary.completed}/{summary.total}
                    </span>
                  </div>
                </div>

                <div className="session-roadmap-detail-grid">
                  <section className="reference-card session-roadmap-detail-card">
                    <strong>{labels.structureTitle}</strong>
                    <div className="list">
                      {session.tasks.map((task) => (
                        <div key={task} className="list-item">
                          {task}
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="reference-card session-roadmap-detail-card">
                    <strong>{labels.milestonesTitle}</strong>
                    <div className="list">
                      {session.milestones.map((milestone) => (
                        <div key={milestone} className="list-item">
                          {milestone}
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="session-roadmap-meta-grid">
                  <div className="callout callout-official">
                    <strong>{labels.toolsTitle}</strong>
                    <p>{session.tools.join(" • ")}</p>
                  </div>
                  <div className="callout callout-official">
                    <strong>{labels.outputTitle}</strong>
                    <p>{session.output}</p>
                  </div>
                  <div className="callout callout-advisory">
                    <strong>{labels.homeworkTitle}</strong>
                    <p>{session.homework}</p>
                  </div>
                </div>

                <section className="panel stack session-roadmap-checklist-card">
                  <h3>{labels.checklistTitle}</h3>
                  <div className="session-roadmap-checklist">
                    {session.checklistItems.map((item, itemIndex) => {
                      const checked = values[itemIndex] ?? false;
                      const inputId = `${session.session}-${itemIndex}`;
                      return (
                        <label key={inputId} htmlFor={inputId} className={checked ? "session-roadmap-check checked" : "session-roadmap-check"}>
                          <input
                            id={inputId}
                            type="checkbox"
                            checked={checked}
                            onChange={() => onToggle?.(session.session, itemIndex)}
                            disabled={!onToggle}
                          />
                          <span>{item}</span>
                        </label>
                      );
                    })}
                  </div>
                </section>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
