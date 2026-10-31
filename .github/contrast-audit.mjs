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
