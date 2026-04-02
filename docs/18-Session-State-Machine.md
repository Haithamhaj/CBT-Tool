# Session State Machine

## Purpose
This document defines the exact lifecycle for a practice session so workflow enforcement, persistence, and UI behavior are deterministic.

## Session States

### `draft`
Session record exists but setup is incomplete.

### `ready`
Case, stage, and tool have been selected. Session can begin guided work.

### `in_progress`
The trainee is submitting guided step inputs and receiving validation feedback.

### `blocked_validation`
The latest attempt failed a required validation gate. The session cannot advance until the trainee corrects the current step.

### `review_pending`
All required guided steps are complete. Final scoring and feedback generation may run.

### `reviewed`
Final score, drift summary, and feedback are stored. The trainee can inspect results.

### `needs_revision`
The session was reviewed but failed the passing threshold or triggered mandatory remediation. The trainee may redo targeted steps.

### `completed`
The trainee reviewed results and either passed or completed required revisions.

### `abandoned`
The session was started but not finished within the allowed inactivity window.

## State Transition Table

| From | Event | To | Conditions |
| --- | --- | --- | --- |
| `draft` | setup completed | `ready` | case, stage, and tool are present and valid |
| `ready` | first step opened | `in_progress` | step order initialized |
| `in_progress` | attempt submitted and gate passes | `in_progress` | current step saved, next step unlocked |
| `in_progress` | attempt submitted and gate fails | `blocked_validation` | hard validation failed |
| `blocked_validation` | corrected attempt passes | `in_progress` | same step resubmitted successfully |
| `in_progress` | all required steps complete | `review_pending` | all mandatory steps have passing attempts |
| `review_pending` | scoring + feedback completed and pass | `reviewed` | adjusted score meets threshold and no blocking drift remains |
| `review_pending` | scoring + feedback completed and fail | `needs_revision` | below threshold or blocking remediation rule triggered |
| `reviewed` | user finalizes session | `completed` | review acknowledged |
| `needs_revision` | targeted redo started | `in_progress` | revision scope created |
| `needs_revision` | re-evaluation passes | `reviewed` | revised score and required corrections completed |
| `draft` or `ready` or `in_progress` or `blocked_validation` | inactivity timeout | `abandoned` | no activity for 7 days |

## Step Model
Each session progresses through these ordered steps:
1. Select case
2. Define session goal
3. Identify stage
4. Select tool
5. Complete guided input
6. Validate
7. Detect drift
8. Generate feedback
9. Score
10. Save result

For MVP, steps 1 to 4 happen during setup, steps 5 to 8 happen during active work, and steps 9 to 10 happen in review.

## Validation Gates

### Gate 1: Setup validity
Required before `draft -> ready`
- `case_id` exists
- selected `stage` is one of the allowed training stages
- selected `tool` is allowed for the selected stage

### Gate 2: Step payload validity
Required on every attempt submission
- required fields are present
- payload shape matches the current step contract
- text length is within allowed bounds
- session is in a state that accepts submission

### Gate 3: Hard rule validity
Required before step advancement
- no blocking workflow violation
- no tool-stage mismatch
- no missing mandatory field for that step

### Gate 4: Review eligibility
Required before `in_progress -> review_pending`
- all mandatory steps have passing attempts
- session has at least one scored attempt for each required step
- no unresolved blocking validation failures

### Gate 5: Completion eligibility
Required before `reviewed -> completed`
- final score exists
- drift summary exists
- required remediation actions, if any, are either completed or not applicable

## Failure States

### Validation failure
If payload validation fails:
- do not advance step
- create an attempt record with validation failure metadata
- keep the session in `blocked_validation`

### Rule failure
If a hard rule fails:
- persist a drift event if the rule maps to a drift
- show corrective action
- keep the session in `blocked_validation`

### Evaluator failure
If AI evaluation fails or returns invalid JSON:
- save the attempt and rule outputs
- mark evaluator result as unavailable
- allow progress only if the step depends on rules only
- if final review depends on evaluator output, keep session in `review_pending` with a retryable error

## Revision Logic
`needs_revision` is triggered when any of the following is true:
- adjusted score is below pass threshold
- any major drift remains unresolved
- session structure score is below minimum subscore
- category confusion count exceeds the allowed limit

Revision scope is targeted, not full-session by default:
- redo the failed step
- regenerate score and feedback
- preserve full attempt history

## Persistence Rules
- Every state transition must be persisted.
- Every attempt must reference the current step name and state at submission time.
- Review outputs are immutable snapshots for that revision cycle.
- Revised sessions append new attempts; they do not overwrite prior attempts.

## Ready-to-build blockers remaining
- Define the exact inactivity timeout recovery UX for abandoned sessions.
- Confirm whether facilitators can reopen completed sessions in MVP.
- Define per-step input length limits for each guided input form.
