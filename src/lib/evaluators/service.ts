import type {
  CategoryClassifierResult,
  DriftDetectorResult,
  EvaluatorOutput,
  FeedbackCoachResult,
  SessionSynthesizerResult
} from "../../contracts";
import {
  categoryClassifierResultSchema,
  driftDetectorResultSchema,
  feedbackCoachResultSchema,
  sessionSynthesizerResultSchema
} from "../../contracts";
import { ZodError } from "zod";
import { FallbackEvaluatorProvider } from "./fallback-provider";
import { OpenAIProvider } from "./openai-provider";
import { getEvaluatorRuntimeConfig } from "./runtime";
import type {
  CategoryClassifierInput,
  DriftDetectorInput,
  EvaluatorExecutionMeta,
  EvaluatorProvider,
  EvaluatorServiceInterface,
  FeedbackCoachInput,
  SessionSynthesizerInput,
  SuccessfulEvaluatorResult
} from "./provider";

function createDefaultProvider(): EvaluatorProvider | null {
  const config = getEvaluatorRuntimeConfig();
  if (config.apiKey) {
    return new OpenAIProvider({
      apiKey: config.apiKey,
      model: config.model,
      timeoutMs: config.timeoutMs
    });
  }

  return null;
}

function classifyFallbackReason(error: unknown): EvaluatorExecutionMeta["fallbackReason"] {
  if (error instanceof ZodError) {
    return "schema_validation";
  }
  if (typeof error === "object" && error !== null && "name" in error && error.name === "AbortError") {
    return "timeout";
  }
  return "provider_error";
}

export class EvaluatorService implements EvaluatorServiceInterface {
  constructor(
    private readonly provider: EvaluatorProvider | null = createDefaultProvider(),
    private readonly fallbackProvider: EvaluatorProvider = new FallbackEvaluatorProvider()
  ) {}

  async classifyCategory(
    input: CategoryClassifierInput
  ): Promise<SuccessfulEvaluatorResult<CategoryClassifierResult>> {
    const provider = this.provider;
    return this.executeWithFallback(
      "category_classifier",
      "category-classifier-v1",
      provider ? () => provider.classifyCategory(input) : null,
      () => this.fallbackProvider.classifyCategory(input),
      categoryClassifierResultSchema,
      input.language
    );
  }

  async detectDrift(
    input: DriftDetectorInput
  ): Promise<SuccessfulEvaluatorResult<DriftDetectorResult>> {
    const provider = this.provider;
    return this.executeWithFallback(
      "drift_detector",
      "drift-detector-v1",
      provider ? () => provider.detectDrift(input) : null,
      () => this.fallbackProvider.detectDrift(input),
      driftDetectorResultSchema,
      input.language
    );
  }

  async coachFeedback(
    input: FeedbackCoachInput
  ): Promise<SuccessfulEvaluatorResult<FeedbackCoachResult>> {
    const provider = this.provider;
    return this.executeWithFallback(
      "feedback_coach",
      "feedback-coach-v1",
      provider ? () => provider.coachFeedback(input) : null,
      () => this.fallbackProvider.coachFeedback(input),
      feedbackCoachResultSchema,
      input.language
    );
  }

  async synthesizeSession(
    input: SessionSynthesizerInput
  ): Promise<SuccessfulEvaluatorResult<SessionSynthesizerResult>> {
    const provider = this.provider;
    return this.executeWithFallback(
      "session_evaluator",
      "session-synthesizer-v1",
      provider ? () => provider.synthesizeSession(input) : null,
      () => this.fallbackProvider.synthesizeSession(input),
      sessionSynthesizerResultSchema,
      input.language
    );
  }

  private async executeWithFallback<T>(
    evaluatorName: EvaluatorOutput["evaluator_name"],
    promptVersion: string,
    primary: (() => Promise<unknown>) | null,
    fallback: () => Promise<unknown>,
    schema: { parse: (value: unknown) => T },
    language: "en" | "ar"
  ): Promise<SuccessfulEvaluatorResult<T>> {
    const config = getEvaluatorRuntimeConfig();
    const startedAt = Date.now();
    if (!primary) {
      const fallbackOutput = schema.parse(await fallback());
      const result = {
        meta: {
          providerName: "fallback" as const,
          responseSource: "fallback" as const,
          fallbackUsed: true,
          fallbackReason: "missing_configuration" as const,
          model: "fallback",
          promptVersion: `${promptVersion}:fallback`,
          latencyMs: Date.now() - startedAt,
          occurredAt: new Date().toISOString(),
          outputLanguage: language
        },
        output: fallbackOutput
      };
      console.warn("[evaluator.fallback]", {
        evaluatorName,
        providerName: result.meta.providerName,
        responseSource: result.meta.responseSource,
        fallbackUsed: result.meta.fallbackUsed,
        fallbackReason: result.meta.fallbackReason,
        latencyMs: result.meta.latencyMs,
        promptVersion: result.meta.promptVersion
      });
      return result;
    }
    try {
      const providerOutput = await primary();
      const primaryOutput = schema.parse(providerOutput);
      const result = {
        meta: {
          providerName: config.providerName,
          responseSource: "provider" as const,
          fallbackUsed: false,
          fallbackReason: null,
          model: config.providerName === "openai" ? config.model : "fallback",
          promptVersion,
          latencyMs: Date.now() - startedAt,
          occurredAt: new Date().toISOString(),
          outputLanguage: language
        },
        output: primaryOutput
      };
      console.info("[evaluator.success]", {
        evaluatorName,
        providerName: result.meta.providerName,
        responseSource: result.meta.responseSource,
        fallbackUsed: result.meta.fallbackUsed,
        fallbackReason: result.meta.fallbackReason,
        latencyMs: result.meta.latencyMs,
        promptVersion: result.meta.promptVersion
      });
      return result;
    } catch (error) {
      const fallbackOutput = schema.parse(await fallback());
      const fallbackReason = classifyFallbackReason(error);
      const result = {
        meta: {
          providerName: "fallback" as const,
          responseSource: "fallback" as const,
          fallbackUsed: true,
          fallbackReason,
          model: "fallback",
          promptVersion: `${promptVersion}:fallback`,
          latencyMs: Date.now() - startedAt,
          occurredAt: new Date().toISOString(),
          outputLanguage: language
        },
        output: fallbackOutput
      };
      console.warn("[evaluator.fallback]", {
        evaluatorName,
        providerName: result.meta.providerName,
        responseSource: result.meta.responseSource,
        fallbackUsed: result.meta.fallbackUsed,
        fallbackReason: result.meta.fallbackReason,
        latencyMs: result.meta.latencyMs,
        promptVersion: result.meta.promptVersion
      });
      return result;
    }
  }
}

export function toEvaluatorOutput(
  evaluatorName: EvaluatorOutput["evaluator_name"],
  meta: EvaluatorExecutionMeta,
  output: CategoryClassifierResult | DriftDetectorResult | FeedbackCoachResult | SessionSynthesizerResult
): EvaluatorOutput {
  return {
    evaluator_name: evaluatorName,
    status: "success",
    provider_name: meta.providerName,
    response_source: meta.responseSource,
    fallback_used: meta.fallbackUsed,
    fallback_reason: meta.fallbackReason,
    model: meta.model,
    prompt_version: meta.promptVersion,
    latency_ms: meta.latencyMs,
    occurred_at: meta.occurredAt,
    output_language: meta.outputLanguage,
    output,
    error_message: null
  };
}
