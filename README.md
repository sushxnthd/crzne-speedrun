# CR-ZNE IRIS 90-second video speedrun

Production repo for the IRIS National Fair video for:

**Separability does not certify zero-noise extrapolation: Factorial diagnostics in dynamic quantum circuits**

## Live animation preview

GitHub Pages target:

**https://sushxnthd.github.io/crzne-speedrun/**

Useful direct jumps after Pages is live:

- ZNE explainer: `?t=8&present=1`
- factorial design: `?t=32&present=1`
- primary interaction: `?t=38&present=1`
- narrator handoff / reversal: `?t=45&present=1`
- 3/6 failure: `?t=52&present=1`
- non-identifiability hero scene: `?t=64&present=1`
- more-shots scene: `?t=77&present=1`
- final interlocks: `?t=86&present=1`

## Master specs

- 1920×1080
- 30 fps
- 90 seconds / 2700 frames
- Aryan: 0:00–0:45
- Sushanth: 0:45–1:30

## Files

- `index.html` — interactive animation/player
- `animation.js` — complete time-based animation choreography
- `styles.css` — visual system
- `timeline.json` — exact scene/frame boundaries
- `STORYBOARD.md` — production storyboard and compositing plan
- `SCRIPT.md` — locked 90-second recording draft
- `BUILD_NOTES.md` — implementation notes

## Local preview

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

### Controls

- Play/Pause previews all 90 seconds.
- Scrubber jumps to any exact time.
- Frame counter uses the 30 fps master timeline.
- `?t=64.0` opens an exact timestamp.
- `?present=1` hides controls for clean preview/capture.
- `?autoplay=1` starts playback automatically.

## Visual architecture

One persistent precision calibration instrument transforms through:

1. ZNE rail
2. G/L/M component controls
3. 2³ factorial cube
4. interaction gauge + positive control
5. six-observable accuracy check
6. response-model cutaway / non-identifiability cam tracks
7. precision-vs-identifiability demonstration
8. three-key certification interlock

The build follows the supplied Anatomy and animate-skill principles: the physical mechanism carries the explanation; motion is eased and time-based; scene transitions rely primarily on transforms/opacity rather than decorative effects.

## Next production step

Record Aryan and Sushanth separately using `SCRIPT.md`. Once the clips/audio are available, composite them against this timing master and retime individual scene boundaries only where the real delivery requires it.
