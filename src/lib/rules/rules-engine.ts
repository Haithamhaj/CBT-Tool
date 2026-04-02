import type { Case, DriftSeverity, ToolId, TrainingStage, ValidationOutput } from "../../contracts";
import { driftTaxonomy } from "../config/drift-taxonomy";
import { getStageToolEntry } from "../config/stage-tool-matrix";

export type RuleDriftEvent = {
  drift_id: string;
  severity: DriftSeverity;
  message: string;
  corrective_action: string;
  blocking: boolean;
};

export type SetupValidationInput = {
  caseRecord: Case;
  stage: TrainingStage;
  selectedTool: ToolId;
  sessionGoal: string;
  rationale?: string;
};

export type SummaryHomeworkInput = {
  selectedTool: ToolId;
  summaryText?: string;
  homeworkText?: string;
  caseRecord: Case;
};

export type RuleEvaluationResult = ValidationOutput & {
  drifts: RuleDriftEvent[];
  toolSelectionCap: number | null;
};

function createRuleDrift(driftId: string, overrides?: Partial<Pick<RuleDriftEvent, "message" | "severity">>): RuleDriftEvent {
  const definition = driftTaxonomy[driftId];

  if (!definition) {
    throw new Error(`Unknown drift id: ${driftId}`);
  }

  return {
    drift_id: driftId,
    severity: overrides?.severity ?? definition.default_severity,
    message: overrides?.message ?? definition.description,
    corrective_action: definition.corrective_action,
    blocking: definition.blocking
  };
}

function isGoalSpecificEnough(goal: string): boolean {
  const normalized = goal.trim();
  if (normalized.length < 15) {
    return false;
  }

  const weakPhrases = [
    "work on things",
    "feel better",
    "talk about stuff",
    "whatever seems important",
    "help with anxiety"
  ];

  return !weakPhrases.some((phrase) => normalized.toLowerCase().includes(phrase));
}

function hasCaseLinkedRationale(rationale?: string): boolean {
  return typeof rationale === "string" && rationale.trim().length >= 20;
}

export function validateSessionSetup(input: SetupValidationInput): RuleEvaluationResult {
  const blockingErrors: string[] = [];
  const warnings: string[] = [];
  const ruleHits: string[] = [];
  const drifts: RuleDriftEvent[] = [];
  let toolSelectionCap: number | null = null;

  if (!isGoalSpecificEnough(input.sessionGoal)) {
    drifts.push(createRuleDrift("DR009"));
    warnings.push("Session goal is too vague to guide the practice reliably.");
    ruleHits.push("DR009");
  }

  const entry = getStageToolEntry(input.stage, input.selectedTool);

  if (entry.status === "blocked") {
    drifts.push(createRuleDrift("DR006"));
    blockingErrors.push("Selected tool is blocked for the chosen training stage.");
    ruleHits.push("DR006");
  }

  if (entry.status === "discouraged") {
    const driftId = entry.wrong_tool_drift ?? "DR004";
    drifts.push(createRuleDrift(driftId));
    warnings.push("Selected tool is discouraged for this training stage.");
    ruleHits.push(driftId);
    toolSelectionCap = 11;
  }

  if (entry.status === "allowed" && !hasCaseLinkedRationale(input.rationale)) {
    drifts.push(createRuleDrift("DR011"));
    warnings.push("Tool selection is valid but lacks a clear rationale tied to the case.");
    ruleHits.push("DR011");
  }

  if (!input.caseRecord.stage_suitability.includes(input.stage)) {
    blockingErrors.push("Selected case is not suitable for the chosen stage.");
  }

  return {
    passed: blockingErrors.length === 0,
    blocking_errors: blockingErrors,
    warnings,
    rule_hits: ruleHits,
    drifts,
    toolSelectionCap
  };
}

function homeworkMatchesTool(tool: ToolId, homeworkText?: string): boolean {
  if (!homeworkText) {
    return false;
  }

  const normalized = homeworkText.toLowerCase();
  const expectedKeywords: Record<ToolId, string[]> = {
    agenda_setting: ["agenda", "goal"],
    thought_record: ["thought", "trigger", "record"],
    emotion_labeling: ["emotion", "feeling", "label"],
    behavioral_activation: ["activity", "schedule", "task"],
    cognitive_restructuring: ["alternative thought", "evidence", "restructure"],
    core_belief_work: ["belief", "assumption", "core belief"],
    homework_planning: ["practice", "task", "plan"],
    session_summary: ["summary", "review"]
  };

  return expectedKeywords[tool].some((keyword) => normalized.includes(keyword));
}

export function validateSummaryAndHomework(input: SummaryHomeworkInput): RuleEvaluationResult {
  const blockingErrors: string[] = [];
  const warnings: string[] = [];
  const ruleHits: string[] = [];
  const drifts: RuleDriftEvent[] = [];

  if (!input.summaryText || input.summaryText.trim().length < 20) {
    drifts.push(createRuleDrift("DR007"));
    warnings.push("Session summary is missing or too brief.");
    ruleHits.push("DR007");
  }

  if (input.caseRecord.homework_context_present && (!input.homeworkText || input.homeworkText.trim().length === 0)) {
    drifts.push(createRuleDrift("DR002"));
    warnings.push("Homework review or carry-forward task is expected for this case.");
    ruleHits.push("DR002");
  }

  if (!homeworkMatchesTool(input.selectedTool, input.homeworkText)) {
    const drift = createRuleDrift("DR008");
    drifts.push(drift);
    blockingErrors.push("Homework does not align with the selected tool.");
    ruleHits.push("DR008");
  }

  if (input.homeworkText) {
    const tasks = input.homeworkText.split(/,| and | then /i).filter((part) => part.trim().length > 0);
    if (tasks.length > 2) {
      drifts.push(createRuleDrift("DR012"));
      warnings.push("Homework appears overloaded and should be narrowed.");
      ruleHits.push("DR012");
    }
  }

  return {
    passed: blockingErrors.length === 0,
    blocking_errors: blockingErrors,
    warnings,
    rule_hits: ruleHits,
    drifts,
    toolSelectionCap: null
  };
}
