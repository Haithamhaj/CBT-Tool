# Evaluator Verification

## What Is Integrated
- provider abstraction
- OpenAI-backed provider path when `OPENAI_API_KEY` is configured
- deterministic fallback provider path when OpenAI is unavailable or fails
- Category Classifier on `guided_input`
- Feedback Coach on review-relevant step persistence
- schema validation for all evaluator outputs before persistence

## What Is Deferred
- drift detector evaluator
- session evaluator
- facilitator-facing evaluator outputs
- evaluator-specific UI expansion beyond returned attempt payloads

## Where AI Is Allowed To Influence Output
- category classification labels and explanations
- educational corrective coaching
- concise next-revision guidance

## Where AI Is Explicitly Forbidden From Overriding Deterministic Systems
- blocking validation
- deterministic drift creation
- stage-tool compatibility
- scoring math
- session state transitions
- persistence decisions outside evaluator output fields
