import { describe, expect, it } from "vitest";
import { categoryClassifierResultSchema } from "../../src/contracts";
import { EvaluatorService } from "../../src/lib/evaluators/service";
import type { EvaluatorProvider } from "../../src/lib/evaluators/provider";

describe("category classifier evaluator", () => {
  it("returns schema-valid classification output", async () => {
    const provider: EvaluatorProvider = {
      async classifyCategory() {
        return {
          label: "thought",
          confidence: 0.91,
          explanation: "The text is an interpretation."
        };
      },
      async detectDrift() {
        return { ai_drifts: [] };
      },
      async coachFeedback() {
        throw new Error("unused");
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
    const result = await service.classifyCategory({
      text: "I am going to embarrass myself.",
      language: "en"
    });

    expect(categoryClassifierResultSchema.parse(result.output).label).toBe("thought");
  });

  it("falls back to deterministic classification on provider failure", async () => {
    const failingProvider: EvaluatorProvider = {
      async classifyCategory() {
        throw new Error("timeout");
      },
      async detectDrift() {
        return { ai_drifts: [] };
      },
      async coachFeedback() {
        throw new Error("unused");
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

    const service = new EvaluatorService(failingProvider);
    const result = await service.classifyCategory({
      text: "I feel anxious and ashamed.",
      language: "en"
    });

    expect(result.meta.model).toBe("fallback");
    expect(result.output.label).toBe("emotion");
  });
});
