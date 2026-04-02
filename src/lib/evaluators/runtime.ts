import { z } from "zod";

const evaluatorRuntimeSchema = z.object({
  OPENAI_API_KEY: z.string().min(1).optional(),
  OPENAI_EVALUATOR_MODEL: z.string().min(1).default("gpt-4.1-mini"),
  EVALUATOR_TIMEOUT_MS: z.coerce.number().int().min(500).max(15000).default(4000)
});

export type EvaluatorRuntimeConfig = {
  providerName: "openai" | "fallback";
  apiKey: string | null;
  model: string;
  timeoutMs: number;
};

export function getEvaluatorRuntimeConfig(
  env: Record<string, string | undefined> = process.env
): EvaluatorRuntimeConfig {
  const parsed = evaluatorRuntimeSchema.parse(env);

  return {
    providerName: parsed.OPENAI_API_KEY ? "openai" : "fallback",
    apiKey: parsed.OPENAI_API_KEY ?? null,
    model: parsed.OPENAI_EVALUATOR_MODEL,
    timeoutMs: parsed.EVALUATOR_TIMEOUT_MS
  };
}
