# User Testing Plan

## Goal
Test whether the current MVP actually helps trainees practice CBT work more clearly and usefully, not just whether it functions technically.

## Walkthrough 1: First-Time Guided Input

### Scenario
- trainee selects a beginner case
- completes Practice Setup
- submits a guided input response

### Observe
- whether stage/tool choice feels understandable
- whether the trainee understands what kind of text to submit
- whether Category Classifier and advisory outputs help or distract

### Confusion signals
- asks what kind of answer is expected
- cannot distinguish between authoritative and advisory panels
- ignores evaluator output because it feels unclear

### Usefulness signals
- can explain why the step passed or failed
- can describe what to improve next

## Walkthrough 2: Weak Homework Submission

### Scenario
- trainee reaches summary/homework
- submits overloaded or mismatched homework

### Observe
- whether deterministic drift feedback is understandable
- whether Feedback Coach adds useful correction instead of repetition
- whether the trainee knows what to revise first

### Confusion signals
- says "these two boxes tell me the same thing"
- cannot identify the next action

### Usefulness signals
- revises homework in a more focused way
- points to one specific corrective instruction they followed

## Walkthrough 3: Review Screen Interpretation

### Scenario
- trainee finishes a session and opens Review

### Observe
- whether they understand the order of importance:
  - score
  - drift summary
  - advisory coaching
  - advisory synthesis

### Confusion signals
- mistakes advisory synthesis for score authority
- thinks evaluator text changed the official result

### Usefulness signals
- can identify:
  - what happened
  - why it mattered
  - what to practice next

## Walkthrough 4: Reopening Review

### Scenario
- trainee opens the same review twice
- possibly refreshes the page

### Observe
- whether repeat review feels stable or inconsistent
- whether synthesis wording changes noticeably
- whether latency feels acceptable

### Confusion signals
- notices changing summary and loses trust
- thinks the system is unstable or arbitrary

### Usefulness signals
- feels the review is stable and understandable
- no concern about repeated viewing

## Walkthrough 5: Full-Simulation Case With Deeper Work

### Scenario
- trainee uses an advanced/full-simulation case
- produces a deeper formulation-oriented response

### Observe
- whether Drift Detector catches advisory AI-only patterns usefully
- whether Session Synthesizer helps connect the full session into one learning pattern

### Confusion signals
- cannot tell whether drift advice is official or optional
- feels synthesis is too abstract to act on

### Usefulness signals
- can name one session-level learning pattern after reading synthesis
- can say what they would practice differently next time

## What To Record Across All Walkthroughs
- time to complete each stage
- number of rereads of the same message/panel
- whether the trainee can restate the next action
- whether the trainee distinguishes deterministic vs advisory outputs
- whether they perceive evaluator outputs as useful, repetitive, or confusing

## Strong Product Signals
- trainee can move from feedback to revision without facilitator help
- trainee can explain the difference between score, drift, coaching, and synthesis
- trainee reports that evaluator outputs are short enough to use

## Risk Signals
- trainee treats advisory text as official authority
- trainee sees repeated or overlapping evaluator guidance
- trainee waits too long on review and loses flow
- trainee cannot identify the one next practice focus

## Prioritized Recommendation For The Next Implementation Slice
1. add review-stage caching for Session Synthesizer
2. tighten evaluator prompts to reduce overlap and verbosity
3. improve Review-screen clarity so deterministic and advisory outputs are easier to scan
