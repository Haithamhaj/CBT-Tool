# Reference Hub Non-Disruption Guardrails

## Purpose
Protect the rest of the CBT Tool while the Reference Hub becomes more interactive.

The Reference Hub must stay helpful without becoming a source of hidden coupling, rule duplication, or product instability.

## Core Guardrails

### 1. No Authority Over Practice Flow
Reference Hub features must not:
- change session state
- change validation results
- change score outputs
- change drift authority
- change evaluator authority

### 2. No Hidden Backend Dependency
Prefer:
- local state
- local UI interactions
- static bilingual content

Avoid introducing new backend routes unless there is a strong product need.

### 3. No Duplicate Business Logic
Reference Hub may explain:
- tool selection logic
- cognitive levels
- worksheet patterns

It must not reimplement:
- rules engine decisions
- scoring engine logic
- evaluator output generation

### 4. No Mixed-Language Fallback UI
Any new interactive layer must:
- fully support Arabic
- fully support English
- not fall back to English labels in Arabic mode

### 5. No Faciliator-Scope Leakage
Reference Hub improvements should remain:
- trainee-safe
- general reference friendly

They should not become facilitator dashboards, assignment tools, or analytics panels.

## Allowed Interactions
- tab switching
- filters
- card selection
- detail panels
- self-check widgets with local feedback
- local jump links to practice routes
- local recently viewed memory

## Forbidden Interactions
- backend mutations
- session creation from hidden side effects
- writing progress records
- awarding scores
- producing evaluator-like judgments
- storing personal learning analytics by default

## Content Guardrails
- remain grounded in the trainer material
- simplify wording without changing substance
- avoid speculative CBT theory not present in the training material backbone

## UI Guardrails
- no redesign of the whole app
- improvements remain bounded to the reference area
- operational clarity is more important than visual novelty
- Arabic `rtl` and English `ltr` must stay equally strong

## Technical Guardrails
- reference-specific components should remain under isolated UI/content files
- do not add dependencies from backend services into the reference layer
- prefer composition over editing shared business modules

## Release Gate For Any Future Reference Feature
Before shipping a new interactive reference enhancement, verify:
1. does it stay inside `/reference` or reference-specific UI components?
2. does it avoid backend-critical-path changes?
3. does it work in both Arabic and English?
4. does it reduce user confusion rather than add one more interaction?
5. does it avoid acting like a hidden evaluator?

If any answer is no, the change should be re-scoped before implementation.
