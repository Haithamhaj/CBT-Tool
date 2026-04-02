# Screen Contracts

## Purpose
This document defines the MVP screen behavior as explicit contracts between UI, server routes, and validation logic.

## 1. Dashboard

### Purpose
Show the trainee a concise snapshot of progress and what to practice next.

### Inputs
- authenticated user session
- latest progress snapshot
- recent reviewed sessions

### Outputs
- score summary
- recent sessions list
- top recurring issues
- recommended next practice area

### API dependencies
- `GET /api/progress/:userId`

### Validation behavior
- if no progress exists, render an empty-state dashboard with a CTA to start practice

### Error states
- unauthenticated: redirect to auth
- progress fetch failure: show retry banner and fallback empty widgets

## 2. Practice Setup

### Purpose
Collect the minimum session configuration before guided work starts.

### Inputs
- list of available cases
- allowed training stages
- allowed tools for selected stage

### Outputs
- created or updated session in `ready` state

### API dependencies
- `GET /api/cases`
- `POST /api/practice/start`

### Validation behavior
- case is required
- stage is required
- tool is required
- tool must be allowed for the selected stage
- session goal is required and must meet minimum specificity checks

### Error states
- invalid setup payload: show inline field errors
- server create failure: show blocking form error and do not transition

## 3. Guided Practice Screen

### Purpose
Run the trainee through the active session steps with deterministic validation first and evaluator feedback second.

### Inputs
- session record
- current step contract
- prior attempts for the session

### Outputs
- saved attempt
- validation result
- drift alerts
- step progression or correction request

### API dependencies
- `POST /api/practice/step`
- `POST /api/evaluate/category`
- `POST /api/evaluate/drift`

### Validation behavior
- reject submit if session is not `in_progress` or `blocked_validation`
- enforce current step payload shape
- run hard validation before any progression
- show warnings and drifts separately from blocking errors

### Error states
- stale session state: refetch session and restore current step
- validation failure: stay on same step with corrective messaging
- evaluator failure: show partial-result notice and preserve rules-based result

## 4. Review Screen

### Purpose
Present the trainee with final scoring, drifts, structured feedback, and required revisions.

### Inputs
- reviewed session
- score output
- session-level drift summary
- latest evaluator outputs

### Outputs
- visible final or provisional outcome
- targeted redo action when revision is required
- session completion acknowledgement

### API dependencies
- `POST /api/evaluate/session`
- `POST /api/practice/step` for targeted revisions

### Validation behavior
- review cannot load until session reaches `review_pending`, `reviewed`, or `needs_revision`
- if score output is missing, trigger review evaluation or show retry state
- do not allow completion while unresolved blocking drift exists

### Error states
- missing score output: show retry action
- evaluator contract failure: show review unavailable state
- revision required: render revision CTA instead of completion CTA

## 5. Cases Library

### Purpose
Allow users to browse and select training cases by difficulty and topic.

### Inputs
- case list
- difficulty filter
- topic filter

### Outputs
- filtered case list
- selected case route into practice setup

### API dependencies
- `GET /api/cases`

### Validation behavior
- filter state is client-side only
- selection must pass a valid case ID to setup

### Error states
- fetch failure: show list error with retry
- no matching cases: show empty filter state

## 6. Facilitator Panel

### Purpose
Provide facilitators with cohort-level visibility into trainee performance and common drift patterns.

### Inputs
- authenticated facilitator session
- group summary payload

### Outputs
- trainees list
- average scores
- common drift patterns
- weak-skill visibility

### API dependencies
- `GET /api/facilitator/group-summary`

### Validation behavior
- route is accessible only to facilitator role
- payload must include cohort aggregates and per-trainee summaries

### Error states
- unauthorized role: show access denied or redirect
- summary fetch failure: show retryable analytics error state

## Cross-Screen Rules

### Loading behavior
- Screens must render deterministic skeletons, not blank containers.
- Mutating screens must prevent duplicate submissions while a request is in flight.

### Error copy behavior
- Hard validation errors must explain what must be fixed.
- Drift alerts must include a corrective action.
- AI failures must never be phrased as trainee mistakes.

### Persistence behavior
- Navigation away from a saved step must not lose persisted attempt history.
- Unsaved draft input may be discarded in MVP; explicit autosave is postponed.

## Ready-to-build blockers remaining
- Define the exact field-level contracts for each guided step form.
- Finalize stage-to-tool option sets exposed by Practice Setup.
- Decide whether the Dashboard and Facilitator Panel share the same aggregation endpoint or separate read models.
