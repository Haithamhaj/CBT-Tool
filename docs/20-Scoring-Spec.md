# Scoring Spec

## Purpose
This document defines the exact scoring model for MVP so every result can be reproduced deterministically from rubric scores and drift penalties.

## Score Components

### Raw rubric score: 100 points total
- Session structure: 20
- Identification accuracy: 20
- Tool selection: 15
- Questioning quality: 15
- Formulation quality: 15
- Summary and homework: 15

### Subscore range
Each rubric category is scored from `0` to its category max.

## Raw Score Calculation
`raw_score = sum(all rubric category scores)`

Raw score must always be an integer from `0` to `100`.

## Adjusted Score Calculation
`adjusted_score = max(0, raw_score - total_drift_penalty)`

Adjusted score must always be an integer from `0` to `100`.

## Drift Penalties

### Per-event penalty by severity
- `minor`: 2 points
- `moderate`: 5 points
- `major`: 10 points

### Repeated drift escalation
If the same `drift_id` occurs more than once in the same session:
- second occurrence: add `+1` extra penalty
- third and later occurrences: add `+2` extra penalty per occurrence

### Blocking drift floor
If any unresolved blocking drift exists at final review:
- adjusted score is capped at `59`
- session outcome is automatically `needs_revision`

## Subscore Minimums
The following category minimums are required to pass:
- Session structure: at least `12/20`
- Identification accuracy: at least `12/20`
- Tool selection: at least `8/15`
- Summary and homework: at least `8/15`

Questioning quality and formulation quality do not have independent hard minimums in MVP, but they still affect total score.

## Pass Thresholds

### Outcome bands
- `85-100`: strong pass
- `70-84`: pass
- `60-69`: borderline, revision required
- `0-59`: fail

### Final pass rule
A session passes only if all of the following are true:
- adjusted score is `>= 70`
- no unresolved blocking drift remains
- all minimum subscores are met

If any rule above fails, final outcome is `needs_revision`.

## Remediation Logic

### Automatic remediation triggers
Require targeted revision if any of the following is true:
- adjusted score `< 70`
- any blocking drift remains open
- `Session structure < 12`
- `Identification accuracy < 12`
- `Tool selection < 8`
- `Summary and homework < 8`
- Category confusion drift count is `>= 2`

### Revision target selection
Map remediation to the weakest failing area:
- low Session structure -> revise opening, agenda, or summary steps
- low Identification accuracy -> redo category labeling or case interpretation steps
- low Tool selection -> reselect tool and explain rationale
- low Summary and homework -> rewrite summary and homework linkage
- repeated guided-discovery drift -> rewrite questioning step

### Revision scoring policy
- revised attempts generate a new raw score and adjusted score snapshot
- previous scores remain stored for audit history
- latest reviewed revision is the canonical displayed result

## Score Output Fields
The scoring engine must return:
- `raw_score`
- `adjusted_score`
- `rubric_scores`
- `drift_penalties`
- `drift_count`
- `top_issues`
- `priority_skill`
- `recommended_next_practice_area`
- `outcome`

## Top Issues Selection
`top_issues` is limited to 3 items and ordered by:
1. unresolved blocking drift
2. highest severity drift frequency
3. lowest rubric subscore

## Priority Skill Logic
Set `priority_skill` by the most important failed area in this order:
1. session structure
2. identification accuracy
3. tool selection
4. questioning quality
5. formulation quality
6. summary and homework

## Example
- Raw rubric total: `78`
- Drift events: one major, one moderate, two minor
- Penalty: `10 + 5 + 2 + 3` = `20`
  - the final minor is the second occurrence of the same drift, so `2 + 1`
- Adjusted score: `58`
- Outcome: `needs_revision`

## Ready-to-build blockers remaining
- Define the rubric scoring rubric anchors for each subscore band.
- Confirm whether facilitator overrides can remove penalties in MVP or only post-MVP.
- Provide at least 20 labeled examples to calibrate score consistency.
