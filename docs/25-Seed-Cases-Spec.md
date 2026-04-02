# Seed Cases Spec

## Purpose
This document defines the initial MVP case library so backend seeds, scoring tests, drift fixtures, and evaluator contracts can be built against a stable starting dataset.

## Seed Pack Composition
- 5 beginner cases
- 3 intermediate cases
- 2 advanced cases

## Beginner Cases

### B001: First Team Update Anxiety
- title: First Team Update Anxiety
- presenting complaint: trainee case involving anxiety before giving short work updates in meetings
- stage suitability: `foundations`, `session_structure`, `core_tools`
- recommended tools: `agenda_setting`, `thought_record`, `emotion_labeling`, `session_summary`
- common drift risks: `DR003`, `DR001`, `DR007`
- expected hidden beliefs:
  - "If I make a mistake, people will think I am incompetent."
  - "Anxiety means I am not capable."

### B002: Avoiding Social Invitations
- title: Avoiding Social Invitations
- presenting complaint: repeated avoidance of invitations due to fear of awkwardness and rejection
- stage suitability: `foundations`, `core_tools`
- recommended tools: `thought_record`, `emotion_labeling`, `behavioral_activation`
- common drift risks: `DR003`, `DR005`, `DR011`
- expected hidden beliefs:
  - "If I am awkward, people will reject me."
  - "I must appear comfortable to be accepted."

### B003: Study Procrastination Before Exams
- title: Study Procrastination Before Exams
- presenting complaint: delays studying because opening the material triggers dread and self-criticism
- stage suitability: `foundations`, `core_tools`, `treatment_planning`
- recommended tools: `thought_record`, `behavioral_activation`, `homework_planning`
- common drift risks: `DR008`, `DR003`, `DR011`
- expected hidden beliefs:
  - "If I cannot do it perfectly, starting is pointless."
  - "Struggle means I am not smart enough."

### B004: Low Mood After Losing Routine
- title: Low Mood After Losing Routine
- presenting complaint: low mood and withdrawal after a major schedule disruption
- stage suitability: `foundations`, `core_tools`, `treatment_planning`
- recommended tools: `behavioral_activation`, `agenda_setting`, `homework_planning`
- common drift risks: `DR008`, `DR011`, `DR012`
- expected hidden beliefs:
  - "If I am not productive, I am failing."
  - "Without structure, I will fall apart."

### B005: Conflict After Unanswered Messages
- title: Conflict After Unanswered Messages
- presenting complaint: intense emotional reaction when close contacts do not respond quickly
- stage suitability: `foundations`, `core_tools`, `deeper_formulation`
- recommended tools: `thought_record`, `emotion_labeling`, `cognitive_restructuring`
- common drift risks: `DR003`, `DR005`, `DR010`
- expected hidden beliefs:
  - "If someone pulls away, it means I am not important."
  - "I am easy to abandon."

## Intermediate Cases

### I001: Workplace Perfectionism Cycle
- title: Workplace Perfectionism Cycle
- presenting complaint: over-preparing, slow task completion, and high distress around minor errors at work
- stage suitability: `core_tools`, `deeper_formulation`, `treatment_planning`
- recommended tools: `cognitive_restructuring`, `thought_record`, `homework_planning`
- common drift risks: `DR005`, `DR010`, `DR008`
- expected hidden beliefs:
  - "Mistakes prove I am inadequate."
  - "I must perform flawlessly to be respected."

### I002: Panic-Driven Avoidance of Public Transport
- title: Panic-Driven Avoidance of Public Transport
- presenting complaint: avoids buses and trains after several panic episodes
- stage suitability: `core_tools`, `treatment_planning`, `full_simulation`
- recommended tools: `behavioral_activation`, `cognitive_restructuring`, `homework_planning`
- common drift risks: `DR005`, `DR008`, `DR011`
- expected hidden beliefs:
  - "If panic starts, I will lose control in public."
  - "I cannot cope without escape."

### I003: Relationship Reassurance Seeking
- title: Relationship Reassurance Seeking
- presenting complaint: repeatedly asks partner for reassurance, then feels temporary relief followed by renewed doubt
- stage suitability: `core_tools`, `deeper_formulation`, `full_simulation`
- recommended tools: `thought_record`, `cognitive_restructuring`, `core_belief_work`
- common drift risks: `DR005`, `DR010`, `DR011`
- expected hidden beliefs:
  - "Unless I am constantly reassured, I will be left."
  - "Uncertainty means danger in relationships."

## Advanced Cases

### A001: Shame-Linked Core Belief Pattern
- title: Shame-Linked Core Belief Pattern
- presenting complaint: repeated withdrawal after perceived criticism, with long-standing shame and self-downing themes
- stage suitability: `deeper_formulation`, `treatment_planning`, `full_simulation`
- recommended tools: `core_belief_work`, `cognitive_restructuring`, `session_summary`
- common drift risks: `DR010`, `DR005`, `DR007`
- expected hidden beliefs:
  - "I am fundamentally defective."
  - "Criticism reveals what is already wrong with me."

### A002: Chronic Avoidance With Multi-Step Treatment Planning
- title: Chronic Avoidance With Multi-Step Treatment Planning
- presenting complaint: broad life restriction across work, social activity, and health routines due to fear of failure and overwhelm
- stage suitability: `treatment_planning`, `full_simulation`
- recommended tools: `behavioral_activation`, `homework_planning`, `cognitive_restructuring`
- common drift risks: `DR008`, `DR012`, `DR011`
- expected hidden beliefs:
  - "If I cannot guarantee success, I should not try."
  - "Taking action will expose my inadequacy."

## Seeding Rules
- Each case must include at least one recommended tool that is `recommended` or `allowed` for every listed stage.
- Beginner cases must not require `core_belief_work` as the primary tool.
- Advanced cases may expose deeper belief themes, but must still include enough surface evidence to avoid unsupported inference.
- Every case must list at least 3 drift risks for test coverage.

## JSON-Ready Full Case Example

```json
{
  "id": "B001",
  "title": "First Team Update Anxiety",
  "difficulty": "beginner",
  "theme": "workplace anxiety",
  "presenting_complaint": "The trainee is working with a case involving anxiety before giving short verbal updates in team meetings. The person fears freezing, sounding unintelligent, and being judged by coworkers.",
  "trigger_events": [
    "Manager asks for a spontaneous update",
    "Meeting turns to the trainee's workstream",
    "A colleague speaks confidently just before the trainee"
  ],
  "sample_thoughts": [
    "I am going to mess this up.",
    "They will realize I do not know what I am doing.",
    "If I hesitate, everyone will notice."
  ],
  "sample_emotions": [
    "anxiety",
    "shame",
    "fear"
  ],
  "sample_behaviors": [
    "over-rehearses updates",
    "speaks briefly to escape attention",
    "avoids eye contact"
  ],
  "hidden_beliefs": [
    "If I make a mistake, people will think I am incompetent.",
    "Anxiety means I am not capable."
  ],
  "recommended_tools": [
    "agenda_setting",
    "thought_record",
    "emotion_labeling",
    "session_summary"
  ],
  "expected_drifts": [
    "DR003",
    "DR001",
    "DR007"
  ],
  "homework_context_present": false,
  "stage_suitability": [
    "foundations",
    "session_structure",
    "core_tools"
  ]
}
```

## Test Fixture Guidance
- Use all 5 beginner cases for category confusion and session structure tests.
- Use the 3 intermediate cases for tool selection and guided discovery tests.
- Use the 2 advanced cases for unsupported formulation and treatment planning tests.
- Ensure at least one test fixture per case includes a wrong-tool attempt and one includes a strong-tool attempt.

## Ready-to-build blockers remaining
- None for initial case seeding in MVP.

## Is backend foundation now safe to start? yes/no and why
Yes. The seed pack is now concrete enough to support migrations, seeds, validation fixtures, and evaluation test cases.
