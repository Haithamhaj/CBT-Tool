import { z } from "zod";
import {
  driftSeveritySchema,
  evaluationStatusSchema,
  evaluatorNameSchema
} from "./enums";

export const rubricScoresSchema = z.object({
  session_structure: z.number().int().min(0).max(20),
  identification_accuracy: z.number().int().min(0).max(20),
  tool_selection: z.number().int().min(0).max(15),
  questioning_quality: z.number().int().min(0).max(15),
  formulation_quality: z.number().int().min(0).max(15),
  summary_and_homework: z.number().int().min(0).max(15)
});

export const evaluatorOutputSchema = z.object({
  evaluator_name: evaluatorNameSchema,
  status: evaluationStatusSchema,
  provider_name: z.enum(["openai", "fallback"]),
  response_source: z.enum(["provider", "fallback"]),
  fallback_used: z.boolean(),
  fallback_reason: z.enum(["missing_configuration", "provider_error", "schema_validation", "timeout"]).nullable(),
  model: z.string().min(1).nullable(),
  prompt_version: z.string().min(1).nullable(),
  latency_ms: z.number().int().nonnegative(),
  occurred_at: z.string().datetime(),
  output_language: z.enum(["en", "ar"]),
  output: z.object({
    label: z.enum(["situation", "thought", "emotion", "behavior", "ambiguous"]).optional(),
    confidence: z.number().min(0).max(1).optional(),
    explanation: z.string().min(1).optional(),
    ai_drifts: z.array(
      z.object({
        drift_id: z.enum(["DR005", "DR010"]),
        name: z.string().min(1),
        severity: driftSeveritySchema,
        rationale: z.string().min(1),
        corrective_action: z.string().min(1)
      }).strict()
    ).optional(),
    severity: driftSeveritySchema.optional(),
    corrective_action: z.string().min(1).optional(),
    what_was_done_well: z.array(z.string().min(1)).optional(),
    top_issues: z.array(z.string().min(1)).max(3).optional(),
    why_it_matters: z.array(z.string().min(1)).optional(),
    next_revision: z.string().min(1).optional(),
    session_summary: z.string().min(1).optional(),
    primary_learning_pattern: z.string().min(1).optional(),
    evidence_based_strengths: z.array(z.string().min(1)).max(3).optional(),
    priority_improvement_area: z.string().min(1).optional(),
    recommended_next_focus: z.string().min(1).optional(),
    rubric_scores: rubricScoresSchema.optional(),
    total_score: z.number().int().min(0).max(100).optional(),
    priority_skill: z.string().min(1).optional(),
    next_exercise: z.string().min(1).optional()
  }).strict().nullable(),
  error_message: z.string().min(1).nullable()
});

export type RubricScores = z.infer<typeof rubricScoresSchema>;
export type EvaluatorOutput = z.infer<typeof evaluatorOutputSchema>;
