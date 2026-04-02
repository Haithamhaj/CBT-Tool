# Reference Hub Interactive Roadmap

## Goal
Turn the CBT Reference Hub into a more interactive and educational in-app training companion without destabilizing the rest of the product.

The target outcome is:
- faster retrieval of the right concept or worksheet
- clearer learning by example, not only explanation
- tighter connection between reference and actual training usage
- no interference with scoring, evaluators, session state, or backend-critical paths

## Design Principle
The Reference Hub should become:
- more interactive
- more visual
- more instructive
- more operational

It should not become:
- a second practice engine
- a shadow evaluator system
- a hidden analytics feature
- a facilitator workflow surface

## Phase 1: Safe High-Value Learning Upgrades
This phase gives the highest educational value with the lowest architectural risk.

### 1. Interactive Cognitive Distortions
Current state:
- content exists
- presentation is still mostly static

Target:
- selectable distortion cards or grouped filter view
- one active distortion detail panel
- each distortion shows:
  - short definition
  - how it appears in real thinking
  - one example
  - one "do not confuse it with" note

Why first:
- trainees frequently confuse distortions
- fully local to the reference page
- no backend dependency required

### 2. Mini-Case Examples For Tools
Current state:
- tools library explains what a tool is
- decision support improved
- still missing real-feeling usage examples

Target:
- for each core tool add:
  - one short case situation
  - why this tool fits now
  - what the expected output should look like

Why first:
- helps bridge theory to action
- improves tool selection quality indirectly without changing rules logic

### 3. Worked Examples For Core Worksheets
Current state:
- worksheet structure is now clearer
- still needs richer, more complete worked examples

Target:
- add fuller example content for:
  - thought record
  - formulation sheet
  - treatment plan
  - session summary
  - homework

Why first:
- reduces beginner guesswork
- directly supports imitation-based learning

## Phase 2: Operational Reference Linking
This phase improves usefulness during real product use without changing business logic.

### 1. Contextual Jump Links
Examples:
- start practice setup
- review tools before session
- go to worksheets after session

Rule:
- navigation only
- no mutation
- no session-state side effects

### 2. Section Usage Prompts
Each important reference area should clearly state when to use it:
- before session
- during session
- after session
- when case is unclear
- when choosing a tool

Why:
- moves the page from archive to companion

### 3. Most-Used Shortcuts
Add lightweight shortcuts for:
- emotions
- distortions
- worksheets
- cognitive structure
- homework

Why:
- improves speed of return use

## Phase 3: Lightweight Learning Interactions
This phase adds more educational depth but must remain fully local and non-authoritative.

### 1. Self-Check Widgets
Examples:
- identify the distortion
- classify: automatic thought vs intermediate belief vs core belief
- choose the best tool for the stated goal

Requirements:
- immediate local feedback
- no scoring
- no persistence required
- no influence on app progress

### 2. Comparison Modules
Useful comparisons:
- automatic thought vs intermediate belief vs core belief
- thought record vs downward arrow
- formulation vs treatment plan
- summary vs homework

Why:
- many trainee errors come from category confusion, not content ignorance

## Phase 4: Personal Convenience Layer
Only after earlier phases prove useful.

### 1. Recently Viewed Reference Sections
- local UI memory only
- no backend requirement

### 2. Resume Where You Left Off
- remember last tab and active subview

### 3. Pinned Reference Items
- optional local-only personalization

Why later:
- useful but not core to learning effectiveness

## Recommended Execution Order
1. interactive cognitive distortions
2. mini-case tool examples
3. worked worksheet examples
4. contextual jump links
5. self-check widgets
6. comparison modules
7. local convenience features

## Success Signals
- trainee finds the needed section quickly
- trainee can distinguish between closely related CBT concepts more reliably
- trainee can imitate worksheet structure with less hesitation
- trainee uses the reference page during practice, not just as one-time reading

## Failure Signals
- the page becomes noisy or game-like
- new interactions distract from the training flow
- the reference page starts duplicating evaluator or practice responsibilities
- feature work causes layout instability in Arabic or English

## Final Recommendation
The next best slice after current work is:
1. interactive cognitive distortions
2. mini-case tool examples
3. worked examples for core worksheets

This is the most realistic path to make the page more useful without creating system conflicts.
