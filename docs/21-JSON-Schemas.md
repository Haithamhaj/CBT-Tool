# JSON Schemas

## Purpose
This document defines exact JSON contracts that are ready to convert into TypeScript types and Zod schemas without changing field meaning.

## Conventions
- All IDs are strings.
- All timestamps are ISO 8601 strings in UTC.
- Enums must be represented as string literals.
- Unknown fields are not allowed.

## Shared Enums

```ts
type UserRole = "trainee" | "facilitator";

type Difficulty = "beginner" | "intermediate" | "advanced";

type TrainingStage =
  | "foundations"
  | "session_structure"
  | "core_tools"
  | "deeper_formulation"
  | "treatment_planning"
  | "full_simulation";

type ToolId =
  | "agenda_setting"
  | "thought_record"
  | "emotion_labeling"
  | "behavioral_activation"
  | "cognitive_restructuring"
  | "core_belief_work"
  | "homework_planning"
  | "session_summary";

type SessionState =
  | "draft"
  | "ready"
  | "in_progress"
  | "blocked_validation"
  | "review_pending"
  | "reviewed"
  | "needs_revision"
  | "completed"
  | "abandoned";

type AttemptStepName =
  | "define_session_goal"
  | "identify_stage"
  | "select_tool"
  | "guided_input"
  | "summary_and_homework";

type DetectionMode = "rule" | "ai" | "hybrid";

type DriftSeverity = "minor" | "moderate" | "major";

type DriftStatus = "open" | "corrected" | "waived";

type EvaluatorName =
  | "category_classifier"
  | "drift_detector"
  | "feedback_coach"
  | "session_evaluator";

type EvaluationStatus = "success" | "error" | "skipped";

type SessionOutcome = "strong_pass" | "pass" | "needs_revision" | "fail";
```

## Case Schema

```ts
type Case = {
  id: string;
  title: string;
  difficulty: Difficulty;
  theme: string;
  presenting_complaint: string;
  trigger_events: string[];
  sample_thoughts: string[];
  sample_emotions: string[];
  sample_behaviors: string[];
  hidden_beliefs: string[];
  recommended_tools: ToolId[];
  expected_drifts: string[];
  homework_context_present: boolean;
  created_at: string;
  updated_at: string;
};
```

## Session Schema

```ts
type Session = {
  id: string;
  user_id: string;
  case_id: string;
  state: SessionState;
  current_step: AttemptStepName | null;
  stage: TrainingStage;
  selected_tool: ToolId;
  session_goal: string;
  revision_count: number;
  started_at: string | null;
  finished_at: string | null;
  last_activity_at: string;
  created_at: string;
  updated_at: string;
};
```

## Attempt Schema

```ts
type Attempt = {
  id: string;
  session_id: string;
  revision_number: number;
  step_name: AttemptStepName;
  input_payload: {
    text: string;
    labels?: string[];
    rationale?: string;
    homework_text?: string;
    summary_text?: string;
  };
  validation_output: {
    passed: boolean;
    blocking_errors: string[];
    warnings: string[];
    rule_hits: string[];
  };
  evaluator_outputs: EvaluatorOutput[];
  score_snapshot: ScoreOutput | null;
  created_at: string;
};
```

## Drift Event Schema

```ts
type DriftEvent = {
  id: string;
  session_id: string;
  attempt_id: string;
  drift_id: string;
  name: string;
  description: string;
  detection_mode: DetectionMode;
  severity: DriftSeverity;
  status: DriftStatus;
  message: string;
  corrective_action: string;
  created_at: string;
  corrected_at: string | null;
};
```

## Evaluator Output Schema

```ts
type EvaluatorOutput = {
  evaluator_name: EvaluatorName;
  status: EvaluationStatus;
  model: string | null;
  prompt_version: string | null;
  output: {
    label?: "situation" | "thought" | "emotion" | "behavior" | "ambiguous";
    confidence?: number;
    explanation?: string;
    drift_detected?: string[];
    severity?: DriftSeverity;
    corrective_action?: string;
    what_was_done_well?: string[];
    top_issues?: string[];
    why_it_matters?: string[];
    next_revision?: string;
    rubric_scores?: {
      session_structure: number;
      identification_accuracy: number;
      tool_selection: number;
      questioning_quality: number;
      formulation_quality: number;
      summary_and_homework: number;
    };
    total_score?: number;
    priority_skill?: string;
    next_exercise?: string;
  } | null;
  error_message: string | null;
};
```

## Score Output Schema

```ts
type ScoreOutput = {
  raw_score: number;
  adjusted_score: number;
  outcome: SessionOutcome;
  rubric_scores: {
    session_structure: number;
    identification_accuracy: number;
    tool_selection: number;
    questioning_quality: number;
    formulation_quality: number;
    summary_and_homework: number;
  };
  drift_penalties: {
    drift_id: string;
    severity: DriftSeverity;
    penalty_points: number;
    repeated: boolean;
  }[];
  drift_count: number;
  top_issues: string[];
  priority_skill: string;
  recommended_next_practice_area: string;
};
```

## Zod Conversion Notes
- All arrays must default to empty arrays, not `null`.
- Optional nested fields should be omitted rather than set to `undefined`.
- `confidence` must be clamped to `0..1`.
- All rubric score fields must be integers.
- `top_issues` max length is 3.
- `revision_count` and `revision_number` must be non-negative integers.

## Validation Rules Not Captured by Type Shape
- `selected_tool` must be valid for `stage`.
- `session_goal` must be non-empty when `state` is not `draft`.
- `finished_at` is required when `state` is `completed`.
- `corrected_at` is required when `status` is `corrected`.
- `score_snapshot` is required on attempts created during final review.

## Ready-to-build blockers remaining
- Freeze the exact `ToolId` list against the first seeded case library.
- Decide whether evaluator outputs should be stored per attempt only or also denormalized at session level.
- Confirm the exact maximum text lengths for each payload field.
