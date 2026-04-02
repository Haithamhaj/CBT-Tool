# Review Experience Refinement

## What Changed
- tightened prompts for Review-visible evaluators:
  - Feedback Coach
  - Drift Detector
  - Session Synthesizer
- added conservative review-stage caching for Session Synthesizer reuse
- refined Review screen hierarchy to separate deterministic review from advisory guidance
- highlighted:
  - official next action
  - advisory next focus
  - deterministic vs advisory sections

## What User Problem Each Change Addresses

### Prompt tightening
Problem:
- evaluator outputs were at risk of overlap, verbosity, and repetition

Addressed by:
- shorter prompt constraints
- stronger role separation
- more explicit anti-duplication guidance

### Review hierarchy refinement
Problem:
- deterministic and advisory sections were all rendered at roughly the same level

Addressed by:
- an `Official Review` section for score and deterministic drifts
- an `Advisory Guidance` section for coaching, AI-only drift hints, and synthesis
- clearer badges and emphasis for next action vs next focus

### Session Synthesizer caching
Problem:
- repeated review fetches re-ran provider work unnecessarily

Addressed by:
- reusing synthesis when:
  - latest attempt is unchanged
  - a session synthesis output already exists
  - latest score snapshot still matches current drift count
- regenerating synthesis when review-stage evidence meaningfully changes

## What Remains Unresolved
- Session Synthesizer cache invalidation is conservative but not yet versioned with an explicit review fingerprint
- prompt quality can still improve with real user examples
- Review screen is clearer now, but still text-heavy compared with a later polish pass

## What Should Be Tested Manually Next
- open the same Review page twice and confirm it feels faster and stable
- compare official next action vs advisory next focus and confirm the distinction is obvious
- inspect a session with no AI-only drifts and ensure the advisory sections do not feel noisy
- inspect a session with coaching plus synthesis and confirm they do not feel repetitive
