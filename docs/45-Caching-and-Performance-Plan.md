# Caching And Performance Plan

## Goal
Reduce latency and repeated compute cost without weakening correctness or authority boundaries.

## Where Caching Is Worth Adding First

### 1. Session Synthesizer at review retrieval
Priority: `highest`

Why first:
- runs at review time
- has visible latency
- re-executes on repeated review fetches
- output depends on stable post-review artifacts

Recommended cache key:
- session id
- latest attempt id
- latest score snapshot version or updated timestamp
- latest deterministic drift set version or updated timestamp

### 2. Feedback Coach on final reviewable attempt
Priority: `medium`

Why:
- also visible during end-of-session review
- tied to final attempt content and rubric context

Recommended cache key:
- attempt id
- rubric scores
- detected deterministic issue list

### 3. Drift Detector on a specific attempt payload
Priority: `medium-low`

Why:
- useful if the same attempt is re-read often
- less urgent than review synthesis because it is shorter and cheaper

Recommended cache key:
- attempt id
- step name
- text payload hash

## Invalidation Rules

### Session Synthesizer invalidates when:
- a new attempt is added
- the latest attempt changes
- deterministic drift events for the session change
- score snapshot changes

### Feedback Coach invalidates when:
- attempt text changes
- deterministic issues for that attempt change
- rubric context changes

### Drift Detector invalidates when:
- analyzed text changes
- step name changes
- stage or tool context changes

## What Must Remain Uncached
- deterministic validation logic
- deterministic scoring logic
- session state transitions
- authoritative drift event creation

These must always run from current source-of-truth state.

## Trade-offs

### Correctness
- caching advisory outputs is safe only when tied to stable evidence
- caching deterministic authority is not acceptable

### Cost
- provider-backed evaluators are the main source of repeated runtime cost
- Session Synthesizer is the best early cache target because it currently re-runs on review fetch

### UX
- faster review retrieval improves perceived product quality more than almost any other refinement
- caching helps most when users reopen or refresh review screens

## Recommendation
- add cache/reuse first for Session Synthesizer
- leave deterministic systems uncached
- treat cached evaluator outputs as reusable advisory artifacts, not new sources of truth
