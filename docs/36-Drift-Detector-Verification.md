# Drift Detector Verification

## What Was Integrated
- Added `drift_detector` as Evaluator 3
- Added strict JSON schema validation for advisory AI-only drifts
- Added provider and fallback paths
- Integrated evaluator execution into `guided_input` and `summary_and_homework`
- Persisted results only in `attempt.evaluator_outputs`

## AI-only Drift Types
- `DR005` Advice Instead of Guided Discovery
- `DR010` Unsupported Formulation Claim

## What Remains Deterministic
- `DR001`, `DR002`, `DR004`, `DR006`, `DR007`, `DR008`, `DR009`, `DR011`, `DR012`
- `DR003` remains outside this evaluator because category handling already belongs to deterministic and separate evaluator logic

## What This Evaluator Is Forbidden To Do
- add blocking validation errors
- create authoritative `drift_events`
- modify scoring inputs or scoring outputs
- change state transitions
- override rule-engine drift findings

## Verification Summary
- contract schema validation exists for `drift_detector` output
- fallback path returns schema-valid empty advisory output
- invalid provider output falls back safely
- integration tests confirm deterministic drifts still create authoritative `drift_events`
- integration tests confirm AI-only drifts remain evaluator metadata only
