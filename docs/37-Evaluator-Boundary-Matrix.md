# Evaluator Boundary Matrix

## Purpose
This document defines the evaluator-layer contract boundaries for the implemented evaluators and the planned fourth evaluator.

## Matrix

### Evaluator 1: Category Classifier
- purpose: classify trainee text into CBT content category
- allowed scope: `label`, `confidence`, `explanation` for the submitted text
- forbidden scope: creating `drift_events`, changing validation, changing scoring, changing session state
- input contract: trainee text only
- output contract: strict JSON with `label`, `confidence`, `explanation`
- authority: advisory

### Evaluator 2: Feedback Coach
- purpose: produce concise educational correction after deterministic validation
- allowed scope: strengths, issues, why-it-matters, and next revision guidance
- forbidden scope: changing deterministic drift findings, changing scores, changing state transitions, blocking progression
- input contract: `stepName`, `attemptText`, `detectedIssues`, `rubricContext`
- output contract: strict JSON with `what_was_done_well`, `top_issues`, `why_it_matters`, `next_revision`
- authority: advisory

### Evaluator 3: Drift Detector
- purpose: detect AI-only drifts not covered authoritatively by the rules engine
- allowed scope: advisory detection of `DR005` and `DR010` only
- forbidden scope: emitting deterministic drift ids, creating authoritative `drift_events`, changing `validation_output`, changing scores, changing state transitions
- input contract: `stepName`, `stage`, `selectedTool`, `text`, optional `summaryText`, optional `homeworkText`
- output contract: strict JSON with `ai_drifts[]`, where each item includes `drift_id`, `name`, `severity`, `rationale`, `corrective_action`
- authority: advisory

### Evaluator 4: Session Evaluator
- purpose: planned bounded end-of-session qualitative synthesis
- allowed scope: summarize performance patterns after deterministic scoring is complete
- forbidden scope: overriding rules, overriding drift events, overriding score outputs, mutating workflow state
- input contract: planned completed-session context only
- output contract: planned strict JSON summary only
- authority: advisory

## Authoritative Systems
The following remain authoritative and outside evaluator authority:
- rules engine
- deterministic drift persistence
- scoring engine
- session state machine
- stage-tool validation

## Single Source Of Truth
- evaluator boundaries: this document
- drift detection ownership by id: [`/Users/haitham/development/CBT Tool/docs/19-Drift-Taxonomy.md`](/Users/haitham/development/CBT%20Tool/docs/19-Drift-Taxonomy.md) and [`/Users/haitham/development/CBT Tool/src/lib/config/drift-taxonomy.ts`](/Users/haitham/development/CBT%20Tool/src/lib/config/drift-taxonomy.ts)
