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
  // let fonts + IntersectionObserver reveals land
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.evaluate(async () => {
    await new Promise((r) => {
      let y = 0;
      const step = () => {
        y += window.innerHeight * 0.8;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 90); else { window.scrollTo(0, 0); setTimeout(r, 350); }
      };
      step();
    });
  });
  await page.waitForTimeout(700);
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
    await settle(page);
    await page.screenshot({ path: `shots/${p.name}.png`, fullPage: !!p.full });
    console.log(`${p.name}  HTTP ${res && res.status()}  ${p.path}  errors=${errors.length}`);
    if (errors.length) errors.slice(0, 5).forEach((e) => console.log('   !', e.slice(0, 180)));
  } catch (err) {
    console.log(`${p.name}  FAILED  ${p.path}  ${String(err).slice(0, 200)}`);
  }
  await ctx.close();
}

await browser.close();
