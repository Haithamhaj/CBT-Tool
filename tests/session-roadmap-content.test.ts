import { describe, expect, it } from "vitest";
import { getReferenceHubContent } from "../src/lib/i18n/reference-hub-content";

describe("session roadmap content", () => {
  it("contains five complete roadmap sessions in English and Arabic", () => {
    for (const language of ["en", "ar"] as const) {
      const sessions = getReferenceHubContent(language).fiveSessionMap.items;

      expect(sessions).toHaveLength(5);

      for (const session of sessions) {
        expect(session.tasks.length).toBeGreaterThan(0);
        expect(session.milestones.length).toBeGreaterThan(0);
        expect(session.checklistItems.length).toBeGreaterThan(0);
        expect(session.dynamicFlow.whatToDo.length).toBeGreaterThan(0);
        expect(session.dynamicFlow.therapeuticBenefit.length).toBeGreaterThan(0);
        expect(session.dynamicFlow.whatNext.length).toBeGreaterThan(0);
        expect(session.dynamicFlow.doNotAdvanceIf.length).toBeGreaterThan(0);
        expect(session.tools.length).toBeGreaterThan(0);
        expect(session.homework.length).toBeGreaterThan(0);
        expect(session.output.length).toBeGreaterThan(0);
      }
    }
  });
});
