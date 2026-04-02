import type { DetectionMode, DriftSeverity } from "../../contracts";

export type DriftDefinition = {
  drift_id: string;
  name: string;
  description: string;
  detection_mode: DetectionMode;
  trigger_condition: string;
  default_severity: DriftSeverity;
  corrective_action: string;
  blocking: boolean;
};

export const driftTaxonomy: Record<string, DriftDefinition> = {
  DR001: {
    drift_id: "DR001",
    name: "Missing Agenda",
    description: "The trainee starts or ends the session without a clear agenda or goal.",
    detection_mode: "rule",
    trigger_condition: "Required goal or agenda field is empty during setup or opening work.",
    default_severity: "moderate",
    corrective_action: "Require a one-sentence agenda before progressing.",
    blocking: false
  },
  DR002: {
    drift_id: "DR002",
    name: "Missing Homework Review",
    description: "The trainee skips review of prior homework when homework context exists.",
    detection_mode: "rule",
    trigger_condition: "Case metadata marks homework context present and the review is missing.",
    default_severity: "moderate",
    corrective_action: "Prompt for prior homework summary and relevance.",
    blocking: false
  },
  DR003: {
    drift_id: "DR003",
    name: "Category Confusion",
    description: "The trainee confuses situation, thought, emotion, or behavior labels.",
    detection_mode: "hybrid",
    trigger_condition: "Category mapping is invalid or evaluator alignment is poor.",
    default_severity: "major",
    corrective_action: "Ask the trainee to relabel the item and explain the distinction.",
    blocking: true
  },
  DR004: {
    drift_id: "DR004",
    name: "Premature Depth",
    description: "The trainee jumps into deeper intervention before the stage supports it.",
    detection_mode: "rule",
    trigger_condition: "Selected tool or task exceeds the current training stage depth.",
    default_severity: "moderate",
    corrective_action: "Redirect to a stage-appropriate lower-complexity tool.",
    blocking: false
  },
  DR005: {
    drift_id: "DR005",
    name: "Advice Instead of Guided Discovery",
    description: "The trainee gives direct advice rather than collaborative questioning.",
    detection_mode: "ai",
    trigger_condition: "Directive language replaces guided discovery in intervention text.",
    default_severity: "major",
    corrective_action: "Rewrite the response as an exploratory question sequence.",
    blocking: false
  },
  DR006: {
    drift_id: "DR006",
    name: "Tool-Stage Mismatch",
    description: "The selected tool is blocked for the current stage.",
    detection_mode: "rule",
    trigger_condition: "Tool is outside the allowed stage mapping.",
    default_severity: "major",
    corrective_action: "Force tool reselection before continuing.",
    blocking: true
  },
  DR007: {
    drift_id: "DR007",
    name: "No Summary",
    description: "The trainee ends the flow without a session summary.",
    detection_mode: "rule",
    trigger_condition: "Final review step lacks a summary field.",
    default_severity: "moderate",
    corrective_action: "Require a concise session summary before final scoring.",
    blocking: false
  },
  DR008: {
    drift_id: "DR008",
    name: "Homework Mismatch",
    description: "The assigned homework does not follow from the session goal or tool.",
    detection_mode: "hybrid",
    trigger_condition: "Homework is missing linkage fields or is unrelated to the selected tool.",
    default_severity: "major",
    corrective_action: "Revise homework to align with the goal, tool, and problem target.",
    blocking: true
  },
  DR009: {
    drift_id: "DR009",
    name: "Weak Session Goal",
    description: "The session goal is vague or not actionable enough to guide work.",
    detection_mode: "hybrid",
    trigger_condition: "Goal text is too generic or not bounded to the session.",
    default_severity: "minor",
    corrective_action: "Rewrite the goal into a specific, session-bounded target.",
    blocking: false
  },
  DR010: {
    drift_id: "DR010",
    name: "Unsupported Formulation Claim",
    description: "The trainee makes a deeper formulation claim not grounded in case evidence.",
    detection_mode: "ai",
    trigger_condition: "Formulation or core belief inference is unsupported by case facts.",
    default_severity: "moderate",
    corrective_action: "Require evidence-backed reformulation tied to case facts.",
    blocking: false
  },
  DR011: {
    drift_id: "DR011",
    name: "Missing Collaborative Link",
    description: "The trainee fails to connect the intervention to case material or rationale.",
    detection_mode: "hybrid",
    trigger_condition: "Explanation field is empty or weakly linked to the case.",
    default_severity: "minor",
    corrective_action: "Add a brief rationale linking tool, target problem, and expected outcome.",
    blocking: false
  },
  DR012: {
    drift_id: "DR012",
    name: "Overloaded Homework",
    description: "The trainee assigns homework that is too broad or contains multiple tasks.",
    detection_mode: "rule",
    trigger_condition: "Homework text contains multiple task clauses beyond the deterministic overload threshold.",
    default_severity: "moderate",
    corrective_action: "Reduce homework to one focused, feasible task.",
    blocking: false
  }
};
