import { z } from "zod";
import { driftSeveritySchema } from "./enums";

export const categoryClassifierResultSchema = z.object({
  label: z.enum(["situation", "thought", "emotion", "behavior", "ambiguous"]),
  confidence: z.number().min(0).max(1),
  explanation: z.string().min(1)
}).strict();

export const feedbackCoachResultSchema = z.object({
  what_was_done_well: z.array(z.string().min(1)).max(3),
  top_issues: z.array(z.string().min(1)).max(3),
  why_it_matters: z.array(z.string().min(1)).max(3),
  next_revision: z.string().min(1)
}).strict();

export const aiOnlyDriftIdSchema = z.enum(["DR005", "DR010"]);

export const driftDetectorResultSchema = z.object({
  ai_drifts: z.array(
    z.object({
      drift_id: aiOnlyDriftIdSchema,
      name: z.string().min(1),
      severity: driftSeveritySchema,
      rationale: z.string().min(1),
      corrective_action: z.string().min(1)
    }).strict()
  ).max(3)
}).strict();

export const sessionSynthesizerResultSchema = z.object({
  session_summary: z.string().min(1),
  primary_learning_pattern: z.string().min(1),
  evidence_based_strengths: z.array(z.string().min(1)).min(1).max(3),
  priority_improvement_area: z.string().min(1),
  recommended_next_focus: z.string().min(1),
  confidence: z.number().min(0).max(1)
}).strict();

export type CategoryClassifierResult = z.infer<typeof categoryClassifierResultSchema>;
export type FeedbackCoachResult = z.infer<typeof feedbackCoachResultSchema>;
export type DriftDetectorResult = z.infer<typeof driftDetectorResultSchema>;
export type SessionSynthesizerResult = z.infer<typeof sessionSynthesizerResultSchema>;
