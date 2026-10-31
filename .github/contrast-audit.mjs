// WCAG contrast audit across every package × mode × page combination.
// Uses axe-core's colour-contrast rule on the rendered DOM, so it measures what users see.
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const BASE = (process.env.BASE || 'https://99-branding.agilexplus.dev').replace(/\/$/, '');
const PACKAGES = ['ember', 'clay', 'forge'];
const MODES = ['dark', 'light'];
const PAGES = [
  ['home', '/site/home'],
  ['services', '/site/services'],
  ['about', '/site/about'],
  ['collateral', '/collateral']
];

const axeSrc = readFileSync('./node_modules/axe-core/axe.min.js', 'utf8');

const browser = await chromium.launch();
let total = 0;
const rows = [];

for (const pkg of PACKAGES) {
  for (const mode of MODES) {
    for (const [name, path] of PAGES) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      await ctx.addInitScript(([p, m]) => {
        try { localStorage.setItem('99-package', p); localStorage.setItem('99-mode', m); } catch (e) {}
      }, [pkg, mode]);
      const page = await ctx.newPage();
      let found = [];
      try {
        await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45000 });
        // make hidden sections measurable
        await page.evaluate(() => {
          document.querySelectorAll('.reveal').forEach((e) => e.classList.add('in'));
          document.querySelectorAll('.jscreen').forEach((e) => e.classList.add('active'));
        });
        await page.waitForTimeout(400);
        await page.addScriptTag({ content: axeSrc });
        const res = await page.evaluate(async () => {
          const r = await axe.run(document, { runOnly: { type: 'rule', values: ['color-contrast'] } });
          return r.violations.flatMap((v) => v.nodes.map((n) => ({
            target: n.target.join(' '),
            summary: (n.any[0] && n.any[0].message) || v.help
          })));
        });
        found = res;
      } catch (err) {
        found = [{ target: 'PAGE', summary: 'audit failed: ' + String(err).slice(0, 120) }];
      }
      await ctx.close();
      rows.push({ pkg, mode, name, found });
      total += found.length;
    }
  }
}
await browser.close();

for (const r of rows) {
  if (!r.found.length) continue;
  console.log(`\n## ${r.pkg}/${r.mode} ${r.name} — ${r.found.length}`);
  r.found.slice(0, 8).forEach((f) => {
    console.log(`   ${f.target}  ::  ${String(f.summary).replace(/\s+/g, ' ').slice(0, 130)}`);
  });
}
console.log(`\nTOTAL CONTRAST VIOLATIONS: ${total}`);

// ---- mobile responsiveness check: no horizontal overflow, hamburger present ----
const mobile = await chromium.launch();
console.log('\n=== MOBILE (390x844) ===');
for (const [name, path] of PAGES) {
  const ctx = await mobile.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45000 });
    await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('in')));
    await page.waitForTimeout(350);
    const m = await page.evaluate(() => {
      const d = document.documentElement;
      let widest = null, worst = 0;
      document.querySelectorAll('body *').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.right > window.innerWidth + 2) {
          if (r.right - window.innerWidth > worst) { worst = r.right - window.innerWidth; widest = el.className || el.tagName; }
        }
      });
      const burger = document.getElementById('navtoggle');
      return {
        overflow: d.scrollWidth - window.innerWidth,
        worstOverflow: Math.round(worst),
        worstEl: String(widest).slice(0, 60),
        burgerVisible: burger ? getComputedStyle(burger).display !== 'none' : false
      };
    });
    console.log(`${name.padEnd(11)} overflow=${m.overflow}px  worst=${m.worstOverflow}px (${m.worstEl})  hamburger=${m.burgerVisible}`);
  } catch (e) { console.log(`${name} mobile check failed`); }
  await ctx.close();
}
await mobile.close();

// ---- anchor scroll accuracy: target must land just below the always-visible chrome ----
const anc = await chromium.launch();
console.log('\n=== ANCHOR ALIGNMENT (desktop) ===');
for (const [name, path, sel] of [['home', '/site/home', '#how'], ['services', '/site/services', '#engagement']]) {
  const ctx = await anc.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 45000 });
    await page.evaluate((s) => { const a = document.querySelector('a[href$="' + s + '"]'); if (a) a.click(); }, sel);
    await page.waitForTimeout(1200);
    const r = await page.evaluate((s) => {
      const el = document.querySelector(s);
      const bar = document.getElementById('bc-topbar');
      const nav = document.querySelector('.nav');
      const chrome = (bar ? bar.offsetHeight : 0) + (nav ? nav.offsetHeight : 0);
      return { top: el ? Math.round(el.getBoundingClientRect().top) : null, chrome: Math.round(chrome) };
    }, sel);
    const ok = r.top !== null && r.top >= r.chrome - 24 && r.top <= r.chrome + 80;
    console.log(`${name.padEnd(9)} ${sel} top=${r.top}px chrome=${r.chrome}px ${ok ? 'OK' : 'MISALIGNED'}`);
  } catch (e) { console.log(`${name} anchor check failed`); }
  await ctx.close();
}
await anc.close();
