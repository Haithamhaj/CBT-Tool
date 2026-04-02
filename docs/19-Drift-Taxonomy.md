# Drift Taxonomy

## Purpose
This document defines the canonical drift catalog used by rules, evaluators, scoring, and analytics.

## Detection Modes
- `rule`: deterministic and enforced without AI
- `ai`: requires evaluator interpretation
- `hybrid`: rule provides initial flag and AI adds explanation or severity refinement

## Drift Table

| drift_id | name | description | detection_mode | trigger condition | default severity | corrective action |
| --- | --- | --- | --- | --- | --- | --- |
| `DR001` | Missing Agenda | The trainee starts the session work without setting a clear agenda or goal. | `rule` | Required goal or agenda field is empty during setup or guided opening step. | `moderate` | Require a one-sentence agenda before progressing. |
| `DR002` | Missing Homework Review | The trainee skips review of prior homework when the case context indicates an existing course of work. | `rule` | Case metadata marks homework context present and homework review input is missing. | `moderate` | Prompt for prior homework summary and relevance to current goal. |
| `DR003` | Category Confusion | The trainee confuses situation, thought, emotion, or behavior labels. | `hybrid` | Rule detects invalid category mapping or evaluator classifies the text against the expected category with low alignment. | `major` | Ask the trainee to relabel the item and explain why it belongs to that category. |
| `DR004` | Premature Depth | The trainee jumps into deeper formulation before completing the expected stage foundations. | `rule` | Current stage is earlier than the selected tool or expected depth level. | `moderate` | Redirect to the appropriate lower-complexity step or tool. |
| `DR005` | Advice Instead of Guided Discovery | The trainee gives direct advice instead of using collaborative CBT questioning. | `ai` | Evaluator detects prescriptive or leading intervention language in a guided discovery step. | `major` | Rewrite the response as an exploratory question sequence. |
| `DR006` | Tool-Stage Mismatch | The selected tool is not allowed for the current stage. | `rule` | Tool is outside the stage-to-tool mapping. | `major` | Force tool reselection before continuing. |
| `DR007` | No Summary | The trainee ends the session flow without a summary statement. | `rule` | Final review step lacks a summary field. | `moderate` | Require a concise session summary before final scoring. |
| `DR008` | Homework Mismatch | The assigned homework does not follow from the session goal, identified issue, or selected tool. | `hybrid` | Rule detects missing linkage fields or evaluator judges the proposed homework as unrelated. | `major` | Revise homework to align with the goal, tool, and identified problem. |
| `DR009` | Weak Session Goal | The session goal is vague, overly broad, or not measurable enough to guide the practice. | `hybrid` | Goal text is below minimum specificity rules or evaluator marks it as ambiguous. | `minor` | Rewrite the goal into a specific, session-bounded target. |
| `DR010` | Unsupported Formulation Claim | The trainee makes a formulation claim not grounded in the presented case evidence. | `ai` | Evaluator finds unsupported inference in deeper formulation or treatment planning steps. | `moderate` | Require evidence-backed reformulation tied to case facts. |
| `DR011` | Missing Collaborative Link | The trainee fails to connect the chosen intervention to the case material or trainee rationale. | `hybrid` | Explanation field is empty or evaluator detects weak rationale for tool selection. | `minor` | Add a brief rationale linking tool, target problem, and expected outcome. |
| `DR012` | Overloaded Homework | The trainee assigns homework that is too broad, too complex, or contains multiple unrelated tasks. | `rule` | Deterministic homework parsing detects more task clauses than the overload threshold allows. | `moderate` | Reduce homework to one focused, feasible task. |

## AI-only Drift IDs
- `DR005` Advice Instead of Guided Discovery
- `DR010` Unsupported Formulation Claim

## Deterministic Or Rule-led Drift IDs
- `DR001`
- `DR002`
- `DR003`
- `DR004`
- `DR006`
- `DR007`
- `DR008`
- `DR009`
- `DR011`
- `DR012`

`DR012` is deterministic in the implemented system and must not be emitted as an authoritative AI drift.

## Severity Definitions
- `minor`: feedback required, but step may still pass if no blocking gate applies
- `moderate`: affects adjusted score materially and may require revision of the current step
- `major`: blocking or near-blocking issue that usually requires correction before completion

## Blocking Rules
The following drifts are blocking by default in MVP:
- `DR003` Category Confusion
- `DR006` Tool-Stage Mismatch
- `DR008` Homework Mismatch

The following drifts become blocking only at final review if unresolved:
- `DR001` Missing Agenda
- `DR007` No Summary
- `DR005` Advice Instead of Guided Discovery

## Canonical Persistence Fields
Every persisted drift event must include:
- `drift_id`
- `session_id`
- `attempt_id`
- `severity`
- `detection_mode`
- `message`
- `corrective_action`
- `status`

## Status Values
- `open`
- `corrected`
- `waived`

`waived` is reserved for facilitator override and is not available in self-service trainee flows during MVP.

## Ready-to-build blockers remaining
- Finalize the stage-to-tool compatibility matrix used by `DR004` and `DR006`.
- Finalize case metadata rules for when homework review is expected.
- Define the exact text heuristics for goal specificity before implementation.
