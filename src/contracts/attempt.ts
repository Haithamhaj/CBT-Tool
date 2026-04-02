import { z } from "zod";
import { attemptStepNameSchema } from "./enums";
import { evaluatorOutputSchema } from "./evaluator-output";
import { scoreOutputSchema } from "./score-output";

export const inputPayloadSchema = z.object({
  text: z.string().min(1),
  labels: z.array(z.string().min(1)).optional(),
  rationale: z.string().min(1).optional(),
  homework_text: z.string().min(1).optional(),
  summary_text: z.string().min(1).optional()
}).strict();

export const validationOutputSchema = z.object({
  passed: z.boolean(),
  blocking_errors: z.array(z.string().min(1)),
  warnings: z.array(z.string().min(1)),
  rule_hits: z.array(z.string().min(1))
});

export const attemptSchema = z.object({
  id: z.string().min(1),
  session_id: z.string().min(1),
  revision_number: z.number().int().nonnegative(),
  step_name: attemptStepNameSchema,
  input_payload: inputPayloadSchema,
  validation_output: validationOutputSchema,
  evaluator_outputs: z.array(evaluatorOutputSchema),
  score_snapshot: scoreOutputSchema.nullable(),
  created_at: z.string().datetime()
});

export type InputPayload = z.infer<typeof inputPayloadSchema>;
export type ValidationOutput = z.infer<typeof validationOutputSchema>;
export type Attempt = z.infer<typeof attemptSchema>;
