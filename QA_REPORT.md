# Final CR-ZNE IRIS animation QA

## Canonical inputs

- Original direction: `8ff974f`; typography / final-build pass based on `78b2fef` in `sushxnthd/crzne-speedrun`.
- `SCRIPT.md` remains byte-for-byte unchanged (SHA-256 `7edb12e12fcb059a21ce81b066e823a8e982415304367629e30871513b62cf8a`).
- Latest split-screen storyboard; Anatomy mechanisms + Papermorph directing; warm paper / neutral metals / orange; no narration captions.
- 1920×1080, 30 fps, 90 seconds. Aryan 0–45; Sushanth 45–90.

## Completed final pass

The prior implementation was still full width despite the newer storyboard. The final director now renders coordinated left-panel views: ZNE response, G/L/M closeups, factorial cage, interaction dial, positive-control comparison, six coverage cartridges, service panel, polynomial proof, uncertainty calipers, observed-grid interpretation, and the three-key interlock.

Fixes include:

- Removed leaked service-panel guides and the old full-width frame/readout.
- Ensured the factorial cage is visible in its own beat and reappears for interpretation.
- Corrected interlock painter order so sockets and engaged keys remain visible.
- Kept exactly three excluded cartridges orange and three contained cartridges neutral.
- Made competing labels exit before the next beat's labels appear; mechanical geometry can still transform or dissolve.
- Retracted the service panel after its fasteners release.
- Prevented proof notes from overlapping the precision conclusion and final hardware from overlapping labels.
- Disabled wall-clock CSS transitions for deterministic timeline seeking.
- Used actual polynomial continuations rather than a piecewise sketch as the proof plot.
- Held positive-control geometry still through the 45-second narrator change.
- Delayed output release until all three keys are fully seated.
- Added transparent compositing and optional feathered paper backing.
- Unified local and deployed asset loading and added a mandatory pre-deployment browser QA job.

## Scientific checks

The proof plot uses A(λ)=1−0.04λ−0.008λ² and B(λ)=A(λ)−(0.058/3)(λ−1)(λ−3). Both match exactly at λ=1 and λ=3; their zero values are 1.000 and 0.942. Values are explicitly labelled illustrative, not hardware estimates. The model is independent of the other factorial coordinates, so the perturbation vanishes at every sampled factorial setting.

The illustrative shot counter increases from 20,000 to 1,000,000, while caliper width follows 1/√N and the zero-value gap stays fixed. Known-answer coverage is qualitative: no fabricated numerical hardware estimates are plotted. The final keys describe requirements for reliable ZNE; their illustrative release does not assert that this experiment certified a corrected target.

## Verification

The committed browser runner checks all 2700 timeline frames for valid attributes, visible bounds, motion continuity, caption suppression, palette/filter consistency, exact proof equality, fixed ambiguity, shot readouts, 3-of-6 status, and strict interlock gating. It additionally checks the final 90-second endpoint.

Reverse seeking checks the exact rendered SVG state at 28 representative/boundary times and compares screenshots at 1920×1080. The pixel comparison permits only bounded SVG edge antialiasing: ≤0.05% of pixels and ≤32/255 per channel. Scene geometry, transforms, colours, and numeric state must be identical.

The full capture includes 91 master/boundary screenshots with the speaker mask, ten mechanism/proof detail views, all 2700 raster frames at 1920×1080, and an encoded silent 90-second 1080p master. Transparent-overlay QA verifies all 756,000 pixels in x=1220–1920 have zero alpha at the proof scene. The all-frame bounds audit separately ensures no critical final visual reaches that zone.

Final measurements are recorded in `qa-summary.json`: zero audit issues and browser errors; 118,963 visible text-pair comparisons with zero collisions; furthest visible content x=1135.41; maximum tracked movement 20.58 px/frame; all 2700 raster frames analyzed. The encoded 1080p master is exactly 90.000 seconds / 2700 frames. The 91 master/boundary captures were visually inspected after the final corrections. CI uploads the complete QA evidence as `final-animation-qa` before Pages deploys.

## Remaining production step

The animation is complete against the nominal locked timing. Actual recorded speech has not been supplied in this continuation, so audiovisual lip/narration synchronization and footage exposure/eyeline matching are not yet verified. Conform the animation to the two recorded waveforms without changing the locked narration, speaker-safe framing, or ≤90-second runtime.

## Typography and alignment finish

- Replaced plain `bLM`, `λM`, and the modifier-letter c with actual SVG subscripts; used real superscripts for the factorial power, italic mathematical variables, upright experimental indices, and Unicode minus signs.
- Aligned injected/recovered values in fixed columns with tabular numerals.
- Bundled Inter Latin / Greek normal / italic and explicit operator glyphs; verified all six font faces load before capture.
- Standardized the left datum, improved axis-label spacing and footer contrast, and aligned the closing labels to the projected centres of the corresponding keys.
- Moved the zero-limit readouts clear of the travelling scan head and the unsampled-zero marker clear of the interlock.
- Added a curve legend, corrected factorial axis-label placement, and replaced the remaining cool handwheel stroke with warm neutral material.
- Added every-frame text collision, minimum type size, mathematical subscript, operator, and palette checks. Competing proof labels now disappear before the precision readout appears.

The full-resolution silent master is published alongside the interactive preview as `animation-master.mp4`. It preserves the empty right-side speaker region; compositing recorded footage still follows the locked script and its real audio waveform.
