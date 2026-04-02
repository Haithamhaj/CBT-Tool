import { describe, expect, it } from "vitest";
import { EvaluatorService } from "../../src/lib/evaluators/service";
import { FallbackEvaluatorProvider } from "../../src/lib/evaluators/fallback-provider";
import { getEvaluatorRuntimeConfig } from "../../src/lib/evaluators/runtime";
import type { EvaluatorProvider, FeedbackCoachInput } from "../../src/lib/evaluators/provider";

const categoryRequest = {
  text: "I am going to embarrass myself in the team meeting.",
  language: "en" as const
};

const feedbackRequest: FeedbackCoachInput = {
  stepName: "summary_and_homework",
  attemptText: "This week I will try lots of strategies and maybe complete a worksheet if I have time.",
  detectedIssues: ["Homework appears too broad.", "Summary did not connect clearly to the selected tool."],
  rubricContext: {
    session_structure: 14,
    identification_accuracy: 12,
    tool_selection: 10,
    questioning_quality: 11,
    formulation_quality: 10,
    summary_and_homework: 7
  },
  language: "en"
};

function sanitize<T extends { meta: unknown; output: unknown }>(result: T) {
  return {
    meta: result.meta,
    output: result.output
  };
}

describe("live evaluator smoke", () => {
  it("captures default runtime results for both current evaluators", async () => {
    const runtime = getEvaluatorRuntimeConfig();
    const service = new EvaluatorService();
    const category = await service.classifyCategory(categoryRequest);
    const feedback = await service.coachFeedback(feedbackRequest);

    console.log(
      "[live-evaluator-smoke.default]",
      JSON.stringify(
        {
          environment: {
            node: process.version,
            has_openai_api_key: Boolean(process.env.OPENAI_API_KEY),
            configured_provider: runtime.providerName,
            model: runtime.model,
            timeout_ms: runtime.timeoutMs
          },
          category: sanitize(category),
          feedback: sanitize(feedback)
        },
        null,
        2
      )
    );

    expect(category.meta.providerName).toBeTruthy();
    expect(feedback.meta.providerName).toBeTruthy();
  }, 20000);

  it("captures schema-validation fallback behavior", async () => {
    const invalidProvider: EvaluatorProvider = {
      async classifyCategory() {
        return { label: "not-valid" };
      },
      async detectDrift() {
        return { invalid: true };
      },
      async coachFeedback() {
        return { invalid: true };
      },
      async synthesizeSession() {
        return { invalid: true };
      }
    };

    const service = new EvaluatorService(invalidProvider, new FallbackEvaluatorProvider());
    const category = await service.classifyCategory(categoryRequest);

    console.log("[live-evaluator-smoke.schema]", JSON.stringify(sanitize(category), null, 2));

    expect(category.meta.fallbackReason).toBe("schema_validation");
    expect(category.meta.responseSource).toBe("fallback");
  });

  it("captures timeout-triggered fallback behavior", async () => {
    const timeoutProvider: EvaluatorProvider = {
      async classifyCategory() {
        const error = new Error("timed out");
        error.name = "AbortError";
        throw error;
      },
      async detectDrift() {
        const error = new Error("timed out");
        error.name = "AbortError";
        throw error;
      },
      async coachFeedback() {
        const error = new Error("timed out");
        error.name = "AbortError";
        throw error;
      },
      async synthesizeSession() {
        const error = new Error("timed out");
        error.name = "AbortError";
        throw error;
      }
    };

    const service = new EvaluatorService(timeoutProvider, new FallbackEvaluatorProvider());
    const category = await service.classifyCategory(categoryRequest);

    console.log("[live-evaluator-smoke.timeout]", JSON.stringify(sanitize(category), null, 2));

    expect(category.meta.fallbackReason).toBe("timeout");
    expect(category.meta.responseSource).toBe("fallback");
  });
});
