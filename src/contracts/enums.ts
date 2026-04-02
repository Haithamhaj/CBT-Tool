import { z } from "zod";

export const userRoleSchema = z.enum(["trainee", "facilitator"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const difficultySchema = z.enum(["beginner", "intermediate", "advanced"]);
export type Difficulty = z.infer<typeof difficultySchema>;

export const trainingStageSchema = z.enum([
  "foundations",
  "session_structure",
  "core_tools",
  "deeper_formulation",
  "treatment_planning",
  "full_simulation"
]);
export type TrainingStage = z.infer<typeof trainingStageSchema>;

export const toolIdSchema = z.enum([
  "agenda_setting",
  "thought_record",
  "emotion_labeling",
  "behavioral_activation",
  "cognitive_restructuring",
  "core_belief_work",
  "homework_planning",
  "session_summary"
]);
export type ToolId = z.infer<typeof toolIdSchema>;

export const sessionStateSchema = z.enum([
  "draft",
  "ready",
  "in_progress",
  "blocked_validation",
  "review_pending",
  "reviewed",
  "needs_revision",
  "completed",
  "abandoned"
]);
export type SessionState = z.infer<typeof sessionStateSchema>;

export const attemptStepNameSchema = z.enum([
  "define_session_goal",
  "identify_stage",
  "select_tool",
  "guided_input",
  "summary_and_homework"
]);
export type AttemptStepName = z.infer<typeof attemptStepNameSchema>;

export const detectionModeSchema = z.enum(["rule", "ai", "hybrid"]);
export type DetectionMode = z.infer<typeof detectionModeSchema>;

export const driftSeveritySchema = z.enum(["minor", "moderate", "major"]);
export type DriftSeverity = z.infer<typeof driftSeveritySchema>;

export const driftStatusSchema = z.enum(["open", "corrected", "waived"]);
export type DriftStatus = z.infer<typeof driftStatusSchema>;

export const evaluatorNameSchema = z.enum([
  "category_classifier",
  "drift_detector",
  "feedback_coach",
  "session_evaluator"
]);
export type EvaluatorName = z.infer<typeof evaluatorNameSchema>;

export const evaluationStatusSchema = z.enum(["success", "error", "skipped"]);
export type EvaluationStatus = z.infer<typeof evaluationStatusSchema>;

export const sessionOutcomeSchema = z.enum(["strong_pass", "pass", "needs_revision", "fail"]);
export type SessionOutcome = z.infer<typeof sessionOutcomeSchema>;

export const toolSelectionStatusSchema = z.enum(["recommended", "allowed", "discouraged", "blocked"]);
export type ToolSelectionStatus = z.infer<typeof toolSelectionStatusSchema>;
