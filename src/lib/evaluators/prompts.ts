import type { RubricScores } from "../../contracts";
import type { AppLanguage } from "../i18n/shared";

function languageInstruction(language: AppLanguage) {
  return language === "ar"
    ? "Write all free-text values in Arabic only."
    : "Write all free-text values in English only.";
}

export function buildCategoryClassifierPrompt(text: string, language: AppLanguage) {
  return [
    "Classify the trainee text into one CBT category.",
    "Return strict JSON only with keys: label, confidence, explanation.",
    "Allowed labels: situation, thought, emotion, behavior, ambiguous.",
    languageInstruction(language),
    "Do not add markdown.",
    `Text: ${text}`
  ].join("\n");
}

export function buildFeedbackCoachPrompt(input: {
  stepName: string;
  attemptText: string;
  detectedIssues: string[];
  rubricContext: RubricScores;
  language: AppLanguage;
}) {
  return [
    "Provide concise educational CBT training feedback for this step only.",
    "Return strict JSON only with keys: what_was_done_well, top_issues, why_it_matters, next_revision.",
    "Keep each field brief, specific, and practical.",
    "Do not summarize the whole session.",
    "Do not repeat numeric scores, drift lists, or review labels verbatim.",
    "Prefer 1 to 2 concrete strengths and 1 to 3 concrete issues.",
    "Make next_revision one actionable revision instruction.",
    languageInstruction(input.language),
    "Do not give therapy. Do not mention diagnosis. Keep the advice corrective and specific.",
    `Step: ${input.stepName}`,
    `Attempt: ${input.attemptText}`,
    `Detected issues: ${input.detectedIssues.join(" | ") || "none"}`,
    `Rubric context: ${JSON.stringify(input.rubricContext)}`
  ].join("\n");
}

export function buildDriftDetectorPrompt(input: {
  stepName: string;
  stage: string;
  selectedTool: string;
  text: string;
  summaryText?: string;
  homeworkText?: string;
  language: AppLanguage;
}) {
  return [
    "Detect only AI-only CBT training drifts for this submission.",
    "Return strict JSON only with key: ai_drifts.",
    "Allowed drift ids only: DR005, DR010.",
    "Do not return DR001, DR002, DR003, DR004, DR006, DR007, DR008, DR009, DR011, or DR012.",
    "Prefer an empty ai_drifts array over a weak or speculative detection.",
    "Each rationale must be one concise evidence-based sentence.",
    "Each corrective_action must be short and behavioral, not a full rewrite.",
    languageInstruction(input.language),
    "DR005 means advice instead of guided discovery.",
    "DR010 means unsupported formulation claim not grounded in the presented material.",
    "If neither applies, return an empty ai_drifts array.",
    `Step: ${input.stepName}`,
    `Stage: ${input.stage}`,
    `Selected tool: ${input.selectedTool}`,
    `Primary text: ${input.text}`,
    `Summary text: ${input.summaryText ?? "none"}`,
    `Homework text: ${input.homeworkText ?? "none"}`
  ].join("\n");
}

export function buildSessionSynthesizerPrompt(input: {
  sessionState: string;
  stage: string;
  selectedTool: string;
  scoreOutcome: string;
  adjustedScore: number;
  topIssues: string[];
  driftSummaries: string[];
  attemptSteps: string[];
  language: AppLanguage;
}) {
  return [
    "Produce an advisory CBT training session synthesis.",
    "Return strict JSON only with keys: session_summary, primary_learning_pattern, evidence_based_strengths, priority_improvement_area, recommended_next_focus, confidence.",
    "Do not rescore, do not create new drifts, do not override validation, do not act as authority.",
    "Summarize only the session-level pattern using the provided evidence.",
    "Keep the output concise and readable.",
    languageInstruction(input.language),
    "Do not restate score numbers, drift ids, or review labels unless essential.",
    "Do not duplicate step-level coaching or rewrite instructions.",
    "recommended_next_focus must be one short next practice direction, not a rewrite command.",
    "primary_learning_pattern must name one dominant pattern only.",
    `Session state: ${input.sessionState}`,
    `Stage: ${input.stage}`,
    `Selected tool: ${input.selectedTool}`,
    `Outcome: ${input.scoreOutcome}`,
    `Adjusted score: ${input.adjustedScore}`,
    `Top issues: ${input.topIssues.join(" | ") || "none"}`,
    `Deterministic drift summaries: ${input.driftSummaries.join(" | ") || "none"}`,
    `Attempt steps: ${input.attemptSteps.join(" | ") || "none"}`
  ].join("\n");
}
