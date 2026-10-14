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
