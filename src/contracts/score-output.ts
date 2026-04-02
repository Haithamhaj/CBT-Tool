import { z } from "zod";
import { driftSeveritySchema, sessionOutcomeSchema } from "./enums";
import { rubricScoresSchema } from "./evaluator-output";

export const driftPenaltySchema = z.object({
  drift_id: z.string().regex(/^DR\d{3}$/),
  severity: driftSeveritySchema,
  penalty_points: z.number().int().nonnegative(),
  repeated: z.boolean()
});

export const scoreOutputSchema = z.object({
  raw_score: z.number().int().min(0).max(100),
  adjusted_score: z.number().int().min(0).max(100),
  outcome: sessionOutcomeSchema,
  rubric_scores: rubricScoresSchema,
  drift_penalties: z.array(driftPenaltySchema),
  drift_count: z.number().int().nonnegative(),
  top_issues: z.array(z.string().min(1)).max(3),
  priority_skill: z.string().min(1),
  recommended_next_practice_area: z.string().min(1)
});

export type DriftPenalty = z.infer<typeof driftPenaltySchema>;
export type ScoreOutput = z.infer<typeof scoreOutputSchema>;
