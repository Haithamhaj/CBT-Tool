import { z } from "zod";
import { inputPayloadSchema } from "./attempt";
import { rubricScoresSchema } from "./evaluator-output";
import { attemptStepNameSchema, trainingStageSchema, toolIdSchema, userRoleSchema } from "./enums";
import { supportedLanguages } from "../lib/i18n/shared";

export const actorContextSchema = z.object({
  actor_user_id: z.string().uuid(),
  actor_role: userRoleSchema
});
export type ActorContext = z.infer<typeof actorContextSchema>;

export const practiceSetupRequestSchema = actorContextSchema.extend({
  case_id: z.string().min(1),
  stage: trainingStageSchema,
  selected_tool: toolIdSchema,
  session_goal: z.string().min(1),
  rationale: z.string().optional()
});
export type PracticeSetupRequest = z.infer<typeof practiceSetupRequestSchema>;

export const sessionStartRequestSchema = actorContextSchema.extend({
  session_id: z.string().min(1)
});
export type SessionStartRequest = z.infer<typeof sessionStartRequestSchema>;

export const stepSubmissionRequestSchema = actorContextSchema.extend({
  session_id: z.string().min(1),
  step_name: attemptStepNameSchema,
  input_payload: inputPayloadSchema,
  rubric_scores: rubricScoresSchema.optional(),
  language: z.enum(supportedLanguages).optional()
});
export type StepSubmissionRequest = z.infer<typeof stepSubmissionRequestSchema>;

export const reviewRetrievalRequestSchema = actorContextSchema.extend({
  session_id: z.string().min(1),
  language: z.enum(supportedLanguages).optional()
});
export type ReviewRetrievalRequest = z.infer<typeof reviewRetrievalRequestSchema>;

export const progressRetrievalRequestSchema = actorContextSchema.extend({
  user_id: z.string().uuid()
});
export type ProgressRetrievalRequest = z.infer<typeof progressRetrievalRequestSchema>;
