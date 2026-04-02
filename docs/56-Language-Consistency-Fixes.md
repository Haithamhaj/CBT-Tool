# Language Consistency Fixes

## What Was Still Inconsistent

- Arabic-mode pages still showed English case titles
- Arabic-mode pages still showed English presenting complaints
- help text was technically translated but still too abstract for beginners

## What Was Fixed

- tooltips were rewritten in simpler beginner-friendly language
- visible case display text in the main practice flow now switches to Arabic in Arabic mode
- difficulty badges now localize by selected language

## What Is Now Consistent

In the main practice flow, Arabic mode now shows Arabic for:

- navigation and shell
- labels and buttons
- inline help
- validation guidance
- case title
- case theme
- presenting complaint
- review hierarchy labels

English mode continues to show the original English display text.

## What Still Remains Bounded

- source case content beyond main display fields is not fully localized
- internal ids remain unchanged
- no schema expansion or multilingual authoring workflow was introduced

## Manual Check Target

Open Arabic mode and walk:

1. Practice Setup
2. Session Step
3. Review

The page should no longer feel half-Arabic, half-English in its main visible content.
