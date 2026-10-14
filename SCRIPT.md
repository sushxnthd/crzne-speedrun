# IRIS 90-second narration script — locked recording draft

**Project:** *Separability does not certify zero-noise extrapolation: Factorial diagnostics in dynamic quantum circuits*  
**Master:** 90 s, 30 fps  
**Narrator split:** Aryan 0:00–0:45 · Sushanth 0:45–1:30

This is the locked clear-first script chosen for recording. The animations carry additional technical detail visually rather than forcing it into the narration.

## Aryan — 0:00–0:45

I’m Aryan Kumar, and this is Sushanth Dasari. We’re student researchers from Gurugram, Haryana.

Here’s a strange way quantum computers fight noise: make the machine deliberately noisier, watch how its answer changes, then extrapolate backward to what a perfect circuit should have produced.

That’s zero-noise extrapolation.

But dynamic quantum circuits combine several error sources at once. So on IBM quantum processors, we independently amplified three of them: gate operations, feedforward latency, and mid-circuit measurements.

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

That changes what a small interaction actually means.

**Separability is evidence about the measurements we observed. It is not a certificate that the unmeasured zero-noise answer is correct.**

Reliable ZNE therefore needs three things kept separate: interaction diagnostics, a justified response model, and a calibrated zero-noise target.

## Delivery notes

- Aryan: explanatory rather than dramatic; make **“make the machine deliberately noisier”** intuitive.
- Pause very briefly after **“That’s zero-noise extrapolation.”**
- Sushanth: leave a visible beat after **“That should have been reassuring.”** and make **“It wasn’t.”** short and dry.
- Do not rush **“three of six observables.”** The animation freezes on that result.
- The mathematical explanation should sound like you are resolving the mystery, not reading a theorem.
- Slow slightly on the final two sentences.
- Record clean, dry audio; music and mechanical SFX are added later.
