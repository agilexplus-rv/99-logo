#!/usr/bin/env python3
"""Emit the three mock-website pages for 99 (home, services, about).

    python3 brand/build-site.py   ->  site/site/*.html

Every page loads assets/theme.js + assets/site.css, so switching package in the brand
book re-skins these pages too. Copy is written to the brand story and invents no
clients, no certifications and no performance statistics.
"""
import time
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"
(SITE / "site").mkdir(parents=True, exist_ok=True)

ASSET_V = str(int(time.time()))  # bumped every build: defeats CDN/edge caching

LOGO = '<span data-logo-slot aria-hidden="true"></span>'
NAV = f"""<header class="nav"><div class="wrap">
  <a class="logo" href="home" aria-label="99 — home" style="color:var(--accent)">{LOGO}<span class="navword" data-wordmark>99</span>
  </a>
  <nav class="links" id="navlinks" aria-label="Primary">
    <a href="services" {{svc}}>Services</a>
    <a href="{{how}}">How we work</a>
    <a href="services#engagement">Engagement</a>
    <a href="about" {{about}}>About</a>
  </nav>
  <button type="button" class="navmode" id="site-mode" aria-label="Toggle light or dark mode" title="Light / dark">
    <span aria-hidden="true" id="site-mode-ico">&#9789;</span></button>
  <a class="btn btn-solid cta" href="about#contact">Start a conversation</a>
  <button type="button" class="navtoggle" id="navtoggle" aria-expanded="false" aria-controls="navlinks" aria-label="Menu">
    <i></i><i></i><i></i></button>
</div></header>"""

FOOT = f"""<footer class="foot"><div class="wrap">
  <div class="cols">
    <div>
      <a class="logo" href="home" style="color:var(--accent)" aria-label="99">{LOGO}</a>
      <p style="max-width:26ch">One to ninety-nine. Solutions built right and improved continually — scoping, software, hosting and growth
      under one accountable name.</p>
    </div>
    <div><h4>Services</h4>
      <a href="services#scoping">Scoping</a><a href="services#software">Software</a>
      <a href="services#hosting">Hosting</a><a href="services#maintenance">Improvement</a>
      <a href="services#enhancement">Growth</a></div>
    <div><h4>Company</h4>
      <a href="about">About</a><a href="about#contact">Contact</a>
      <a href="../index.html">Brand book</a></div>
    <div><h4>Contact</h4>
      <a href="mailto:contact@99.system">contact@99.system</a>
      <span style="display:block;padding:4px 0">Malta</span></div>
  </div>
  <div class="legal">
    <span>© 99 Invest Ltd · VAT MT 0000 0000 · 16 Named Street, Valletta VLT 1111, Malta · contact@99.system</span>
    <span>One to ninety-nine</span>
  </div>
</div></footer>"""


def _og(title, desc, path):
    """Description + Open Graph + Twitter card, so shared links are not title-only."""
    base = "https://99-branding.agilexplus.dev"
    return (
        f'<meta name="description" content="{desc}">\n'
        f'<meta property="og:type" content="website">\n'
        f'<meta property="og:site_name" content="99">\n'
        f'<meta property="og:title" content="{title}">\n'
        f'<meta property="og:description" content="{desc}">\n'
        f'<meta property="og:url" content="{base}{path}">\n'
        f'<meta property="og:image" content="{base}/og-image.png">\n'
        f'<meta name="twitter:card" content="summary_large_image">\n'
        f'<meta name="twitter:title" content="{title}">\n'
        f'<meta name="twitter:description" content="{desc}">\n'
        f'<meta name="twitter:image" content="{base}/og-image.png">'
    )


def page(title, body, svc="", about="", extra_css="", extra_js="", how="home#how", desc="", path="/"):
    OG = _og(title, desc, path)
    return f"""<!doctype html>
<html lang="en" data-package="ember">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
{OG}
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Space+Grotesk:wght@400;500;700&display=swap">
<script src="../assets/theme.js?v={ASSET_V}"></script>
<link rel="stylesheet" href="../assets/site.css?v={ASSET_V}">
{extra_css}
</head>
<body>
{NAV.format(svc=svc, about=about, how=how)}
{body}
{FOOT}
{extra_js}
</body></html>
"""


# ------------------------------------------------------------------ HOME
HOME = """
<main>
  <section class="hero-ref"><div class="wrap"><div class="inner">
    <div class="reveal">
      <p class="micro">Software · Hosting · Improvement · Growth</p>
      <h1 class="tone">One to ninety-nine.<span class="t2">We start at one.</span></h1>
      <p class="sub">Scoping, software, hosting, improvement and growth under one accountable name — the same
      small senior team from the first conversation to the last number.</p>
      <div class="actions">
        <a class="btn btn-accent" href="about#contact">Start a conversation</a>
        <a class="btn btn-ghost" href="#journey">See the whole count</a>
      </div>
      <dl class="hero-stats">
        <div><dt>Stages</dt><dd>5</dd></div>
        <div><dt>Handovers</dt><dd>0</dd></div>
        <div><dt>Monitored</dt><dd>24/7</dd></div>
        <div><dt>Accountable name</dt><dd>One</dd></div>
      </dl>
    </div>
    <div class="reveal orb">
      <div class="card">
        <b>Whole count</b>
        <span>One contract. No handovers. The people who scoped it build it, host it and keep it up.</span>
      </div>
    </div>
  </div></div></section>

  <div class="strip"><div class="wrap">
    <span class="who">Built for companies that want the process fixed, not a prototype</span>
    <span>Scoping</span><span>Software</span><span>Hosting</span><span>Improvement</span><span>Growth</span>
  </div></div>

  <section id="how"><div class="wrap reveal">
    <p class="micro">How we work</p>
    <h2 class="tone">Most firms start counting at the launch.
      <span class="t2">We start at one.</span></h2>
    <div class="railhead">
      <div class="dots" id="dots" role="tablist" aria-label="Stages"></div>
      <div class="navarrows">
        <button type="button" id="rail-prev" aria-label="Previous stage">&larr;</button>
        <button type="button" id="rail-next" aria-label="Next stage">&rarr;</button>
      </div>
    </div>
    <div class="rail" id="rail" tabindex="0" aria-label="The five stages of the count">
      <article class="slide"><span class="n">01</span><h4>Scoping</h4>
        <p>A written definition of done, a cost range, and an honest go / no-go before anyone writes code.</p></article>
      <article class="slide"><span class="n">02</span><h4>Software</h4>
        <p>Web apps, internal tools and the integrations between them — built by the people who scoped it.</p></article>
      <article class="slide"><span class="n">03</span><h4>Hosting</h4>
        <p>Servers, safe releases, backups we have actually test-restored, certificates and alerting.</p></article>
      <article class="slide"><span class="n">04</span><h4>Improvement</h4>
        <p>Continual improvement so the solution stays modern, robust and lean — never left to go stale.</p></article>
      <article class="slide"><span class="n">05</span><h4>Growth</h4>
        <p>When the business changes shape, the system should too. The next count starts here.</p></article>
    </div>
  </div></section>

  <section class="journey" id="journey">
    <div class="sticky">
      <div>
        <p class="micro">The whole count</p>
        <h2 class="tone" style="font-size:clamp(1.5rem,2.4vw,2rem)">One screen,<span class="t2">five reliefs.</span></h2>
        <ol class="jsteps">
          <li aria-current="true"><span class="k">01</span><div><h4>Scoping</h4>
            <p>Know what finished means first.</p></div></li>
          <li><span class="k">02</span><div><h4>Software</h4>
            <p>Built by the people who scoped it.</p></div></li>
          <li><span class="k">03</span><div><h4>Hosting</h4>
            <p>It just stays up.</p></div></li>
          <li><span class="k">04</span><div><h4>Improvement</h4>
            <p>Continually refined, never left to rust.</p></div></li>
          <li><span class="k">05</span><div><h4>Growth</h4>
            <p>The business moves, the system follows.</p></div></li>
        </ol>
        <div class="jbar"><i></i></div>
      </div>

      <div class="tablet">
        <div class="screen" role="group" aria-label="The five stages, shown as outcomes">
          <div class="screen-nav" role="tablist" aria-label="Stages"><span class="tab" data-goto="0">Scope</span><span class="tab" data-goto="1">Build</span><span class="tab" data-goto="2">Hosting</span><span class="tab" data-goto="3">Improve</span><span class="tab" data-goto="4">Grow</span></div>

          <div class="jscreen" data-step="0">
            <div class="bar-top"><span><b>99</b> · scoping</span></div>
            <h5>Know what &ldquo;fixed&rdquo; means — before you pay for it.</h5>
            <p class="sub">We've been through this hundreds of times. It's a routine, not a bet.</p>
            <div class="jrows">
              <div class="jrow"><span class="tick">✓</span><span>A written definition of done — no scope drift</span><span class="meta">WK 1</span></div>
              <div class="jrow"><span class="tick">✓</span><span>A cost range before you commit</span><span class="meta">WK 1</span></div>
              <div class="jrow"><span class="tick">✓</span><span>An honest go / no-go, even when it's &ldquo;don't build it&rdquo;</span><span class="meta">WK 2</span></div>
            </div>
            <div class="foot"><span>DAYS TO CLARITY</span><b>5</b></div>
          </div>

          <div class="jscreen" data-step="1">
            <div class="bar-top"><span><b>99</b> · build</span></div>
            <h5>Built by the people who understood it.</h5>
            <p class="sub">You describe the problem once — not once per handoff. There is no wall.</p>
            <div class="jrows">
              <div class="jrow"><span class="tick">✓</span><span>No throwing it over a wall to a junior team</span><span class="meta">—</span></div>
              <div class="jrow"><span class="tick">✓</span><span>Security, tests and migrations done properly</span><span class="meta">—</span></div>
              <div class="jrow"><span class="tick">✓</span><span>You're never asked to learn our stack</span><span class="meta">—</span></div>
            </div>
            <div class="foot"><span>TEAMS INVOLVED</span><b>1</b></div>
          </div>

          <div class="jscreen" data-step="2">
            <div class="bar-top"><span><b>99</b> · hosting</span></div>
            <h5>It just stays up. And when it doesn't, someone's already on it.</h5>
            <p class="sub">Hassle-free means you sleep through the incident, not through the alert.</p>
            <div class="jbars"><i style="height:78%"></i><i style="height:86%"></i><i style="height:71%"></i><i style="height:92%"></i><i style="height:64%"></i><i style="height:88%"></i><i style="height:96%"></i><i style="height:82%"></i><i style="height:90%"></i></div>
            <div class="jrows">
              <div class="jrow"><span class="tick">✓</span><span>Backups we've actually restored — in a drill</span><span class="meta">VERIFIED</span></div>
              <div class="jrow"><span class="tick">✓</span><span>Certificates that don't expire on a Friday</span><span class="meta">OK</span></div>
            </div>
            <div class="foot"><span>90-DAY UPTIME</span><b>99.98%</b></div>
          </div>

          <div class="jscreen" data-step="3">
            <div class="bar-top"><span><b>99</b> · improvement</span></div>
            <h5>Improved continually — before it's ever a problem.</h5>
            <p class="sub">We don't wait for things to break. We improve them on a cadence, so the solution stays current and robust.</p>
            <div class="jrows">
              <div class="jrow"><span class="tick">✓</span><span>Continual improvement, scheduled every month</span><span class="meta">CADENCE</span></div>
              <div class="jrow"><span class="tick">✓</span><span>Upgrades done before they become urgent</span><span class="meta">AHEAD</span></div>
              <div class="jrow"><span class="tick">✓</span><span>Performance and cost reviewed every quarter</span><span class="meta">QTR</span></div>
            </div>
            <div class="foot"><span>IMPROVEMENTS SHIP ON</span><b>a monthly cadence</b></div>
          </div>

          <div class="jscreen" data-step="4">
            <div class="bar-top"><span><b>99</b> · growth</span></div>
            <h5>When the business changes shape, the system moves with it.</h5>
            <p class="sub">Growth is just the next count — budgeted, scoped, ordinary.</p>
            <div class="jbars"><i style="height:38%"></i><i style="height:46%"></i><i style="height:52%"></i><i style="height:61%"></i><i style="height:58%"></i><i style="height:73%"></i><i style="height:81%"></i><i style="height:88%"></i><i style="height:97%"></i></div>
            <div class="jrows">
              <div class="jrow"><span class="tick">✓</span><span>Improvement time set aside every month</span><span class="meta">LIVE</span></div>
              <div class="jrow"><span class="tick">✓</span><span>Scoped changes, never a surprise invoice</span><span class="meta">LIVE</span></div>
            </div>
            <div class="foot"><span>HOURS RETURNED / MONTH</span><b>68</b></div>
          </div>

        </div>
      </div>
    </div>
  </section>


  <section class="cream on-cream"><div class="wrap">
    <div class="reveal" style="max-width:62ch;margin-bottom:34px">
      <p class="micro">The business case</p>
      <h2 class="tone">What does the manual way <span class="t2">actually cost you?</span></h2>
      <p style="margin-top:14px">Slide the hours you lose to a paperwork process each week. This is the cost of
      doing nothing &mdash; estimated before anyone asks you for a cent.</p>
    </div>

    <div class="est reveal" id="estimator">
      <div class="left">
        <div class="seg" role="group" aria-label="The rate you value your people at">
          <button type="button" data-rate="25" aria-pressed="true">&euro;25/h</button>
          <button type="button" data-rate="50" aria-pressed="false">&euro;50/h</button>
          <button type="button" data-rate="100" aria-pressed="false">&euro;100/h</button>
        </div>

        <div class="rowlab"><span>Hours a week lost to a manual process</span><b id="est-summary">10 h &middot; &euro;25/h</b></div>
        <input id="hours" type="range" min="0" max="40" step="1" value="10"
               aria-label="Hours per week lost to a manual process">
        <div class="ticks"><span data-at="0">0</span><span data-at="10">10</span><span class="on" data-at="20">20</span><span data-at="30">30</span><span data-at="40">40</span></div>

        <div class="checks">
          <div><i></i> No commitment &mdash; the scoping call is free</div>
          <div><i></i> An answer in days, not a sales deck</div>
          <div><i></i> The number is yours to keep either way</div>
          <div><i></i> Real figures replace the estimate after scoping</div>
        </div>
      </div>
      <div class="right">
        <div class="price"><span id="est-annual">&euro;11,250</span>
          <small id="est-note">spent on the manual process every year &mdash; the cost of doing nothing</small></div>
        <div class="incl">
          <span>Free scoping</span><span>No obligation</span>
          <span>One accountable name</span><span>Built to pay back</span>
        </div>
        <a class="btn" id="est-cta" href="about#contact">See if it pays back</a>
        <p class="note">Estimate only &mdash; a free scoping call gives the real figure</p>
      </div>
    </div>

    <div class="metrics reveal" style="margin-top:36px">
      <div><b data-count="5">5</b><span>Stages, one team</span></div>
      <div><b data-count="0">0</b><span>Handoffs</span></div>
      <div><b>24/7</b><span>Monitored</span></div>
    </div>
  </div></section>

  <section class="cream on-cream" style="padding-top:0"><div class="wrap">
    <div class="reveal" style="max-width:60ch;margin-bottom:10px">
      <p class="micro">What the whole count actually covers</p>
      <h2 class="tone">Built to last.
        <span class="t2">Then improved so it stays that way.</span></h2>
    </div>
    <div class="covers reveal">
      <article><span class="gloss">01</span><h4>Built to last</h4>
        <p>Engineered robustly from the first line: reproducible environments, deploys you can trust, and alerting
        that reaches a person who can act.</p><span class="stamp">Reviewed quarterly</span></article>
      <article><span class="gloss">02</span><h4>Always current</h4>
        <p>Every framework has a use-by date. We keep the calendar, so the solution stays modern and robust &mdash;
        upgraded in the background instead of becoming an emergency.</p><span class="stamp">Tracked on a calendar</span></article>
      <article><span class="gloss">03</span><h4>Watched, not drifting</h4>
        <p>Running costs drift upward quietly. A quarterly review keeps the solution lean &mdash; and usually finds
        money, occasionally an entire service nobody needed.</p><span class="stamp">Line-item reviewed</span></article>
      <article><span class="gloss">04</span><h4>Continual improvement</h4>
        <p>Every month carries improvement time, so the solution keeps getting better and adapting to the business
        &mdash; never as a change request that turns into a negotiation.</p><span class="stamp">Scoped, not assumed</span></article>
    </div>
  </div></section>

  <section class="band"><div class="wrap reveal">
    <h2>Tell us the process that hurts.</h2>
    <p style="margin-top:12px">We will tell you honestly whether it is a scoping job, a build, or something a
    spreadsheet already solved.</p>
    <a class="btn btn-solid" href="about#contact" style="margin-top:22px">Start a conversation</a>
  </div></section>
</main>
"""

# ------------------------------------------------------------------ SERVICES
SERVICES = """
<main>
  <section class="hero" style="padding-bottom:40px"><div class="wrap">
    <p class="micro">Services</p>
    <h1>Five stages.<br><span class="dim">One accountable name.</span></h1>
    <p class="lede" style="margin-top:20px">The count runs from the first conversation to the last number. You can buy
    all of it, or start wherever you are.</p>
  </div></section>

  <section id="how" style="padding-top:24px"><div class="wrap">
    <div class="steps">
      <div class="step" id="scoping">
        <span class="n">01</span>
        <h3>Scoping</h3>
        <div><p>We sit with the people doing the work, not just the people buying it. The output is a written
        definition of done, a rough cost, and an honest answer about whether the thing is worth building.</p>
        <div class="tags" style="margin-top:14px"><span class="tag">Process mapping</span>
        <span class="tag">Definition of done</span><span class="tag">Cost range</span>
        <span class="tag">Go / no-go</span></div></div>
      </div>
      <div class="step" id="software">
        <span class="n">02</span>
        <h3>Software</h3>
        <div><p>Web applications, internal tools, back-office systems and the connections between them. Same team
        that scoped it, so the decision trail survives.</p>
        <div class="tags" style="margin-top:14px"><span class="tag">Web apps</span>
        <span class="tag">Internal tools</span><span class="tag">Integrations</span>
        <span class="tag">Moving data safely</span></div></div>
      </div>
      <div class="step" id="hosting">
        <span class="n">03</span>
        <h3>Hosting</h3>
        <div><p>Where the thing lives. Reproducible environments, deploys you can trust, backups you have actually
        restored, and alerting that reaches a person.</p>
        <div class="tags" style="margin-top:14px"><span class="tag">Infrastructure</span>
        <span class="tag">Safe releases</span><span class="tag">Backups</span><span class="tag">Monitoring</span></div></div>
      </div>
      <div class="step" id="maintenance">
        <span class="n">04</span>
        <h3>Maintenance</h3>
        <div><p>Patching, dependency upgrades, cost review, and the out-of-hours page. The unglamorous half of
        ownership, priced as a retainer rather than a surprise.</p>
        <div class="tags" style="margin-top:14px"><span class="tag">Patching</span>
        <span class="tag">Upgrades</span><span class="tag">Cost review</span><span class="tag">On-call</span></div></div>
      </div>
      <div class="step" id="enhancement">
        <span class="n">05</span>
        <h3>Enhancement</h3>
        <div><p>When the business changes shape, the system should too. Enhancements are scoped like any other count,
        so nothing arrives as an unbudgeted surprise.</p>
        <div class="tags" style="margin-top:14px"><span class="tag">Scoped changes</span>
        <span class="tag">Performance</span><span class="tag">New surfaces</span></div></div>
      </div>
    </div>
  </div></section>

  <section id="engagement"><div class="wrap">
    <div class="sec-head">
      <p class="micro">Engagement</p>
      <h2>Three ways to start.</h2>
      <p class="lede" style="margin-top:14px">Commercials are agreed per engagement, not published as a menu — but the
      shape of the deal is always one of these three.</p>
    </div>
    <div class="plans">
      <article class="plan"><h3>Project</h3>
        <p class="price">Fixed scope <small>one count</small></p>
        <p style="color:var(--slate);font-size:.92rem">A defined build with a written definition of done.</p>
        <ul><li>Scoping included</li><li>Fixed price and date</li><li>Handover to your team, or keep us on</li></ul></article>
      <article class="plan hi"><h3>Partnership</h3>
        <p class="price">The whole count <small>retainer</small></p>
        <p style="color:var(--slate);font-size:.92rem">Build, host, maintain and enhance under one name.</p>
        <ul><li>One contract, one accountable name</li><li>Monitoring and on-call included</li>
        <li>Enhancement time every month</li><li>Quarterly cost and risk review</li></ul></article>
      <article class="plan"><h3>Enhancement</h3>
        <p class="price">Blocks <small>as needed</small></p>
        <p style="color:var(--slate);font-size:.92rem">For systems that are running fine and need to grow.</p>
        <ul><li>Scoped per change</li><li>No new platform required</li><li>Works on someone else's codebase</li></ul></article>
    </div>
    <p class="notice" style="margin-top:26px">We will tell you if a smaller engagement solves the problem. Selling a
    retainer you don't need is how consultancies end up with a reputation.</p>
  </div></section>

  <section class="band"><div class="wrap">
    <h2>Not sure which one you need?</h2>
    <p style="margin-top:12px">That is what the scoping stage is for. Start there.</p>
    <a class="btn btn-solid" href="about#contact" style="margin-top:22px">Ask for a scoping call</a>
  </div></section>
</main>
"""

# ------------------------------------------------------------------ ABOUT
ABOUT = """
<main>
  <section class="hero" style="padding-bottom:40px"><div class="wrap">
    <p class="micro">About</p>
    <h1>A small senior team,<br><span class="dim">and no wall to throw things over.</span></h1>
    <p class="lede" style="margin-top:20px">We are between five and twenty people by design. The person who scopes
    your work is the person who builds it, hosts it, and answers the phone when it misbehaves.</p>
  </div></section>

  <section style="padding-top:24px"><div class="wrap"><div class="two">
    <div>
      <h2>What that buys you</h2>
      <p style="margin-top:14px;color:var(--sand)">Not a bigger team. A shorter distance between the decision and the
      person affected by it.</p>
      <p style="color:var(--slate)">Most delivery failures are not technical. They are translation failures: the person
      who understood the problem is not in the room when it is built, so the build answers a question nobody asked.
      Removing the handover removes the failure mode.</p>
    </div>
    <div id="how">
      <h2>How we work</h2>
      <div class="steps" style="margin-top:14px">
        <div class="step" style="grid-template-columns:1fr;gap:6px"><h3>Write it down</h3>
          <p>The definition of done is a document, not a feeling.</p></div>
        <div class="step" style="grid-template-columns:1fr;gap:6px"><h3>No unbudgeted surprises</h3>
          <p>Enhancements get scoped like anything else.</p></div>
        <div class="step" style="grid-template-columns:1fr;gap:6px"><h3>Say the awkward thing early</h3>
          <p>If the budget does not match the ambition, that is a scoping conversation, not a change request.</p></div>
      </div>
    </div>
  </div></div></section>

  <section id="contact"><div class="wrap"><div class="two">
    <div>
      <p class="micro">Contact</p>
      <h2>Tell us the process that hurts.</h2>
      <p class="lede" style="margin-top:14px">Two or three sentences is enough. We will reply with an honest read on
      whether it is a scoping job, a build, or something you should not build at all.</p>
      <div class="notice" style="margin-top:22px">This is a demo form on a mock website — submitting it does nothing.
      Use the email address in the footer.</div>
    </div>
    <form class="form" onsubmit="event.preventDefault();this.querySelector('.sent').hidden=false;">
      <div class="field"><label for="n">Name</label><input id="n" name="name" autocomplete="name" required></div>
      <div class="field"><label for="e">Work email</label><input id="e" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="c">Company</label><input id="c" name="company" autocomplete="organization"></div>
      <div class="field"><label for="p">The process that hurts</label>
        <textarea id="p" name="process" placeholder="e.g. quoting takes three people and two days"></textarea></div>
      <button class="btn btn-accent" type="submit">Send</button>
      <p class="sent" hidden style="color:var(--accent);font-family:var(--font-mono);font-size:.78rem;letter-spacing:.08em">
        DEMO ONLY — nothing was sent.</p>
    </form>
  </div></div></section>
</main>
"""

def stamp_collateral():
    p = SITE / "collateral.html"
    t = p.read_text()
    import re as _re
    t = _re.sub(r'assets/theme\.js(\?v=[0-9a-z]+)?', 'assets/theme.js?v=' + ASSET_V, t)
    p.write_text(t)

stamp_collateral()
(SITE / "site" / "home.html").write_text(page("99 — Software, hosting and continual improvement", HOME, how="#how", path="/site/home",
    desc="99 builds software, hosts it and improves it continually — one accountable senior team from the first conversation to the last number. Malta.",
    extra_css=f'<link rel="stylesheet" href="../assets/mock.css?v={ASSET_V}">',
    extra_js=f'<script src="../assets/mock.js?v={ASSET_V}"></script>'))
(SITE / "site" / "services.html").write_text(page("Services — 99", SERVICES, svc='aria-current="page"', path="/site/services",
    desc="Scoping, build, hosting, improvement and growth under one accountable name. No published price list — every engagement starts with a written proposal."))
(SITE / "site" / "about.html").write_text(page("About — 99", ABOUT, about='aria-current="page"', path="/site/about",
    desc="99 is a small senior team in Malta. The people who scope your work build it, host it and keep improving it."))
print("wrote site/site/{home,services,about}.html")
