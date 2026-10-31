/**
 * POST /api/submit — receives the client's brand-book choices and emails them to the owner.
 *
 * Transport is pluggable, because the box this was built on has no mail service:
 *   1. RESEND_API_KEY + MAIL_FROM   -> Resend HTTP API   (recommended)
 *   2. RESEND_API_KEY + default from -> onboarding@resend.dev sender
 *   3. EMAIL binding (Cloudflare Email Routing `send_email`) -> send_email
 *   4. neither -> 503 with a clear message; the UI tells the user to email directly.
 *
 * Optional: KV binding `SUBMISSIONS` stores every submission regardless of transport.
 */

const RECIPIENT = 'rudie@agilexplus.com';
const MAX = 8000;

const slug = (s) => String(s || '').replace(/[<>&"]/g, '').trim().slice(0, 160);

function field(label, value) {
  return `${label.padEnd(14)} ${value || '—'}`;
}

function collateralUrl(req) {
  try { return new URL(req.url).origin + '/collateral'; } catch (e) { return 'https://99-branding.agilexplus.dev/collateral'; }
}
function buildBody(p, req) {
  const at = new Date().toISOString();
  const ip = req.headers.get('cf-connecting-ip') || '—';
  const country = (req.cf && req.cf.country) || '—';
  return [
    'A new choice has been submitted from the 99 brand book.',
    '',
    field('Logo:', p.logoName && p.logo ? `${p.logoName} (${p.logo})` : p.logo),
    field('Package:', p.packageName && p.package ? `${p.packageName} (${p.package})` : p.package),
    '',
    field('Name:', p.name),
    field('Company:', p.company),
    field('Email:', p.email),
    '',
    'Collateral preview: ' + collateralUrl(req),
    '', 
    'Notes:',
    p.notes || '—',
    '',
    '—',
    field('Collateral:', collateralUrl(req)),
    field('Page:', p.page),
    field('Received:', at),
    field('Country:', country),
    field('IP:', ip)
  ].join('\n');
}

function htmlEscape(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function buildHtml(p) {
  const row = (k, v) => `<tr><td style="padding:6px 14px 6px 0;color:#8A8078;font:600 11px/1.6 ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;vertical-align:top">${htmlEscape(k)}</td><td style="padding:6px 0;color:#120C0A;font:15px/1.6 -apple-system,Segoe UI,sans-serif">${htmlEscape(v || '—')}</td></tr>`;
  return `<div style="background:#F7F2EB;padding:28px;font-family:-apple-system,Segoe UI,sans-serif">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:14px;padding:26px">
    <p style="margin:0 0 4px;font:600 11px/1 ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase;color:#D8440B">99 — brand book</p>
    <h1 style="margin:0 0 18px;font-size:24px;letter-spacing:-.02em;color:#120C0A">A choice has been submitted</h1>
    <table style="border-collapse:collapse;width:100%">
      ${row('Logo', p.logoName ? `${p.logoName} (${p.logo})` : p.logo)}
      ${row('Package', p.packageName ? `${p.packageName} (${p.package})` : p.package)}
      ${row('Name', p.name)}
      ${row('Company', p.company)}
      ${row('Email', p.email)}
      ${row('Notes', p.notes)}
    </table>
    <p style="margin:18px 0 0;font:12px/1.6 ui-monospace,monospace;color:#8A8078">${htmlEscape(p.page || '')}</p>
  </div></div>`;
}

async function sendViaResend(env, subject, text, html) {
  const from = env.MAIL_FROM || '99 Brand Book <onboarding@resend.dev>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from, to: [RECIPIENT], subject, text, html })
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

async function sendViaBinding(env, subject, text) {
  // Cloudflare Email Routing send_email binding expects raw MIME.
  const mime = [
    'From: 99 Brand Book <no-reply@agilexplus.dev>',
    `To: ${RECIPIENT}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="utf-8"',
    '',
    text
  ].join('\r\n');
  const { EmailMessage } = await import('cloudflare:email');
  await env.EMAIL.send(new EmailMessage('no-reply@agilexplus.dev', RECIPIENT, mime));
}

export async function onRequestPost({ request, env }) {
  const json = (body, status) => new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });

  let p;
  try {
    const raw = await request.text();
    if (raw.length > MAX) return json({ error: 'Submission too large.' }, 413);
    p = JSON.parse(raw);
  } catch {
    return json({ error: 'Malformed request.' }, 400);
  }

  p = {
    logo: slug(p.logo), logoName: slug(p.logoName),
    package: slug(p.package), packageName: slug(p.packageName),
    name: slug(p.name), company: slug(p.company),
    email: slug(p.email).slice(0, 200), notes: slug(p.notes).slice(0, 2000),
    page: slug(p.page).slice(0, 400)
  };

  if (!p.name || !p.email) return json({ error: 'Name and email are required.' }, 422);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) return json({ error: 'That email address looks invalid.' }, 422);
  if (!p.logo) return json({ error: 'No logo direction was chosen.' }, 422);

  const subject = `99 brand book — ${p.logoName || p.logo} / ${p.packageName || p.package}`;
  const text = buildBody(p, request);

  // Always keep a copy when the binding exists.
  let stored = false;
  if (env.SUBMISSIONS) {
    try {
      const key = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      await env.SUBMISSIONS.put(key, JSON.stringify({ ...p, receivedAt: new Date().toISOString() }));
      stored = true;
    } catch { /* non-fatal */ }
  }

  try {
    if (env.RESEND_API_KEY) {
      await sendViaResend(env, subject, text, buildHtml(p));
      return json({ ok: true, transport: 'resend', stored });
    }
    if (env.EMAIL) {
      await sendViaBinding(env, subject, text);
      return json({ ok: true, transport: 'cloudflare-email', stored });
    }
  } catch (err) {
    return json({
      error: stored
        ? 'Your choices were saved, but the notification email failed. Please also email rudie@agilexplus.com.'
        : 'Could not send. Please email rudie@agilexplus.com directly.',
      detail: String(err && err.message || err).slice(0, 200)
    }, 502);
  }

  return json({
    error: 'Email is not configured yet — please email rudie@agilexplus.com directly.',
    configured: false
  }, 503);
}
