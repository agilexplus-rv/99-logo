/* 99 — brand book interactions: package switching, logo choice, submission. */
(function () {
  'use strict';
  var B = window.Brand99;
  var state = { logo: null, pkg: null };

  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------------- decision bar ---------------- */
  function paintSummary() {
    var l = state.logo ? document.querySelector('.logo-card[data-logo="' + state.logo + '"]') : null;
    var p = B.PACKAGES[state.pkg] || {};
    $('#sum-logo').textContent = l ? l.getAttribute('data-name') : 'not chosen';
    $('#sum-pkg').textContent = p.name || '—';
    var sumField = $('#f-summary');
    if (sumField) {
      sumField.value = (l ? l.getAttribute('data-name') : '—') + '  ·  ' + (p.name || '—');
    }
  }

  /* ---------------- packages ---------------- */
  function setPackage(key, opts) {
    opts = opts || {};
    state.pkg = key;
    B.set(key);
    $all('.pkg').forEach(function (el) {
      el.setAttribute('aria-pressed', String(el.dataset.pkg === key));
    });
    paintSpecimen(key);
    paintSummary();
    if (!opts.silent) refreshFrames(key);
  }

  function paintSpecimen(key) {
    var t = B.PACKAGES[key].tokens, r = B.ratios(key);
    var sw = [
      ['Ink', t['--ink'], 'default ground'],
      ['Paper', t['--paper'], 'light ground'],
      ['Accent', t['--accent'], 'on Ink — large text + UI'],
      ['Accent (light ground)', t['--accent-ink'], 'on Paper — any size'],
      ['Sand', t['--sand'], 'secondary text'],
      ['Slate', t['--slate'], 'tertiary / dividers']
    ];
    $('#swatches').innerHTML = sw.map(function (s) {
      return '<div><div class="chip" style="background:' + s[1] + '"></div>' +
             '<b>' + s[0] + '</b><code>' + s[1].toUpperCase() + '</code><span>' + s[2] + '</span></div>';
    }).join('');
    var rr = $('#ratios');
    if (rr) {
      rr.innerHTML =
        '<span>accent/ink <em>' + r.accentOnInk.toFixed(2) + ':1</em></span>' +
        '<span>accent/paper <em>' + r.accentOnPaper.toFixed(2) + ':1</em></span>' +
        '<span>paper/ink <em>' + r.paperOnInk.toFixed(2) + ':1</em></span>' +
        '<span>sand/ink <em>' + r.sandOnInk.toFixed(2) + ':1</em></span>';
    }
    var fam = $('#fontnames');
    if (fam) {
      fam.innerHTML = '<b>' + t['--font-display'].split(',')[0].replace(/"/g, '') + '</b> (display) · ' +
        '<b>' + t['--font-mono'].split(',')[0].replace(/"/g, '') + '</b> (numerals &amp; labels) · ' +
        '<b>' + t['--font-body'].split(',')[0].replace(/"/g, '') + '</b> (body)';
    }
  }

  /* ---------------- mock-site iframes ---------------- */
  function refreshFrames(key) {
    $all('iframe[data-site]').forEach(function (f) {
      var base = f.getAttribute('data-site');
      f.src = base + '?pkg=' + encodeURIComponent(key) + '&t=' + Date.now();
    });
  }

  /* ---------------- logos ---------------- */
  function setLogo(id) {
    state.logo = id;
    try { window.Brand99.setLogo(id); window.Brand99.injectLogos(); window.Brand99.syncControl(); } catch (e) {}
    $all('.logo-card').forEach(function (el) {
      el.setAttribute('aria-pressed', String(el.dataset.logo === id));
    });
    var chosen = document.querySelector('.logo-card[data-logo="' + id + '"]');
    if (chosen) {
      var art = chosen.querySelector('.stage').innerHTML;
      $all('[data-inject]').forEach(function (slot) { slot.innerHTML = art; });
      var nm = chosen.getAttribute('data-name');
      $all('[data-inject-name]').forEach(function (s) { s.textContent = nm; });
    }
    paintSummary();
  }

  /* ---------------- submit ---------------- */
  function submit(e) {
    e.preventDefault();
    var st = $('#status');
    if (!state.logo) { st.className = 'status err'; st.textContent = 'Choose a logo direction first.'; return; }
    var payload = {
      logo: state.logo,
      logoName: (document.querySelector('.logo-card[data-logo="' + state.logo + '"]') || {}).getAttribute
        ? document.querySelector('.logo-card[data-logo="' + state.logo + '"]').getAttribute('data-name') : state.logo,
      package: state.pkg,
      packageName: (B.PACKAGES[state.pkg] || {}).name || state.pkg,
      name: $('#f-name').value.trim(),
      company: $('#f-company').value.trim(),
      email: $('#f-email').value.trim(),
      notes: $('#f-notes').value.trim(),
      page: location.href
    };
    if (!payload.name || !payload.email) {
      st.className = 'status err'; st.textContent = 'Name and email are required.'; return;
    }
    var btn = $('#submit-btn');
    btn.disabled = true;
    st.className = 'status'; st.textContent = 'Sending…';

    fetch('/api/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    }).then(function (res) { return res.json().then(function (j) { return { ok: res.ok, j: j }; }); })
      .then(function (r) {
        if (r.ok) {
          st.className = 'status ok';
          st.textContent = '✓ Sent. Rudie has your choices — thank you.';
          btn.textContent = 'Sent';
        } else {
          st.className = 'status err';
          st.textContent = r.j && r.j.error ? r.j.error : 'Could not send. Please email rudie@agilexplus.com directly.';
          btn.disabled = false;
        }
      })
      .catch(function () {
        st.className = 'status err';
        st.textContent = 'Network error. Please email rudie@agilexplus.com directly.';
        btn.disabled = false;
      });
  }

  /* ---------------- boot ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    state.pkg = B.current();
    setPackage(state.pkg, { silent: true });
    paintSpecimen(state.pkg);

    $all('.pkg').forEach(function (el) {
      el.addEventListener('click', function () { setPackage(el.dataset.pkg); });
    });
    $all('.logo-card').forEach(function (el) {
      el.addEventListener('click', function () { setLogo(el.dataset.logo); });
    });
    var f = $('#choose-form');
    if (f) f.addEventListener('submit', submit);

    // default to the recommended direction so the page opens in a real state
    var rec = document.querySelector('.logo-card[data-recommended="true"]');
    if (rec) setLogo(rec.dataset.logo);
    paintSummary();
  });
})();
