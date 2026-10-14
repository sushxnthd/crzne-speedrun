# Anatomy Hero Build — CR-ZNE Quantum Mitigation Metrology Rig

This is the source-of-truth design spec for the 90-second IRIS animation. It follows the `wheresryan22/anatomy` workflow literally: **the object is the explanation**.

## Tier

**Hero** — one dense explanatory instrument, approximately 100–130 purposeful parts. The same rig persists across the film; scenes are states of one machine, not a sequence of disconnected diagrams.

## Truth first

The rig encodes only claims supported by the paper:

- ZNE samples deliberately amplified noise and extrapolates toward an unmeasured zero-noise coordinate.
- Three independently implemented knobs: gate operations **G**, feedforward latency **L**, mid-circuit measurements **M**.
- Full `2^3` low/high factorial: 8 settings.
- Primary latency × measurement interaction: `b_LM = +0.0007`.
- Nominal 95% interval: `[−0.0033, +0.0049]`.
- Planned equivalence scale: `±0.005`.
- Positive controls recovered deliberately injected interactions.
- All five original extrapolation strategies excluded the known ideal for `3 / 6` observables.
- Constructive non-identifiability: two continuations can agree at sampled `λ_M ∈ {1,3}` and disagree at the zero coordinate.
- Illustrative mathematical continuation: zero readouts `1.000` and `0.942`; these are explicitly a proof example, not hardware estimates.
- More shots at the same settings reduce statistical uncertainty but do not remove the continuation ambiguity.
- Final distinction: separability diagnostic, response-model validity, zero-target calibration.

## Object

**A precision quantum-mitigation metrology rig.**

A heavy optical-bench-like base carries three noise-amplifier mechanisms, a ZNE sampling rail, a three-axis factorial indexing cage, a precision interaction dial, six known-answer inspection cartridges, and a removable service panel. Opening the panel reveals two physical response cams that touch the same followers at the sampled positions but diverge toward the unmeasured zero position. Three mechanical interlocks must all engage before the output latch releases.

Every movement maps one-to-one to the research:

- ZNE carriage moving from nominal to amplified settings = deliberate noise scaling.
- Extrapolation carriage moving into the unmeasured section = inference beyond sampled settings.
- G folding cassette = repeated/folded gate exposure.
- L telescoping timing carriage = latency stretch.
- M indexing turret = repeated mid-circuit measurement.
- 3-axis cage visiting eight stops = `2^3` factorial acquisition.
- Dial needle = measured interaction contrast.
- Injection handwheel = planned positive-control interaction.
- Six inspection cartridges = six observables checked against known ideal.
- Service panel / response cams = constructive non-identifiability proof.
- Closing caliper jaws while cam separation remains = more precision without identifiability.
- Three interlock keys = separability + model validity + zero calibration.

## Camera / world

- World coordinates: `x` along the long bench, `y` across its depth, `z` up.
- Camera: isometric, approximately 45° azimuth / 30° elevation.
- The machine is fit into a 1920×1080 stage with the narration strip reserved at the bottom.
- Parts are painted by world depth, bottom-to-top; moving assemblies keep fixed physical slots unless their motion changes depth.

## Parts list

### Base and support — 28 parts
1. Main cast base slab
2–5. Four elastomer feet
6–9. Four foot flanges
10. Front datum rail
11. Rear datum rail
12. Front ruler strip
13. Rear cable trough
14. Left end stop
15. Right end stop
16. Engraved instrument plate
17–24. Eight top-plate socket screws
25. Front service-panel frame
26. Left panel guide
27. Right panel guide
28. Lower panel stop

### ZNE sampling rail — 16 parts
29–30. Twin guide rails
31–34. Four rail supports
35–38. Four support screws
39. Sampling carriage plate
40–43. Four carriage bushings
44. Carriage index pointer
45. Zero detent
46. λ=1 detent
47. λ=3 detent
48. Extrapolation plunger

### Gate amplifier G — 14 parts
49. G pedestal
50. G spindle
51. G knurled selector
52. G pointer
53–55. Three CZ exposure cassettes
56–58. Three cassette guide pins
59. Rear cassette stop
60. Front cassette stop
61–62. Two pedestal bolts

### Latency amplifier L — 13 parts
63. L pedestal
64–65. Twin timing rails
66. L sliding timing carriage
67–68. Two carriage bushings
69. Telescoping delay bar
70. Delay index pointer
71. Knurled stretch screw
72. Stretch screw collar
73–74. Two pedestal bolts
75. Echo-window marker

### Measurement amplifier M — 14 parts
76. M pedestal
77. M turret shaft
78. M knurled selector
79. Turret crown
80–82. Three measurement plungers
83–85. Three plunger collars
86–88. Three sensor tips
89. Parity pawl

### Factorial indexing cage — 17 parts
90–93. Four vertical cage posts
94–97. Four lower frame rails
98–101. Four upper frame rails
102. X slide
103. Y slide
104. Z slide
105. Selector puck
106–113. Eight detent cups / corner targets

### Interaction metrology — 13 parts
114. Dial stand
115. Dial clamp
116. Dial body
117. Bezel ring
118. Dial face
119. Needle
120. Hub
121. Equivalence-window arc
122. Positive-control handwheel
123. Handwheel shaft
124. Injection cam
125–126. Two stand bolts

### Known-answer inspection bank — 13 parts
127. Inspection-bank carrier
128–133. Six observable cartridges
134–139. Six interval jaws
140–142. Three failure shutters for the excluded observables

### Service cutaway / proof mechanism — 20 parts
143. Removable service panel
144–147. Four panel screws
148. Internal proof backplate
149. Response cam A
150. Response cam B
151–152. Two sampled-position follower wheels
153–154. Two follower arms
155. Zero scan head
156. Zero scan carriage
157. Proof ruler strip
158. λ=0 mark
159. λ=1 mark
160. λ=3 mark
161. Shot-count odometer
162–163. Two uncertainty calipers

### Final interlock — 12 parts
164. Interlock frame
165–167. Three lock sockets
168–170. Three sliding keys
171. Output latch
172. Latch spring
173. Release bar
174–175. Two frame screws

### Cabling and fittings — 18+ parts
176–178. G/L/M signal cables
179–181. Three cable plugs
182–184. Three strain-relief collars
185–190. Six cable clamps
191. Dial linkage rod
192. Injection linkage rod
193–196. Four internal proof fasteners

The final rendered count is intentionally above 100 because repeated screws, bushings, collars, detents and cable fittings are genuine structural parts rather than decorative texture.

## Tone hierarchy

- Four neutral metal tones: low / mid / high / highlight.
- Cyan is the single normal “lit” state: the currently active physical mechanism.
- Red appears only for a known-answer exclusion / failure state.
- Amber appears only to distinguish the second mathematical continuation or injected positive control.
- No generic particle backgrounds, glowing qubits, floating UI cards or ornamental arrows.

## Motion model

All animation is time-based and keyed to the same 90-second master clock.

- Carriages use eased follow / critically damped arrival.
- Dial needle settles rather than snapping.
- G cassettes separate on guide pins.
- L carriage physically travels on rails as the delay bar extends.
- M turret/plungers index in sequence.
- Factorial selector visits eight physical detents.
- Positive control turns a handwheel and moves the same dial mechanism.
- Service screws loosen first; the panel then drops on guides.
- The zero scan head travels through the sampled region into the unmeasured region.
- Shot count rises while uncertainty caliper jaws close; response-cam separation at zero remains unchanged.
- Final keys engage sequentially; separability alone cannot release the latch.

## Frame / readout

The object occupies the drawing. Text stays out of the mechanism except a tiny engraved `CR-ZNE` plate and physical scale marks.

Card-level information:

- top-left: `FIG · CR-ZNE METROLOGY RIG`
- top-right live readout driven by the same state model
- narration remains in the existing lower strip

## Verification targets

- 1×: instantly reads as one real scientific instrument.
- 4×: every region contains purposeful structure: fasteners, supports, collars, rails, stops, seams or cable fittings.
- No line terminates in empty space.
- No floating label stands in for mechanism.
- No quantitative visual invents hardware data not present in the paper.
- QA screenshots at key master times: 12, 24, 34, 40, 52, 58, 66, 74, 84, 89 seconds.

## Canonical final-production override

The newer `STORYBOARD.md` and locked `SCRIPT.md` supersede this original full-screen rig specification wherever composition, colour, captions, or timing differ. Final production uses the left visual panel and right human safe zone, light paper / warm neutrals / orange, no narration strip, multiple coordinated explanatory views, and the exact beat boundaries in `timeline.json`. The original instrument remains the geometry source for physical control closeups, the factorial cage, service panel, and interlock. Mathematical curves are rendered from the explicit polynomial construction in `final-director.js`, rather than treating the earlier piecewise cam sketch as a numeric model.
