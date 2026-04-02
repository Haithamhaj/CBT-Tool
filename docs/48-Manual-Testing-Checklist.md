# Manual Testing Checklist

## Goal
Run a structured set of trainee walkthroughs against the current MVP and capture concrete signals about clarity, usefulness, repetition, and confusion.

## Tester Setup
- use a trainee account only
- start with seeded cases
- record observations during the session, not from memory afterward
- test on the current Review flow without facilitator features

## Walkthrough 1: First-Time Guided Input

### Steps
1. Open Practice Setup.
2. Choose a beginner case.
3. Choose a valid stage.
4. Choose a valid tool.
5. Start session.
6. Enter a guided input response.
7. Submit the step.

### Observe
- whether the trainee understands what to write
- whether the step result feels understandable
- whether the evaluator output helps or distracts

### Record
- first moment of hesitation
- any question the trainee asks aloud
- whether category-related feedback was understandable

### Pass criteria
- trainee can explain what the step expected
- trainee can describe the result in their own words

### Fail criteria
- trainee does not know what kind of answer to enter
- trainee cannot explain what the feedback means

## Walkthrough 2: Weak Homework Submission

### Steps
1. Continue to summary and homework.
2. Enter a weak or overloaded homework response.
3. Submit the step.
4. Open Review.

### Observe
- whether deterministic drift feedback is understandable
- whether Feedback Coach adds something distinct
- whether the trainee knows what to revise first

### Record
- which message they read first
- what they identify as the next action
- whether they see overlap between official review and coaching

### Pass criteria
- trainee can name one concrete revision to make
- trainee can identify the authoritative next action

### Fail criteria
- trainee says the messages are repetitive
- trainee cannot tell what to fix first

## Walkthrough 3: Review Interpretation

### Steps
1. Complete a session and open Review.
2. Read the whole page without guidance.
3. Ask the trainee to explain:
   - score/outcome
   - drift summary
   - advisory guidance
   - next action
   - next focus

### Observe
- whether they understand the hierarchy
- whether they can distinguish deterministic vs advisory content

### Record
- exact wording they use to explain each section
- whether they confuse advisory content for authority

### Pass criteria
- trainee correctly distinguishes official result from advisory guidance
- trainee can state both next action and next focus

### Fail criteria
- trainee thinks advisory synthesis changed the official result
- trainee cannot distinguish next action from next focus

## Walkthrough 4: Reopen Review

### Steps
1. Open a completed review.
2. Refresh or reopen the same review.
3. Compare the experience.

### Observe
- whether the page feels stable
- whether load time feels acceptable
- whether the synthesis content appears consistent

### Record
- perceived speed
- whether the trainee notices unstable wording
- whether they comment on waiting time

### Pass criteria
- trainee perceives the review as stable
- no visible confusion about repeated opens

### Fail criteria
- trainee notices inconsistent wording and loses trust
- repeated opening feels noticeably slow or unpredictable

## Walkthrough 5: Advanced Session With Advisory Signals

### Steps
1. Use a full-simulation or advanced case.
2. Complete the session.
3. Review deterministic drifts, coaching, and synthesis together.

### Observe
- whether Drift Detector hints are understandable
- whether Session Synthesizer adds value without duplication

### Record
- which advisory section felt most useful
- which advisory section felt repetitive
- whether synthesis was actionable or too abstract

### Pass criteria
- trainee can name one session-level learning pattern
- trainee can say what to practice next

### Fail criteria
- trainee cannot explain why synthesis exists
- trainee sees advisory panels as redundant

## What To Record For Every Walkthrough
- step where hesitation first appeared
- exact phrase or concept the trainee misunderstood
- what they read first
- whether they understood next action vs next focus
- whether any section felt repetitive
- what felt most useful

## Global Pass/Fail Criteria

### Clarity
Pass:
- trainee can explain what happened and what to do next

Fail:
- trainee misreads the authority of review content

### Usefulness
Pass:
- trainee can identify at least one practical next improvement step

Fail:
- trainee says the review is informative but not actionable

### Confusion
Pass:
- trainee moves through review with limited prompting

Fail:
- trainee repeatedly asks which message matters most
