# Evaluator Integration Plan

## Purpose
This document defines the controlled MVP integration for evaluator services so AI-generated outputs remain bounded, schema-validated, and subordinate to deterministic rules and scoring.

## Evaluator Boundaries

### Deterministic systems remain authoritative
The following systems are authoritative and must not be overridden by AI:
- rules engine
- stage-tool validation
- blocking validation gates
- drift events created by deterministic rules
- scoring engine
- session state transitions

### AI evaluators are advisory and additive
The evaluator layer may:
- classify trainee text into CBT categories
- detect advisory AI-only drifts
- generate concise corrective coaching
- enrich attempt records with structured feedback

The evaluator layer may not:
- mark a blocking rule as passed
- delete or downgrade deterministic drift events
- override raw score or adjusted score
- mutate session state outside the service flow

## Evaluators In Scope

### Evaluator 1: Category Classifier
- input: trainee text
- output: strict JSON with `label`, `confidence`, `explanation`
- integration point: `guided_input` step
- purpose: enrich attempt analysis and surface likely category interpretation without changing deterministic validation

### Evaluator 2: Feedback Coach
- input: attempt text, detected issues, rubric context
- output: strict JSON with concise coaching fields
- integration point: step result after validation, especially review-relevant submissions
- purpose: provide educational correction and next-step guidance

### Evaluator 3: Drift Detector
- input: step text plus stage and tool context
- output: strict JSON with advisory `ai_drifts`
- integration point: `guided_input` and `summary_and_homework`
- purpose: detect only AI-only drifts `DR005` and `DR010`
- forbidden from creating authoritative `drift_events` or changing validation/scoring/state

### Evaluator 4: Session Evaluator
- planned only
- intended input: completed session attempt history, deterministic drift summary, and score context
- intended output: bounded end-of-session qualitative summary
- must remain advisory unless future architecture explicitly changes

## Execution Order

### Guided input step
1. deterministic request validation
2. deterministic step pass/fail logic
3. persist attempt
4. run Category Classifier
5. run Drift Detector for AI-only advisory drifts
6. persist evaluator outputs onto the same attempt
7. return attempt + evaluator output

### Summary/homework step
1. deterministic rules validation
2. deterministic drift persistence
3. deterministic rubric derivation or supplied rubric usage
4. run Drift Detector for advisory AI-only drifts
5. deterministic scoring
6. persist score snapshot
7. run Feedback Coach using attempt + issues + rubric context
8. persist evaluator outputs onto the same attempt
9. return attempt + score + evaluator output

## Failure Handling And Fallback Behavior

### Failure cases
- provider timeout
- provider network error
- provider returns non-JSON
- provider returns schema-invalid JSON

### Fallback rule
When the provider fails:
- deterministic workflow continues
- evaluator service returns a schema-valid fallback output
- fallback output is persisted as the evaluator result
- no rule or score result is changed

### Timeout rule
- evaluator requests must be bounded by a short timeout
- timeout is treated the same as any provider failure

## JSON Schema Enforcement Strategy

### Enforcement rules
- every provider output is parsed as JSON
- every parsed object must pass Zod schema validation
- invalid outputs are discarded and replaced with deterministic fallback outputs

### Persistence rule
- only schema-valid evaluator payloads are persisted into `attempt.evaluator_outputs`

## Provider Abstraction

### Goals
- allow OpenAI-backed execution when configured
- allow deterministic fallback behavior when not configured
- keep provider-specific logic out of services and routes

### Required layers
- provider interface
- OpenAI provider implementation
- fallback provider implementation
- evaluator service that owns timeout, schema validation, and fallback behavior

## Prompting Constraints
- outputs must be concise
- outputs must be educational, not therapeutic
- feedback must be corrective and specific
- evaluators must not claim diagnostic authority

## Ready-to-build blockers remaining
- none for MVP evaluator layer start
