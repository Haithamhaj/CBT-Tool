# Prompt Tuning Plan

## Goal
Improve evaluator output quality without changing evaluator boundaries. The target is better clarity, brevity, usefulness, and non-overlap.

## Shared Tuning Principles
- keep outputs short
- tie statements to visible evidence
- avoid restating deterministic review fields verbatim
- avoid therapeutic language
- avoid unsupported inference
- keep each evaluator’s role distinct

## Category Classifier

### Current role
- classify submitted text into CBT category

### Quality goal
- improve explanation clarity while keeping output concise

### Tuning targets
- explanation should say why the category fits in plain language
- avoid generic wording like "looks like"
- keep explanation to one sentence
- avoid cross-category ambiguity unless confidence is low

### Non-overlap rule
- do not give coaching
- do not mention drift ids
- do not suggest revisions

### Desired style
- brief
- specific
- observational

## Feedback Coach

### Current role
- give step-level corrective guidance after deterministic validation

### Quality goal
- make coaching more actionable and less repetitive

### Tuning targets
- strengths must be evidence-based, not empty praise
- top issues must stay concrete and limited to 1 to 3 points
- why-it-matters should explain training value, not abstract theory
- next revision should be one practical next attempt instruction

### Non-overlap rule
- do not summarize the whole session
- do not emit drift ids unless already surfaced elsewhere in deterministic review
- do not rewrite score logic

### Desired style
- corrective
- educational
- immediately usable

## Drift Detector

### Current role
- detect advisory AI-only drifts only

### Quality goal
- reduce false positives and keep rationale tightly bounded

### Tuning targets
- only emit `DR005` or `DR010`
- prefer empty `ai_drifts` over weak speculative detection
- rationale should reference the observed pattern, not restate the drift name
- corrective action should be short and behavior-oriented

### Non-overlap rule
- do not mention deterministic drifts
- do not act like Feedback Coach
- do not produce rewrite instructions as if it owns correction

### Desired style
- sparse
- high precision
- advisory

## Session Synthesizer

### Current role
- produce a review-stage synthesis across the finished session

### Quality goal
- make synthesis genuinely useful rather than duplicative

### Tuning targets
- session summary should compress, not restate
- primary learning pattern should identify one pattern only
- strengths should be selective and evidence-based
- priority improvement area should align with score/drift evidence
- recommended next focus should be one next training direction, not a rewrite instruction

### Non-overlap rule
- do not duplicate Feedback Coach
- do not create new drifts
- do not repeat numeric score summary
- do not sound like a new authority layer

### Desired style
- synthesis-first
- concise
- subordinate to deterministic review

## Prompt Iteration Method
1. collect real evaluator outputs from representative sessions
2. mark each output as:
   - clear
   - vague
   - repetitive
   - overlapping
   - too long
3. revise prompt constraints only where the failure pattern is repeated
4. rerun smoke and integration checks
5. test with real trainee walkthroughs before locking a prompt revision
