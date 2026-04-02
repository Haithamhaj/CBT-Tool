# Case Display Localization Plan

## Goal

Reduce mixed-language experience in Arabic mode across the main practice flow without changing case ids or database structure.

## Decision

Use a bounded display-localization layer keyed by case id.

- internal source data stays unchanged
- display text changes by selected UI language
- initial scope covers:
  - case title
  - case theme
  - presenting complaint

## Why This Approach

- low risk to existing contracts
- no migration required
- avoids changing seed schema during a UX-only pass
- enough to remove the most visible English text from Arabic-mode practice flow

## Applied Scope

Localized display text is now applied in:

- Practice Setup case picker and case summary card
- Session Step case title badge and case context panel

## Deferred

- full bilingual localization of all seed-case arrays
  - trigger events
  - sample thoughts
  - sample emotions
  - sample behaviors
  - hidden beliefs
- database-level multilingual case content
- facilitator-facing case display

## Constraint

This is a display fix, not a data-model redesign.
