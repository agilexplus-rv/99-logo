#!/usr/bin/env python3
"""Build the three final 99 logos in the brand palette, plus the client presentation page.

    python3 brand/build-final.py   ->  brand/final-three/*.svg  +  docs/final.html
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent
OUT = ROOT / "final-three"
OUT.mkdir(exist_ok=True)

INK, EMBER, DEEP, SAND, PAPER, SLATE = "#120C0A", "#D8440B", "#6E1F06", "#E9CBA9", "#FAF5EE", "#8A8078"

MARKS = [
    dict(id="01", slug="the-sign", name="The Sign", source="opus-round1/concepts/a-closing-quote.svg",
         role="Idea-led · typographic sign",
         idea="A closing quotation mark is a 99. It is the sign that ends the statement.",
         why="The name is the symbol, so a lockup has no redundant \u201c9 + 99\u201d. Best small-size behaviour of the three: "
             "it still reads as punctuation at 16 px.",
         risk="Quotation marks are common glyphs. Ownership comes from the drawn tail and consistent use.",
         pick="Pick it if you want the name itself to be the symbol."),
    dict(id="02", slug="the-wordmark", name="The Wordmark", source="sol-round1/concepts/a-cut-and-curve.svg",
         role="Craft-led · custom wordmark",
         idea="Two drawn numerals: round bowls, decisive swept tails, flat-cut terminals.",
         why="The plainest reading of the name, and the warmest. Nothing to decode, so it survives being printed "
             "small on an invoice footer.",
         risk="Quiet. It asks the rest of the identity to carry the personality.",
         pick="Pick it if you want quiet authority and zero misreading."),
    dict(id="03", slug="the-sign-off", name="Sign-off", source="opus-round1/concepts/b-sign-off.svg",
         role="Craft-led \u00b7 underlined wordmark",
         idea="The last stroke keeps going and underlines both numerals: the work is underlined, then signed off.",
         why="The underline is the only element carrying meaning rather than decoration \u2014 it reads as a signature "
             "line and gives the wordmark a baseline to sit on in dark UI.",
         risk="An underline can also read as a hyperlink or as emphasis. It competes directly with 02 for the same "
              "role \u2014 pick one of the two, not both.",
         pick="Pick it if you want the wordmark to end on a line rather than on a curve."),
    dict(id="04", slug="the-seal", name="The Seal", source="gemini-pro-round1/concepts/b-keystone-seal.svg",
         role="Strategy-led · negative-space emblem",
         idea="Two negative-space 9s carved through one solid, chamfered monolith.",
         why="Reads as finished and sealed \u2014 the A-to-Z promise as a single mass. Works as an app icon, avatar or "
             "stamp with no extra container.",
         risk="Dense. The channels thin below 24 px, so it needs a small-size cut; reversed weight needs a nudge.",
         pick="Pick it if you want a mark that doubles as an icon and a stamp."),
]

VARIANTS = {  # name -> fill colour
    "ember": EMBER, "ink": INK, "paper": PAPER, "sand": SAND,
}


def recolour(raw, fill):
    raw = re.sub(r'fill="#000(000)?"', f'fill="{fill}"', raw)
    raw = re.sub(r'\sfill="(?!none)[^"]*"(?=[^>]*/>)', f' fill="{fill}"', raw)
    return raw


def inline(raw):
    raw = re.sub(r'<\?xml[^>]*\?>', "", raw)
    raw = re.sub(r"\s(width|height)=\"\d+\"", "", raw, count=2)
    return raw[raw.index("<svg"):]


def variants(m):
    src = (REPO / "brand" / m["source"]).read_text()
    made = {}
    for name, fill in VARIANTS.items():
        svg = recolour(src, fill)
        (OUT / f'{m["slug"]}-{name}.svg').write_text(svg)
        made[name] = svg
    return made


CSS = """
:root{--ink:#120C0A;--ember:#D8440B;--deep:#6E1F06;--sand:#E9CBA9;--paper:#FAF5EE;--slate:#8A8078;
--line:rgba(233,203,169,.16);--mono:ui-monospace,SFMono-Regular,Menlo,monospace}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--ink);color:var(--paper);
font:16px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Inter Tight,Inter,Roboto,Helvetica,Arial,sans-serif;
-webkit-font-smoothing:antialiased}
.wrap{max-width:1120px;margin:0 auto;padding:0 24px}
.eyebrow{font:600 .72rem/1 var(--mono);letter-spacing:.18em;text-transform:uppercase;color:var(--ember)}
h1{font-size:clamp(2.4rem,6vw,4.4rem);line-height:.98;letter-spacing:-.035em;margin:.3em 0 0;font-weight:640}
h1 .dim,h2 .dim{color:var(--slate)}
h2{font-size:clamp(1.5rem,3vw,2.2rem);letter-spacing:-.02em;margin:0 0 14px;font-weight:620;line-height:1.1}
h3{font-size:1.1rem;margin:0}
p{margin:0 0 1em}
.lede{font-size:1.1rem;color:#d8ccc3;max-width:62ch}
header{padding:80px 0 56px;border-bottom:1px solid var(--line)}
section{padding:64px 0;border-bottom:1px solid var(--line)}
.grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px}
.card{border:1px solid var(--line);border-radius:18px;padding:22px;background:#170F0C}
.card .cap{font:600 .68rem/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--slate);
margin-bottom:14px}
.stage{border-radius:12px;display:grid;place-items:center;padding:26px;min-height:170px}
.on-ink{background:var(--ink);border:1px solid var(--line)}
.on-paper{background:var(--paper)}
.on-ember{background:var(--ember)}
.stage svg{width:100%;height:auto;max-height:160px;display:block}
.opts{display:grid;gap:26px}
.opt{display:grid;grid-template-columns:1.05fr 1fr;gap:34px;align-items:center;
border:1px solid var(--line);border-radius:22px;padding:30px;background:linear-gradient(180deg,#1A110D,#150E0B)}
@media(max-width:820px){.opt{grid-template-columns:1fr}}
.opt .num{font:700 4rem/1 var(--mono);color:var(--ember);letter-spacing:-.04em}
.opt h3{font-size:1.9rem;letter-spacing:-.02em;margin:0 0 4px}
.opt .role{font:600 .7rem/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--slate);
margin:0 0 16px}
.opt dl{margin:16px 0 0;display:grid;gap:9px}
.opt dt{font:600 .66rem/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--ember)}
.opt dd{margin:2px 0 0;color:#d8ccc3;font-size:.95rem}
.sizes{display:flex;align-items:flex-end;gap:18px;margin-top:22px;padding-top:18px;border-top:1px solid var(--line)}
.sizes figure{margin:0;text-align:center}
.sizes figcaption{font:600 .62rem/1 var(--mono);color:var(--slate);margin-top:7px}
.sizes .box{background:var(--sand);border-radius:4px;display:grid;place-items:center}
.sizes .box svg{display:block}
.sw{display:grid;grid-template-columns:repeat(auto-fill,minmax(146px,1fr));gap:14px}
.sw div .chip{height:78px;border-radius:11px;border:1px solid var(--line)}
.sw b{display:block;margin-top:9px;font-size:.9rem}
.sw code{font:600 .78rem/1 var(--mono);color:var(--ember)}
.sw span{display:block;color:var(--slate);font-size:.8rem;margin-top:3px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:34px}
@media(max-width:760px){.two{grid-template-columns:1fr}}
.quote{border-left:2px solid var(--ember);padding-left:22px;font-size:1.16rem;color:#e6dbd4}
.hl{color:var(--ember);font-weight:600}
.tbl{width:100%;border-collapse:collapse;font-size:.94rem}
.tbl th{text-align:left;font:600 .66rem/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;
color:var(--slate);padding:0 14px 10px 0;border-bottom:1px solid var(--line)}
.tbl td{padding:13px 14px 13px 0;border-bottom:1px solid var(--line);vertical-align:top;color:#d8ccc3}
.tbl td:first-child{color:var(--paper);font-weight:600;white-space:nowrap}
.typerow{display:flex;align-items:baseline;gap:18px;flex-wrap:wrap;padding:14px 0;border-bottom:1px solid var(--line)}
.typerow .big{font-size:2.1rem;letter-spacing:-.03em;font-weight:620}
.typerow .mono{font:600 .8rem/1 var(--mono);letter-spacing:.16em;color:var(--sand)}
footer{padding:44px 0 80px;color:var(--slate);font-size:.88rem}
a{color:var(--sand)}
.nav{position:sticky;top:0;z-index:9;background:rgba(18,12,10,.9);backdrop-filter:blur(10px);
border-bottom:1px solid var(--line);padding:12px 0;font:600 .78rem/1 var(--mono)}
.nav .wrap{display:flex;gap:22px;flex-wrap:wrap}
.nav a{color:var(--sand);text-decoration:none;letter-spacing:.04em}
.nav a:hover{color:var(--ember)}
"""


def page(made):
    def stage(svg, cls, cap):
        return f'<div class="card"><p class="cap">{cap}</p><div class="stage {cls}">{inline(svg)}</div></div>'

    cards = "".join(f"""
      <article class="opt" id="{m['slug']}">
        <div>
          <p class="num">{m['id']}</p>
          <h3>{m['name']}</h3>
          <p class="role">{m['role']}</p>
          <div class="stage on-ink">{inline(made[m['slug']]['ember'])}</div>
          <div class="sizes">
            <figure><div class="box" style="width:64px;height:64px">{inline(made[m['slug']]['ink']).replace('<svg','<svg style="width:64px;height:64px"')}</div><figcaption>64 px</figcaption></figure>
            <figure><div class="box" style="width:32px;height:32px">{inline(made[m['slug']]['ink']).replace('<svg','<svg style="width:32px;height:32px"')}</div><figcaption>32 px</figcaption></figure>
            <figure><div class="box" style="width:16px;height:16px">{inline(made[m['slug']]['ink']).replace('<svg','<svg style="width:16px;height:16px"')}</div><figcaption>16 px</figcaption></figure>
          </div>
        </div>
        <div>
          <dl>
            <dt>The idea</dt><dd>{m['idea']}</dd>
            <dt>Why it carries the story</dt><dd>{m['why']}</dd>
            <dt>Honest risk</dt><dd>{m['risk']}</dd>
            <dt>Decision</dt><dd>{m['pick']}</dd>
          </dl>
        </div>
      </article>""" for m in MARKS)

    colour_cards = "".join(
        stage(made["the-sign"][v], cls, cap) for v, cls, cap in
        (("ember", "on-ink", "Ember on Ink"), ("ink", "on-paper", "Ink on Paper"),
         ("paper", "on-ink", "Paper on Ink"), ("ink", "on-ember", "Ink on Ember"))
    )

    swatches = "".join(
        f'<div><div class="chip" style="background:{h}"></div><b>{n}</b><code>{h}</code><span>{r}</span></div>'
        for n, h, r in [("Ink", INK, "default ground"), ("Ember", EMBER, "single accent"),
                        ("Deep Ember", DEEP, "pressed / print"), ("Sand", SAND, "warm light"),
                        ("Paper", PAPER, "light ground"), ("Slate", SLATE, "tertiary text")])

    return f"""<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>99 — brand story and final logos</title><style>{CSS}</style></head>
<body>
<div class="nav"><div class="wrap">
  <a href="#story">Story</a><a href="#palette">Palette</a><a href="#type">Type</a>
  <a href="#logos">Final logos</a><a href="#usage">Usage</a>
</div></div>

<header><div class="wrap">
  <p class="eyebrow">99 &nbsp;/&nbsp; brand proposal v1</p>
  <h1>One to<br><span class="dim">ninety-nine.</span></h1>
  <p class="lede" style="margin-top:22px">Four final directions, one story. The marks are drawn, the palette is set against the website
  direction you sent, and the type is chosen. What is left is the decision.</p>
</div></header>

<section id="story"><div class="wrap">
  <p class="eyebrow">The story</p>
  <h2>Most firms start counting<br><span class="dim">at the launch. We start at one.</span></h2>
  <div class="two">
    <div>
      <p>Most software firms start counting at the launch. Before that there is the first conversation, the
      scoping, the architecture, the hosting plan &mdash; the part nobody is watching, and the part that decides
      whether the thing works at all.</p>
      <p><strong>We start at one.</strong></p>
      <p><span class="hl">99 is the last number you need to count to.</span> It is the point where a system stops
      being a project and starts being infrastructure &mdash; and it is the point where most firms leave. We are not
      arriving there. We were there at one, at forty, at ninety.</p>
      <p>One to ninety-nine: scoping, engineering, hosting, maintenance, enhancement. A small senior team, so nothing
      is thrown over a wall &mdash; there is no wall. The people who scope your work are the people who build it, host
      it and keep it alive. One accountable name for the whole count.</p>
      <p>And when a count ends, the next one starts. Enhancements are not an afterthought or an upsell &mdash; they
      are the next count, and they are part of the job we signed up for.</p>
      <p style="color:var(--slate);font-size:.92rem">We never claim 100. Not because we are incomplete, but because
      there is always one more count worth starting.</p>
    </div>
    <div>
      <p class="quote">For companies that want to digitalise how they actually work &mdash; and stay ahead of the ones
      that won't &mdash; <strong>99</strong> is a small senior team that owns the <em>whole count</em>: scoping,
      software, hosting, maintenance and enhancement, under one accountable name, from the first conversation to the
      last number &mdash; and the next one after it.</p>
      <div class="grid3" style="margin-top:26px">
        <div class="card"><p class="cap">Pillar 01</p><h3>Engineered</h3>
          <p style="color:#d8ccc3;font-size:.92rem;margin:.4em 0 0">Exactness is the argument. Drawn geometry, real
          numbers, hairline rules, nothing decorative.</p></div>
        <div class="card"><p class="cap">Pillar 02</p><h3>Whole count</h3>
          <p style="color:#d8ccc3;font-size:.92rem;margin:.4em 0 0">Scope to enhancement, build to hosting. One team,
          one contract, one name. Nothing handed off, nothing left at the launch.</p></div>
        <div class="card"><p class="cap">Pillar 03</p><h3>Human</h3>
          <p style="color:#d8ccc3;font-size:.92rem;margin:.4em 0 0">Precise never means cold. Sentence case, plain
          words, warm palette.</p></div>
      </div>
    </div>
  </div>
  <div class="card" style="margin-top:26px;border-color:rgba(216,68,11,.4)">
    <p class="cap" style="color:var(--ember)">One naming note &mdash; a direction we rejected</p>
    <p style="color:#d8ccc3;margin:0 0 8px">The first draft of this story leaned on an alphabetic frame &mdash;
    the idea of covering the whole range from the first letter to the last. It is out.
    <strong>AtoZ Electronics</strong> is an established Maltese retailer with shops in Attard and PAVI Qormi; in this
    market that territory is theirs, and a software firm borrowing it reads as a reseller, which is the opposite of
    the positioning.</p>
    <p style="color:var(--slate);margin:0">The replacement, &ldquo;<strong>One to ninety-nine</strong>&rdquo;, claims
    the same coverage without the collision, ties the claim to the company's own name instead of a borrowed idiom, and
    fixes a second problem: the earlier wording made the offer sound like post-launch support, when it is the whole
    lifecycle.</p>
  </div>
</div></section>

<section id="palette"><div class="wrap">
  <p class="eyebrow">Palette v1</p>
  <h2>Warm black.<br><span class="dim">One ember. One cream.</span></h2>
  <p class="lede" style="margin-bottom:26px">Checked against 99x, Thoughtworks, 8th Light and Made Tech: the category
  is cool neutrals with one accent, or a bright multi-accent spectrum. The warm-dark-plus-ember territory is
  unoccupied.</p>
  <div class="sw">{swatches}</div>
  <p style="color:var(--slate);font-size:.9rem;margin-top:22px">Ember never carries body text. Ink and Paper are the
  only grounds. One accent per screen. Measured: Paper on Ink 17.9:1, Sand on Ink 12.5:1, Slate on Ink 5.0:1,
Ember on Ink 4.4:1, <strong>Ember on Paper 4.1:1</strong> &mdash; so Ember never sets body text on either ground;
large text and non-text UI only.</p>
</div></section>

<section id="type"><div class="wrap">
  <p class="eyebrow">Typography</p>
  <h2>Inter Tight <span class="dim">+</span> JetBrains Mono</h2>
  <div class="typerow"><span class="big">Finished is a service.</span><span style="color:var(--slate)">Inter Tight,
  620, &minus;0.03em</span></div>
  <div class="typerow"><span class="big" style="color:var(--slate);font-weight:400">the detail, one shade quieter</span>
  <span style="color:var(--slate)">the two-tone device from your reference</span></div>
  <div class="typerow"><span class="mono">ONE TO NINETY-NINE &middot; THE WHOLE COUNT &middot; 24/7</span>
  <span style="color:var(--slate)">JetBrains Mono, 600, 0.16em tracking</span></div>
  <p style="color:var(--slate);font-size:.9rem;margin-top:20px">Both OFL-licensed. No font is used inside any logo
  &mdash; every mark is drawn as filled paths, so nothing reflows on a machine without the typeface.</p>
</div></section>

<section id="logos"><div class="wrap">
  <p class="eyebrow">Final directions</p>
  <h2>Choose one.<br><span class="dim">02 and 03 answer the same question &mdash; take one of them.</span></h2>
  <p class="lede" style="margin-bottom:30px">All four read as &ldquo;ninety-nine&rdquo; with no wordmark and survive one colour. They differ in what they ask the rest of the identity to do.</p>
  <div class="opts">{cards}</div>
</div></section>

<section id="usage"><div class="wrap">
  <p class="eyebrow">Colour application &mdash; The Sign, as an example</p>
  <h2>Four grounds, no exceptions</h2>
  <div class="grid3">{colour_cards}</div>
  <table class="tbl" style="margin-top:34px">
    <tr><th>If you want</th><th>Choose</th></tr>
    <tr><td>Maximum distinctiveness</td><td>01 &mdash; The Sign. The only one where the name and the symbol are the
      same object.</td></tr>
    <tr><td>Zero misreading risk, softest</td><td>02 &mdash; The Wordmark.</td></tr>
    <tr><td>Zero misreading risk, most structured</td><td>03 &mdash; Sign-off. Shares a role with 02: pick one.</td></tr>
    <tr><td>A mark that works as an icon and a stamp</td><td>04 &mdash; The Seal. Needs a small-size cut below
      24&nbsp;px.</td></tr>
  </table>
</div></section>

<footer><div class="wrap">
  Marks are filled vector paths only &mdash; no live text, no rasters, no filters. Masters and colour variants:
  <code>brand/final-three/</code>. Structural audit passes with no failures; that is a file check, not a judgement of
  quality. <strong>No trademark clearance has been done</strong> &mdash; the name is close to
  <a href="https://99x.io/">99x</a> and <a href="https://99designs.com/">99designs</a>; commission a professional
  search before launch.
</div></footer>
</body></html>
"""


if __name__ == "__main__":
    made = {m["slug"]: variants(m) for m in MARKS}
    (REPO / "docs" / "final.html").write_text(page(made))
    n = len(list(OUT.glob("*.svg")))
    print(f"wrote {n} SVG variants in brand/final-three/ and docs/final.html")
