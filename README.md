## Current recorded film: transparent overlays

The revised footage composition uses **[motion-film.html](motion-film.html)**. It keeps both recordings full-frame and overlays kinetic type, animated diagrams and original paper excerpts with transparency. The recorded edit is 89.8 seconds; Aryan is at 1.1× and Sushanth is at 1×. See [MOTION_EDIT.md](MOTION_EDIT.md) for reproducible rendering and [paper-assets/README.md](paper-assets/README.md) for source locations.

The final narrated MP4 is delivered separately. Personal footage remains outside this public repository.

# CR-ZNE · IRIS 90-second animation master

**Separability does not certify zero-noise extrapolation: Factorial diagnostics in dynamic quantum circuits**

[Open the recording-conformed animation](https://sushxnthd.github.io/crzne-speedrun/?recorded=1&present=1) · [Nominal animation](https://sushxnthd.github.io/crzne-speedrun/?present=1) · [Download the silent 1080p master](https://sushxnthd.github.io/crzne-speedrun/animation-master.mp4)

1920×1080 · 30 fps · 90 seconds / 2700 frames. Aryan: 0–45 s; Sushanth: 45–90 s.

The recording-conformed cut is 89.8 seconds / 2694 frames, with Aryan at 1.1×, Sushanth at original speed, and a speaker handoff at 42 seconds. Full-screen diagrams alternate with speaker-right scenes. Colors encode scientific roles: measured blue, alternative violet, latency amber, failed-coverage vermilion, and requirement teal. Brief paper notes add context without narration subtitles.

The locked script remains unchanged as the recording draft. The supplied takes and `recording-timeline.json` determine the edited timing. Anatomy and Papermorph remain the visual direction. In speaker scenes critical visuals remain left of x=1160; full-screen scenes expand the framing.

## Preview and compositing

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. Local preview and GitHub Pages load the exact same scripts, with no deployment-only injection.

- `?present=1` — clean nominal master without player controls.
- `?recorded=1&present=1` — actual-speech timing, wider visual beats, and explanatory notes.
- `?t=69&present=1` — precise timestamp; scrubber uses the 30 fps master.
- `?autoplay=1&present=1` — full motion preview.
- `?safe=1&present=1` — simulated right-side speaker mask.
- `?overlay=1&present=1` — transparent animation layer; capture PNGs with background omission.
- `?overlay=1&paper=1&present=1` — transparent layer with a feathered paper backing on the left.

Useful beats: ZNE 12 s; G/L/M 22/26/30 s; factorial 34 s; interaction 39 s; positive control 44 s; coverage 52 s; service panel 58 s; proof 69 s; precision 75 s; interpretation 82 s; final interlock 89 s.

## Source

- `SCRIPT.md` — unchanged locked narration, two recording halves.
- `STORYBOARD.md` — canonical directing and compositing plan.
- `final-director.js`, `final-director.css` — final speaker-safe choreography and quantitative diagrams.
- `anatomy-model.js`, `anatomy-hero.js` — retained instrument geometry and master state.
- `timeline.json` — exact scene and frame boundaries.
- `visual-audit.js`, `scripts/qa.cjs` — every-frame browser audit and rendered-frame verification.
- `QA_REPORT.md` — checks, fixes, and practical limits.

Typography is bundled locally, with native SVG subscripts/superscripts and pinned Latin, Greek, and operator glyphs. See `fonts/README.md` for asset provenance.

Earlier animation layers remain for provenance and instrument construction. The final director owns the visible composition and suppresses superseded views. All motion is a function of the timeline; wall-clock CSS transitions are disabled.

## Reproduce QA

```bash
npm ci
npx playwright install chromium
npm run qa
QA_ALL_FRAMES=1 npm run qa
```

Set `CHROME=/path/to/chrome` to use an installed browser. `QA_URL` can override the local preview served by the QA runner. The full run audits all 2700 master frames at 1920×1080, checks reverse seeking, captures master/boundary frames with a speaker mask, and rasterizes every frame at 1920×1080 for the full-resolution master. Set `QA_FRAME_WIDTH=960` for a smaller review export. GitHub Actions reruns the checks before deploying Pages and retains QA images, JSON, and a silent 90-second 1080p animation-master MP4 as the `final-animation-qa` artifact.

## Footage conform

The supplied recordings have been conformed, cropped to the speaker region, and balanced in loudness for the separately delivered narrated video. Raw recordings are external to this repository. See `RECORDED_EDIT.md` and `recording-timeline.json`. Run `scripts/render-recorded.cjs` to audit/render all 2694 transparent frames; use `scripts/composite-recorded.py` with externally supplied aligned camera and narration tracks.
