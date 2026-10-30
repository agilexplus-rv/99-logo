# 99 — SOL concept round 1

## Brief / done condition
Three structurally distinct black-and-white logo directions for **99**, a software development company. Promise: “We do not just develop software; we deliver solutions.” Deliver editable vector-only SVGs, an inspected PNG overview, two saved refinement rounds, 16/32/64 px and reversed tests, and honest structural checks. Stop for a concept choice; no brand book.

**Assumptions:** precise, confident, credible; digital-first use. Audience, geography, customers, history and competitors are unconfirmed. These are design hypotheses, not company facts. The number is the name, not a percentage: no “almost complete” narrative.

## Strategy / research
Read the installed logo-design workflow and references for discovery, mark types, construction, optical craft and testing. Library category: `developer-tools` (295 marks): abstract and pictorial/combination marks dominate; containment appears in 34.2%, code/bracket motifs in 5.8%. Avoid code brackets, arrows, checkmarks, cubes, generic rounded app badges and a lone 9 beside a redundant 99.

Studied source construction in Pagekit (open negative-space channel), Framer (economy of straight contours), npm (modular positive/negative weight) and 100TB (numeral ligature). These are technique references, not templates or clearance evidence. Searched numeral and negative-space work. No other agent’s current designs were opened.

Word map: **99 → repetition / two counters / paired rhythm**; **solutions → fit / coherence / finished whole**; **precise → deliberate spacing / calibrated geometry**; **confident → strong silhouette**. The logo identifies 99; it does not attempt to diagram every service.

## Candidate longlist
Scores are quick selection judgements, not objective quality measures. C/D/S/R/Z = clarity / distinction / simplicity / relevance / small-size strength, each out of 5.

| Idea | Type / ownable move | C/D/S/R/Z | Decision |
|---|---|---|---|
| 1. Cut & Curve | Custom numeral wordmark: round bowls and decisive swept tails, no extra symbol | 5/4/5/4/4 | **Build A** |
| 2. Joint | Compact double-numeral ligature: two 9 bowls step diagonally and join into one body | 4/5/4/4/4 | **Build C** |
| 3. Counterform | Negative-space stencil: two open-bottom 9s are cut from one architectural mass | 4/5/5/4/5 | **Build B** |
| 4. Baseline | Two 9s whose descenders merge into a single horizontal footing | 4/3/4/4/3 | Too close to a simple underline |
| 5. Ribbon pair | Continuous folded band makes two rounded 9s | 3/3/3/4/2 | Too much interlacing at small sizes |
| 6. Open joint | Two angular 9s meet along a dovetail-like centre | 3/4/3/4/3 | Risks becoming a generic chain |
| 7. Quiet slab | Wide, low-contrast slab-serif 99 with one shared terminal | 5/3/4/3/4 | Less contrast against A |
| 8. Twin aperture | Two circular counters inside a single capsule with twin tails | 3/3/4/3/4 | Risks binoculars / generic badge |
| 9. Offset stamp | Two separate 9s on stacked baselines | 4/3/4/3/4 | Explore the more integrated Joint instead |
| 10. Tessellation | Four modular pieces reveal two 9s in their gaps | 2/4/3/4/2 | Puzzle before name; reject |

## Construction hypotheses (before drawing)
- **A — Cut & Curve / typographic:** two custom filled numeral outlines; round upper counters, narrower horizontal weight, a purposeful diagonal-to-flat terminal. A complete name, not icon plus name.
- **B — Counterform / negative space:** rectilinear twin 9 counters in a single broad solid mass; open descender channels prevent the form becoming a container around typography. Right angles, strong vertical weight, no separate badge.
- **C — Joint / compact ligature:** two legible 9 forms in a diagonal, near-square footprint; one integrated silhouette, two counters and two descenders. A compact name-monogram rather than a single-9 icon.

## The three directions
- **A — Cut & Curve (recommended):** the most immediate reading of the exact name. Custom drawn bowls and swept, flat-cut tails give a restrained typographic signature. Confidence comes from clarity and proportion, not a separate software pictogram. **Risk:** the quietest / least conceptually surprising option; custom numerals still occupy crowded visual territory.
- **B — Counterform:** twin negative 9s turn a solid architectural mass into the name. The two apertures and long open channels are the identifying feature; the open bottom matters, so it is not a generic enclosing app tile. **Risk:** figure/ground reversal needs a moment to decode; some viewers may initially see a building or squared initials.
- **C — Joint:** diagonally interlocked, squared numeral bodies make one compact silhouette with two counters and two descenders. Precision of fit is the visual metaphor for coherent solutions. **Risk:** most abstract and least immediate as 99, especially at 16 px; may read as a chain or linked forms. Do not treat its shape recognition at 16 px as proof of numeral legibility.

**Recommendation:** choose A if the priority is a credible, sophisticated company identifier that says the name first. B is the stronger alternative if the user prefers a bolder figure/ground identity. C is an exploratory compact-monogram direction, not the safest launch choice.

## Actual refinement / inspection record
All renders use **installed Python CairoSVG**; no browser, Chromium, Playwright, Puppeteer or heavy build was run. Opaque white or opaque black grounds throughout. Viewed with `read_image`: `renders/inspection-v1.png`, `inspection-v2.png`, `inspection-v3.png`, final `concepts.png`, `checks/peer-shelf.png`, and `checks/size-reverse-ladder.png`.

| Pass | Observation | Saved change |
|---|---|---|
| v1 → v2 | A too loose. C was merely two staggered 9s, disconnected and bottom-clipped. | Tightened A gap by 7 canvas units; lengthened tail sweep. Widened B channels. Replaced C's construction entirely with joined, rounded architectural numeral bodies. |
| v2 → v3 | A sat low; counters slightly tight. C slightly left-heavy, blocky corners. B's first channel could breathe more. | Raised A 5 units and opened its counters by 1–2 construction units. Shifted C right 10 units; corner transition increased from 24 to 30 units, left counter inset 24 → 26. B's first cut begins at x40 rather than x42. |

Every direction has v1/v2/v3 SVGs in `revisions/`. Final files are copied from v3 into `concepts/`.

## Checks / limitations
- **16 / 32 / 64 px:** exported and inspected each at actual pixel width, black and reversed (18 PNGs). At 32 and 64 all counters remain open. At 16 A still reads as 99; B retains its two channels/counter islands but is a miniature stencil; C retains a linked silhouette but loses immediate double-9 reading. Use **32 px or larger for C** pending user choice and a dedicated small-size refinement. Canvas padding means actual ink is smaller than nominal width. No false all-pass aesthetic claim.
- **One colour / reverse:** pure black fills and real transparent counters; reverse files swap only black to white, tested on black. White appears somewhat heavier, especially B. No optical reverse compensation is claimed at this concept checkpoint; selected-direction finishing should address that if needed.
- **Readings:** inspected mirrored and 180° versions. Rotated 99 naturally reads as 66; no claim that rotation is brand-legible. B has architectural / squared-letter ambiguity; C has chain ambiguity. No independent audience legibility study was run.
- **Peer shelf:** inspected against Pagekit, Framer and npm at similar presentation scale for silhouette/craft. This is a limited technique comparison, **not** a comprehensive market shelf or similarity clearance.
- **SVG audit:** final three masters return **no warnings or information issues**. Raw output in `checks/svg-audit.txt`. v1 reported A horizontal off-centring info and C overflow warning plus x/y centring info; v2 reported C horizontal centring info; these were corrected in v3. The script prints a 100/100 readiness heuristic for final files; this is **structural only, not design quality, originality, or legal clearance**.
- **Runnable assertions:** `PYTHONDONTWRITEBYTECODE=1 python3 brand/sol-round1/finalize.py` verifies allowed vector elements, no live text/images/filters/strokes/hrefs in logo masters, black fill only, 18 RGB opaque size/reverse renders with black/white extrema, and overview dimensions 1500×840. Passed. `git diff --check -- brand/sol-round1` passed (the output directory is new/untracked, so this does not substitute for the XML/render checks).
- **Licensing:** all logo shapes are custom constructed paths; no font is used in the artwork. DejaVu Sans/system text is used only for presentation labels. Library marks remain their owners' trademarks and are used only in the internal peer-check image.
- **Clearance:** parent flagged name-adjacent [99x](https://99x.io/) (software/product engineering) and [99designs](https://99designs.com/) (design marketplace). These were not used as templates. Professional trademark and visual-similarity searches remain required before adoption. No trademark clearance is promised.

## Files / checkpoint
- `concepts.png` — readable 1500×840 overview; `concepts.svg` is its editable presentation source (labels are live text; not final artwork).
- `concepts/a-cut-and-curve.svg`, `b-counterform.svg`, `c-joint.svg` — clean, vector-only logo sources.
- `renders/inspection-v1.png` through `inspection-v3.png` — actual visual refinement evidence.
- `checks/` — size PNGs, reverse SVGs/PNGs, peer shelf, reverse ladder and raw audit.
- `build.py`, `finalize.py` — reproducible drawings, rendering and minimal assertions.

**Stop here:** choose A, B or C (or request a change). No palette, brand book, expanded kit, commit or push was made.
