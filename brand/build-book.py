#!/usr/bin/env python3
"""Emit the 99 brand book (site/index.html) from real data — logos, domain research, packages.

    python3 brand/build-book.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent
SITE = REPO / "site"

# ---------------------------------------------------------------- marks
SIGN = ('<svg viewBox="0 0 256 256" aria-hidden="true"><g fill="currentColor" fill-rule="evenodd" '
        'transform="translate(128 126) scale(1.22) translate(-128 -126)">'
        '<path d="M78 56a42 42 0 1 1 0 84a42 42 0 1 1 0 -84ZM120 98C120 150.5 109.5 179.9 59.1 198.8'
        'L51.75 186.07C86.4 168.56 99 148.4 97.93 136.22ZM178 56a42 42 0 1 1 0 84a42 42 0 1 1 0 -84'
        'ZM220 98C220 150.5 209.5 179.9 159.1 198.8L151.75 186.07C186.4 168.56 199 148.4 197.93 136.22Z"/>'
        '</g></svg>')

_WM = ('M52 8 C23 8 4 28 4 56 C4 84 22 102 48 102 C60 102 70 98 77 90 C73 119 55 136 24 144 L32 166 '
       'C79 154 104 120 104 65 V57 C104 27 84 8 52 8 Z M52 31 C36 31 27 41 27 56 C27 71 37 80 52 80 '
       'C68 80 79 70 79 55 C79 40 69 31 52 31 Z')
WORDMARK = ('<svg viewBox="0 0 344 256" aria-hidden="true">'
            f'<path fill="currentColor" fill-rule="evenodd" transform="translate(28 15) scale(1.3)" d="{_WM}"/>'
            f'<path fill="currentColor" fill-rule="evenodd" transform="translate(181 15) scale(1.3)" d="{_WM}"/>'
            '</svg>')

RING = '<path fill="currentColor" fill-rule="evenodd" d="M28 92a46 46 0 1 0 92 0a46 46 0 1 0 -92 0Z M52 92a22 22 0 1 0 44 0a22 22 0 1 0 -44 0Z"/>'
RING2 = '<path fill="currentColor" fill-rule="evenodd" d="M136 92a46 46 0 1 0 92 0a46 46 0 1 0 -92 0Z M160 92a22 22 0 1 0 44 0a22 22 0 1 0 -44 0Z"/>'
SIGN_OFF = ('<svg viewBox="0 0 256 256" aria-hidden="true">' + RING +
            '<path fill="currentColor" d="M96 92h24v80h-24Z"/>' + RING2 +
            '<path fill="currentColor" d="M204 92H228V192A24 24 0 0 1 204 216H28V192H204Z"/></svg>')

SEAL = ('<svg viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" '
        'd="M 52 24 H 204 L 232 52 V 204 L 204 232 H 52 L 24 204 V 52 Z M 56 52 H 104 L 116 64 V 192 '
        'L 104 204 H 56 L 80 180 H 92 V 136 H 56 L 44 124 V 64 Z M 68 76 H 92 V 112 H 68 Z M 152 52 '
        'H 200 L 212 64 V 192 L 200 204 H 152 L 176 180 H 188 V 136 H 152 L 140 124 V 64 Z M 164 76 '
        'H 188 V 112 H 164 Z"/></svg>')

MARKS = [
    dict(id="the-sign", name="The Sign", role="Idea-led · typographic", svg=SIGN, rec=True,
         idea="A closing quotation mark is a 99 — the sign that ends the statement.",
         note="The name and the symbol are the same object, so a lockup never repeats “9 + 99”. "
              "Strongest of the four at 16 px."),
    dict(id="the-wordmark", name="The Wordmark", role="Craft-led · custom numerals", svg=WORDMARK,
         idea="Two drawn numerals: round bowls, decisive swept tails, flat-cut terminals.",
         note="The plainest reading of the name and the warmest. Nothing to decode."),
    dict(id="the-sign-off", name="Sign-off", role="Craft-led · underlined numerals", svg=SIGN_OFF,
         idea="The last stroke keeps going and underlines both numerals: underlined, then signed off.",
         note="Ends on a line rather than a curve. Shares a role with The Wordmark — take one of the two."),
    dict(id="the-seal", name="The Seal", role="Strategy-led · emblem", svg=SEAL,
         idea="Two negative-space 9s carved through one solid chamfered monolith.",
         note="Reads as finished and sealed. Works as an app icon or a stamp with no container; "
              "needs a small-size cut below 24 px."),
]

PACKAGES = [
    dict(key="ember", name="Ember", tagline="Warm black, one vermilion accent, grotesk voice",
         mood="Confident and direct. The reference direction, tightened.",
         typeface="Inter Tight + JetBrains Mono",
         chips=["#120C0A", "#1B120E", "#D8440B", "#E9CBA9", "#FAF5EE"]),
    dict(key="clay", name="Clay", tagline="Warm brown-black, muted terracotta, serif voice",
         mood="Editorial and premium. Reads as a considered consultancy, not a vendor.",
         typeface="Newsreader + Inter Tight + JetBrains Mono",
         chips=["#1A1310", "#241A15", "#C0603A", "#DFC7AC", "#F7F1E7"]),
    dict(key="forge", name="Forge", tagline="Cool near-black, brass accent, mono-led voice",
         mood="Engineering-forward. Looks like something that was built, not styled.",
         typeface="JetBrains Mono + Inter Tight",
         chips=["#0C1013", "#141A1E", "#C9973F", "#CFC6B4", "#F4F2ED"]),
]

DOMAIN_NOTES = {
    "99.systems": "Recommended primary. Short, and it says the thing the story says: you own systems, not projects.",
    "99.software": "The literal option. Clear, but a little flat and descriptive.",
    "99.engineering": "Good signal for seniority; longer to type.",
    "99.build": "Verb-like and confident. Weakens if the offer ever moves beyond builds.",
    "99.consulting": "Safe, but sounds like an agency and invites the reseller read.",
    "99.solutions": "Available, but “solutions” is the most worn word in this category.",
    "99.team": "Warm and human; says small team, which is true.",
    "99.partners": "Plural-implies scale the team does not have yet.",
    "ninety-nine.dev": "Spelled out. Longer, but unambiguous on a call.",
    "ninetynine.mt": "Local Maltese presence. Worth holding defensively even if unused.",
    "99.mt": "Two-character .mt is generally not issued — confirm with NIC Malta before relying on it.",
}


def domain_rows():
    data = json.load(open(ROOT / "research" / "domain-check.json"))
    free = [d for d in data if d["status"] == "likely FREE"]
    taken = [d for d in data if d["status"] == "TAKEN"]
    order = ["99.systems", "99.software", "99.engineering", "99.build", "99.team",
             "99.solutions", "99.consulting", "99.partners", "ninety-nine.dev", "99.mt", "ninetynine.mt"]
    free.sort(key=lambda d: order.index(d["domain"]) if d["domain"] in order else 99)
    taken.sort(key=lambda d: d["domain"])
    rows = ""
    for d in free:
        rows += (f'<tr><td>{d["domain"]}</td><td><span class="pill free">unregistered</span></td>'
                 f'<td>{DOMAIN_NOTES.get(d["domain"], "—")}</td></tr>')
    for d in taken:
        rows += (f'<tr><td>{d["domain"]}</td><td><span class="pill taken">registered</span></td>'
                 f'<td>Registered {d["registered"] or "earlier"} — not available.</td></tr>')
    return rows, len(free), len(taken)


def main():
    logo_cards = ""
    for m in MARKS:
        logo_cards += f"""
      <button class="logo-card" type="button" data-logo="{m['id']}" data-name="{m['name']}"
              data-recommended="{'true' if m.get('rec') else 'false'}" aria-pressed="false">
        <span class="tick">&#10003; chosen</span>
        <div class="stage">{m['svg']}</div>
        <div class="nm"><b>{m['name']}</b><span>{m['role']}</span></div>
        <p><strong style="color:var(--sand);font-weight:600">{m['idea']}</strong> {m['note']}</p>
      </button>"""

    pkg_cards = ""
    for p in PACKAGES:
        chips = "".join(f'<i style="background:{c}"></i>' for c in p["chips"])
        pkg_cards += f"""
      <button class="pkg" type="button" data-pkg="{p['key']}" aria-pressed="false">
        <div class="nm"><b>{p['name']}</b><span>package</span></div>
        <p class="tagline">{p['tagline']}</p>
        <p class="mood">{p['mood']}</p>
        <div class="chips">{chips}</div>
        <p class="typeface">{p['typeface']}</p>
      </button>"""

    rows, nfree, ntaken = domain_rows()

    doc = f"""<!doctype html>
<html lang="en" data-package="ember">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>99 — brand book</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72;700&family=Space+Grotesk:wght@400;500;700&display=swap">
<script src="assets/theme.js"></script>
<link rel="stylesheet" href="assets/book.css">
</head>
<body>

<div class="decisionbar"><div class="wrap">
  <span class="sum">
    <span>Logo <b id="sum-logo">—</b></span>
    <span>Package <b id="sum-pkg">—</b></span>
  </span>
  <span class="spacer"></span>
  <a class="btn btn-ghost" href="#submit">Review &amp; submit</a>
  <a class="btn btn-accent" id="bar-submit" href="#submit" disabled>Submit choice</a>
</div></div>

<header class="book"><div class="wrap">
  <p class="eyebrow">99 &nbsp;/&nbsp; brand book v1</p>
  <h1>One to ninety-nine.<br><span class="dim">Choose the mark, choose the voice.</span></h1>
  <p class="lede" style="margin-top:22px">Everything on this page is live. Switching a package re-skins the whole
  document <em>and</em> the mock website below, because colour and type are one decision here, not two.</p>
  <p class="small" style="margin-top:14px">Choose the mark and system from the control in the header, then scroll to
  submit your choice. Everything on this page re-skins live.</p>
  <span data-brand-control></span>
</div></header>

<section id="story"><div class="wrap">
  <p class="eyebrow">01 — The story</p>
  <h2>Most firms start counting at the launch.<br><span class="dim">We start at one.</span></h2>
  <div class="two" style="margin-top:26px">
    <div>
      <p>Before the launch there is the first conversation, the scoping, the architecture, the hosting plan — the part
      nobody is watching, and the part that decides whether the thing works at all.</p>
      <p><strong>99 is the last number you need to count to.</strong> It is the point where a system stops being a
      project and starts being infrastructure — and it is the point where most firms leave. We are not arriving there.
      We were there at one, at forty, at ninety.</p>
      <p>One to ninety-nine: scoping, software, hosting, improvement and growth. A small senior team, so nothing is
      thrown over a wall — there is no wall. One accountable name for the whole count.</p>
      <p>And when a count ends, the next one starts. Continual improvement is not an upsell; it is the next count.</p>
      <p class="small">We never claim 100. Not because we are incomplete, but because there is always one more count
      worth starting.</p>
    </div>
    <div>
      <blockquote><p>For companies that want to digitalise how they actually work — and stay ahead of the ones that
      won't — 99 is a small senior team that builds solutions right and improves them continually: scoping,
      software, hosting, improvement and growth, under one accountable name.</p></blockquote>
      <div class="pillars-stack" style="margin-top:26px">
        <div class="pillar"><h3>Engineered</h3><p>Exactness is the argument. Drawn geometry, real numbers,
        nothing decorative.</p></div>
        <div class="pillar"><h3>Whole count</h3><p>Scope to enhancement, build to hosting. Nothing handed off,
        nothing left at the launch.</p></div>
        <div class="pillar"><h3>Human</h3><p>Precise never means cold. Sentence case, plain words, warm palette.</p></div>
      </div>
    </div>
  </div>
</div></section>

<section id="logos"><div class="wrap">
  <p class="eyebrow">02 — Logo directions</p>
  <h2>Four directions.<br><span class="dim">Pick one.</span></h2>
  <p class="lede" style="margin-top:16px">All four read as “ninety-nine” without a wordmark and survive a single
  colour. They differ in what they ask the rest of the identity to do. <strong>02 and 03 answer the same question —
  choose one of those two, not both.</strong></p>
  <div class="logo-grid" style="margin-top:26px">{logo_cards}
  </div>
  <p class="small" style="margin-top:22px">Marks are drawn as filled vector paths — no font is used inside any logo,
  so nothing reflows on a machine without the typeface.</p>
</div></section>

<section id="packages"><div class="wrap">
  <p class="eyebrow">03 — Package</p>
  <h2>Colour and type travel together.</h2>
  <p class="lede" style="margin-top:16px">A package is a palette plus a type pairing, sold as one decision. That is not
  a gimmick — it is because two things are true at once.</p>
  <div class="two" style="margin-top:24px">
    <div class="notice"><strong style="color:var(--sand)">1 · A hard constraint.</strong> An accent has to clear
    contrast on the ground it sits on. Forge's brass accent measures <em>2.35:1</em> on a light ground — it fails even
    the large-text threshold. So each package carries <em>two</em> accent tokens: one for Ink, one for Paper, and both
    are measured rather than estimated.</div>
    <div class="notice"><strong style="color:var(--sand)">2 · A soft constraint.</strong> The typeface sets the voice —
    grotesk reads neutral and confident, serif reads editorial and premium, mono reads engineering-forward. A palette
    that disagrees with the typeface makes the brand look like two companies. These three pairings are opinionated on
    purpose.</div>
  </div>
  <div class="pkg-grid" style="margin-top:26px">{pkg_cards}
  </div>
</div></section>

<section id="palette"><div class="wrap">
  <p class="eyebrow">04 — Palette &amp; type, as applied</p>
  <h2>What this package actually produces.</h2>
  <p class="small" style="margin-top:12px">Live values for the selected package. Switch a package above and these
  change.</p>
  <p class="mono small" id="fontnames" style="margin-top:16px;color:var(--sand)"></p>
  <div class="sw" id="swatches" style="margin-top:22px"></div>
  <div class="pkg ratios" style="border:0;background:none;padding:0;margin-top:18px;cursor:default" tabindex="-1">
    <div class="ratios" id="ratios" style="margin-top:0"></div>
  </div>
  <h3 style="margin-top:44px">Type scale</h3>
  <div class="spec" style="margin-top:14px">
    <div class="row"><span class="d1">One to ninety-nine.</span><span>display / 2.5rem</span></div>
    <div class="row"><span class="d2">99 is where you stop counting.</span><span>display / 1.7rem</span></div>
    <div class="row"><span class="b1">We will tell you honestly whether it is a scoping job, a build, or something a
    spreadsheet already solved.</span><span>body / 1rem</span></div>
    <div class="row"><span class="m1">Scoping · Software · Hosting · Improvement · Growth</span>
      <span>mono / 0.76rem / 0.16em</span></div>
  </div>
</div></section>

<section id="apps"><div class="wrap">
  <p class="eyebrow">05 — Applications</p>
  <h2>Where it has to work.</h2>
  <div class="apps" style="margin-top:26px">
    <div class="app"><p class="lab">App tile</p><div class="box tile" data-inject></div></div>
    <div class="app"><p class="lab">On paper</p><div class="box paper" data-inject></div></div>
    <div class="app"><p class="lab">Business card</p><div class="box">
      <div class="card-elem" data-inject style="border-color:transparent;padding:0"></div>
      <div class="card-elem" style="margin-top:10px">
        <span style="color:var(--sand)">Rudie<br>99 · Malta<br>rudie@agilexplus.com</span></div>
    </div></div>
    <div class="app"><p class="lab">At size</p><div class="box" style="gap:16px;display:flex">
      <span class="ladder"><span class="sz" style="width:64px;height:64px" data-inject></span><small>64</small></span>
      <span class="ladder"><span class="sz" style="width:32px;height:32px" data-inject></span><small>32</small></span>
      <span class="ladder"><span class="sz" style="width:16px;height:16px" data-inject></span><small>16</small></span>
    </div></div>
  </div>
  <p class="small" style="margin-top:18px">Showing <strong data-inject-name style="color:var(--sand)">—</strong>.
  Change the logo above and these update.</p>
</div></section>

<section id="website"><div class="wrap">
  <p class="eyebrow">06 — Mock website</p>
  <h2>The identity in use.</h2>
  <p class="lede" style="margin-top:16px">Three real pages built on the selected package — not boxes. They re-skin
  with the package, so you are choosing the site as well as the mark.</p>
  <div class="frames" style="margin-top:24px">
    <div class="frame-wrap">
      <div class="bar"><span>home.html</span><a href="site/home" target="_blank" rel="noopener">open full page &rarr;</a></div>
      <iframe data-site="site/home" title="99 mock website — home" loading="lazy"></iframe>
    </div>
    <div class="frame-wrap">
      <div class="bar"><span>services.html</span><a href="site/services" target="_blank" rel="noopener">open full page &rarr;</a></div>
      <iframe data-site="site/services" title="99 mock website — services" loading="lazy" class="tall"></iframe>
    </div>
    <div class="frame-wrap">
      <div class="bar"><span>about.html</span><a href="site/about" target="_blank" rel="noopener">open full page &rarr;</a></div>
      <iframe data-site="site/about" title="99 mock website — about" loading="lazy"></iframe>
    </div>
  </div>
  <p class="small" style="margin-top:18px">Copy is written to the story and invents no clients, certifications or
  performance statistics. The forms on those pages are demos.</p>
</div></section>

<section id="collateral"><div class="wrap">
  <p class="eyebrow">07 — Collateral &amp; documents</p>
  <h2>One identity,<br><span class="dim">on every sheet of paper.</span></h2>
  <p class="lede" style="margin-top:16px">The client's chosen logo and package drive these too: a mock business card,
  email signature, letterhead, proposal, quote and invoice — all live, all re-skinnable.</p>
  <div class="frame-wrap" style="margin-top:24px">
    <div class="bar"><span>collateral.html</span><a href="collateral" target="_blank" rel="noopener">open full page &rarr;</a></div>
    <iframe data-site="collateral" class="tall" title="99 — collateral, live" loading="lazy"></iframe>
  </div>
</div></section>

<section id="domain"><div class="wrap">
  <p class="eyebrow">08 — Domain</p>
  <h2>The name is short. The domains are not.</h2>
  <p class="lede" style="margin-top:16px">Checked against RDAP: {nfree} of the candidates are unregistered and
  {ntaken} are taken. Availability moves hourly — confirm at a registrar before you rely on any of these.</p>
  <p class="notice" style="margin-top:18px"><strong style="color:var(--sand)">Recommendation:</strong> hold
  <strong>99.systems</strong> as the primary and <strong>ninetynine.mt</strong> defensively for the local market.
  A bare numeral is hard to protect as a trademark, so the domain and the wordmark do more of the work than usual —
  budget for a professional clearance search on the name before launch.</p>
  <table style="margin-top:26px"><thead><tr><th>Domain</th><th>Status</th><th>Why</th></tr></thead>
  <tbody>{rows}</tbody></table>
  <p class="small" style="margin-top:16px">Sources: RDAP lookups recorded in
  <code>brand/research/domain-check.json</code>. “Unregistered” means the registry returned no record at check time.</p>
</div></section>

<section id="submit"><div class="wrap">
  <p class="eyebrow">09 — Your choice</p>
  <h2>Send it back.</h2>
  <p class="lede" style="margin-top:16px">Your logo and package selections are already carried into this form. Add
  your name and email and submit — it goes straight to the 99 team at rudie@agilexplus.com.</p>
  <form id="choose-form" style="margin-top:26px;max-width:640px">
    <div class="choices">
      <div class="field"><label for="f-name">Your name *</label>
        <input id="f-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="f-email">Email *</label>
        <input id="f-email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="f-company">Company</label>
        <input id="f-company" name="company" autocomplete="organization"></div>
      <div class="field"><label>Selections</label>
        <input value="" id="f-summary" readonly aria-label="Selected logo and package"></div>
    </div>
    <div class="field" style="margin-top:14px"><label for="f-notes">Notes / changes you'd like</label>
      <textarea id="f-notes" name="notes" placeholder="e.g. I like the mark but want the accent softer"></textarea></div>
    <div class="submit-row">
      <button class="btn btn-accent" id="submit-btn" type="submit">Submit choice</button>
      <span class="status" id="status" role="status"></span>
    </div>
    <p class="small" style="margin-top:14px">If the button does not work for any reason, email
    <a href="mailto:rudie@agilexplus.com">rudie@agilexplus.com</a> with your mark and package.</p>
  </form>
</div></section>

<footer class="foot"><div class="wrap">
  <p style="margin:0 0 8px">99 — brand book v1. Marks are filled vector paths only; no live text, no rasters,
  no filters. Palette contrast is measured per package, not estimated.</p>
  <p style="margin:0">Open items before launch: professional trademark search (the name is close to 99x and
  99designs), print/Pantone proofing, a reversed-weight optical pass, and a small-size cut for The Seal.</p>
</div></footer>

<script src="assets/book.js"></script>
</body></html>
"""
    (SITE / "index.html").write_text(doc)
    print(f"wrote site/index.html  ({len(doc)/1024:.0f} KB) — {nfree} free / {ntaken} taken domains")


main()
