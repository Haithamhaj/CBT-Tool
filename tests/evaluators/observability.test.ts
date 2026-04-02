import { describe, expect, it, vi } from "vitest";
import { EvaluatorService, toEvaluatorOutput } from "../../src/lib/evaluators/service";
import type { EvaluatorProvider } from "../../src/lib/evaluators/provider";
import { evaluatorOutputSchema } from "../../src/contracts";

describe("evaluator observability", () => {
  it("includes observability fields in persisted evaluator output", () => {
    const output = toEvaluatorOutput(
      "feedback_coach",
      {
        providerName: "fallback",
        responseSource: "fallback",
        fallbackUsed: true,
        fallbackReason: "provider_error",
        model: "fallback",
        promptVersion: "feedback-coach-v1:fallback",
        latencyMs: 12,
        occurredAt: new Date().toISOString(),
        outputLanguage: "en"
      },
      {
        what_was_done_well: ["Clear enough to review."],
        top_issues: ["Homework was too broad."],
        why_it_matters: ["Specific tasks are easier to complete."],
        next_revision: "Reduce the homework to one task."
      }
    );

    expect(evaluatorOutputSchema.parse(output).provider_name).toBe("fallback");
    expect(output.response_source).toBe("fallback");
    expect(output.fallback_used).toBe(true);
    expect(output.fallback_reason).toBe("provider_error");
    expect(output.latency_ms).toBe(12);
  });

  it("logs fallback execution", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const failingProvider: EvaluatorProvider = {
      async classifyCategory() {
        throw new Error("provider failure");
      },
      async detectDrift() {
        throw new Error("provider failure");
      },
      async coachFeedback() {
        throw new Error("provider failure");
      },
      async synthesizeSession() {
        throw new Error("provider failure");
      }
    };

    const service = new EvaluatorService(failingProvider);
    await service.classifyCategory({ text: "I feel anxious.", language: "en" });

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
