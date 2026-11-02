import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const base=(process.env.BASE||'https://99-branding.agilexplus.dev').replace(/\/$/,'');
await mkdir('pdfs',{recursive:true});await mkdir('wordmark-proofs',{recursive:true});
const browser=await chromium.launch();
try {
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  await page.goto(base+'/collateral',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  for(const slug of ['business-card','email-signature','letterhead','proposal','quote','invoice']) {
    await page.locator(`.citem[data-target="${slug}"]`).click();
    await page.emulateMedia({media:'print'});
    await page.pdf({path:`pdfs/${slug}.pdf`,format:'A4',printBackground:true,tagged:true});
    await page.emulateMedia({media:'screen'});
    await page.locator('.cpanel.active .doc').screenshot({path:`pdfs/final-${slug}.png`});
  }
  for(const [path,name] of [['/','brand-guidelines'],['/company-activities','company-activities']]) {
    await page.goto(base+path,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
    await page.pdf({path:`pdfs/${name}.pdf`,format:'A4',printBackground:true,preferCSSPageSize:true,tagged:true});
  }
  await page.close();
  console.log('PASS: exported six final specimen PDFs, brand guidelines and company activities');
} finally {await browser.close();}
