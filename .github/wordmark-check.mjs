import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.BASE.replace(/\/$/, '');
const browser = await chromium.launch();
await mkdir('wordmark-proofs', { recursive: true });
const results = [];
try {
  for (const pkg of ['ember', 'clay', 'forge']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.addInitScript(() => localStorage.setItem('99-bright-seen', '1'));
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    await page.locator('#bc-topbar [data-dd="bc-mm"]').click();
    await page.locator('#bc-mm [data-logo="ninetynine"]').click();
    await page.locator('#bc-topbar [data-dd="bc-ms"]').click();
    await page.locator(`#bc-ms [data-pkg="${pkg}"]`).click();
    assert.equal(await page.locator('#sum-logo').textContent(), 'ninetynine');
    assert.equal(await page.locator('#sum-pkg').textContent(), pkg[0].toUpperCase() + pkg.slice(1));
    assert.equal(await page.locator('.logo-card[data-logo="ninetynine"]').getAttribute('aria-pressed'), 'true');
    await page.locator('.logo-card[data-logo="ninetynine"]').screenshot({ path: `wordmark-proofs/book-${pkg}.png` });
    for (const path of ['/site/home', '/site/services', '/site/about']) {
      await page.goto(base + path, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('html').getAttribute('data-package'), pkg);
      assert.equal(await page.locator('.nav [data-logo-slot]').getAttribute('data-logo'), 'ninetynine');
      assert.equal(await page.locator('.foot [data-logo-slot]').getAttribute('data-logo'), 'ninetynine');
      await page.setViewportSize({ width: 390, height: 844 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${pkg} ${path} mobile overflow`);
      await page.locator('#navtoggle').click();
      assert.equal(await page.locator('#navtoggle').getAttribute('aria-expanded'), 'true');
      if (path.endsWith('/home')) await page.screenshot({ path: `wordmark-proofs/home-mobile-${pkg}.png` });
      await page.setViewportSize({ width: 1440, height: 1000 });
    }
    await page.goto(base + '/collateral', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.cpanel.active [data-logo-slot]').first().getAttribute('data-logo'), 'ninetynine');
    const href = await page.locator('.cpanel.active .dlbtn').getAttribute('href');
    assert.ok(href.endsWith(`business-card-${pkg}-ninetynine.pdf`), href);
    await page.locator('.cpanel.active').screenshot({ path: `wordmark-proofs/business-card-${pkg}.png` });
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    assert.equal(await page.locator('#sum-logo').textContent(), 'ninetynine', 'Book must preserve selected wordmark on revisit');
    assert.deepEqual(errors, [], `JavaScript errors for ${pkg}`);
    results.push({ package: pkg, result: 'passed' });
    await context.close();
  }
  await writeFile('wordmark-proofs/checks.json', JSON.stringify(results, null, 2));
  console.log('PASS: written wordmark selection, persistence, summary, all mock pages, mobile menus, collateral and PDF link across all three systems.');
} finally {
  await browser.close();
}
