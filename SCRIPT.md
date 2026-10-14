# IRIS 90-second narration script — locked recording draft

**Project:** *Separability does not certify zero-noise extrapolation: Factorial diagnostics in dynamic quantum circuits*  
**Master:** 90 s, 30 fps  
**Narrator split:** Aryan 0:00–0:45 · Sushanth 0:45–1:30

This is the exact narration copy to record. Do not paraphrase it in the animation source. Additional technical detail belongs in visuals, not added narration.

## Aryan — 0:00–0:45

I’m Aryan Kumar, and with me is Sushanth Dasari of grade 12th.

Here’s a strange way quantum computers fight noise: make the machine deliberately noisier, watch how its answer changes, then extrapolate backward to what a perfect circuit should have produced.

That’s zero-noise extrapolation.

But dynamic quantum circuits combine several error sources at once. So on IBM quantum processors, we built independent controls for three of them: gate operations, feedforward latency, and mid-circuit measurements.

We tested every low–high combination in a pre-specified $2^3$ factorial experiment on circuits whose correct answers we already knew.

And initially, it worked exactly as we hoped. Our primary latency–measurement interaction was only **0.0007**, while a positive control successfully recovered interactions we deliberately injected.

## Sushanth — 0:45–1:30

That should have been reassuring.

It wasn’t.

When we actually extrapolated to zero noise, **all five original strategies excluded the correct answer for three of six observables.**

So we asked: how can the noise look separable, yet the correction still be wrong?

We proved the reason mathematically.

With only two sampled measurement-noise levels, different response curves can pass through **every measurement we made** and still predict different values at zero noise.

And collecting more shots at those same points cannot tell those curves apart.

**Separability is evidence about the measurements we observed. It is not a certificate that the unmeasured zero-noise answer is correct.**

Reliable ZNE therefore needs three things kept separate: interaction diagnostics, a justified response model, and a calibrated zero-noise target.

## Recording / compositing constraint

- Two source clips total: Aryan for 0:00–0:45 and Sushanth for 0:45–1:30.
- In both recordings, the speaker is framed on the **right side** of the screen.
- The animation is therefore authored primarily for the **left 60–65%** of the final frame and must not place critical information under the speaker.
- Recorded audio becomes the final timing master. The nominal timings below are design timings only and should be conformed to the real spoken waveform after recording.
