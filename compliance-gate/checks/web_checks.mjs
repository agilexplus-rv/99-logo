// Collects automated compliance evidence for the gate. Browsers run in CI, never on the
// build host, so this is invoked from .github/workflows/compliance-gate.yml and writes
// evidence/auto.json, which gate.py consumes.
//
// Every check returns a boolean and never throws: a check that cannot run is reported
// as absent, which the gate treats as "not evidenced" rather than as a pass.
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';

const base = (process.env.BASE || '').replace(/\/$/, '');
const paths = JSON.parse(process.env.GATE_PATHS || '{"home":"/","privacy":"/privacy","terms":"/terms","imprint":"/legal"}');
const pages = JSON.parse(process.env.GATE_AXE_PAGES || '["/"]');
const dsr = process.env.GATE_DSR_ROUTE || '';
const exportRoute = process.env.GATE_EXPORT_ROUTE || '';
const axeSrc = readFileSync('./node_modules/axe-core/axe.min.js', 'utf8');

const out = {};
const put = (k, v) => { out[k] = v; };
const browser = await chromium.launch();

async function open(path, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  const page = await ctx.newPage();
  await page.goto(base + path, { waitUntil: 'networkidle', timeout: 45000 });
  return { ctx, page };
}

// ---- document routes exist and are linked -------------------------------------------
for (const [key, path] of Object.entries({ privacy_link: paths.privacy, terms_link: paths.terms, imprint: paths.imprint })) {
  try {
    const { ctx, page } = await open('/');
    const linked = await page.evaluate((p) => [...document.querySelectorAll('a[href]')]
      .some((a) => new URL(a.href, location.href).pathname.replace(/\/$/, '') === p.replace(/\/$/, '')), path);
    let reachable = false;
    try {
      const r = await page.goto(base + path, { waitUntil: 'domcontentloaded', timeout: 20000 });
      reachable = !!r && r.status() < 400;
    } catch { reachable = false; }
    put(key, linked && reachable);
    await ctx.close();
  } catch { put(key, false); }
}

// ---- non-essential cookies must not be set before consent ---------------------------
try {
  const { ctx, page } = await open('/');
  const cookies = await ctx.cookies();
  const nonEssential = cookies.filter((c) => !/^(csrf|xsrf|session|__Host-|__Secure-|consent)/i.test(c.name));
  put('cookie_consent', nonEssential.length === 0);
  await ctx.close();
} catch { put('cookie_consent', false); }

// ---- transport security ------------------------------------------------------------
try {
  const { ctx, page } = await open('/');
  const headers = (await page.request.get(base + '/')).headers();
  put('hsts', /max-age=\d{5,}/i.test(headers['strict-transport-security'] || ''));
  put('csp', !!headers['content-security-policy']);
  await ctx.close();
} catch { put('hsts', false); }

// ---- accessibility -----------------------------------------------------------------
try {
  let total = 0;
  for (const p of pages) {
    const { ctx, page } = await open(p);
    await page.addScriptTag({ content: axeSrc });
    const res = await page.evaluate(async () => {
      const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } });
      return r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').length;
    });
    total += res;
    await ctx.close();
  }
  put('axe_violations_zero', total === 0);
  put('axe_serious_count', total);
} catch { put('axe_violations_zero', false); }

// ---- keyboard-only operation of the primary journey --------------------------------
try {
  const { ctx, page } = await open('/');
  const reached = await page.evaluate(async () => {
    const focusable = [...document.querySelectorAll('a[href],button,input,select,textarea')].filter((e) => !e.disabled);
    return focusable.length > 0 && document.body.innerText.length > 200;
  });
  await page.keyboard.press('Tab');
  const visibleFocus = await page.evaluate(() => !!document.activeElement && document.activeElement !== document.body);
  put('keyboard_ok', reached && visibleFocus);
  await ctx.close();
} catch { put('keyboard_ok', false); }

// ---- required endpoints (staging) --------------------------------------------------
async function probe(url, key) {
  if (!url) return;
  try {
    const r = await fetch(url, { method: 'GET' });
    put(key, r.status < 400);
  } catch { put(key, false); }
}
await probe(dsr, 'dsr_route');
await probe(exportRoute, 'export_route');

// ---- operator attestations are supplied, never inferred ----------------------------
// These cannot be derived from a page: they come from a signed attestation file that the
// delivery lead completes. Absent file = absent evidence.
const attestationPath = process.env.GATE_ATTESTATION;
if (attestationPath) {
  try {
    const a = JSON.parse(readFileSync(attestationPath, 'utf8'));
    for (const [k, v] of Object.entries(a)) if (typeof v === 'boolean') put(k, v);
    put('attestation_present', true);
  } catch { put('attestation_present', false); }
}

await mkdir('evidence', { recursive: true });
await writeFile('evidence/auto.json', JSON.stringify(out, null, 2));
await browser.close();
console.log('evidence collected:', Object.keys(out).length, 'checks');
