# Language and Help UX Plan

## Purpose

This pass makes the MVP easier to understand without expanding product scope. It addresses two specific clarity failures seen in manual testing:

- users were unsure what key fields expected
- review screens mixed authority levels and left users guessing what to do next

## Decisions

- Support exactly two UI languages in MVP: `en` and `ar`
- The interface renders in one language at a time only
- Arabic renders `rtl`
- English renders `ltr`
- Language selection is runtime-level, cookie-backed, and available from login plus the app shell
- Help is inline, short, and example-based

## Scope

Apply language consistency and inline help to:

- Practice Setup
- Session Step
- Review
- navigation and login chrome

## Key Field Targets

- Session goal
- Tool rationale
- Step input
- Session summary
- Homework
- Official Review
- Advisory Guidance
- Next action
- Next focus

## Review-entry Clarity Fix

- `Open Review` must appear only when session state is review-ready:
  - `review_pending`
  - `reviewed`
  - `needs_revision`
  - `completed`
- before that, the UI shows a clear non-actionable status instead of a misleading review entry point
- validation failures must surface user-facing corrective guidance, not raw system-state phrasing

## Evaluator Language Rule

- New evaluator output must be generated in the currently selected UI language
- Advisory output with a stored language that does not match the current UI language must not be shown on screen
- Deterministic review remains authoritative and separately localized at the UI layer

## Non-goals

- no machine translation of historical case content
- no multilingual simultaneous display
- no full i18n framework rollout beyond bounded MVP needs
- no redesign of information architecture

## Manual Verification Focus

- switch languages on login and inside the shell
- confirm `html[dir]` changes correctly
- confirm no mixed-language review panels are shown
- confirm help text explains expected input in one short read
- confirm review cannot be opened early
