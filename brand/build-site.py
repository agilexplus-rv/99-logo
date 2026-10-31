#!/usr/bin/env python3
"""Emit the three mock-website pages for 99 (home, services, about).

    python3 brand/build-site.py   ->  site/site/*.html

Every page loads assets/theme.js + assets/site.css, so switching package in the brand
book re-skins these pages too. Copy is written to the brand story and invents no
clients, no certifications and no performance statistics.
"""
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / "site"
(SITE / "site").mkdir(parents=True, exist_ok=True)

LOGO = ('<svg viewBox="0 0 256 256" aria-hidden="true"><g fill="currentColor" '
        'transform="translate(128 126) scale(1.22) translate(-128 -126)">'
        '<path d="M78 56a42 42 0 1 1 0 84a42 42 0 1 1 0 -84ZM120 98C120 150.5 109.5 179.9 59.1 198.8'
        'L51.75 186.07C86.4 168.56 99 148.4 97.93 136.22ZM178 56a42 42 0 1 1 0 84a42 42 0 1 1 0 -84'
        'ZM220 98C220 150.5 209.5 179.9 159.1 198.8L151.75 186.07C186.4 168.56 199 148.4 197.93 136.22Z"/>'
        '</g></svg>')

NAV = f"""<header class="nav"><div class="wrap">
  <a class="logo" href="home" aria-label="99 — home" style="color:var(--accent)">{LOGO}
  </a>
  <nav class="links" aria-label="Primary">
    <a href="services" {{svc}}>Services</a>
    <a href="services#lifecycle">How we work</a>
    <a href="services#engagement">Engagement</a>
    <a href="about" {{about}}>About</a>
  </nav>
  <a class="btn btn-solid cta" href="about#contact">Start a conversation</a>
</div></header>"""

FOOT = f"""<footer class="foot"><div class="wrap">
  <div class="cols">
    <div>
      <a class="logo" href="home" style="color:var(--accent)" aria-label="99">{LOGO}</a>
      <p style="max-width:26ch">One to ninety-nine. Scoping, software, hosting, maintenance and enhancement under
      one accountable name.</p>
    </div>
    <div><h4>Services</h4>
      <a href="services#scoping">Scoping</a><a href="services#software">Software</a>
      <a href="services#hosting">Hosting</a><a href="services#maintenance">Maintenance</a>
      <a href="services#enhancement">Enhancement</a></div>
    <div><h4>Company</h4>
      <a href="about">About</a><a href="about#contact">Contact</a>
      <a href="../index.html">Brand book</a></div>
    <div><h4>Contact</h4>
      <a href="mailto:hello@agilexplus.dev">hello@agilexplus.dev</a>
      <span style="display:block;padding:4px 0">Malta</span></div>
  </div>
  <div class="legal">
    <span>© 99 — a mock website, built as a brand-book reference</span>
    <span>One to ninety-nine</span>
  </div>
</div></footer>"""


def page(title, body, svc="", about="", extra_css="", extra_js=""):
    return f"""<!doctype html>
<html lang="en" data-package="ember">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Space+Grotesk:wght@400;500;700&display=swap">
<script src="../assets/theme.js"></script>
<link rel="stylesheet" href="../assets/site.css">
{extra_css}
</head>
<body>
{NAV.format(svc=svc, about=about)}
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
      <p class="micro">Software · Hosting · Maintenance · Enhancement</p>
      <h1 class="tone">One to <span class="t2">ninety-nine.</span></h1>
      <p class="sub">Scoping, software, hosting, maintenance and enhancement under one accountable name — the same
      small senior team from the first conversation to the last number.</p>
      <div class="actions">
        <a class="btn btn-accent" href="about#contact">Start a conversation</a>
        <a class="btn btn-ghost" href="#estimator">Estimate a retainer</a>
      </div>
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
    <span>Scoping</span><span>Software</span><span>Hosting</span><span>Maintenance</span><span>Enhancement</span>
  </div></div>

  <section><div class="wrap reveal">
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
        <p>Infrastructure, deploys, backups you have actually restored, certificates, alerting.</p></article>
      <article class="slide"><span class="n">04</span><h4>Maintenance</h4>
        <p>Patching, dependency upgrades, cost review and the 2 a.m. page. The half nobody advertises.</p></article>
      <article class="slide"><span class="n">05</span><h4>Enhancement</h4>
        <p>When the business changes shape, the system should too. The next count starts here.</p></article>
    </div>
  </div></section>

  <section class="cream on-cream"><div class="wrap">
    <div class="reveal" style="max-width:60ch;margin-bottom:34px">
      <p class="micro">Engagement</p>
      <h2 class="tone">Pay for the running systems,
        <span class="t2">not for a project that ends.</span></h2>
      <p style="margin-top:14px">Move the slider to see the shape of a retainer. This is an illustration on a mock
      site — real numbers come out of a scoping call.</p>
    </div>

    <div class="est reveal" id="estimator">
      <div class="left">
        <div class="seg" role="group" aria-label="Billing period">
          <button type="button" data-billing="monthly" aria-pressed="true">Monthly</button>
          <button type="button" data-billing="yearly" aria-pressed="false">Yearly <em>save 15%</em></button>
        </div>

        <div class="rowlab"><span>Systems in the count</span><b id="est-summary">25 systems · monthly</b></div>
        <input id="devices" type="range" min="0" max="200" step="5" value="25"
               aria-label="Number of systems under management">
        <div class="ticks"><span data-at="0">0</span><span data-at="5">5</span><span class="on" data-at="25">25</span><span data-at="50">50</span><span data-at="100">100</span><span data-at="200">200+</span></div>

        <div class="checks">
          <div><i></i> Monitoring and out-of-hours on-call</div>
          <div><i></i> Patching and dependency upgrades</div>
          <div><i></i> Backup verification, not just backups</div>
          <div><i></i> Monthly enhancement time</div>
        </div>
      </div>
      <div class="right">
        <div class="price"><span id="price">€780</span>
          <small id="price-note">per month, billed monthly</small></div>
        <div class="incl">
          <span>One accountable name</span><span>Quarterly cost review</span>
          <span>No handovers</span><span>Exit with the keys</span>
        </div>
        <a class="btn" href="about#contact">Start a conversation</a>
        <p class="note">Illustrative pricing — not a quote</p>
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
      <p class="micro">What the retainer actually covers</p>
      <h2 class="tone">The unglamorous half of ownership.
        <span class="t2">Priced, not discovered.</span></h2>
    </div>
    <div class="acc reveal">
      <details open>
        <summary><span class="gloss">01</span><h4>Infrastructure</h4><span class="plus">+</span></summary>
        <div class="body">Reproducible environments, deploys you can trust, certificates that do not expire on a
        Friday, and alerting that reaches a person who can act on it.
        <div class="tags" style="margin-top:10px"><span class="stamp">Reviewed quarterly</span></div></div>
      </details>
      <details>
        <summary><span class="gloss">02</span><h4>Dependencies</h4><span class="plus">+</span></summary>
        <div class="body">Every framework you depend on will reach end-of-life on a date. We keep that date, and we do
        something about it before it becomes an incident rather than after.
        <div class="tags" style="margin-top:10px"><span class="stamp">Tracked on a calendar</span></div></div>
      </details>
      <details>
        <summary><span class="gloss">03</span><h4>Cost</h4><span class="plus">+</span></summary>
        <div class="body">Cloud and hosting bills drift upward quietly. A quarterly review of what is actually running
        usually finds money, and occasionally an entire service nobody needed.
        <div class="tags" style="margin-top:10px"><span class="stamp">Line-item reviewed</span></div></div>
      </details>
      <details>
        <summary><span class="gloss">04</span><h4>Enhancement</h4><span class="plus">+</span></summary>
        <div class="body">Every month carries enhancement time, so the system can follow the business without a change
        request turning into a negotiation.
        <div class="tags" style="margin-top:10px"><span class="stamp">Scoped, not assumed</span></div></div>
      </details>
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

  <section id="lifecycle" style="padding-top:24px"><div class="wrap">
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
        <div><p>Web applications, internal tools, back-office systems and the integrations between them. Same team
        that scoped it, so the decision trail survives.</p>
        <div class="tags" style="margin-top:14px"><span class="tag">Web apps</span>
        <span class="tag">Internal tools</span><span class="tag">Integrations</span>
        <span class="tag">Data migration</span></div></div>
      </div>
      <div class="step" id="hosting">
        <span class="n">03</span>
        <h3>Hosting</h3>
        <div><p>Where the thing lives. Reproducible environments, deploys you can trust, backups you have actually
        restored, and alerting that reaches a person.</p>
        <div class="tags" style="margin-top:14px"><span class="tag">Infrastructure</span>
        <span class="tag">CI/CD</span><span class="tag">Backups</span><span class="tag">Monitoring</span></div></div>
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
    <div>
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

(SITE / "site" / "home.html").write_text(page("99 — One to ninety-nine", HOME,
    extra_css='<link rel="stylesheet" href="../assets/mock.css">',
    extra_js='<script src="../assets/mock.js"></script>'))
(SITE / "site" / "services.html").write_text(page("99 — Services", SERVICES, svc='aria-current="page"'))
(SITE / "site" / "about.html").write_text(page("99 — About", ABOUT, about='aria-current="page"'))
print("wrote site/site/{home,services,about}.html")
