# Rubric Anchors

## Purpose
This document defines observable scoring anchors for every rubric category so both deterministic scoring logic and AI evaluator guidance can converge on the same standard.

## Scoring Philosophy
- `low` means the trainee missed the core purpose of the category or performed it weakly enough to reduce training value
- `medium` means the trainee met the baseline expectation with acceptable clarity and relevance
- `high` means the trainee performed clearly, accurately, and in a way that models good CBT training behavior

These anchors are intended for integer scoring within each category's max points.

## 1. Session Structure (0-20)

### Low performance: 0-7
Observable signals:
- no clear agenda or session goal
- weak or missing opening structure
- abrupt movement between tasks with no transition
- missing summary or closure
- homework review omitted when expected

Weak example:
- "Let's just work on whatever seems important."

### Medium performance: 8-14
Observable signals:
- session goal is stated but somewhat broad
- opening and closure are present
- transitions are understandable but not tight
- summary exists but is generic
- homework review appears if required, but briefly

Acceptable example:
- "Today we’ll focus on understanding the thought that comes up before your anxiety increases."

### High performance: 15-20
Observable signals:
- clear agenda and focused session goal
- appropriate opening, transitions, and closure
- prior homework is reviewed when relevant
- summary accurately reflects what was learned
- homework is linked logically to the session goal

Strong example:
- "Today we’ll review last week’s thought log, identify the automatic thought driving the anxiety spike, and leave with one specific practice task for the week."

## 2. Identification Accuracy (0-20)

### Low performance: 0-7
Observable signals:
- frequent confusion between thought, emotion, behavior, and situation
- labels are inconsistent or unsupported by the case
- key items are missing or misclassified

Weak example:
- labeling "I’m going to fail" as an emotion

### Medium performance: 8-14
Observable signals:
- mostly correct category separation
- occasional ambiguity or imprecise labeling
- core case elements are identified with minor errors

Acceptable example:
- "Thought: 'I’ll embarrass myself.' Emotion: anxiety. Behavior: avoiding the meeting."

### High performance: 15-20
Observable signals:
- categories are clearly distinguished and consistently correct
- labels are precise and case-grounded
- trainee explains why an item belongs to its category when needed

Strong example:
- "Situation: manager asks for an update. Thought: 'I’ll say something stupid.' Emotion: fear. Behavior: delays speaking and looks down."

## 3. Tool Selection (0-15)

### Low performance: 0-5
Observable signals:
- selected tool is blocked or poorly matched to the stage
- rationale is missing or obviously unrelated to the case goal
- trainee chooses a deeper or narrower tool than the case supports

Weak example:
- choosing `core_belief_work` in Foundations with no evidence of deeper pattern work

### Medium performance: 6-10
Observable signals:
- tool is allowed but not strongly justified
- rationale links to the case in a basic way
- another tool might have been better, but the selection is still usable

Acceptable example:
- choosing `behavioral_activation` for low-motivation avoidance and noting that action scheduling fits the current problem

### High performance: 11-15
Observable signals:
- tool is recommended for the stage and case
- rationale clearly links session goal, case evidence, and expected outcome
- trainee avoids premature depth and overcomplication

Strong example:
- choosing `thought_record` for a beginner anxiety case because the immediate learning goal is to separate trigger, thought, emotion, and response before attempting restructuring

## 4. Questioning Quality (0-15)

### Low performance: 0-5
Observable signals:
- direct advice replaces guided discovery
- leading or closed questions dominate
- questions skip logic steps or push conclusions

Weak example:
- "You should just stop thinking that way."

### Medium performance: 6-10
Observable signals:
- some exploratory questions are used
- occasional leading phrasing or premature interpretation
- trainee invites reflection but not consistently

Acceptable example:
- "What was going through your mind just before you felt anxious?"

### High performance: 11-15
Observable signals:
- questions are collaborative, specific, and sequenced
- trainee helps uncover patterns without supplying the answer
- tone supports guided discovery rather than instruction

Strong example:
- "When your friend didn’t reply, what meaning did you make of that in the moment? What emotion followed? What did you do next?"

## 5. Formulation Quality (0-15)

### Low performance: 0-5
Observable signals:
- formulation is absent, vague, or unsupported
- trainee jumps to core beliefs without evidence
- links between thoughts, emotions, and behaviors are missing

Weak example:
- "They probably have abandonment issues" with no case support

### Medium performance: 6-10
Observable signals:
- trainee identifies a plausible pattern
- formulation is partially connected but still broad
- some links are implied more than explained

Acceptable example:
- "Avoidance seems to reduce anxiety short term, which may keep the problem going."

### High performance: 11-15
Observable signals:
- formulation is grounded in specific case data
- links between triggers, interpretations, emotions, and behaviors are clear
- deeper assumptions are proposed only when supported

Strong example:
- "The client interprets minor mistakes as evidence of personal failure, which triggers shame and avoidance, preventing corrective learning and reinforcing the belief."

## 6. Summary and Homework (0-15)

### Low performance: 0-5
Observable signals:
- summary is missing or generic
- homework is absent, unrelated, or too broad
- no connection to the session goal or selected tool

Weak example:
- "Try to do better this week."

### Medium performance: 6-10
Observable signals:
- summary captures the main topic but misses precision
- homework is relevant but not tightly scoped
- trainee provides a usable next step with limited specificity

Acceptable example:
- "This week, write down one example of the thought when it appears."

### High performance: 11-15
Observable signals:
- summary is concise, accurate, and linked to the session goal
- homework is specific, feasible, and directly tied to the chosen tool
- trainee reinforces why the task matters

Strong example:
- "We identified the thought 'I’ll fail and be judged' as the main trigger. For homework, complete one thought record after the next team meeting and note the situation, automatic thought, emotion, and alternative response."

## Rule-Based Interpretation Guidance

### Deterministic deductions
- missing agenda reduces Session Structure
- category confusion reduces Identification Accuracy
- blocked or discouraged tool selection reduces Tool Selection
- advice language reduces Questioning Quality
- unsupported deep claims reduce Formulation Quality
- missing summary or mismatched homework reduces Summary and Homework

### AI evaluator guidance
Evaluators should:
- score only observable behavior in the submitted content
- avoid inferring missing evidence
- explain score reductions by quoting the exact missing or weak element in paraphrased form
- use the anchors above before producing free-form commentary

## Suggested Scoring Bands Per Category

| Category | Low | Medium | High |
| --- | --- | --- | --- |
| Session Structure | 0-7 | 8-14 | 15-20 |
| Identification Accuracy | 0-7 | 8-14 | 15-20 |
| Tool Selection | 0-5 | 6-10 | 11-15 |
| Questioning Quality | 0-5 | 6-10 | 11-15 |
| Formulation Quality | 0-5 | 6-10 | 11-15 |
| Summary and Homework | 0-5 | 6-10 | 11-15 |

## Ready-to-build blockers remaining
- None for anchor-based scoring in MVP.

## Is backend foundation now safe to start? yes/no and why
Yes. The rubric anchors are now concrete enough to support deterministic deductions, evaluator prompts, and calibration tests.
