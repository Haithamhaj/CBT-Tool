import type { DriftEvent, RubricScores } from "../src/contracts";
import { calculateScore } from "../src/lib/scoring/scoring-engine";

function makeDriftEvent(overrides: Partial<DriftEvent>): DriftEvent {
  return {
    id: "drift-1",
    session_id: "session-1",
    attempt_id: "attempt-1",
    drift_id: "DR011",
    name: "Missing Collaborative Link",
    description: "Rationale missing",
    detection_mode: "hybrid",
    severity: "minor",
    status: "open",
    message: "Tool rationale is missing.",
    corrective_action: "Add a brief rationale.",
    created_at: "2026-04-01T00:00:00.000Z",
    corrected_at: null,
    ...overrides
  };
}

describe("scoring engine", () => {
  const rubricScores: RubricScores = {
    session_structure: 16,
    identification_accuracy: 16,
    tool_selection: 13,
    questioning_quality: 12,
    formulation_quality: 11,
    summary_and_homework: 10
  };

  it("calculates raw and adjusted score with repeated drift escalation", () => {
    const result = calculateScore({
      rubricScores,
      driftEvents: [
        makeDriftEvent({ drift_id: "DR011", severity: "minor" }),
        makeDriftEvent({ id: "drift-2", drift_id: "DR011", severity: "minor" }),
        makeDriftEvent({ id: "drift-3", drift_id: "DR004", severity: "moderate" })
      ]
    });

    expect(result.raw_score).toBe(78);
    expect(result.adjusted_score).toBe(68);
    expect(result.drift_penalties.map((entry) => entry.penalty_points)).toEqual([2, 3, 5]);
    expect(result.outcome).toBe("needs_revision");
  });

  it("caps adjusted score when blocking drift remains open", () => {
    const result = calculateScore({
      rubricScores: {
        session_structure: 20,
        identification_accuracy: 20,
        tool_selection: 15,
        questioning_quality: 15,
        formulation_quality: 15,
        summary_and_homework: 15
      },
      driftEvents: [makeDriftEvent({ drift_id: "DR006", severity: "major", detection_mode: "rule" })]
    });

    expect(result.adjusted_score).toBe(59);
    expect(result.outcome).toBe("fail");
  });

  it("returns strong pass when score and subscores clear the thresholds", () => {
    const result = calculateScore({
      rubricScores: {
        session_structure: 18,
        identification_accuracy: 18,
        tool_selection: 14,
        questioning_quality: 14,
        formulation_quality: 13,
        summary_and_homework: 14
      },
      driftEvents: []
    });

    expect(result.adjusted_score).toBe(91);
    expect(result.outcome).toBe("strong_pass");
  });
});
