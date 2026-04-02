import { describe, expect, it } from "vitest";
import { getEvaluatorRuntimeConfig } from "../../src/lib/evaluators/runtime";

describe("evaluator runtime validation", () => {
  it("uses fallback provider defaults when no OpenAI env is set", () => {
    const config = getEvaluatorRuntimeConfig({});

    expect(config.providerName).toBe("fallback");
    expect(config.model).toBe("gpt-4.1-mini");
    expect(config.timeoutMs).toBe(4000);
  });

  it("uses openai provider when api key is present", () => {
    const config = getEvaluatorRuntimeConfig({
      OPENAI_API_KEY: "test-key",
      OPENAI_EVALUATOR_MODEL: "gpt-4.1-mini",
      EVALUATOR_TIMEOUT_MS: "2500"
    });

    expect(config.providerName).toBe("openai");
    expect(config.apiKey).toBe("test-key");
    expect(config.timeoutMs).toBe(2500);
  });
});
