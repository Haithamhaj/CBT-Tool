# Evaluator 4 Session Synthesizer Spec

## Exact Purpose
Evaluator 4 is an advisory session-level synthesizer. Its role is to summarize the overall learning pattern of a completed practice session after deterministic review is already finished.

It exists to answer one bounded question:
- "What is the most important learning pattern across this session, given the completed attempts, deterministic drift record, and final score context?"

It does not evaluate correctness from scratch. It does not rescore. It does not re-run validation. It does not create new authoritative drift outcomes.

## Allowed Scope
Evaluator 4 may:
- summarize the session at a high level
- identify the main recurring learning pattern across the session
- restate the most important improvement priority using existing deterministic evidence
- suggest one next practice focus area phrased as educational guidance
- connect deterministic score/drift results into a concise narrative

## Forbidden Scope
Evaluator 4 may not:
- change raw score or adjusted score
- add, remove, or rewrite authoritative `drift_events`
- override evaluator outputs from Evaluators 1, 2, or 3
- create blocking validation outcomes
- modify session state transitions
- invent new case facts or unsupported interpretations
- provide therapy, diagnosis, or clinical recommendation
- replace the review flow’s deterministic result display

Explicit boundary:
- Evaluator 4 cannot change scoring, drift authority, validation, or state transitions.

## Input Sources
Evaluator 4 may consume only already-persisted and already-authoritative session artifacts:
- session metadata
- attempts for the session
- deterministic `drift_events`
- final `score_snapshot`
- advisory evaluator outputs from:
  - Category Classifier
  - Drift Detector
  - Feedback Coach

It must not consume raw external data or hidden state outside the stored session context.

## Output Schema
The output should be strict JSON with these fields only:

```json
{
  "session_summary": "string",
  "primary_learning_pattern": "string",
  "evidence_based_strengths": ["string"],
  "priority_improvement_area": "string",
  "recommended_next_focus": "string",
  "confidence": 0.0
}
```

Field constraints:
- `session_summary`
  - 1 concise paragraph
  - summary only, no new judgments outside evidence
- `primary_learning_pattern`
  - 1 sentence naming the dominant practice pattern
- `evidence_based_strengths`
  - 1 to 3 items
  - must be anchored to existing attempts, drifts, or score context
- `priority_improvement_area`
  - 1 sentence
  - must align with deterministic score/drift evidence
- `recommended_next_focus`
  - 1 sentence
  - educational practice recommendation only
- `confidence`
  - `0` to `1`
  - confidence in synthesis quality, not authority

## Where It Runs In The Flow
Evaluator 4 should run only after:
1. deterministic validation is complete
2. deterministic drift persistence is complete
3. deterministic scoring is complete
4. review payload is stable

Practical execution point:
- at review retrieval time for a session that already has a final `score_snapshot`
- or as a post-review persisted enrichment step

It should not run during early step submission where the session is incomplete.

## Fallback Behavior
On missing config, timeout, provider error, or schema-invalid output:
- return a schema-valid fallback synthesis
- fallback content must stay conservative
- fallback may produce:
  - short deterministic recap
  - empty or minimal strengths list
  - one bounded next-focus suggestion derived from existing score/drift context

Fallback must not:
- invent new evidence
- change review results
- create new authority

## UI Display Intent
If surfaced in UI later, Evaluator 4 should appear as:
- a short advisory synthesis panel on the Review screen
- below deterministic score and drift sections
- visually subordinate to deterministic review outputs

Display intent:
- help the trainee understand the session as a whole
- not compete with score summary or drift summary
- not look like an authoritative judgment block

## Non-Overlapping Role Definition
Evaluator 4 is not:
- a step-level coach
- a drift detector
- a score explainer that rewrites scoring math
- a facilitator report

It is only:
- a bounded end-of-session synthesis layer built on top of already-finalized session evidence
