# Transparent footage overlay revision

The recorded speech remains the master clock: 89.8 seconds, 30 fps, Aryan at 1.1×, Sushanth at 1×, handoff at 42 seconds. The locked script is unchanged.

`motion-film.html` and `motion-film.js` replace the presentation-style framing for the new composite. Both source cameras remain full width. Fifteen scenes use masked kinetic typography, drawn circuit paths, a factorial cube, original source-paper plots, the original proof equation and speech-timed curve construction. White and semantic-color graphics are exported in RGBA; a translucent left-side gradient provides contrast. There is no opaque full-frame background. All pixels at x ≥ 1100 remain transparent in the animation layer.

The exact narration already mastered in the prior final MP4 is retained. The original percentages aside remains removed; the primary log coefficient is shown correctly as +0.0007. Personal source recordings are external to the public repository.

## Build

Place both original recordings and the previous verified `CRZNE_IRIS_Final.mp4` in `../source/`, retaining their names. Run `python3 scripts/prepare-full-footage.py`. This conforms full-frame camera tracks and reuses the mastered narration.

Run `CHROME=/path/to/chrome RENDER_ALL=1 node scripts/render-motion.cjs`. All 2,694 frames are audited before raster output. Every frame is written explicitly as RGBA to prevent ffmpeg filter reinitialization when alpha changes. Then run `python3 scripts/composite-motion.py`.

The overlay-only preview is `motion-film.html`; final delivery is the composed MP4. The existing nominal animation and its QA remain available for reference.
