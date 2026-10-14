# CR-ZNE · IRIS 90-second animation master

**Separability does not certify zero-noise extrapolation: Factorial diagnostics in dynamic quantum circuits**

[Open the animation](https://sushxnthd.github.io/crzne-speedrun/?present=1) · [Download the silent 1080p master](https://sushxnthd.github.io/crzne-speedrun/animation-master.mp4)

1920×1080 · 30 fps · 90 seconds / 2700 frames. Aryan: 0–45 s; Sushanth: 45–90 s.

The locked narration in `SCRIPT.md` and the split-screen `STORYBOARD.md` are canonical. Anatomy supplies the physical controls and interlock; Papermorph directing supplies the coordinated diagram, cutaway, and mechanical transitions. Critical content stays within x=60–1160; x=1220–1920 is reserved for the recorded speaker. Warm paper, neutral metals, orange active accents; no narration captions.

## Preview and compositing

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. Local preview and GitHub Pages load the exact same scripts, with no deployment-only injection.

- `?present=1` — clean master without player controls.
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

This is the finished nominal animation master. Final speech synchronization follows the actual recorded waveform once the two clips are supplied. Preserve the right-side framing and the locked narration when conforming the scene timings; final submitted runtime must be ≤90 seconds.
