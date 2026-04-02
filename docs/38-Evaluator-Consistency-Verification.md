# Evaluator Consistency Verification

## What Was Inconsistent
- `DR012` was still marked as `ai` in prior drift taxonomy documentation and config even though the rules engine already emitted it deterministically.
- evaluator-boundary documentation described Evaluators 1 and 2 clearly, but Evaluator 3 and planned Evaluator 4 were not yet normalized into one matrix.
- prior docs could be read as if advisory AI drift output might become authoritative drift storage.

## What Was Corrected
- `DR012` was changed to deterministic in the canonical drift taxonomy documentation.
- `DR012` was changed to `rule` in the runtime drift taxonomy config.
- evaluator boundaries were consolidated into one matrix covering Evaluators 1, 2, 3, and planned 4.
- Drift Detector scope was explicitly limited to `DR005` and `DR010`.
- a regression test was added to ensure deterministic drift ids cannot leak into authoritative AI outcomes and advisory AI outputs cannot be mistaken for `drift_events`.

## Single Source Of Truth
- drift id ownership and detection mode:
  - [`/Users/haitham/development/CBT Tool/docs/19-Drift-Taxonomy.md`](/Users/haitham/development/CBT%20Tool/docs/19-Drift-Taxonomy.md)
  - [`/Users/haitham/development/CBT Tool/src/lib/config/drift-taxonomy.ts`](/Users/haitham/development/CBT%20Tool/src/lib/config/drift-taxonomy.ts)
- evaluator purpose and boundaries:
  - [`/Users/haitham/development/CBT Tool/docs/37-Evaluator-Boundary-Matrix.md`](/Users/haitham/development/CBT%20Tool/docs/37-Evaluator-Boundary-Matrix.md)

## Current Boundary State
- authoritative drift persistence remains deterministic
- AI drift output remains advisory evaluator metadata only
- scoring and state transitions remain evaluator-invariant
