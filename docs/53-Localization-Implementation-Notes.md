# Localization Implementation Notes

## Runtime Model

- Language is selected with a cookie-backed UI setting
- Server layout reads the language cookie and sets:
  - `lang`
  - `dir`
- Client provider exposes translation helpers and language switching

## Directionality

- `en` -> `ltr`
- `ar` -> `rtl`

## What Is Localized

- labels
- buttons
- navigation
- loading text
- validation guidance shown in UI
- review authority labels
- tooltip/help copy
- deterministic review recommendation text shown in UI

## What Is Language-aware but Not Fully Rewritten

- evaluator outputs are generated in the selected language for new executions
- persisted advisory outputs now store `output_language`
- advisory output whose stored language does not match the current UI language is hidden instead of shown in a mixed-language state

## Deterministic Text Strategy

- backend deterministic rules remain unchanged
- UI translates known validation and review strings at display time
- known recommendation strings are mapped to localized equivalents
- known deterministic drift messages are mapped by drift id

## Limitations

- existing historical evaluator outputs created before this pass may not have `output_language`
- case titles and case complaint text remain source content
- this is a bounded MVP localization layer, not a full translation framework

## Future-safe Follow-up

- persist a localized review fingerprint if review output caching later expands beyond Session Synthesizer
- add localized case content only if bilingual case-authoring becomes product scope
