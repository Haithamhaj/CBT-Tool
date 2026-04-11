import type { SessionMapItem } from "./i18n/reference-hub-content";
import type { RoadmapStatusLabels } from "./i18n/session-roadmap-content";

export type RoadmapChecklistState = Record<string, boolean[]>;
export type RoadmapSessionStatus = keyof RoadmapStatusLabels;

export function buildRoadmapStorageKey(language: string) {
  return `cbt-session-roadmap:${language}`;
}

export function createInitialChecklistState(sessions: SessionMapItem[]): RoadmapChecklistState {
  return Object.fromEntries(sessions.map((session) => [session.session, session.checklistItems.map(() => false)]));
}

export function mergeChecklistState(
  sessions: SessionMapItem[],
  savedState: Partial<RoadmapChecklistState> | null | undefined
): RoadmapChecklistState {
  const initialState = createInitialChecklistState(sessions);

  if (!savedState) {
    return initialState;
  }

  return Object.fromEntries(
    sessions.map((session) => {
      const values = savedState[session.session];
      const merged = session.checklistItems.map((_, index) => Boolean(values?.[index]));
      return [session.session, merged];
    })
  );
}

export function parseChecklistState(raw: string | null, sessions: SessionMapItem[]) {
  if (!raw) {
    return createInitialChecklistState(sessions);
  }

  try {
    const parsed = JSON.parse(raw) as Partial<RoadmapChecklistState>;
    return mergeChecklistState(sessions, parsed);
  } catch {
    return createInitialChecklistState(sessions);
  }
}

export function deriveSessionStatus(values: boolean[]): RoadmapSessionStatus {
  const completedCount = values.filter(Boolean).length;

  if (completedCount === 0) {
    return "notStarted";
  }

  if (completedCount === values.length) {
    return "completed";
  }

  return "inProgress";
}

export function summarizeChecklist(values: boolean[]) {
  const completed = values.filter(Boolean).length;
  return {
    completed,
    total: values.length
  };
}

export function toggleChecklistValue(
  state: RoadmapChecklistState,
  sessionKey: string,
  itemIndex: number
): RoadmapChecklistState {
  const values = state[sessionKey] ?? [];

  return {
    ...state,
    [sessionKey]: values.map((value, index) => (index === itemIndex ? !value : value))
  };
}
