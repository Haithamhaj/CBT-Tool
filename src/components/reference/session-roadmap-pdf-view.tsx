"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../language-provider";
import { LecturePdfTrigger } from "../lectures/lecture-pdf-trigger";
import { getReferenceHubContent } from "../../lib/i18n/reference-hub-content";
import { getSessionRoadmapContent } from "../../lib/i18n/session-roadmap-content";
import { buildRoadmapStorageKey, parseChecklistState, type RoadmapChecklistState } from "../../lib/session-roadmap";
import { SessionRoadmapView } from "./session-roadmap-view";

export function SessionRoadmapPdfView() {
  const { language } = useLanguage();
  const labels = getSessionRoadmapContent(language);
  const sessions = getReferenceHubContent(language).fiveSessionMap.items;
  const storageKey = buildRoadmapStorageKey(language);
  const [checklistState, setChecklistState] = useState<RoadmapChecklistState>(() => parseChecklistState(null, sessions));
  const [readyToPrint, setReadyToPrint] = useState(false);

  useEffect(() => {
    setChecklistState(parseChecklistState(window.localStorage.getItem(storageKey), sessions));
    setReadyToPrint(true);
  }, [sessions, storageKey]);

  return (
    <div className="stack">
      {readyToPrint ? <LecturePdfTrigger /> : null}
      <section className="panel print-hidden lecture-pdf-banner stack">
        <strong>{labels.pdfReadyTitle}</strong>
        <p>{labels.pdfReadyHint}</p>
      </section>
      <SessionRoadmapView sessions={sessions} labels={labels} checklistState={checklistState} />
    </div>
  );
}
