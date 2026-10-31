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
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

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
    const res = await page.goto(BASE + p.path, { waitUntil: 'networkidle', timeout: 45000 });
    const state = await settle(page);
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
