import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir,writeFile } from 'node:fs/promises';
const base=process.env.BASE.replace(/\/$/,'');const browser=await chromium.launch();
await mkdir('wordmark-proofs',{recursive:true});const results=[];
try {
 for(const mode of ['dark','light']) {
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await context.addInitScript(m=>{localStorage.setItem('99-package','ember');localStorage.setItem('99-logo','the-sign');localStorage.setItem('99-mode',m);},mode);
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const path of ['/site/home','/site/services','/site/about']) {
   await page.goto(base+path,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.locator('html').getAttribute('data-package'),'forge');
   assert.equal(await page.locator('.nav [data-logo-slot]').getAttribute('data-logo'),'ninetynine-the-wordmark');
   const font=await page.locator('h1').evaluate(e=>getComputedStyle(e).fontFamily);assert.ok(font.includes('Inter Tight'),font);
   assert.equal(await page.locator('a[href="mailto:contact@ninetynine.eu"]').count(),1);
   const text=await page.locator('body').innerText();assert.ok(!text.includes('99.system'));
   await page.screenshot({path:`wordmark-proofs/final-${mode}-${path.split('/').pop()}.png`,fullPage:true});
   for(const width of [390,320]){
    await page.setViewportSize({width,height:844});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${path} overflow at ${width}`);
    await page.locator('#navtoggle').click();assert.equal(await page.locator('#navtoggle').getAttribute('aria-expanded'),'true');
    await page.locator('#navtoggle').click();assert.equal(await page.locator('#navtoggle').getAttribute('aria-expanded'),'false');
   }
   await page.setViewportSize({width:1440,height:1000});
  }
  await page.goto(base+'/collateral',{waitUntil:'networkidle'});
  for(const slug of ['business-card','email-signature','letterhead','proposal','quote','invoice']){
   await page.locator(`[data-target="${slug}"]`).click();
   assert.equal(await page.locator('.cpanel.active').getAttribute('data-doc'),slug);
   assert.equal(await page.locator('.cpanel.active .dlbtn').getAttribute('href'),`downloads/${slug}.pdf`);
   assert.equal(await page.locator('.cpanel.active [data-logo-slot]').getAttribute('data-logo'),'ninetynine-the-wordmark');
   if(!['business-card','email-signature'].includes(slug))assert.ok((await page.locator('.cpanel.active .docfoot').innerText()).includes('UNVERIFIED'));
  }
  await page.goto(base+'/',{waitUntil:'networkidle'});
  assert.ok((await page.locator('body').innerText()).includes('ninetynine.eu'));
  assert.deepEqual(errors,[]);results.push({mode,status:'passed'});await context.close();
 }
 await writeFile('wordmark-proofs/checks.json',JSON.stringify(results,null,2));console.log('PASS: approved identity migration, fonts, domain, responsive pages, collateral and downloads');
} finally {await browser.close();}
