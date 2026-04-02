# Stage-Tool Matrix

## Purpose
This document defines the canonical mapping between training stages and CBT tools for MVP. It is the source of truth for setup validation, drift detection, scoring support, and seed-case authoring.

## Classification Meanings
- `recommended`: preferred tool for the stage; selecting it supports full scoring expectations
- `allowed`: valid tool for the stage, but not the most aligned default
- `discouraged`: technically possible, but usually premature or lower-value for the stage; selecting it should trigger a non-blocking drift unless justified
- `blocked`: invalid tool for the stage; selection must be rejected or corrected before progress

## Tool Definitions
- `agenda_setting`: define the session agenda and target
- `thought_record`: identify situation, thought, emotion, and evidence
- `emotion_labeling`: distinguish and name emotional responses
- `behavioral_activation`: plan task-based behavioral action
- `cognitive_restructuring`: evaluate and revise unhelpful thoughts
- `core_belief_work`: identify deeper assumptions or beliefs
- `homework_planning`: assign and frame between-session practice
- `session_summary`: summarize learning and reinforce takeaways

## Stage Mapping With Rationale

### 1. Foundations
Focus: basic category accuracy, simple structure, and observing CBT components without deep intervention.

| Tool | Status | Rationale | Wrong-tool drift |
| --- | --- | --- | --- |
| `agenda_setting` | `recommended` | Foundational sessions must begin with clear structure and goal-setting. | `DR001` if omitted later; no wrong-tool drift when selected |
| `thought_record` | `recommended` | This is the clearest entry point for learning thought/emotion/behavior separation. | `DR003` if used incorrectly, not for selection alone |
| `emotion_labeling` | `recommended` | Early learners need explicit category separation practice. | `DR003` if category confusion appears |
| `behavioral_activation` | `allowed` | Simple activation can be introduced, but only at a basic level. | `DR011` if rationale is weak |
| `cognitive_restructuring` | `discouraged` | Usually too advanced before consistent category identification is achieved. | `DR004` Premature Depth |
| `core_belief_work` | `blocked` | Deeper belief work exceeds the stage objective. | `DR006` Tool-Stage Mismatch |
| `homework_planning` | `allowed` | Homework can be practiced if linked to the simple session goal. | `DR008` if mismatched |
| `session_summary` | `allowed` | Summary is valid, but not the core learning exercise of the stage. | `DR007` if omitted at end |

### 2. Session Structure
Focus: opening, agenda, homework review, transitions, summary, and closure.

| Tool | Status | Rationale | Wrong-tool drift |
| --- | --- | --- | --- |
| `agenda_setting` | `recommended` | This stage explicitly trains structured session opening. | `DR001` if absent |
| `thought_record` | `allowed` | Can appear as content, but not the primary goal of the stage. | `DR011` if rationale is weak |
| `emotion_labeling` | `allowed` | Category work may support the session, but not define the stage focus. | `DR011` if rationale is weak |
| `behavioral_activation` | `allowed` | Acceptable when used inside a well-structured session. | `DR011` if rationale is weak |
| `cognitive_restructuring` | `discouraged` | May distract from mastering process and structure. | `DR004` Premature Depth |
| `core_belief_work` | `blocked` | Deep formulation work is not appropriate before session structure is stable. | `DR006` Tool-Stage Mismatch |
| `homework_planning` | `recommended` | Homework framing is part of session closure competence. | `DR008` if mismatched |
| `session_summary` | `recommended` | Summary is a central observable behavior for this stage. | `DR007` if omitted |

### 3. Core Tools
Focus: competent use of standard CBT interventions matched to case needs.

| Tool | Status | Rationale | Wrong-tool drift |
| --- | --- | --- | --- |
| `agenda_setting` | `allowed` | Still valid as supporting structure, but not the main training target. | `DR011` if over-selected without rationale |
| `thought_record` | `recommended` | Core CBT skill and frequent training target. | `DR003` if misused |
| `emotion_labeling` | `recommended` | Still important when identifying target experiences before intervention. | `DR003` if misused |
| `behavioral_activation` | `recommended` | Appropriate as a core intervention tool. | `DR011` if rationale is weak |
| `cognitive_restructuring` | `recommended` | Central to this stage. | `DR005` if advice replaces guided discovery |
| `core_belief_work` | `discouraged` | Usually premature unless a case explicitly supports deeper work. | `DR004` Premature Depth |
| `homework_planning` | `allowed` | Useful for consolidation, but not typically the primary training tool. | `DR008` if mismatched |
| `session_summary` | `allowed` | Necessary at closure, but not the main skill target. | `DR007` if omitted at end |

### 4. Deeper Formulation
Focus: linking patterns, assumptions, meaning, and maintaining mechanisms.

| Tool | Status | Rationale | Wrong-tool drift |
| --- | --- | --- | --- |
| `agenda_setting` | `allowed` | Still valid for structure, but secondary. | `DR011` if treated as the main intervention |
| `thought_record` | `allowed` | Can support formulation evidence gathering. | `DR011` if rationale is weak |
| `emotion_labeling` | `allowed` | Supports precision, but is not sufficient alone for this stage. | `DR011` if isolated without formulation linkage |
| `behavioral_activation` | `allowed` | Can be relevant if formulation leads to behavioral targets. | `DR011` if link to formulation is missing |
| `cognitive_restructuring` | `recommended` | Appropriate bridge between surface thought work and deeper themes. | `DR005` if directive rather than exploratory |
| `core_belief_work` | `recommended` | This is the main stage where deeper assumptions are appropriate. | `DR010` if claims are unsupported |
| `homework_planning` | `allowed` | Valid as carryover once formulation is grounded. | `DR008` if unrelated |
| `session_summary` | `allowed` | Closure remains valid, but not the main target. | `DR007` if omitted at end |

### 5. Treatment Planning
Focus: choosing next-step interventions based on formulation and goals.

| Tool | Status | Rationale | Wrong-tool drift |
| --- | --- | --- | --- |
| `agenda_setting` | `allowed` | Structure is still useful but not sufficient for treatment planning. | `DR011` if used as substitute for planning |
| `thought_record` | `allowed` | May support target selection, but usually not the final focus. | `DR011` if no planning rationale |
| `emotion_labeling` | `discouraged` | Too narrow if used as the main treatment planning tool. | `DR004` Premature Depth |
| `behavioral_activation` | `recommended` | Common and appropriate plan component for many cases. | `DR008` if homework or task mismatch appears |
| `cognitive_restructuring` | `recommended` | Valid for planning targeted cognitive work. | `DR011` if rationale is weak |
| `core_belief_work` | `allowed` | Appropriate when supported by case complexity and formulation evidence. | `DR010` if unsupported |
| `homework_planning` | `recommended` | Treatment planning should usually end in a feasible action plan. | `DR008` if task is unrelated or overloaded |
| `session_summary` | `allowed` | Still required for closure but not the planning focus. | `DR007` if omitted at end |

### 6. Full Simulation
Focus: complete trainee performance across the full workflow.

| Tool | Status | Rationale | Wrong-tool drift |
| --- | --- | --- | --- |
| `agenda_setting` | `allowed` | Valid component of a full session. | `DR001` if missing |
| `thought_record` | `allowed` | Valid when case-appropriate. | `DR011` if rationale is missing |
| `emotion_labeling` | `allowed` | Valid when case-appropriate. | `DR003` if inaccurate |
| `behavioral_activation` | `allowed` | Valid when case-appropriate. | `DR008` if tasks mismatch |
| `cognitive_restructuring` | `allowed` | Valid when case-appropriate. | `DR005` if advice replaces guided discovery |
| `core_belief_work` | `allowed` | Valid when case evidence supports deeper work. | `DR010` if unsupported |
| `homework_planning` | `allowed` | Expected near closure. | `DR008` if unrelated or overloaded |
| `session_summary` | `allowed` | Expected near closure. | `DR007` if omitted |

In full simulation, nothing is inherently blocked by stage alone. The gating question is appropriateness to case evidence and session flow.

## Deterministic Rule Behavior

### On `recommended`
- no drift for selection alone
- full points remain available for tool selection scoring

### On `allowed`
- no drift for selection alone
- trainee must still justify tool relevance if the case does not make it obvious

### On `discouraged`
- allow continuation
- create `DR004` Premature Depth or `DR011` Missing Collaborative Link depending on the mismatch type
- cap Tool Selection subscore at `11/15` unless strong justification is provided

### On `blocked`
- reject setup or force correction before progression
- create `DR006` Tool-Stage Mismatch
- session enters `blocked_validation`

## Machine-Readable Table

```json
[
  { "stage": "foundations", "tool": "agenda_setting", "status": "recommended", "wrong_tool_drift": null },
  { "stage": "foundations", "tool": "thought_record", "status": "recommended", "wrong_tool_drift": null },
  { "stage": "foundations", "tool": "emotion_labeling", "status": "recommended", "wrong_tool_drift": null },
  { "stage": "foundations", "tool": "behavioral_activation", "status": "allowed", "wrong_tool_drift": "DR011" },
  { "stage": "foundations", "tool": "cognitive_restructuring", "status": "discouraged", "wrong_tool_drift": "DR004" },
  { "stage": "foundations", "tool": "core_belief_work", "status": "blocked", "wrong_tool_drift": "DR006" },
  { "stage": "foundations", "tool": "homework_planning", "status": "allowed", "wrong_tool_drift": "DR008" },
  { "stage": "foundations", "tool": "session_summary", "status": "allowed", "wrong_tool_drift": "DR007" },

  { "stage": "session_structure", "tool": "agenda_setting", "status": "recommended", "wrong_tool_drift": null },
  { "stage": "session_structure", "tool": "thought_record", "status": "allowed", "wrong_tool_drift": "DR011" },
  { "stage": "session_structure", "tool": "emotion_labeling", "status": "allowed", "wrong_tool_drift": "DR011" },
  { "stage": "session_structure", "tool": "behavioral_activation", "status": "allowed", "wrong_tool_drift": "DR011" },
  { "stage": "session_structure", "tool": "cognitive_restructuring", "status": "discouraged", "wrong_tool_drift": "DR004" },
  { "stage": "session_structure", "tool": "core_belief_work", "status": "blocked", "wrong_tool_drift": "DR006" },
  { "stage": "session_structure", "tool": "homework_planning", "status": "recommended", "wrong_tool_drift": null },
  { "stage": "session_structure", "tool": "session_summary", "status": "recommended", "wrong_tool_drift": null },

  { "stage": "core_tools", "tool": "agenda_setting", "status": "allowed", "wrong_tool_drift": "DR011" },
  { "stage": "core_tools", "tool": "thought_record", "status": "recommended", "wrong_tool_drift": null },
  { "stage": "core_tools", "tool": "emotion_labeling", "status": "recommended", "wrong_tool_drift": null },
  { "stage": "core_tools", "tool": "behavioral_activation", "status": "recommended", "wrong_tool_drift": null },
  { "stage": "core_tools", "tool": "cognitive_restructuring", "status": "recommended", "wrong_tool_drift": null },
  { "stage": "core_tools", "tool": "core_belief_work", "status": "discouraged", "wrong_tool_drift": "DR004" },
  { "stage": "core_tools", "tool": "homework_planning", "status": "allowed", "wrong_tool_drift": "DR008" },
  { "stage": "core_tools", "tool": "session_summary", "status": "allowed", "wrong_tool_drift": "DR007" },

  { "stage": "deeper_formulation", "tool": "agenda_setting", "status": "allowed", "wrong_tool_drift": "DR011" },
  { "stage": "deeper_formulation", "tool": "thought_record", "status": "allowed", "wrong_tool_drift": "DR011" },
  { "stage": "deeper_formulation", "tool": "emotion_labeling", "status": "allowed", "wrong_tool_drift": "DR011" },
  { "stage": "deeper_formulation", "tool": "behavioral_activation", "status": "allowed", "wrong_tool_drift": "DR011" },
  { "stage": "deeper_formulation", "tool": "cognitive_restructuring", "status": "recommended", "wrong_tool_drift": null },
  { "stage": "deeper_formulation", "tool": "core_belief_work", "status": "recommended", "wrong_tool_drift": null },
  { "stage": "deeper_formulation", "tool": "homework_planning", "status": "allowed", "wrong_tool_drift": "DR008" },
  { "stage": "deeper_formulation", "tool": "session_summary", "status": "allowed", "wrong_tool_drift": "DR007" },

  { "stage": "treatment_planning", "tool": "agenda_setting", "status": "allowed", "wrong_tool_drift": "DR011" },
  { "stage": "treatment_planning", "tool": "thought_record", "status": "allowed", "wrong_tool_drift": "DR011" },
  { "stage": "treatment_planning", "tool": "emotion_labeling", "status": "discouraged", "wrong_tool_drift": "DR004" },
  { "stage": "treatment_planning", "tool": "behavioral_activation", "status": "recommended", "wrong_tool_drift": null },
  { "stage": "treatment_planning", "tool": "cognitive_restructuring", "status": "recommended", "wrong_tool_drift": null },
  { "stage": "treatment_planning", "tool": "core_belief_work", "status": "allowed", "wrong_tool_drift": "DR010" },
  { "stage": "treatment_planning", "tool": "homework_planning", "status": "recommended", "wrong_tool_drift": null },
  { "stage": "treatment_planning", "tool": "session_summary", "status": "allowed", "wrong_tool_drift": "DR007" },

  { "stage": "full_simulation", "tool": "agenda_setting", "status": "allowed", "wrong_tool_drift": "DR001" },
  { "stage": "full_simulation", "tool": "thought_record", "status": "allowed", "wrong_tool_drift": "DR011" },
  { "stage": "full_simulation", "tool": "emotion_labeling", "status": "allowed", "wrong_tool_drift": "DR003" },
  { "stage": "full_simulation", "tool": "behavioral_activation", "status": "allowed", "wrong_tool_drift": "DR008" },
  { "stage": "full_simulation", "tool": "cognitive_restructuring", "status": "allowed", "wrong_tool_drift": "DR005" },
  { "stage": "full_simulation", "tool": "core_belief_work", "status": "allowed", "wrong_tool_drift": "DR010" },
  { "stage": "full_simulation", "tool": "homework_planning", "status": "allowed", "wrong_tool_drift": "DR008" },
  { "stage": "full_simulation", "tool": "session_summary", "status": "allowed", "wrong_tool_drift": "DR007" }
]
```

## Ready-to-build blockers remaining
- None for stage-to-tool validation in MVP.

## Is backend foundation now safe to start? yes/no and why
Yes. The matrix now provides deterministic rules for tool validation, drift firing, and score capping behavior.
