import { describe, expect, it } from "vitest";
import { feedbackCoachResultSchema, sessionSynthesizerResultSchema } from "../../src/contracts";

describe("review-visible evaluator output distinction", () => {
  it("keeps feedback coach and session synthesizer contracts distinct", () => {
    const feedback = feedbackCoachResultSchema.parse({
      what_was_done_well: ["The trainee completed the flow."],
      top_issues: ["Homework is too broad."],
      why_it_matters: ["Specific practice is easier to complete."],
      next_revision: "Reduce the homework to one task."
    });

    const synthesis = sessionSynthesizerResultSchema.parse({
      session_summary: "The session completed cleanly but still needs more precise follow-through.",
      primary_learning_pattern: "The main pattern was staying structured while needing sharper task definition.",
      evidence_based_strengths: ["The trainee completed the required steps."],
      priority_improvement_area: "The main improvement area is making the final task more precise.",
      recommended_next_focus: "Practice producing one narrow homework task per session.",
      confidence: 0.84
    });

    expect("next_revision" in feedback).toBe(true);
    expect("session_summary" in feedback).toBe(false);
    expect("session_summary" in synthesis).toBe(true);
    expect("next_revision" in synthesis).toBe(false);
  });
});
