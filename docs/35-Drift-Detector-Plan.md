# Drift Detector Plan

## Scope
Evaluator 3 adds advisory AI-only drift detection. It does not create authoritative rule failures, scoring penalties, or workflow state changes.

## AI-only Drift Types In Scope
- `DR005` Advice Instead of Guided Discovery
- `DR010` Unsupported Formulation Claim

## Explicitly Excluded From This Evaluator
The following remain outside Drift Detector authority because they are already deterministic or hybrid elsewhere:
- `DR001` Missing Agenda
- `DR002` Missing Homework Review
- `DR003` Category Confusion
- `DR004` Premature Depth
- `DR006` Tool-Stage Mismatch
- `DR007` No Summary
- `DR008` Homework Mismatch
- `DR009` Weak Session Goal
- `DR011` Missing Collaborative Link
- `DR012` Overloaded Homework

`DR012` is intentionally excluded even though earlier taxonomy drafts listed it as `ai`, because the current rules engine already fires it deterministically during summary and homework validation.

## Execution Point In Flow
- Run on `guided_input`
  - detect `DR005`
  - detect `DR010` only when the trainee text makes formulation-like claims
- Run on `summary_and_homework`
  - detect `DR010` only if the summary contains unsupported formulation language

## Output Boundary
- Output is strict JSON with `ai_drifts`
- Each advisory entry includes:
  - `drift_id`
  - `name`
  - `severity`
  - `rationale`
  - `corrective_action`
- Output is persisted only inside `attempt.evaluator_outputs`
- Output is not persisted into authoritative `drift_events`

## Authority Boundary
Drift Detector is explicitly forbidden from:
- creating blocking validation errors
- changing `validation_output`
- creating authoritative `drift_events`
- changing session state transitions
- changing scoring inputs or penalties
- overriding deterministic drifts already fired by the rules engine

## Fallback Behavior
- Missing config: return schema-valid `{ ai_drifts: [] }`
- Provider error: return schema-valid `{ ai_drifts: [] }`
- Schema-invalid provider output: return schema-valid `{ ai_drifts: [] }`
- Timeout: return schema-valid `{ ai_drifts: [] }`

Fallback remains advisory and silent from a workflow perspective. It affects only evaluator metadata and logs.
