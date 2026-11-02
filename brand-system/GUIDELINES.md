# ninetynine
## Identity guidelines · final direction

One identity: rounded **99** symbol + **ninetynine**, Forge colours, Ember typography. The approved logo was confirmed by the supplied screenshot (approval context, not a new visual test here). This guide specifies the final direction; it does not certify the current website or promise an asset package exists.

## 1. Purpose and story

**One to ninety-nine. We start at one.**

ninetynine helps companies digitalise how they actually work: not just a repository at handover, but a system that can be used, operated and improved. The audience is founders, technical leaders and procurement teams who need clear ownership, not another translation layer.

The count starts before launch: the first conversation, understanding the process, scoping, architecture and a hosting plan. It continues through design, software development, testing and delivery into hosting, maintenance, enhancement and growth. A system becomes infrastructure; launch is a milestone, not the end of the relationship. When one count ends, the next improvement starts.

**99 is not a completion percentage, uptime figure or service guarantee.** It expresses continuity and continual improvement, not “almost finished”. Do not reduce the story to rescuing the last 1% of someone else's project. Specific responsibilities, support coverage and outcomes belong in the agreed scope, not an absolute brand promise.

Three behaviours make the story practical:
- **Engineered:** write down the problem, assumptions and definition of done.
- **Whole lifecycle:** explain ownership from scope to operation and enhancement; do not imply uncontracted services are included.
- **Human:** plain words, direct advice and early conversations about trade-offs. Precision need not feel cold.

Suggested short description: “Software built around how you work — from scoping and delivery to hosting and continual improvement.”

## 2. Name and contact

| Context | Use |
|---|---|
| Public name | **ninetynine**, one word, lowercase; spoken “ninety-nine” |
| Website | **ninetynine.eu** |
| General email | **contact@ninetynine.eu** |
| Example contact | **Paul Gauci · paul@ninetynine.eu** (example, not a verified role or signature) |
| Legal entity | **99 Invest Ltd**, as supplied; not independent registry verification |

Do not substitute an old domain, insert a hyphen into the written brand or use “99 Invest” as the marketing name. Legal documents may identify the entity separately from the brand. Domain/DNS and mailbox provisioning remain to be confirmed separately; naming them here does not verify ownership, resolution or mail delivery.

## 3. Logo

### Approved artwork

- Primary horizontal lockup: [`site/assets/ninetynine-the-wordmark.svg`](../site/assets/ninetynine-the-wordmark.svg). Rounded numeral **99** plus the outlined written name: **ninety 400**, **nine 750**. Preserve the supplied paths, weight contrast, spacing and proportions.
- Compact icon: the original **`the-wordmark`** entry in [`brand/symbols.json`](../brand/symbols.json). Despite its historical key, this is the rounded numeral 99 symbol, not the written name. Use for favicons, avatars and genuinely constrained spaces.
- Other historical concepts and switcher choices are not alternate final identities. Do not redraw the mark with typed numerals or reconstruct the lettering with a live font.

Prefer one colour: Paper on Ink, Ink on Paper, or brass on a sufficiently contrasting dark ground. The SVG uses `currentColor`; inline SVG can inherit CSS colour, while an external image needs a correctly coloured export. Never assume a surrounding CSS `color` recolours an `<img>`.

### Space and size

Let **H** be the visible height of the numeral 99 symbol, excluding the SVG canvas padding. Keep at least **0.25H** clear on every side of the complete lockup or compact symbol; prefer **0.5H** on covers and signage. Measure from visible artwork, not the viewBox. Existing internal logo spacing is fixed, not part of this external clearance.

| Property | Status |
|---|---|
| Primary SVG canvas | **Measured/source:** viewBox `0 0 1014 256`; preserve ratio 1014:256 |
| Compact SVG canvas | **Measured/source:** viewBox `0 0 344 256`; preserve ratio 344:256 |
| Symbol visible height | **Source-derived:** 205.4 units in compact artwork; approximately 122.40 units within the lockup after its supplied transform |
| Primary lockup minimum | **Proposed:** 200 CSS px canvas width on screen; 40 mm in print |
| Compact icon minimum | **Proposed:** 24 CSS px canvas width; 7 mm in print |
| Favicon exception | **Proposed test target:** 16 px canvas width, subject to an actual raster check; not a measured legibility approval |

These minimums and clearance rules are production recommendations, not measured optical limits. Validate at actual size on light and dark backgrounds; counters must stay open and “ninety” readable. If the lockup cannot fit, use the compact icon with an accessible name instead of shrinking or rearranging it. Request approval before changing geometry for micro sizes.

Never stretch, rotate, crop, add shadows/gradients, outline the paths, split the two nines into competing colours, alter the weight contrast or add a second “99”. Do not put the mark over busy imagery. Keep the tagline outside the clearance zone. A linked logo needs an accessible name such as “ninetynine home”; hide a duplicate decorative SVG from assistive technology.

## 4. Colour · Forge

Digital master values below come from the Forge tokens in [`site/assets/theme.js`](../site/assets/theme.js). These are **screen-only sRGB/HEX values**. No Pantone, CMYK or metallic-ink equivalence is specified. Brass is a flat screen colour, not a promise of metallic reproduction; obtain a printer's conversion and physical proof for print.

| Role / source token | Value | Use |
|---|---|---|
| Ink `--ink` | `#0C1013` | Cool charcoal ground; primary text on light |
| Paper `--paper` | `#F4F2ED` | Light ground; primary text on dark |
| Surface `--surface` | `#141A1E` | Dark panels |
| Surface 2 `--surface-2` | `#111619` | Secondary dark depth |
| Sand `--sand` | `#CFC6B4` | Secondary text on dark |
| Slate `--slate` | `#7F8489` | Muted text on dark, tested against each ground |
| Brass `--accent`, `--accent-text` | `#C9973F` | Accent on dark; filled buttons with Ink text |
| Light accent text `--accent-ink` | `#88692D` | Links and accent text on Paper |
| Light accent variant `--accent-cream` | `#8A672B` | Alternate light-ground text role; do not confuse with base brass |
| Light muted text `--muted-ink` | `#6A6E73` | Secondary text on Paper |
| Pale / deep accent | `#EFE3C0` / `#6B4E15` | Supporting fills; text pairs require checking |
| Soft accent / dark line | `rgba(201,151,63,.14)` / `rgba(207,198,180,.16)` | Decorative tint/rule only, not sufficient control boundaries by default |

Keep charcoal and Paper dominant; brass marks actions, a key number or one editorial emphasis. Avoid gold gradients, broad metallic effects or multiple competing accents.

### Accessible light and dark roles

Ratios below were calculated from the source HEX values using the WCAG sRGB relative-luminance formula, rounded to two decimals. They are **pair measurements, not a whole-site accessibility certification**.

| Foreground / background | Contrast | Application |
|---|---:|---|
| Paper / Ink (or inverse) | 17.08:1 | Primary reading pair |
| Paper / Surface | 15.69:1 | Dark cards |
| Sand / Ink | 11.27:1 | Secondary dark text |
| Slate / Ink | 5.06:1 | Muted dark text |
| Slate / Surface | 4.65:1 | Muted panel text; avoid further opacity |
| Brass / Ink (or inverse) | 7.26:1 | Dark accent text; Ink text on brass buttons |
| Light accent text / Paper | 4.57:1 | Body links and labels on light |
| Light accent variant / Paper | 4.63:1 | Alternate light accent text |
| Light muted text / Paper | 4.59:1 | Secondary light text; avoid further opacity |
| Base brass / Paper | **2.35:1** | **Not text, focus indicator or essential UI boundary** |

Use ≥4.5:1 for ordinary text, ≥3:1 for large text (24 CSS px regular or approximately 18.7 px bold), and ≥3:1 for essential non-text indicators against adjacent colours. Do not round a failing value up to a pass. Check actual hover, disabled, focus and error states, image backgrounds and alpha compositing.

Dark mode: Ink ground, Paper text, Sand/Slate supporting text, brass accents. Light mode: Paper ground, Ink text, light muted text and light accent text. Do not blindly invert token names or reuse pale dark-mode text on light. White text on base brass fails ordinary-text contrast; use Ink. Underline body links; pair errors and statuses with words/icons, not colour alone. Supply visible keyboard focus and labelled controls in both modes.

## 5. Typography · Ember pairing

Use **Ember's typography with Forge's colours**. Mono is the supporting voice, not the display face.

| Role | Specification |
|---|---|
| Display | Inter Tight; weight **640**; tracking **−0.035em**; sentence case |
| Body and controls | Inter Tight; 400 body, 600 emphasis/actions; comfortable reading line-height around 1.6 |
| Labels, steps, metadata, technical values | JetBrains Mono; typically 400–600; uppercase only for short labels |
| Fallbacks | Inter Tight → Inter → system sans; JetBrains Mono → system monospace |

Use the actual font files/weights available; do not fake 640 or 750 by adding strokes. The logo is outlined and does not depend on font loading. Preserve its supplied 400/750 contrast separately from editorial typography.

Starting scale, adapted from the existing CSS: H1 `clamp(2.4rem, 5.6vw, 4.2rem)`, H2 `clamp(1.7rem, 3.4vw, 2.7rem)`, H3 1.16rem; heading line-height 1.04–1.3. Body starts at 1rem; keep reading columns around 60–65ch. Tiny mono labels in historical mocks are not a requirement: prefer at least 0.75rem for secondary labels and never hide essential information in microtype. Respect zoom and user text sizing. Verify font licences and embed/subset permissions before distribution.

## 6. Layout and responsive behaviour

- Use a restrained grid, generous whitespace and clear section numbering. Existing site reference: 1160 px maximum content width, 24 px gutters, 16–24 px card gaps. At narrow widths, use 16–24 px gutters rather than squeezing content.
- Use fluid headings and content-led breaks. Existing references collapse major columns/navigation near 900 px and the pinned journey near 980 px; these are starting points, not device definitions.
- At small sizes, stack lifecycle stages and cards in reading order, wrap actions and contact text, and retain the logo's ratio and clearance. Do not hide essential copy just to preserve a composition.
- Navigation must remain keyboard-operable with named controls, accurate expanded state and visible focus. Aim for 44×44 CSS px interaction areas; never use a tiny drawn icon as the entire hit target.
- Check at 320 CSS px and at 200% zoom: no page-wide horizontal overflow, clipped headings or obstructed controls. Reserve horizontal scrolling for genuinely wide content with a clear affordance. Sticky headers must not cover anchor targets or focused content.
- Use restrained panels, thin decorative rules and a consistent corner treatment. Borrow existing components before inventing a parallel visual system. New imagery should explain real work; never imply a stock dashboard is a delivered client project.

## 7. Motion

Motion should explain state, not sell spectacle. Proposed timings: 140–200 ms for controls, 250–400 ms for a small reveal; short distance, ease-out, no layout shift. Keep content usable without JavaScript or animation. Do not animate the logo, loop essential reading content or use decorative counters as proof of results.

For `prefers-reduced-motion: reduce`: remove ambient loops, reveal transforms, parallax, tablet tilt, count-up effects and scroll-linked pinning; show content and final values immediately. Use instant anchor/carousel movement instead of smooth scrolling in **both CSS and JavaScript**, including later preference changes. Preserve every lifecycle stage in normal document order. A static alternative must communicate the same information, not merely stop on the first frame. Existing mocks contain partial handling; audit remaining motion before claiming compliance.

## 8. Voice and marketing

Precise, calm, commercially literate and human. Lead with the process that hurts, explain the proposed change, then state the next step. Short sentences, active verbs, sentence-case headings and British English. Technical detail earns its place when it helps someone decide.

| Prefer | Avoid |
|---|---|
| “Tell us the process that hurts.” | “Unlock limitless digital transformation.” |
| “We scope the work before we quote.” | “Guaranteed results, whatever it takes.” |
| “Build, host, maintain and improve, within an agreed scope.” | “Everything included. No risk. 100% uptime.” |
| “Potential annual time-cost, based on your assumptions.” | “Guaranteed ROI” or “You will save this amount.” |

All **prices are private**. Public pages invite a conversation or a scoped proposal; no public rate card, example project price, “from” price or invented discount. The calculator's illustrative hourly cost is a user's business-case assumption, **not ninetynine's rate**.

Describe the business-case calculator as **potential time-cost**, not return on investment: hours/week × working weeks/year × assumed hourly cost. The current mock uses 45 weeks; show that assumption beside the result. State that time may not be fully recoverable and the estimate excludes solution cost, adoption, overhead, taxes and implementation risk. Do not label the result net savings, profit or payback. Validate inputs and make assumptions and units accessible.

Only publish substantiated, approved claims. Do not invent customers, testimonials, team size, certifications, performance metrics, rankings or service levels. Brand intent is not evidence. Illustrative projects, people, numbers and legal documents must be visibly marked as examples at the point of use.

## 9. Documents, legal details and offline delivery

Use the lockup on proposals and correspondence, the compact icon where space genuinely requires it, and the same type hierarchy in email and presentation materials. Prefer light document backgrounds for economical, legible printing. Never trade readable legal text for a dramatic dark page.

Use these literal placeholders in drafts:

> 99 Invest Ltd  
> Registered address: [UNVERIFIED — confirm before publication]  
> Company registration number: [UNVERIFIED — confirm before publication]  
> VAT number/status: [UNVERIFIED — confirm before publication]

Do not infer a registered jurisdiction, address, registration number or VAT status from a domain, earlier mock or design file. Remove or verify placeholders before issuing real legal/commercial documents. “Example only — fictitious document; not valid for payment or signature” must appear on specimen invoices/contracts. Do not quietly promote mock legal text to terms, privacy notices or contractual commitments; obtain the relevant review.

For any later PDF/offline edition: embed permitted fonts, include local vector logos/graphics, make text selectable, retain headings/reading order and accessible links, and include the domain/email as visible text. Do not rely on remote font requests, scripts, local storage, hover, video or working forms. Show all content statically; replace interactive calculator controls with labelled assumptions and an example-only result. Test the exported PDF disconnected from the network, at actual size and in print preview. Check clipping, missing glyphs, contrast and page breaks; prevent stranded headings. A PDF is not automatically accessible because the source HTML is. No PDF, asset archive or token export is supplied by this documentation task.

## 10. Release gate

Before publishing: confirm approved artwork only; Forge + Ember pairing; correct contact details; both-mode contrast and keyboard checks; responsive/zoom checks; reduced-motion and no-JS reading; private prices; calculator caveat; substantiated claims; and verified legal fields or clearly labelled draft placeholders. Check actual exports, not just their source.

**Evidence boundary:** source artwork, palette values, typography settings and reference layout were inspected. Contrast pairs were computed. Minimum sizes, clearance, motion timings and responsive test targets are proposed guidance. No new screenshot comparison, optical minimum-size test, print proof, PDF validation, legal verification or full accessibility audit was performed here.
