# Local typography assets

Inter variable Latin / Greek, normal / italic: unchanged WOFF2 subsets from `@fontsource-variable/inter` 5.3.0. Licensed under SIL Open Font License 1.1; see `OFL-Inter.txt`.

The two operator TTFs contain only U+2192 RIGHTWARDS ARROW and U+2260 NOT EQUAL TO, subset from the installed DejaVu Sans regular / bold fonts using fontTools. Their retained copyright / licence is in `LICENSE-DejaVu.txt`. Operator spans use a distinct CSS family to preserve correct Unicode-range font matching for the Inter text faces.

All fonts are served by this repository; no external font service or operating-system glyph fallback is needed for the final visible copy. `scripts/qa.cjs` loads and verifies all six faces before rendering.
