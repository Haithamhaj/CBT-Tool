import { describe, expect, it } from "vitest";
import { feedbackCoachResultSchema } from "../../src/contracts";
import { EvaluatorService } from "../../src/lib/evaluators/service";
import type { EvaluatorProvider } from "../../src/lib/evaluators/provider";

describe("feedback coach evaluator", () => {
  it("returns schema-valid coaching output", async () => {
    const provider: EvaluatorProvider = {
      async classifyCategory() {
        throw new Error("unused");
      },
      async detectDrift() {
        return { ai_drifts: [] };
      },
      async coachFeedback() {
        return {
          what_was_done_well: ["You stayed focused on the task."],
          top_issues: ["The homework was too broad."],
          why_it_matters: ["Homework must be feasible and specific."],
          next_revision: "Reduce the homework to one focused task."
        };
      },
      async synthesizeSession() {
        return {
          session_summary: "ok",
          primary_learning_pattern: "ok",
          evidence_based_strengths: ["ok"],
          priority_improvement_area: "ok",
          recommended_next_focus: "ok",
          confidence: 0.7
        };
      }
    };

    const service = new EvaluatorService(provider, provider);
    const result = await service.coachFeedback({
      stepName: "summary_and_homework",
      attemptText: "Try many things this week.",
      detectedIssues: ["Homework appears overloaded."],
      rubricContext: {
        session_structure: 16,
        identification_accuracy: 15,
        tool_selection: 13,
        questioning_quality: 12,
        formulation_quality: 10,
        summary_and_homework: 8
      },
      language: "en"
    });

    expect(feedbackCoachResultSchema.parse(result.output).top_issues[0]).toContain("homework");
  });
});
