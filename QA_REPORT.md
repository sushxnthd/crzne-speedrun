# Final recording-conformed CR-ZNE QA

The current build follows the revised direction: alternate full-screen and speaker-right visuals, use scientific role colors, add brief paper explanations, and synchronize the supplied recordings. The locked script remains unchanged; actual takes determine delivered timing.

## Content

Primary coefficient and original nominal interval match the submitted paper. Positive-control shifts match Sec. IV B. The three all-five excluded observables match Sec. IV C. The proof uses Eq. (7) in log space and exponentiates for the response plot; origin values are 1 and exp(−0.06). Illustrations are labelled and the closing interlock expresses requirements rather than experimental certification. RECORDED_EDIT.md documents wording correction and construction limits.

## Verified frames

Nominal: all 2700 frames pass; 118,963 text-pair comparisons with zero collisions; zero browser errors; all six local font faces loaded; 28 reverse-seek checks.

Recorded: all 2694 full-HD frames pass; 194,356 text-pair comparisons with zero collisions; zero bounds, speaker-safe, and browser errors; maximum tracked movement 32.08 px/frame. Reverse seeking passes at 21 representative times including the handoff and final engagement. All frames were rasterized with alpha for compositing. Sampled response differences are exactly zero at 1 and 3; the origin gap is 0.0582354664. Strict three-key gating remains linked to the canonical model.

## Export integrity

Every compositing PNG is explicitly RGBA. This prevents video-filter clock resets when opaque and transparent views alternate. The compositor rejects mixed PNG color types before encoding. The final encode uses constant 30 fps and is compared frame by frame against the raster source.

## Video verification

The narrated master is encoded separately with external source footage. Per-speaker audio normalization targets −16 LUFS / −1.5 dBTP; Aryan uses 1.1× pitch-preserving tempo, Sushanth original speed. Output specification and encoded-frame comparison are recorded in recorded-video-qa.json after final verification.

GitHub Actions repeats the nominal frame audit/render and recorded layout audit before publishing. Raw recordings remain external to the repository.

Final narrated encode verified: 1920×1080, 30 fps, 2694 frames, 89.834167-second container, AAC audio, 21,693,623 bytes. All 2694 decoded video frames compared against the raster source; maximum mean animation-channel difference 2.41/255 after H.264 color conversion. Audio decodes without errors; encoded loudness is −16.08 LUFS and true peak −1.06 dBTP. Eighteen composite frames were visually reviewed, including both speakers, full-screen proofs, framing transitions, and the closing interlock.
