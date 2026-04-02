# CBT Training Tool – Codex Starter Pack

This pack gives you the minimum set of files to start a serious build with Codex for a CBT training application.

---

## 1) File map

```text
cbt-training-tool/
├── README.md
├── AGENTS.md
├── PLANS.md
├── docs/
│   ├── 01-BRD.md
│   ├── 02-PRD.md
│   ├── 03-User-Stories.md
│   ├── 04-Workflow-and-Rules.md
│   ├── 05-Rubrics-and-Scoring.md
│   ├── 06-Case-Library-Spec.md
│   ├── 07-Information-Architecture.md
│   ├── 08-Technical-Architecture.md
│   ├── 09-Database-Schema.md
│   ├── 10-AI-Evaluators-Spec.md
│   ├── 11-API-Spec.md
│   ├── 12-UI-Screens.md
│   ├── 13-Analytics-and-Metrics.md
│   ├── 14-Testing-and-QA.md
│   ├── 15-Roadmap-and-Milestones.md
│   └── 16-Glossary.md
└── prompts/
    ├── category-classifier.md
    ├── drift-detector.md
    ├── feedback-coach.md
    └── session-evaluator.md
```

---

## 2) README.md

```md
# CBT Training Tool

A guided training platform for CBT learners and peer groups.

## Goal
Help trainees practice CBT in a structured way through guided workflows, drift detection, rubric-based scoring, and actionable feedback.

## Core modules
- Guided practice sessions
- CBT tool training
- Case library
- Drift detection
- Rubric scoring
- Progress dashboard
- Facilitator review

## Audience
- CBT trainees
- Peer learning groups
- Supervisors / facilitators

## Non-goal
This product is not a therapy platform for real patients and does not provide clinical diagnosis.

## Current phase
Discovery / v1 planning
```

---

## 3) AGENTS.md

```md
# AGENTS.md

## Project purpose
Build a structured CBT training application for trainees, not a therapy chatbot.

## Working rules
- Do not change architecture without updating docs/08-Technical-Architecture.md.
- Do not add new dependencies without explaining why.
- Prefer small, reviewable changes.
- Keep logic modular and explicit.
- Rules-based validation must stay separate from AI-generated guidance.
- Every feature must map to a documented user story.
- Every UI change must reference docs/12-UI-Screens.md.
- Every scoring change must reference docs/05-Rubrics-and-Scoring.md.
- Every workflow change must reference docs/04-Workflow-and-Rules.md.

## Product guardrails
- This tool teaches CBT structure and skills.
- It must not present itself as a therapist.
- It must not diagnose users.
- It must distinguish between training mode and simulated client mode.

## Code quality
- Use clear naming.
- Prefer explicit validation over hidden heuristics.
- Add tests for scoring, rules, and workflow transitions.
- Keep prompts versioned in /prompts.

## Before finishing any task
- Run tests.
- Summarize what changed.
- List any assumptions.
- List any follow-up risks.
```

---

## 4) PLANS.md

```md
# PLANS.md

## Execution rule
For any task estimated to affect more than 3 files, create a mini plan before coding.

## Plan format
1. Goal
2. Files touched
3. Risks
4. Validation method
5. Done criteria

## Example
### Goal
Add drift detector scoring pipeline.

### Files touched
- docs/10-AI-Evaluators-Spec.md
- src/lib/driftRules.ts
- src/lib/scoring.ts
- tests/driftRules.test.ts

### Risks
- Drift labels may overlap
- Score inflation

### Validation method
- Unit tests
- 5 sample transcripts

### Done criteria
- Rules fire correctly
- Output schema matches spec
- Scores appear in review screen
```

---

## 5) docs/01-BRD.md

```md
# Business Requirements Document (BRD)

## Problem
CBT trainees often learn concepts theoretically but struggle to apply session structure, choose the right tool, detect drift, and evaluate their own performance consistently.

## Opportunity
Create a structured CBT training tool that guides learners through practice, flags deviations, scores performance, and supports peer-group learning.

## Business goal
Build a reusable training system that improves CBT skill acquisition through repeatable, measurable practice.

## Objectives
- Standardize CBT training flow
- Reduce unstructured practice
- Improve tool selection accuracy
- Improve case formulation accuracy
- Provide measurable progress indicators

## Success metrics
- Reduced category confusion (thought vs emotion vs behavior)
- Improved adherence to session structure
- Improved tool selection
- Lower repeated drift alerts over time
- Higher rubric scores across repeated sessions

## Stakeholders
- Primary: CBT trainees
- Secondary: peer groups, facilitators, course organizers

## Scope in
- Guided CBT practice
- Case-based training
- Rubric scoring
- Drift detection
- Progress tracking
- Facilitator review

## Scope out
- Real-patient care
- Diagnosis
- Medication recommendations
- Emergency mental health management

## Constraints
- Must remain educational
- Must separate hard rules from AI feedback
- Must support Arabic and English later if needed
```

---

## 6) docs/02-PRD.md

```md
# Product Requirements Document (PRD)

## Product vision
A CBT practice copilot that helps trainees learn systematically through structured workflows, guided tool usage, rule-based drift detection, AI feedback, and longitudinal progress tracking.

## Users
### User type 1: trainee
Needs guided practice, examples, correction, and scoring.

### User type 2: facilitator
Needs group-level review, trainee comparison, common error visibility.

## Core features
1. Guided practice mode
2. Tool training mode
3. Case library
4. Session evaluator
5. Drift monitor
6. Feedback coach
7. Progress dashboard
8. Facilitator view

## Functional requirements
- User can choose a case and practice mode.
- System enforces session flow.
- System validates each step.
- System flags drift.
- System generates structured feedback.
- System stores attempts and scores.
- Facilitator can review trainees and group trends.

## Non-functional requirements
- Clear and fast UI
- Auditability of scores
- Prompt outputs must be structured JSON
- Core validations must be deterministic where possible
```

---

## 7) docs/03-User-Stories.md

```md
# User Stories

## Trainee
- As a trainee, I want to practice a CBT case step by step so I do not get lost.
- As a trainee, I want the system to tell me when I confuse thought and emotion.
- As a trainee, I want feedback that explains why my answer is weak.
- As a trainee, I want to see my progress over time.

## Facilitator
- As a facilitator, I want to review the most common drift patterns in the group.
- As a facilitator, I want to compare rubric performance across trainees.
- As a facilitator, I want a simple way to assign cases or exercises.
```

---

## 8) docs/04-Workflow-and-Rules.md

```md
# Workflow and Rules

## Training stages
1. Foundations
2. Session structure
3. Core tools
4. Deeper formulation
5. Treatment planning
6. Full simulation

## Session flow
1. Select case
2. Define session goal
3. Identify stage
4. Select tool
5. Complete guided input
6. Validate
7. Detect drift
8. Generate feedback
9. Score
10. Save result

## Drift rules
- Missing agenda
- Missing homework review
- Category confusion
- Premature depth
- Advice instead of guided discovery
- Tool-stage mismatch
- No summary
- Homework mismatch
```

---

## 9) docs/05-Rubrics-and-Scoring.md

```md
# Rubrics and Scoring

## Total score: 100
- Session structure: 20
- Identification accuracy: 20
- Tool selection: 15
- Questioning quality: 15
- Formulation quality: 15
- Summary and homework: 15

## Severity model
- Minor drift
- Moderate drift
- Major drift

## Output model
- Raw score
- Adjusted score
- Drift count
- Top 3 issues
- Recommended next practice area
```

---

## 10) docs/06-Case-Library-Spec.md

```md
# Case Library Spec

## Case fields
- id
- title
- difficulty
- theme
- presenting complaint
- trigger events
- sample thoughts
- sample emotions
- sample behaviors
- hidden beliefs
- recommended tools
- expected drifts

## Difficulty levels
- Beginner
- Intermediate
- Advanced
```

---

## 11) docs/07-Information-Architecture.md

```md
# Information Architecture

## Main sections
- Dashboard
- Practice
- Cases
- Review
- Analytics
- Facilitator
- Settings
```

---

## 12) docs/08-Technical-Architecture.md

```md
# Technical Architecture

## Suggested stack
- Frontend: Next.js
- Backend: Supabase or Firebase
- AI layer: Gemini or OpenAI evaluator calls
- Validation layer: rules engine
- Storage: PostgreSQL
- Auth: standard email login

## Core modules
- sessionFlow
- rulesEngine
- scoringEngine
- evaluatorService
- caseLibrary
- analytics
- facilitatorReview

## Key principle
Hard rules and AI feedback must be separate services.
```

---

## 13) docs/09-Database-Schema.md

```md
# Database Schema

## tables
### users
- id
- name
- role
- level

### cases
- id
- title
- difficulty
- content_json

### sessions
- id
- user_id
- case_id
- stage
- selected_tool
- started_at
- finished_at

### attempts
- id
- session_id
- step_name
- user_input
- validation_output_json
- evaluator_output_json
- score

### drift_events
- id
- session_id
- drift_type
- severity
- message

### progress_snapshots
- id
- user_id
- date
- avg_score
- top_drift
- strongest_skill
- weakest_skill
```

---

## 14) docs/10-AI-Evaluators-Spec.md

```md
# AI Evaluators Spec

## Evaluator 1: Category Classifier
Input: user text
Output:
- label: situation | thought | emotion | behavior | ambiguous
- confidence
- explanation

## Evaluator 2: Drift Detector
Input: transcript chunk + stage + selected tool
Output:
- drift_detected[]
- severity
- explanation
- corrective_action

## Evaluator 3: Feedback Coach
Input: user attempt + rubric + detected issues
Output:
- what_was_done_well
- top_issues
- why_it_matters
- next_revision

## Evaluator 4: Session Evaluator
Input: full attempt
Output:
- rubric_scores
- total_score
- priority_skill
- next_exercise

## Rule
All outputs must be valid JSON.
```

---

## 15) docs/11-API-Spec.md

```md
# API Spec

## routes
- POST /api/practice/start
- POST /api/practice/step
- POST /api/evaluate/category
- POST /api/evaluate/drift
- POST /api/evaluate/session
- GET /api/cases
- GET /api/progress/:userId
- GET /api/facilitator/group-summary
```

---

## 16) docs/12-UI-Screens.md

```md
# UI Screens

## 1. Dashboard
- score summary
- recent sessions
- top issues
- next recommendation

## 2. Practice Setup
- choose mode
- choose case
- choose stage
- choose tool

## 3. Guided Practice Screen
- instructions
- input form
- hints
- validation result
- drift alerts

## 4. Review Screen
- scores
- drifts
- feedback
- redo step

## 5. Cases Library
- filters
- difficulty
- topic

## 6. Facilitator Panel
- trainees list
- average scores
- common drift patterns
```

---

## 17) docs/13-Analytics-and-Metrics.md

```md
# Analytics and Metrics

## Individual metrics
- average score
- repeated drift types
- tool accuracy
- session structure adherence

## Group metrics
- average score by trainee
- most common drift pattern
- hardest cases
- strongest / weakest tools across cohort
```

---

## 18) docs/14-Testing-and-QA.md

```md
# Testing and QA

## test layers
- unit tests for rules
- unit tests for scoring
- integration tests for session flow
- evaluator contract tests for JSON output
- UI smoke tests

## sample validation set
Use at least 20 labeled examples for:
- thought vs emotion confusion
- drift examples
- homework mismatch
- tool-stage mismatch
```

---

## 19) docs/15-Roadmap-and-Milestones.md

```md
# Roadmap and Milestones

## Phase 1: planning
- finalize docs
- finalize cases
- finalize rubric

## Phase 2: MVP
- auth
- case library
- guided practice
- basic scoring
- review page

## Phase 3: evaluator layer
- category classifier
- drift detector
- feedback coach

## Phase 4: facilitator and analytics
- dashboard
- group metrics
- exports
```

---

## 20) docs/16-Glossary.md

```md
# Glossary

- Automatic thought
- Emotion
n- Behavior
- Cognitive distortion
- Downward arrow
- Guided discovery
- Drift
- Rubric
- Case formulation
```

---

## 21) prompts/category-classifier.md

```md
You are a CBT training evaluator.
Classify the trainee text as one of:
- situation
- thought
- emotion
- behavior
- ambiguous

Return valid JSON only.
```

## 22) prompts/drift-detector.md

```md
You are a CBT drift detector.
Given the stage, selected tool, and trainee transcript, detect drift types.
Return valid JSON only.
```

## 23) prompts/feedback-coach.md

```md
You are a CBT training feedback coach.
Give concise, corrective, educational feedback.
Do not diagnose.
Return valid JSON only.
```

## 24) prompts/session-evaluator.md

```md
You are a CBT session evaluator.
Score the attempt based on rubric.
Return valid JSON only.
```

---

## 25) Minimum order of work with Codex

1. Start with README.md, AGENTS.md, docs/01-BRD.md, docs/02-PRD.md, docs/04-Workflow-and-Rules.md, docs/05-Rubrics-and-Scoring.md, docs/08-Technical-Architecture.md, docs/09-Database-Schema.md, docs/12-UI-Screens.md.
2. Then build the app shell.
3. Then implement rules engine.
4. Then add evaluator prompts.
5. Then add analytics and facilitator tools.

---

## 26) First prompt to give Codex

```md
Read these files first before proposing implementation:
- README.md
- AGENTS.md
- docs/01-BRD.md
- docs/02-PRD.md
- docs/04-Workflow-and-Rules.md
- docs/05-Rubrics-and-Scoring.md
- docs/08-Technical-Architecture.md
- docs/09-Database-Schema.md
- docs/12-UI-Screens.md

Then do the following:
1. Summarize the product in your own words.
2. List the MVP modules.
3. Propose the project folder structure.
4. Identify unclear assumptions.
5. Create an execution plan before coding.
```

