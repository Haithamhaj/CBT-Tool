# Live Evaluator Smoke Test

## Environment Used
- Date: `2026-04-01`
- Workspace: `/Users/haitham/development/CBT Tool`
- Node: `v22.22.0`
- Smoke command: `npm run smoke:evaluators`
- Runtime config observed:
  - `OPENAI_API_KEY`: present
  - `OPENAI_EVALUATOR_MODEL`: `gpt-4.1-mini`
  - `EVALUATOR_TIMEOUT_MS`: verified at `10000` for the final real-provider smoke run
  - configured provider at runtime: `openai`

## Model Used
- Configured model name: `gpt-4.1-mini`
- Actual provider used during the verified success run: `openai`
- Live OpenAI provider success path was exercised successfully for both current evaluators.

## Sample Request Shape

### Category Classifier
```json
{
  "text": "I am going to embarrass myself in the team meeting."
}
```

### Feedback Coach
```json
{
  "stepName": "summary_and_homework",
  "attemptText": "This week I will try lots of strategies and maybe complete a worksheet if I have time.",
  "detectedIssues": [
    "Homework appears too broad.",
    "Summary did not connect clearly to the selected tool."
  ],
  "rubricContext": {
    "session_structure": 14,
    "identification_accuracy": 12,
    "tool_selection": 10,
    "questioning_quality": 11,
    "formulation_quality": 10,
    "summary_and_homework": 7
  }
}
```

## Sample Response Shape
```json
{
  "meta": {
    "providerName": "openai",
    "responseSource": "provider",
    "fallbackUsed": false,
    "fallbackReason": null,
    "model": "gpt-4.1-mini",
    "promptVersion": "category-classifier-v1",
    "latencyMs": 2055,
    "occurredAt": "2026-04-01T09:19:49.080Z"
  },
  "output": {
    "label": "thought",
    "confidence": 0.95,
    "explanation": "The text represents a prediction or belief about a future event, which is a cognitive process, thus classified as a 'thought' in CBT terminology."
  }
}
```

## Success Path Result
- Real provider-backed success was verified for both current evaluators.
- Category Classifier returned:
  - `providerName: openai`
  - `responseSource: provider`
  - `fallbackUsed: false`
  - `fallbackReason: null`
  - `label: thought`
  - `confidence: 0.95`
  - schema validation passed on provider output
- Feedback Coach returned:
  - `providerName: openai`
  - `responseSource: provider`
  - `fallbackUsed: false`
  - `fallbackReason: null`
  - two strengths
  - two top issues
  - two educational explanations
  - one next revision instruction
  - schema validation passed on provider output

Verified success-path output excerpt:
- Category Classifier:
  - `responseSource: provider`
  - `model: gpt-4.1-mini`
  - `latencyMs: 2055`
- Feedback Coach:
  - `responseSource: provider`
  - `model: gpt-4.1-mini`
  - `latencyMs: 2412`

## Fallback Path Result

### Missing Configuration Fallback
- Confirmed.
- Trigger: no `OPENAI_API_KEY` in runtime.
- Result:
  - `providerName: fallback`
  - `responseSource: fallback`
  - `fallbackUsed: true`
  - `fallbackReason: missing_configuration`

### Schema Validation Fallback
- Confirmed.
- Probe used: provider returned schema-invalid JSON payload.
- Result:
  - `responseSource: fallback`
  - `fallbackReason: schema_validation`

## Timeout/Error Handling Result

### Timeout-Triggered Fallback
- Confirmed.
- Probe used: provider threw `AbortError`, which exercises the runtime timeout branch classification.
- Result:
  - `responseSource: fallback`
  - `fallbackReason: timeout`

### Generic Provider Error
- Already covered by existing evaluator tests.
- Result:
  - `responseSource: fallback`
  - `fallbackReason: provider_error`

## Traceability In Backend And UI
- Persisted evaluator outputs now include:
  - `provider_name`
  - `response_source`
  - `fallback_used`
  - `fallback_reason`
  - `latency_ms`
  - `occurred_at`
- Backend logging now emits:
  - `[evaluator.success]`
  - `[evaluator.fallback]`
- Current UI surfaces these fields in:
  - `/Users/haitham/development/CBT Tool/app/session/[sessionId]/page.tsx`
  - `/Users/haitham/development/CBT Tool/app/review/[sessionId]/page.tsx`

This means the displayed evaluator output is now traceable to either:
- a provider response
- or a fallback path, with the fallback reason shown when applicable

In the verified OpenAI success run, the same persisted fields now identify provider-backed outputs as:
- `provider_name: openai`
- `response_source: provider`
- `fallback_used: false`
- `fallback_reason: null`

Current UI behavior:
- Session screen shows provider badge, response source badge, fallback badge when present, and latency
- Review screen shows the same evaluator source badges plus coaching content
- Therefore provider-sourced outputs are distinguishable from fallback outputs in both backend payloads and current UI rendering

## What Was Confirmed
- Category Classifier executes end-to-end against live OpenAI runtime.
- Feedback Coach executes end-to-end against live OpenAI runtime.
- True provider-backed success path is verified for both evaluators.
- `responseSource: provider` is confirmed for both success-path results.
- No fallback was triggered in the final verified success run.
- Schema validation passed on both provider outputs.
- Runtime configuration fallback on missing OpenAI credentials is explicit.
- Schema validation fallback is explicit.
- Timeout fallback is explicit.
- Persisted evaluator output and UI display now preserve source and fallback reason.
- Deterministic rules and scoring remain unchanged.

## What Remains Unverified
- Real network timeout against OpenAI itself
- OpenAI-specific response latency characteristics under production runtime

## Practical Conclusion
- The evaluator runtime behavior is now operationally traceable and bounded.
- Fallback behavior is verified.
- Live OpenAI success behavior is now verified for both current evaluators.

## Issues Found During Real Provider Execution
- With `EVALUATOR_TIMEOUT_MS=4000`, Category Classifier succeeded but Feedback Coach fell back with `fallbackReason: timeout`.
- Increasing the runtime timeout to `10000` allowed both evaluators to complete successfully from the provider path.
- No schema-validation issue occurred on the real provider outputs during the final verified run.
