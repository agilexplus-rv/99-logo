// Renders the live pages to PNGs for visual review in CI.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = (process.env.BASE || 'https://99-branding.agilexplus.dev').replace(/\/$/, '');

const PAGES = [
  { name: '01-brand-book', path: '/', full: true },
  { name: '02-home', path: '/site/home', full: true },
  { name: '03-services', path: '/site/services', full: true },
  { name: '04-about', path: '/site/about', full: true },
  { name: '05-home-mobile', path: '/site/home', full: true, w: 390, h: 844 },
  { name: '06-home-viewport', path: '/site/home', full: false },
  { name: '07-book-viewport', path: '/', full: false },
  { name: '08-journey-step2', path: '/site/home', full: false, anchor: '#journey', frac: 0.34 },
  { name: '09-journey-step4', path: '/site/home', full: false, anchor: '#journey', frac: 0.78 },
  { name: '11-natural-home', path: '/site/home', natural: true },
  { name: '12-natural-collateral', path: '/collateral', natural: true },
  { name: '10-flow', flow: [
      { path: '/', click: '[data-pkg="clay"]' },
      { click: '[data-logo="the-seal"]' },
      { path: '/site/home', shot: 'home' },
      { path: '/collateral', shot: 'collateral' },
      { eval: "localStorage.setItem('99-mode','light')" },
      { path: '/collateral', shot: 'light' }
    ] },
];

const VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };

async function settle(page) {
  await page.evaluate(() => document.fonts && document.fonts.ready);
  // Scroll like a person: real wheel events in small steps, with a frame between each,
  // so IntersectionObserver actually evaluates at every position.
  const steps = await page.evaluate(() =>
    Math.min(40, Math.ceil(document.body.scrollHeight / window.innerHeight) + 2));
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, 620);
    await page.waitForTimeout(130);
  }
  await page.waitForTimeout(400);
  // the page sets scroll-behavior:smooth, so a plain scrollTo(0,0) is still animating
  // when the screenshot is taken — that is what misplaced the sticky nav in full-page shots.
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
  });
  await page.waitForFunction(() => window.scrollY === 0, null, { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(600);

  const state = await page.evaluate(() => ({
    total: document.querySelectorAll('.reveal').length,
    revealed: document.querySelectorAll('.reveal.in').length
  }));
  console.log(`   reveals ${state.revealed}/${state.total}`);
  return state;
}

const browser = await chromium.launch();
await mkdir('shots', { recursive: true });

for (const p of PAGES) {
  const vp = p.w ? { width: p.w, height: p.h } : VIEWPORTS.desktop;
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  try {
    if (p.flow) {
      for (const step of p.flow) {
        if (step.path) {
          await page.goto(BASE + step.path, { waitUntil: 'networkidle', timeout: 45000 });
          await page.evaluate(() => document.fonts && document.fonts.ready);
        }
        if (step.eval) { await page.evaluate(step.eval); await page.waitForTimeout(300); }
        if (step.click) { await page.click(step.click).catch(function(){ console.log('   ! click skipped: ' + step.click); }); await page.waitForTimeout(800); }
        if (step.shot) {
          await page.screenshot({ path: `shots/${p.name}-${step.shot}.png`, fullPage: false });
        }
      }
      await ctx.close();
      continue;
    }
    const res = await page.goto(BASE + p.path, { waitUntil: 'networkidle', timeout: 45000 });
    let state = { total: 0, revealed: 0 };
    if (p.natural) {
      // load exactly like a first-time visitor: no scrolling, no forcing reveals
      await page.waitForTimeout(3500);
      const st = await page.evaluate(() => ({
        total: document.querySelectorAll('.reveal').length,
        revealed: document.querySelectorAll('.reveal.in').length,
        js: document.documentElement.classList.contains('js')
      }));
      console.log(`   NATURAL reveals ${st.revealed}/${st.total} (html.js=${st.js})`);
      await page.screenshot({ path: `shots/${p.name}.png`, fullPage: false });
      await ctx.close();
      continue;
    }
    if (p.anchor) {
      // jump straight into a scroll-driven section so the pinned state is captured
      await page.evaluate(([sel, frac]) => {
        document.documentElement.style.scrollBehavior = 'auto';
        const el = document.querySelector(sel);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const span = el.offsetHeight - window.innerHeight;
        window.scrollTo(0, top + Math.max(0, span) * frac);
      }, [p.anchor, p.frac]);
      await page.waitForTimeout(900);
      await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('in')));
      await page.waitForTimeout(400);
    } else {
      state = await settle(page);
    }
    const shotPath = `shots/${p.name}.png`;
    await page.screenshot({ path: shotPath, fullPage: !!p.full });
    if (state.total && state.revealed < state.total) {
      console.log(`   ! ${state.total - state.revealed} reveal(s) never fired — check for real`);
    }
    console.log(`${p.name}  HTTP ${res && res.status()}  ${p.path}  errors=${errors.length}`);
    if (errors.length) errors.slice(0, 5).forEach((e) => console.log('   !', e.slice(0, 180)));
  } catch (err) {
    console.log(`${p.name}  FAILED  ${p.path}  ${String(err).slice(0, 200)}`);
  }
  await ctx.close();
}

await browser.close();
