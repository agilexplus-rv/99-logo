// Renders each collateral document to a real PDF (via Chromium in CI) and a PNG proof,
// so the documents can be downloaded and opened offline. Browsers are not allowed on the
// build host, hence CI.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = (process.env.BASE || 'https://99-branding.agilexplus.dev').replace(/\/$/, '');

// slug, menu label, page size (null = A4)
const DOCS = [
  ['business-card', 'Business card', { width: '85mm', height: '55mm' }],
  ['email-signature', 'Email signature', { width: '210mm', height: '90mm' }],
  ['letterhead', 'Letterhead', null],
  ['proposal', 'Proposal', null],
  ['quote', 'Quote', null],
  ['invoice', 'Invoice', null]
];

await mkdir('pdfs', { recursive: true });
const browser = await chromium.launch();

for (const [slug, label, size] of DOCS) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  try {
    await page.goto(BASE + '/collateral', { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(400);
    await page.evaluate((lab) => {
      const it = [...document.querySelectorAll('.citem')].find((b) => b.textContent.includes(lab));
      if (it) it.click();
    }, label);
    await page.waitForTimeout(500);
    await page.emulateMedia({ media: 'print' });
    await page.waitForTimeout(250);
    if (slug === 'business-card') {
      const tall = await page.evaluate(() => {
        const out = [];
        document.querySelectorAll('body, body *').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.height > 700 || r.width > 800) {
            out.push(`${el.tagName}.${String(el.className || '').split(' ')[0]} h=${Math.round(r.height)} w=${Math.round(r.width)}`);
          }
        });
        return out.slice(0, 14);
      });
      console.log('PRINT-DEBUG ' + JSON.stringify(tall));
    }
    await page.pdf({
      path: `pdfs/${slug}.pdf`,
      printBackground: true,
      ...(size ? size : { format: 'A4' })
    });
    // a screenshot proof of the same document (used to confirm nothing is clipped)
    await page.emulateMedia({ media: 'screen' });
    const el = await page.$('.cpanel.active .doc');
    if (el) await el.screenshot({ path: `pdfs/${slug}.png` });
    console.log(`pdf ${slug} ok`);
  } catch (e) {
    console.log(`pdf ${slug} FAILED ${String(e).slice(0, 120)}`);
  }
  await ctx.close();
}
await browser.close();
