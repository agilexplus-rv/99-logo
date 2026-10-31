#!/usr/bin/env python3
"""Build a self-contained chooser page for every 99 logo concept generated so far.

    python3 brand/build-gallery.py     ->  brand/index.html

Inline SVG only (no external assets), so the page works as a local file and on Pages.
"""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# verdict: liked / rejected / earlier  (the client's current opinion, from chat)
CONCEPTS = [
    # slot, round, file, name, type, idea, verdict, note
    ("opus", "Opus · round 1", "opus-round1/concepts/a-closing-quote.svg", "Closing Quote",
     "Typographic sign",
     "A closing quotation mark is literally a 99 — the sign that ends the statement.",
     "liked", "Strongest at 16 px. The name is the symbol, so no \u201csymbol + 99\u201d repetition."),
    ("opus", "Opus · round 1", "opus-round1/concepts/b-sign-off.svg", "Sign-off",
     "Custom wordmark",
     "The last stroke underlines the work: one line, signed off, delivered.",
     "liked", "Simplest of the set. Watch that the underline doesn't read as a hyperlink."),
    ("opus", "Opus · round 1", "opus-round1/concepts/c-turnkey.svg", "Turnkey",
     "Pictorial letterform",
     "The second 9's stem carries key bits — handed over, ready to turn.",
     "rejected", "You rejected this. Kept on the page for the record."),

    ("gemini", "Gemini Pro · round 1", "gemini-pro-round1/concepts/a-facet-99.svg", "Facet 99",
     "Custom architectural numerals",
     "Machined octagonal numerals whose stems resolve into 45° precision-cut footings.",
     "liked", "Engineered and authoritative. Reads cleanly at every size."),
    ("gemini", "Gemini Pro · round 1", "gemini-pro-round1/concepts/b-keystone-seal.svg", "Keystone Seal",
     "Negative-space emblem",
     "Twin negative-space 9s carved through a solid 45°-chamfered monolith.",
     "liked", "Works as a tile or seal with no extra container. Dense, so check reversed at 16 px."),
    ("gemini", "Gemini Pro · round 1", "gemini-pro-round1/concepts/c-tangent-99.svg", "Arc 99",
     "Geometric wordmark",
     "Tangent-continuous circular bowls and J-stems, finished with 45° terminals.",
     "liked", "The Arc direction you liked. Warmest and most Swiss of the numeral marks."),

    ("sol", "Sol · round 1", "sol-round1/concepts/a-cut-and-curve.svg", "Cut & Curve",
     "Custom wordmark",
     "Two custom numerals: round bowls, decisive swept tails, flat-cut terminals.",
     "liked", "Most immediate reading of the name. Quiet and credible."),
    ("sol", "Sol · round 1", "sol-round1/concepts/b-counterform.svg", "Counterform",
     "Negative-space stencil",
     "Two open-bottom 9s cut from one architectural mass.",
     "liked", "Boldest figure/ground of the set. Needs a moment to decode."),
    ("sol", "Sol · round 1", "sol-round1/concepts/c-joint.svg", "Joint",
     "Compact ligature",
     "Two numeral bodies joined diagonally into one compact silhouette.",
     "liked", "Most abstract. Give it 32 px or more, or a small-size cut."),

    ("first", "first round · superseded", "concepts/a-symbol.svg", "Delivered Nine",
     "Letterform + checkmark",
     "The 9's tail resolves into a check — the build loop closes and the work ships.",
     "earlier", "Superseded. The checkmark is a literal \u201cdone\u201d cliché."),
    ("first", "first round · superseded", "concepts/b-symbol.svg", "Completion Ring",
     "Abstract symbol",
     "A closed loop plus a detached check: the solution leaves the software.",
     "earlier", "Superseded. Read as a to-do app icon."),
    ("first", "first round · superseded", "concepts/c-wordmark.svg", "Radial 99",
     "Wordmark",
     "Two engineered nines, both stems cut at exactly 45°.",
     "earlier", "Superseded by the later numeral marks."),
]

# Competitor brand colour extraction (brand/research/competitor-branding.json)
COMPETITORS = [
    ("99x", "software engineering", ["#4A3255", "#D9B9B8", "#C07B72", "#BC8E58", "#DBDFC9", "#A2B372"], "plum + sage, desaturated, mid-century"),
    ("Thoughtworks", "global consultancy", ["#BD4257", "#163C4D", "#EDF1F3", "#F2617A", "#9B293C"], "muted raspberry + deep teal, editorial"),
    ("8th Light", "craft consultancy", ["#141414", "#FF8300", "#A81B8D", "#93D500", "#FFD100", "#004987"], "near-black + a bright multi-accent spectrum"),
    ("Made Tech", "UK digital consultancy", ["#00AC32", "#212529", "#F1F1F1", "#FECC2B", "#DC3545"], "single green accent on cool neutrals"),
]

# Proposed palette, derived from the GuardianOS direction but with ownable values.
PALETTE = [
    ("Ink", "#120C0A", "near-black with a warm red undertone — the default ground"),
    ("Ember", "#D8440B", "the one hot accent; hero blocks, key numerals, single CTA"),
    ("Deep Ember", "#7A2107", "pressed / hover / print-safe dark of the accent"),
    ("Sand", "#E8C9A8", "warm light surface, captions on ink"),
    ("Paper", "#F7F2EB", "the light mode ground"),
    ("Slate", "#8C837D", "secondary text, dividers, disabled"),
]


def inline(path):
    raw = (ROOT / path).read_text()
    raw = re.sub(r"\s(width|height)=\"\d+\"", "", raw, count=2)
    raw = re.sub(r"<\?xml[^>]*\?>", "", raw)
    first = raw.index("<svg")
    return raw[first:]


def esc(s):
    return html.escape(s, quote=True)


def card(c, idx):
    slot, rnd, path, name, typ, idea, verdict, note = c
    return f"""
      <article class="card {verdict}" data-idx="{idx}" data-verdict="{verdict}">
        <div class="mark">{inline(path)}</div>
        <div class="sizes" aria-hidden="true">
          <span class="s64">{inline(path)}</span><span class="s32">{inline(path)}</span><span class="s16">{inline(path)}</span>
        </div>
        <div class="meta">
          <div class="row"><h3>{esc(name)}</h3><span class="badge">{esc(rnd)}</span></div>
          <p class="type">{esc(typ)}</p>
          <p class="idea">{esc(idea)}</p>
          <p class="note">{esc(note)}</p>
        </div>
        <button class="pick" type="button" aria-pressed="{'true' if verdict == 'liked' else 'false'}">
          {'&#10003; Shortlisted' if verdict == 'liked' else 'Add to shortlist'}
        </button>
      </article>"""


def main():
    liked = [c for c in CONCEPTS if c[6] == "liked"]
    rest = [c for c in CONCEPTS if c[6] != "liked"]

    swatches = "".join(
        f'<div class="sw"><div class="chip" style="background:{hexv}"></div>'
        f'<b>{esc(n)}</b><code>{hexv}</code><span>{esc(why)}</span></div>'
        for n, hexv, why in PALETTE
    )
    comps = "".join(
        f'<div class="comp"><div class="comphead"><b>{esc(n)}</b><span>{esc(k)}</span></div>'
        f'<div class="strip">' + "".join(f'<i style="background:{c}"></i>' for c in cols) + "</div>"
        f'<p>{esc(note)}</p></div>'
        for n, k, cols, note in COMPETITORS
    )

    doc = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>99 — logo concepts</title>
<style>
  :root {{
    --ink:#120C0A; --ember:#D8440B; --deep:#7A2107; --sand:#E8C9A8; --paper:#F7F2EB; --slate:#8C837D;
    --line:rgba(232,201,168,.18); --m-cap:0.72rem;
  }}
  *{{box-sizing:border-box}}
  body{{margin:0;background:var(--ink);color:var(--paper);
    font:16px/1.55 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Inter,Roboto,Helvetica,Arial,sans-serif;
    -webkit-font-smoothing:antialiased}}
  .wrap{{max-width:1180px;margin:0 auto;padding:0 24px}}
  header{{padding:72px 0 40px;border-bottom:1px solid var(--line)}}
  .eyebrow{{font:600 var(--m-cap)/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.16em;
    text-transform:uppercase;color:var(--ember)}}
  h1{{font-size:clamp(2.2rem,5vw,3.6rem);line-height:1.02;letter-spacing:-.03em;margin:.35em 0 0;font-weight:640}}
  h1 .dim{{color:var(--slate)}}
  .lede{{max-width:56ch;color:#cfc3ba;font-size:1.06rem;margin-top:18px}}
  h2{{font-size:1.02rem;letter-spacing:.14em;text-transform:uppercase;font-weight:600;color:var(--sand);
    margin:64px 0 6px}}
  h2 + .sub{{color:var(--slate);margin:0 0 26px;font-size:.94rem}}
  .grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:20px}}
  .card{{display:flex;flex-direction:column;gap:14px;padding:22px;border-radius:18px;
    background:linear-gradient(180deg,#1B120E,#150E0B);border:1px solid var(--line);
    transition:border-color .18s,transform .18s}}
  .card:hover{{border-color:rgba(216,68,11,.5);transform:translateY(-2px)}}
  .card.picked{{border-color:var(--ember);box-shadow:0 0 0 1px var(--ember) inset}}
  .card.rejected .mark,.card.earlier .mark{{opacity:.45}}
  .mark{{background:var(--paper);border-radius:12px;padding:22px;display:grid;place-items:center;min-height:200px}}
  .mark svg{{width:100%;height:auto;max-height:190px;display:block}}
  .sizes{{display:flex;align-items:flex-end;gap:16px;padding-left:4px}}
  .sizes span{{display:block;background:var(--sand);border-radius:3px;overflow:hidden}}
  .sizes svg{{display:block;background:var(--sand);fill:#120C0A}}
  .sizes svg path,.sizes svg circle,.sizes svg g{{fill:#120C0A}}
  .s64{{width:64px;height:64px}} .s64 svg{{width:64px;height:64px}}
  .s32{{width:32px;height:32px}} .s32 svg{{width:32px;height:32px}}
  .s16{{width:16px;height:16px}} .s16 svg{{width:16px;height:16px}}
  .row{{display:flex;align-items:baseline;gap:10px;justify-content:space-between;flex-wrap:wrap}}
  h3{{margin:0;font-size:1.16rem;letter-spacing:-.01em}}
  .badge{{font:600 .62rem/1 ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;
    color:var(--sand);border:1px solid var(--line);padding:5px 8px;border-radius:99px;white-space:nowrap}}
  .type{{margin:2px 0 0;font-size:.74rem;letter-spacing:.13em;text-transform:uppercase;color:var(--ember)}}
  .idea{{margin:.5em 0 0;color:#e2d8d1}}
  .note{{margin:.4em 0 0;color:var(--slate);font-size:.9rem}}
  .pick{{margin-top:auto;font:600 .82rem/1 inherit;padding:11px 14px;border-radius:10px;cursor:pointer;
    background:transparent;color:var(--sand);border:1px solid var(--line);text-align:center}}
  .pick[aria-pressed="true"]{{background:var(--ember);border-color:var(--ember);color:#fff}}
  .palette{{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}}
  .sw .chip{{height:74px;border-radius:10px;border:1px solid var(--line)}}
  .sw b{{display:block;margin-top:9px;font-size:.9rem}}
  .sw code{{font:600 .78rem/1 ui-monospace,monospace;color:var(--ember)}}
  .sw span{{display:block;color:var(--slate);font-size:.8rem;margin-top:3px}}
  .comps{{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}}
  .comp{{border:1px solid var(--line);border-radius:14px;padding:16px;background:#150E0B}}
  .comphead{{display:flex;justify-content:space-between;gap:8px;align-items:baseline;font-size:.9rem}}
  .comphead span{{color:var(--slate);font-size:.76rem}}
  .strip{{display:flex;height:40px;border-radius:8px;overflow:hidden;margin:12px 0 10px}}
  .strip i{{flex:1}}
  .comp p{{margin:0;color:var(--slate);font-size:.84rem}}
  footer{{margin:72px 0 0;padding:30px 0 60px;border-top:1px solid var(--line);color:var(--slate);font-size:.86rem}}
  .toolbar{{position:sticky;top:0;z-index:9;backdrop-filter:blur(10px);
    background:rgba(18,12,10,.86);border-bottom:1px solid var(--line);padding:12px 0}}
  .toolbar .wrap{{display:flex;gap:10px;align-items:center;flex-wrap:wrap}}
  .toolbar button{{font:600 .78rem/1 inherit;padding:8px 12px;border-radius:8px;cursor:pointer;
    background:transparent;color:var(--sand);border:1px solid var(--line)}}
  .toolbar button[aria-pressed="true"]{{background:var(--sand);color:var(--ink);border-color:var(--sand)}}
  .count{{margin-left:auto;color:var(--slate);font-size:.84rem}}
</style>
</head>
<body>
<header><div class="wrap">
  <p class="eyebrow">99 &nbsp;/&nbsp; identity round</p>
  <h1>Twelve directions.<br><span class="dim">Pick what survives.</span></h1>
  <p class="lede">Every mark generated so far, at real size. Your current shortlist is pre-loaded &mdash; toggle any card
  to change it. Nothing here is colour or final; this page exists to settle the <em>form</em> before we commit to
  a palette and a story.</p>
</div></header>

<div class="toolbar"><div class="wrap">
  <button data-filter="all" aria-pressed="true">All 12</button>
  <button data-filter="liked">Shortlist</button>
  <button data-filter="rejected">Rejected by you</button>
  <button data-filter="earlier">Superseded</button>
  <span class="count" id="count"></span>
</div></div>

<main class="wrap">

  <h2>Palette proposal &mdash; v1</h2>
  <p class="sub">Taken from the website direction you sent: warm near-black ground, one hot accent, warm cream.
  This page is painted in it, so you are judging the colours in context rather than on a swatch card.</p>
  <div class="palette">{swatches}</div>

  <h2>What the category looks like</h2>
  <p class="sub">Colours pulled from four comparable firms' own CSS. None of them occupies the warm-dark-plus-ember
  territory &mdash; the category is cool neutrals with one accent, or a bright multi-accent system.</p>
  <div class="comps">{comps}</div>

  <h2>Shortlist</h2>
  <p class="sub">Eight marks survived your review. Sorted by how directly they read as the name.</p>
  <div class="grid">{"".join(card(c, i) for i, c in enumerate(CONCEPTS))}</div>

  <footer>
    Structural audit: all marks pass <code>svg_audit.py</code> with no failures; that is a file check, not a
    judgement of quality or originality. No trademark clearance has been done &mdash; the name is close to
    <a href="https://99x.io/" style="color:#E8C9A8">99x</a> and
    <a href="https://99designs.com/" style="color:#E8C9A8">99designs</a>, so a professional search is required
    before launch. Marks are filled vector paths only &mdash; no live text, no rasters.
  </footer>
</main>

<script>
  const cards = [...document.querySelectorAll('.card')];
  const count = document.getElementById('count');
  const refresh = () => {{
    const n = cards.filter(c => c.classList.contains('picked')).length;
    count.textContent = n + ' on shortlist';
  }};
  cards.forEach(c => {{
    const b = c.querySelector('.pick');
    if (c.dataset.verdict === 'liked') c.classList.add('picked');
    b.addEventListener('click', () => {{
      const on = c.classList.toggle('picked');
      b.setAttribute('aria-pressed', on);
      b.innerHTML = on ? '&#10003; Shortlisted' : 'Add to shortlist';
      refresh();
    }});
  }});
  document.querySelectorAll('[data-filter]').forEach(btn => {{
    btn.addEventListener('click', () => {{
      document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', b === btn));
      const f = btn.dataset.filter;
      cards.forEach(c => {{
        const show = f === 'all' || (f === 'liked'
          ? c.classList.contains('picked') : c.dataset.verdict === f);
        c.style.display = show ? '' : 'none';
      }});
    }});
  }});
  refresh();
</script>
</body>
</html>
"""
    (ROOT.parent / "docs" / "index.html").write_text(doc)
    print(f"wrote docs/index.html  ({len(doc)/1024:.0f} KB, {len(CONCEPTS)} concepts)")


main()
