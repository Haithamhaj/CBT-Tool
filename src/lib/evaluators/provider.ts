import type {
  CategoryClassifierResult,
  DriftDetectorResult,
  FeedbackCoachResult,
  RubricScores,
  SessionSynthesizerResult,
  ScoreOutput,
  Attempt,
  DriftEvent,
  Session
} from "../../contracts";
import type { AttemptStepName, ToolId, TrainingStage } from "../../contracts";
import type { AppLanguage } from "../i18n/shared";

export type CategoryClassifierInput = {
  text: string;
  language: AppLanguage;
};

export type FeedbackCoachInput = {
  stepName: string;
  attemptText: string;
  detectedIssues: string[];
  rubricContext: RubricScores;
  language: AppLanguage;
};

export type DriftDetectorInput = {
  stepName: AttemptStepName;
  stage: TrainingStage;
  selectedTool: ToolId;
  text: string;
  summaryText?: string;
  homeworkText?: string;
  language: AppLanguage;
};

export type SessionSynthesizerInput = {
  session: Session;
  attempts: Attempt[];
  driftEvents: DriftEvent[];
  scoreSnapshot: ScoreOutput;
  language: AppLanguage;
};

export interface EvaluatorProvider {
  classifyCategory(input: CategoryClassifierInput): Promise<unknown>;
  detectDrift(input: DriftDetectorInput): Promise<unknown>;
  coachFeedback(input: FeedbackCoachInput): Promise<unknown>;
  synthesizeSession(input: SessionSynthesizerInput): Promise<unknown>;
}

export type EvaluatorExecutionMeta = {
  providerName: "openai" | "fallback";
  responseSource: "provider" | "fallback";
  fallbackUsed: boolean;
  fallbackReason: "missing_configuration" | "provider_error" | "schema_validation" | "timeout" | null;
  model: string | null;
  promptVersion: string;
  latencyMs: number;
  occurredAt: string;
  outputLanguage: AppLanguage;
};

export type SuccessfulEvaluatorResult<T> = {
  meta: EvaluatorExecutionMeta;
  output: T;
};

export interface EvaluatorServiceInterface {
  classifyCategory(input: CategoryClassifierInput): Promise<SuccessfulEvaluatorResult<CategoryClassifierResult>>;
  detectDrift(input: DriftDetectorInput): Promise<SuccessfulEvaluatorResult<DriftDetectorResult>>;
  coachFeedback(input: FeedbackCoachInput): Promise<SuccessfulEvaluatorResult<FeedbackCoachResult>>;
  synthesizeSession(input: SessionSynthesizerInput): Promise<SuccessfulEvaluatorResult<SessionSynthesizerResult>>;
}
