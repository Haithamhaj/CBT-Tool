"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../language-provider";
import { getReferenceHubContent } from "../../lib/i18n/reference-hub-content";
import { getSessionRoadmapContent } from "../../lib/i18n/session-roadmap-content";
import {
  buildRoadmapStorageKey,
  parseChecklistState,
  toggleChecklistValue,
  type RoadmapChecklistState
} from "../../lib/session-roadmap";
import { SessionRoadmapView } from "./session-roadmap-view";

export function SessionRoadmapPage({ pdfHref }: { pdfHref?: string }) {
  const { language } = useLanguage();
  const labels = getSessionRoadmapContent(language);
  const sessions = getReferenceHubContent(language).fiveSessionMap.items;
  const storageKey = buildRoadmapStorageKey(language);
  const [checklistState, setChecklistState] = useState<RoadmapChecklistState>(() => parseChecklistState(null, sessions));
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setChecklistState(parseChecklistState(window.localStorage.getItem(storageKey), sessions));
    setIsHydrated(true);
  }, [sessions, storageKey]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(checklistState));
  }, [checklistState, isHydrated, storageKey]);

  function handleToggle(sessionKey: string, itemIndex: number) {
    setChecklistState((currentState) => toggleChecklistValue(currentState, sessionKey, itemIndex));
  }

  return <SessionRoadmapView sessions={sessions} labels={labels} checklistState={checklistState} onToggle={handleToggle} pdfHref={pdfHref} />;
}
