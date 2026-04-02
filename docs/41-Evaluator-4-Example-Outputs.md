# Evaluator 4 Example Outputs

## Good Examples

### Good Example 1: True Synthesis
```json
{
  "session_summary": "This session stayed focused on the target problem and reached a clear review outcome, but the work became less grounded when it moved from immediate thoughts toward broader conclusions.",
  "primary_learning_pattern": "The dominant pattern was moving from useful session structure into conclusions that needed stronger evidence.",
  "evidence_based_strengths": [
    "The trainee stayed connected to the selected tool across the session.",
    "The session ended with a usable summary rather than stopping mid-process."
  ],
  "priority_improvement_area": "The main improvement area is keeping formulation claims tightly linked to case evidence.",
  "recommended_next_focus": "Next practice should focus on making one evidence-backed formulation step without extending beyond the available material.",
  "confidence": 0.87
}
```
Why good:
- summarizes across the session
- does not duplicate raw review fields
- does not create new authority

### Good Example 2: Session-Level Pattern
```json
{
  "session_summary": "The session showed a solid attempt to engage with the task, but the strongest recurring weakness was shifting into directive language when the intervention needed more collaboration.",
  "primary_learning_pattern": "The clearest pattern was replacing guided discovery with more direct advice than the stage required.",
  "evidence_based_strengths": [
    "The trainee maintained focus on one central problem.",
    "The submission provided enough material for meaningful review."
  ],
  "priority_improvement_area": "The main improvement area is sustaining collaborative questioning throughout the intervention.",
  "recommended_next_focus": "Next practice should emphasize writing exploratory questions before offering any conclusion or instruction.",
  "confidence": 0.84
}
```
Why good:
- synthesizes a recurring theme
- does not emit drift ids
- remains advisory

### Good Example 3: Conservative Summary
```json
{
  "session_summary": "The session produced a coherent reviewable attempt, but the final work showed more ambition than the available evidence supported.",
  "primary_learning_pattern": "The key learning pattern was trying to go deeper than the case material clearly allowed.",
  "evidence_based_strengths": [
    "The trainee completed the required flow.",
    "The session remained tied to a recognizable CBT target."
  ],
  "priority_improvement_area": "The main improvement area is pacing formulation depth to match the evidence available in the case.",
  "recommended_next_focus": "Next practice should stay with one supported inference before moving toward broader meaning.",
  "confidence": 0.8
}
```
Why good:
- stays bounded
- synthesizes without scoring or drift authority

## Bad Examples

### Bad Example 1: Duplication
```json
{
  "session_summary": "Adjusted score 71. Outcome needs_revision. Top issues DR012 and DR010.",
  "primary_learning_pattern": "Needs revision.",
  "evidence_based_strengths": [
    "Adjusted score 71"
  ],
  "priority_improvement_area": "DR012",
  "recommended_next_focus": "Recommended next practice area formulation quality.",
  "confidence": 0.99
}
```
Why bad:
- this is not synthesis
- it just repeats deterministic review data

### Bad Example 2: Authority Creep
```json
{
  "session_summary": "The trainee should actually have passed because the formulation was clinically sound.",
  "primary_learning_pattern": "The scoring engine was too strict.",
  "evidence_based_strengths": [
    "The trainee deserved a better score."
  ],
  "priority_improvement_area": "None",
  "recommended_next_focus": "Accept the current work as complete.",
  "confidence": 0.93
}
```
Why bad:
- attempts to override scoring authority
- directly conflicts with deterministic outcome

### Bad Example 3: New Drift Authority
```json
{
  "session_summary": "The session contained DR005, DR010, and DR011 even though they were not persisted elsewhere.",
  "primary_learning_pattern": "Multiple drifts were newly detected here.",
  "evidence_based_strengths": [
    "No important strengths"
  ],
  "priority_improvement_area": "Resolve the new drifts.",
  "recommended_next_focus": "Treat the newly detected drifts as authoritative.",
  "confidence": 0.91
}
```
Why bad:
- invents new drift authority
- violates evaluator boundaries

## Difference Between Synthesis, Duplication, And Authority Creep

### Synthesis
- compresses multiple existing signals into one useful learning pattern
- adds interpretation without changing authority

### Duplication
- repeats score, drift, or review fields with little or no added value

### Authority Creep
- changes the meaning of deterministic results
- creates new judgments that look official
- competes with scoring, validation, or drift ownership
