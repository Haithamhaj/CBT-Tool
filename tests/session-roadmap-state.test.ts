import { describe, expect, it } from "vitest";
import { getReferenceHubContent } from "../src/lib/i18n/reference-hub-content";
import {
  buildRoadmapStorageKey,
  deriveSessionStatus,
  parseChecklistState,
  summarizeChecklist,
  toggleChecklistValue
} from "../src/lib/session-roadmap";

describe("session roadmap state helpers", () => {
  const sessions = getReferenceHubContent("en").fiveSessionMap.items;

  it("builds a stable storage key per language", () => {
    expect(buildRoadmapStorageKey("en")).toBe("cbt-session-roadmap:en");
    expect(buildRoadmapStorageKey("ar")).toBe("cbt-session-roadmap:ar");
  });

  it("creates a safe initial state when storage is empty or invalid", () => {
    const emptyState = parseChecklistState(null, sessions);
    const invalidState = parseChecklistState("{bad json", sessions);

    expect(emptyState[sessions[0].session]).toEqual([false, false, false, false]);
    expect(invalidState[sessions[1].session]).toEqual([false, false, false, false]);
  });

  it("merges saved state back into the current session structure", () => {
    const state = parseChecklistState(JSON.stringify({ [sessions[0].session]: [true, false, true] }), sessions);

    expect(state[sessions[0].session]).toEqual([true, false, true, false]);
    expect(state[sessions[2].session]).toEqual([false, false, false, false]);
  });

  it("toggles one checklist item and derives the expected progress state", () => {
    const initialState = parseChecklistState(null, sessions);
    const updatedState = toggleChecklistValue(initialState, sessions[0].session, 1);
    const completedState = {
      ...updatedState,
      [sessions[0].session]: [true, true, true, true]
    };

    expect(updatedState[sessions[0].session]).toEqual([false, true, false, false]);
    expect(deriveSessionStatus(initialState[sessions[0].session])).toBe("notStarted");
    expect(deriveSessionStatus(updatedState[sessions[0].session])).toBe("inProgress");
    expect(deriveSessionStatus(completedState[sessions[0].session])).toBe("completed");
    expect(summarizeChecklist(completedState[sessions[0].session])).toEqual({ completed: 4, total: 4 });
  });
});
