# Post-Testing Fix Triage

## Goal
Turn manual testing observations into a consistent fix queue so the team improves the right problems first.

## Triage Categories

### Wording Issue
Definition:
- the structure is correct, but phrasing is unclear, too long, or awkward

Examples:
- advisory text sounds repetitive
- labels are understandable only after explanation
- next focus wording is too abstract

Fix priority:
- high if it blocks understanding of review output
- otherwise medium

### Prompt Issue
Definition:
- evaluator output quality is weak because the prompt allows vague, overlapping, or verbose responses

Examples:
- Feedback Coach repeats deterministic review
- Session Synthesizer restates score summary
- Drift Detector rationale is too generic

Fix priority:
- high if repeated across multiple sessions
- medium if occasional and non-blocking

### Hierarchy Issue
Definition:
- the user cannot tell what matters most or what is authoritative

Examples:
- next action and next focus are confused
- advisory panels compete visually with official review
- user reads low-priority advisory content before understanding the official result

Fix priority:
- highest when it causes authority confusion

### Caching Issue
Definition:
- performance or stability problems caused by recomputation or stale reuse

Examples:
- repeated review loads feel slow
- synthesis changes unexpectedly when evidence did not change
- review appears stale after a meaningful session change

Fix priority:
- high when it harms trust or causes visible wait time
- medium if it is only an efficiency issue

### Logic Issue
Definition:
- the product behaves incorrectly relative to its intended rules or boundaries

Examples:
- advisory output appears to affect score interpretation
- stale synthesis survives after meaningful review evidence changes
- deterministic and advisory outputs become mixed incorrectly

Fix priority:
- highest always

## Fix-First Rules

### Fix Immediately
- any logic issue
- any hierarchy issue that causes users to confuse authority
- any repeated prompt issue that makes review output non-actionable
- any caching issue that creates stale or misleading review output

### Fix Soon
- wording problems repeated across multiple testers
- performance issues that make review feel noticeably slow
- moderate prompt overlap that reduces usefulness

### Defer
- minor style preferences
- low-severity wording polish
- nice-to-have UI cleanup that does not change comprehension

## Suggested Triage Order
1. logic issue
2. hierarchy issue
3. repeated prompt issue
4. caching issue
5. wording issue

## Decision Rule
If a finding changes user understanding of:
- what happened
- what is authoritative
- what to do next

then it should not be deferred.

## Output Format For Triage Review
For each finding, capture:
- observation
- category
- severity
- affected screen
- affected evaluator if any
- recommended action
- priority:
  - now
  - next slice
  - later

## Single Highest-Value Implementation Slice After User Testing
- fix any hierarchy confusion between official next action and advisory next focus first, because that directly affects whether trainees can act on the review correctly
