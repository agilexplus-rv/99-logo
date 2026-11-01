// Renders every collateral document for every brand combination (3 systems x 4 marks).
// Filenames: pdfs/<slug>-<system>-<mark>.pdf  — so a download always matches the
// user's current selection, is a real single-page PDF, and never depends on the
// browser's print dialog (which was emitting a trailing blank page).
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = (process.env.BASE || 'https://99-branding.agilexplus.dev').replace(/\/$/, '');
const SYSTEMS = ['ember', 'clay', 'forge'];
const MARKS = ['the-sign', 'the-wordmark', 'the-sign-off', 'the-seal'];
const DOCS = [
  ['business-card', 'Business card', null],
  ['email-signature', 'Email signature', { width: '210mm', height: '90mm' }],
  ['letterhead', 'Letterhead', null],
  ['proposal', 'Proposal', null],
  ['quote', 'Quote', null],
  ['invoice', 'Invoice', null]
];

await mkdir('pdfs', { recursive: true });
const browser = await chromium.launch();
let made = 0;

for (const pkg of SYSTEMS) {
  for (const mark of MARKS) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript(([p, m]) => {
      try { localStorage.setItem('99-package', p); localStorage.setItem('99-logo', m); } catch (e) {}
    }, [pkg, mark]);
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + '/collateral', { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(300);
      for (const [slug, label, size] of DOCS) {
        await page.evaluate((lab) => {
          const it = [...document.querySelectorAll('.citem')].find((b) => b.textContent.includes(lab));
          if (it) it.click();
        }, label);
        await page.waitForTimeout(220);
        await page.emulateMedia({ media: 'print' });
        await page.waitForTimeout(120);
        await page.pdf({
          path: `pdfs/${slug}-${pkg}-${mark}.pdf`,
          printBackground: true,
          ...(size ? size : { format: 'A4' })
        });
        await page.emulateMedia({ media: 'screen' });
        made++;
      }
    } catch (e) {
      console.log(`FAILED ${pkg}/${mark}: ${String(e).slice(0, 100)}`);
    }
    await ctx.close();
  }
}
await browser.close();
console.log(`exported ${made} PDFs`);
