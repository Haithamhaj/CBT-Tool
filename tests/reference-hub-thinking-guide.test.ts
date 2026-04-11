import { describe, expect, it } from "vitest";
import { getReferenceHubContent } from "../src/lib/i18n/reference-hub-content";

describe("reference hub downward arrow guide", () => {
  it("provides a practical downward arrow bridge in both languages", () => {
    for (const language of ["en", "ar"] as const) {
      const guide = getReferenceHubContent(language).downwardArrowGuide;

      expect(guide.prerequisites.length).toBeGreaterThan(0);
      expect(guide.startHere.length).toBeGreaterThan(0);
      expect(guide.questionChainExample.questions.length).toBeGreaterThan(1);
      expect(guide.comparison.length).toBe(2);
      expect(guide.readinessChecks.length).toBeGreaterThan(0);
      expect(guide.commonFailureModes.length).toBeGreaterThan(0);
      expect(guide.readinessOutcomeReady.length).toBeGreaterThan(0);
      expect(guide.readinessOutcomeNotReady.length).toBeGreaterThan(0);
    }
  });
});
