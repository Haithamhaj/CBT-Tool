# Quality Refinement Plan

## Goal
This phase shifts the product from capability build-out to quality improvement. The focus is not new features, but better usefulness, clarity, speed, and consistency.

## Top 5 Quality Risks

### 1. Review-time latency from evaluator execution
Impact rank: `1`

Why it matters:
- Review is a core payoff moment.
- Slow review retrieval makes the product feel unreliable even when outputs are correct.
- Session Synthesizer and other provider-backed evaluators add visible wait time.

Current symptoms:
- provider-backed synthesis latency is non-trivial
- repeated review fetches currently recompute synthesis

What improvement looks like:
- review loads feel fast and predictable
- expensive evaluator work is reused when safe

### 2. Evaluator output quality inconsistency
Impact rank: `2`

Why it matters:
- low-quality evaluator phrasing weakens trust in the training experience
- users may ignore evaluator guidance if it feels generic, repetitive, or overly verbose

Current symptoms:
- fallback outputs are safe but sometimes generic
- provider outputs can vary in specificity and style
- Session Synthesizer may produce broad summaries that feel higher-level than needed

What improvement looks like:
- outputs are concise, specific, and clearly tied to observable session evidence

### 3. UI clarity around deterministic vs advisory outputs
Impact rank: `3`

Why it matters:
- trainees may confuse score/drift authority with evaluator advice
- even correct content becomes less useful if authority levels are visually unclear

Current symptoms:
- current UI is functional but dense
- multiple evaluator blocks can feel similar without strong visual distinction

What improvement looks like:
- users can instantly tell:
  - what is authoritative
  - what is advisory
  - what action to take next

### 4. Repeat-fetch behavior and duplicated compute cost
Impact rank: `4`

Why it matters:
- repeated review opens currently regenerate synthesis
- this increases cost and latency even though replacement semantics avoid duplication

Current symptoms:
- no duplicate session evaluator entries
- but repeated fetches still re-run provider work

What improvement looks like:
- evaluator outputs are reused when the underlying session evidence has not changed

### 5. Prompt overlap across evaluators
Impact rank: `5`

Why it matters:
- even with correct boundaries in code, prompt outputs can still overlap in practice
- overlap reduces perceived value and makes evaluator panels feel repetitive

Current symptoms:
- Feedback Coach and Session Synthesizer can drift toward similar advice wording
- Drift Detector and Feedback Coach can repeat issue language

What improvement looks like:
- each evaluator has a distinct and recognizable job
- outputs feel complementary, not repetitive

## Ranked Summary
1. review-time latency
2. evaluator output quality inconsistency
3. UI clarity for authority boundaries
4. repeat-fetch compute waste
5. prompt overlap

## Immediate Refinement Priorities
- tighten prompt behavior before adding more UI complexity
- add selective caching at the review stage
- make advisory vs deterministic sections clearer in the current review experience
