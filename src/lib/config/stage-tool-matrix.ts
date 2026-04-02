import type { ToolId, ToolSelectionStatus, TrainingStage } from "../../contracts";

export type StageToolMatrixEntry = {
  stage: TrainingStage;
  tool: ToolId;
  status: ToolSelectionStatus;
  wrong_tool_drift: string | null;
};

export const stageToolMatrix: StageToolMatrixEntry[] = [
  { stage: "foundations", tool: "agenda_setting", status: "recommended", wrong_tool_drift: null },
  { stage: "foundations", tool: "thought_record", status: "recommended", wrong_tool_drift: null },
  { stage: "foundations", tool: "emotion_labeling", status: "recommended", wrong_tool_drift: null },
  { stage: "foundations", tool: "behavioral_activation", status: "allowed", wrong_tool_drift: "DR011" },
  { stage: "foundations", tool: "cognitive_restructuring", status: "discouraged", wrong_tool_drift: "DR004" },
  { stage: "foundations", tool: "core_belief_work", status: "blocked", wrong_tool_drift: "DR006" },
  { stage: "foundations", tool: "homework_planning", status: "allowed", wrong_tool_drift: "DR008" },
  { stage: "foundations", tool: "session_summary", status: "allowed", wrong_tool_drift: "DR007" },

  { stage: "session_structure", tool: "agenda_setting", status: "recommended", wrong_tool_drift: null },
  { stage: "session_structure", tool: "thought_record", status: "allowed", wrong_tool_drift: "DR011" },
  { stage: "session_structure", tool: "emotion_labeling", status: "allowed", wrong_tool_drift: "DR011" },
  { stage: "session_structure", tool: "behavioral_activation", status: "allowed", wrong_tool_drift: "DR011" },
  { stage: "session_structure", tool: "cognitive_restructuring", status: "discouraged", wrong_tool_drift: "DR004" },
  { stage: "session_structure", tool: "core_belief_work", status: "blocked", wrong_tool_drift: "DR006" },
  { stage: "session_structure", tool: "homework_planning", status: "recommended", wrong_tool_drift: null },
  { stage: "session_structure", tool: "session_summary", status: "recommended", wrong_tool_drift: null },

  { stage: "core_tools", tool: "agenda_setting", status: "allowed", wrong_tool_drift: "DR011" },
  { stage: "core_tools", tool: "thought_record", status: "recommended", wrong_tool_drift: null },
  { stage: "core_tools", tool: "emotion_labeling", status: "recommended", wrong_tool_drift: null },
  { stage: "core_tools", tool: "behavioral_activation", status: "recommended", wrong_tool_drift: null },
  { stage: "core_tools", tool: "cognitive_restructuring", status: "recommended", wrong_tool_drift: null },
  { stage: "core_tools", tool: "core_belief_work", status: "discouraged", wrong_tool_drift: "DR004" },
  { stage: "core_tools", tool: "homework_planning", status: "allowed", wrong_tool_drift: "DR008" },
  { stage: "core_tools", tool: "session_summary", status: "allowed", wrong_tool_drift: "DR007" },

  { stage: "deeper_formulation", tool: "agenda_setting", status: "allowed", wrong_tool_drift: "DR011" },
  { stage: "deeper_formulation", tool: "thought_record", status: "allowed", wrong_tool_drift: "DR011" },
  { stage: "deeper_formulation", tool: "emotion_labeling", status: "allowed", wrong_tool_drift: "DR011" },
  { stage: "deeper_formulation", tool: "behavioral_activation", status: "allowed", wrong_tool_drift: "DR011" },
  { stage: "deeper_formulation", tool: "cognitive_restructuring", status: "recommended", wrong_tool_drift: null },
  { stage: "deeper_formulation", tool: "core_belief_work", status: "recommended", wrong_tool_drift: null },
  { stage: "deeper_formulation", tool: "homework_planning", status: "allowed", wrong_tool_drift: "DR008" },
  { stage: "deeper_formulation", tool: "session_summary", status: "allowed", wrong_tool_drift: "DR007" },

  { stage: "treatment_planning", tool: "agenda_setting", status: "allowed", wrong_tool_drift: "DR011" },
  { stage: "treatment_planning", tool: "thought_record", status: "allowed", wrong_tool_drift: "DR011" },
  { stage: "treatment_planning", tool: "emotion_labeling", status: "discouraged", wrong_tool_drift: "DR004" },
  { stage: "treatment_planning", tool: "behavioral_activation", status: "recommended", wrong_tool_drift: null },
  { stage: "treatment_planning", tool: "cognitive_restructuring", status: "recommended", wrong_tool_drift: null },
  { stage: "treatment_planning", tool: "core_belief_work", status: "allowed", wrong_tool_drift: "DR010" },
  { stage: "treatment_planning", tool: "homework_planning", status: "recommended", wrong_tool_drift: null },
  { stage: "treatment_planning", tool: "session_summary", status: "allowed", wrong_tool_drift: "DR007" },

  { stage: "full_simulation", tool: "agenda_setting", status: "allowed", wrong_tool_drift: "DR001" },
  { stage: "full_simulation", tool: "thought_record", status: "allowed", wrong_tool_drift: "DR011" },
  { stage: "full_simulation", tool: "emotion_labeling", status: "allowed", wrong_tool_drift: "DR003" },
  { stage: "full_simulation", tool: "behavioral_activation", status: "allowed", wrong_tool_drift: "DR008" },
  { stage: "full_simulation", tool: "cognitive_restructuring", status: "allowed", wrong_tool_drift: "DR005" },
  { stage: "full_simulation", tool: "core_belief_work", status: "allowed", wrong_tool_drift: "DR010" },
  { stage: "full_simulation", tool: "homework_planning", status: "allowed", wrong_tool_drift: "DR008" },
  { stage: "full_simulation", tool: "session_summary", status: "allowed", wrong_tool_drift: "DR007" }
];

export function getStageToolEntry(stage: TrainingStage, tool: ToolId): StageToolMatrixEntry {
  const entry = stageToolMatrix.find((candidate) => candidate.stage === stage && candidate.tool === tool);

  if (!entry) {
    throw new Error(`Missing stage-tool mapping for ${stage}/${tool}`);
  }

  return entry;
}
