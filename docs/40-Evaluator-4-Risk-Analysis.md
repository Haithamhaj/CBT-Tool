# Evaluator 4 Risk Analysis

## Main Overlap Risks

### Overlap With Feedback Coach
Risk:
- Session Synthesizer could drift into revision advice that duplicates step-level coaching.

Why this matters:
- Feedback Coach is step-bounded and corrective.
- Session Synthesizer is session-bounded and summarizing.
- If both produce the same kind of output, the evaluator layer becomes redundant and confusing.

Prevention:
- Feedback Coach owns step correction.
- Session Synthesizer owns cross-session-pattern summary.
- Session Synthesizer must recommend one next focus area, not a step rewrite.

Acceptable:
- "Across the session, the main pattern was moving too quickly into conclusions before linking them to evidence."

Unacceptable:
- "Rewrite your homework section to remove the second task and add one worksheet."

### Overlap With Drift Detector
Risk:
- Session Synthesizer could start naming new drifts or reclassifying AI-only drifts.

Why this matters:
- Drift Detector is the only advisory evaluator that may detect AI-only drifts.
- Session Synthesizer should consume drift evidence, not generate it.

Prevention:
- Session Synthesizer may reference already-detected patterns.
- Session Synthesizer may not emit drift ids.
- Session Synthesizer may not create new drift-like judgments.

Acceptable:
- "A repeated pattern in the session was difficulty maintaining guided discovery."

Unacceptable:
- "Detected DR005 and DR010 even though they were not present in stored outputs."

### Overlap With Scoring Engine
Risk:
- Session Synthesizer could sound like it is explaining or changing score calculation.

Why this matters:
- The scoring engine is deterministic and authoritative.
- If synthesis language sounds evaluative in a scoring sense, it creates authority creep.

Prevention:
- Session Synthesizer may reference score outcomes only as fixed facts.
- It may not explain penalty math as if it computed it.
- It may not imply score changes or alternative outcomes.

Acceptable:
- "The session ended with a needs-revision outcome, and the main improvement area was keeping the work more evidence-based."

Unacceptable:
- "The score should have been higher because the formulation was basically correct."

### Overlap With Review Flow
Risk:
- Session Synthesizer could replace or visually compete with the review summary.

Why this matters:
- Review flow already exposes score summary, drift summary, and next action.
- Session Synthesizer should enrich comprehension, not duplicate the review payload.

Prevention:
- Keep synthesis output short.
- Place it after deterministic review sections.
- Ban repetition of raw score tables, drift lists, and explicit validation outcomes.

Acceptable:
- "The strongest part of this session was staying engaged with the target problem, but the main weakness was moving from summary to broader claims without enough support."

Unacceptable:
- "Adjusted score: 71. Top issues: DR012, DR010. Recommended next practice area: formulation quality."

## Acceptable Output Characteristics
- synthesized across the whole session
- evidence-based
- concise
- subordinate to deterministic results
- educational rather than authoritative

## Unacceptable Output Characteristics
- repeats existing deterministic fields verbatim
- issues new drift judgments
- sounds like a new score decision
- prescribes detailed rewrite instructions already handled by Feedback Coach
- introduces unsupported claims about motives, diagnosis, or case history
