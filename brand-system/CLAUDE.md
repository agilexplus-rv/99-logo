# Claude instructions · ninetynine identity

Read [GUIDELINES.md](GUIDELINES.md) before producing brand work. This is the approved direction, not a concept-selection exercise. Follow the task's explicit scope; do not redesign the identity or silently expand implementation work.

## Non-negotiable decisions

- Public name: **ninetynine**, lowercase, one word. Legal entity supplied: **99 Invest Ltd**; registry facts are not verified.
- Approved primary logo: `site/assets/ninetynine-the-wordmark.svg` — rounded numeral 99 beside mixed-weight ninetynine, **ninety 400 / nine 750**, outlined paths. Screenshot approval is confirmed; do not ask to choose another mark.
- Compact icon: original `the-wordmark` value in `brand/symbols.json`. Preserve its geometry; the historical key does not mean the written name. Other concepts are not final alternates.
- Palette: **Forge** values from `site/assets/theme.js`. Typography: **Ember pairing**, Inter Tight display/body + JetBrains Mono metadata; display 640, tracking −0.035em. Do not substitute a mono display heading because an older Forge definition did so.
- Domain **ninetynine.eu**; general email **contact@ninetynine.eu**. Example: **Paul Gauci · paul@ninetynine.eu**. These supplied identifiers do not establish working DNS, delivery or a person's role.

## Work method

1. State an observable done condition. Inspect the touched SVG/CSS/JS and real content flow before editing. Reuse the existing asset and token path; do not create a second theme architecture.
2. Preserve SVG paths, aspect ratios, mixed weights and internal spacing. Prefer existing artwork to recreating it. Use a readable accessible name for a linked logo; decorative duplicates should be hidden from assistive technology.
3. Treat the guide's 0.25× visible-symbol-height clearance and minimum sizes as **proposed rules**, not measured optical approvals. Actual-size checks are required before claiming legibility.
4. Use semantic light/dark roles. Base brass `#C9973F` on Paper `#F4F2ED` is only **2.35:1**: not text or essential control/focus contrast. Light text accent `#88692D` on Paper is **4.57:1**; Ink on brass is **7.26:1**. Measure actual states and compositing, never infer overall compliance from a palette.
5. Preserve keyboard access, visible focus, labels, reading order, zoom and small-screen reflow. Reduced motion must disable decorative loops, reveals, tilt, counters and smooth scrolling in CSS **and JS**; show all essential content statically. No-JS/offline readers must not get invisible sections.
6. Run the smallest relevant check and inspect the final diff. Report what was actually checked, not what ought to pass. Do not claim browser, print, PDF, accessibility or legal verification without evidence.

## Content guardrails

- Story: **One to ninety-nine. We start at one.** Cover conversation/scoping → architecture/design/build → test/delivery → hosting/maintenance → enhancement/growth. Launch is not the finish. Do not reinterpret 99 as a success percentage or a last-mile-only service.
- Tone: calm, precise, plain British English; sentence case, active verbs, useful specifics. No hype, absolute reliability promises or invented metrics, clients, testimonials, credentials, team counts or guarantees.
- **All prices private**, including specimen rates and “from” prices in public materials. A calculator's hourly time-cost assumption is not a service price.
- Business-case calculator: **potential time-cost**, not guaranteed ROI/net savings. Disclose hours, weeks and assumed hourly cost (current mock: 45 weeks/year), exclusions and uncertainty beside the result. Trace inputs through calculation and accessible output; no decorative/disconnected field.
- Address, company registration and VAT must say `[UNVERIFIED — confirm before publication]`. Do not infer jurisdiction or registry facts. Example legal/commercial collateral must say **“Example only — fictitious document; not valid for payment or signature.”** Brand guidance is not legal advice or an agreed SLA.
- No fabricated Pantone/CMYK values. Screen HEX values need a printer's conversion and proof for physical reproduction.

## Deliverables and handoff

Keep exported asset/token/archive references consistent with files that actually exist. Planned files are not shipped files. The primary approved source above is authoritative until a verified equivalent export is available; never invent download filenames or links.

For PDF/offline work, embed licensed fonts and local vector assets; preserve selectable text, headings, links and reading order; make every section static; label illustrative data/legal content. Verify the PDF without network access and inspect page breaks, glyphs and clipping. Do not claim that a source page proves the exported PDF works.

Before public release, confirm domain and mailbox provisioning separately, verify legal details, remove draft placeholders from real issued documents, keep fictitious examples labelled, and recheck the release gate in GUIDELINES.md. Do not commit, push or modify unrelated files unless explicitly asked.
