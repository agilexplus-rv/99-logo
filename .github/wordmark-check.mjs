import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.BASE.replace(/\/$/, '');
const browser = await chromium.launch();
await mkdir('wordmark-proofs', { recursive: true });
const logos = ['ninetynine', 'ninetynine-the-sign', 'ninetynine-the-wordmark', 'ninetynine-the-sign-off', 'ninetynine-the-seal'];
const results = [];
try {
  for (const pkg of ['ember', 'clay', 'forge']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.addInitScript(() => localStorage.setItem('99-bright-seen', '1'));
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    for (const logo of logos) {
      await page.goto(base + '/', { waitUntil: 'networkidle' });
      await page.locator('#bc-topbar [data-dd="bc-mm"]').click();
      await page.locator(`#bc-mm [data-logo="${logo}"]`).click();
      await page.locator('#bc-topbar [data-dd="bc-ms"]').click();
      await page.locator(`#bc-ms [data-pkg="${pkg}"]`).click();
      const chosen = page.locator(`.logo-card[data-logo="${logo}"]`);
      assert.equal(await chosen.getAttribute('aria-pressed'), 'true');
      assert.equal(await page.locator('#sum-logo').textContent(), await chosen.getAttribute('data-name'));
      assert.equal(await page.locator('#sum-pkg').textContent(), pkg[0].toUpperCase() + pkg.slice(1));
      await chosen.screenshot({ path: `wordmark-proofs/book-${pkg}-${logo}.png` });
      for (const path of ['/site/home', '/site/services', '/site/about']) {
        await page.goto(base + path, { waitUntil: 'networkidle' });
        assert.equal(await page.locator('html').getAttribute('data-package'), pkg);
        assert.equal(await page.locator('.nav [data-logo-slot]').getAttribute('data-logo'), logo);
        assert.equal(await page.locator('.foot [data-logo-slot]').getAttribute('data-logo'), logo);
        await page.setViewportSize({ width: 390, height: 844 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, `${pkg} ${logo} ${path} mobile overflow`);
        await page.locator('#navtoggle').click();
        assert.equal(await page.locator('#navtoggle').getAttribute('aria-expanded'), 'true');
        await page.locator('#navtoggle').click();
        assert.equal(await page.locator('#navtoggle').getAttribute('aria-expanded'), 'false');
        await page.setViewportSize({ width: 1440, height: 1000 });
      }
      await page.goto(base + '/collateral', { waitUntil: 'networkidle' });
      assert.equal(await page.locator('.cpanel.active [data-logo-slot]').first().getAttribute('data-logo'), logo);
      const href = await page.locator('.cpanel.active .dlbtn').getAttribute('href');
      assert.ok(href.endsWith(`business-card-${pkg}-${logo}.pdf`), href);
      await page.locator('.cpanel.active').screenshot({ path: `wordmark-proofs/business-card-${pkg}-${logo}.png` });
      await page.goto(base + '/', { waitUntil: 'networkidle' });
      assert.equal(await page.locator(`.logo-card[data-logo="${logo}"]`).getAttribute('aria-pressed'), 'true', 'Book must preserve chosen lockup');
      results.push({ package: pkg, logo, result: 'passed' });
    }
    assert.deepEqual(errors, [], `JavaScript errors for ${pkg}`);
    await context.close();
  }
  await writeFile('wordmark-proofs/checks.json', JSON.stringify(results, null, 2));
  console.log('PASS: five written-name options × three systems; selection, persistence, summary, all mock pages, mobile menus, collateral and PDF links.');
} finally {
  await browser.close();
}
