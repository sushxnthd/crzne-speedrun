# Build notes

This prototype applies the two animation skills supplied by the user as design constraints.

## Anatomy principles applied
- One persistent physical object carries the explanation.
- Mechanisms map one-to-one to scientific concepts.
- The G, L, and M controls are physical modules rather than boxes-and-arrows.
- The non-identifiability proof is a cutaway mechanism: two cam tracks coincide at sampled followers and diverge only toward zero.
- Motion uses weighted carriages, needles, panels, selector arms, and interlocks.
- Readouts are tied to the scientific quantities shown.

## animate-skill principles applied
- Scene changes use transform/opacity rather than decorative effects.
- Enters are slower than exits.
- Main movement uses ease-out/ease-in-out curves.
- The animation is time-based and frame-rate independent.
- The player can be scrubbed to any exact second/frame.

## Editing hooks
- Replace the two intro `VIDEO INSERT` placeholders with the final Aryan/Sushanth footage.
- Final narration recordings can be added after timing; all scene timing is centralized in `animation.js` and `timeline.json`.
- The exact illustrative 1.000 vs 0.942 labels in the cam-track scene are deliberately presented as the mathematical counterexample, not hardware estimates.

## Final speaker-right pass

`final-director.js` implements the latest split-screen storyboard. The original intro video placeholders and narration strip are suppressed. The final graph uses actual functions for the constructive example:

- A(λ) = 1 − 0.04λ − 0.008λ².
- B(λ) = A(λ) − (0.058/3)(λ−1)(λ−3).
- A and B agree exactly at λ=1 and λ=3; zero values are 1.000 and 0.942.

These are illustrative mathematical continuations, explicitly labelled, not hardware estimates. The displayed shot counter is illustrative too; uncertainty follows 1/√N while the zero gap stays fixed. The final latch begins moving only after all three keys are fully seated. The final reliability interlock is conceptual: it does not imply that the reported experiment certified a corrected target.

Local HTML directly includes all assets. The deployment workflow copies the source without inserting a second set of scripts or styles. See `QA_REPORT.md` for the final verification record.
