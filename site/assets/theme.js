/* 99 brand system — single source of truth for themed packages.
 *
 * A "package" is a palette + type pairing that is deliberately bundled, because the two
 * decisions are not independent:
 *   1. HARD constraint - every accent must clear 4.5:1 on Paper and 3:1 on Ink,
 *      so it can be used at body size on light and large size on dark. Measured, not guessed.
 *   2. SOFT constraint - the typeface sets the voice (grotesk = neutral/confident,
 *      serif = editorial/premium, mono = engineering-forward) and the palette has to
 *      agree with that voice or the brand reads as two different companies.
 * mix() in the book lets the client see *why* the bad pairings were never offered.
 */
(function (global) {
  'use strict';

  var PACKAGES = {
    ember: {
      name: 'Ember',
      tagline: 'Warm black, one vermilion accent, grotesk voice',
      mood: 'Confident and direct. The reference direction, tightened.',
      accentRole: 'On Ink: large text and UI only. On Paper: use --accent-ink, which clears 4.5:1 at any size.',
      tokens: {
        '--ink': '#120C0A',
        '--paper': '#FAF5EE',
        '--surface': '#1B120E',
        '--surface-2': '#150E0B',
        '--sand': '#E9CBA9',
        '--slate': '#8A8078',
        '--accent': '#D3420B',
        '--accent-ink': '#C63E0A',
        '--accent-text': '#DA4B14',
        '--on-accent': '#FFFFFF',
        '--muted-ink': '#756C66',
        '--accent-pale': '#FFD9C2',
        '--accent-deep': '#6E1F06',
        '--accent-soft': 'rgba(216,68,11,.14)',
        '--line': 'rgba(233,203,169,.16)',
        '--font-display': '"Inter Tight", Inter, system-ui, -apple-system, "Segoe UI", sans-serif',
        '--font-body': '"Inter Tight", Inter, system-ui, -apple-system, "Segoe UI", sans-serif',
        '--font-mono': '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
        '--display-weight': '640',
        '--display-track': '-0.035em',
        '--display-case': 'none',
        '--radius': '18px',
        '--rule': '1px'
      }
    },
    clay: {
      name: 'Clay',
      tagline: 'Warm brown-black, muted terracotta, serif voice',
      mood: 'Editorial and premium. Reads like a considered consultancy, not a vendor.',
      accentRole: 'On Ink: large text and UI only. On Paper: use --accent-ink, which clears 4.5:1 at any size.',
      tokens: {
        '--ink': '#1A1310',
        '--paper': '#F7F1E7',
        '--surface': '#241A15',
        '--surface-2': '#1F1611',
        '--sand': '#DFC7AC',
        '--slate': '#8C8078',
        '--accent': '#B75B37',
        '--accent-ink': '#AB5534',
        '--accent-text': '#C26641',
        '--on-accent': '#FFFFFF',
        '--muted-ink': '#766B65',
        '--accent-pale': '#EBD6C8',
        '--accent-deep': '#6B2E17',
        '--accent-soft': 'rgba(192,96,58,.15)',
        '--line': 'rgba(223,199,172,.17)',
        '--font-display': '"Newsreader", Georgia, "Times New Roman", serif',
        '--font-body': '"Inter Tight", Inter, system-ui, -apple-system, sans-serif',
        '--font-mono': '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
        '--display-weight': '500',
        '--display-track': '-0.02em',
        '--display-case': 'none',
        '--radius': '6px',
        '--rule': '1px'
      }
    },
    forge: {
      name: 'Forge',
      tagline: 'Cool near-black, brass accent, mono-led voice',
      mood: 'Engineering-forward. The site looks like something that was built, not styled.',
      accentRole: 'On Ink: large text and UI only. On Paper: use --accent-ink, which clears 4.5:1 at any size.',
      tokens: {
        '--ink': '#0C1013',
        '--paper': '#F4F2ED',
        '--surface': '#141A1E',
        '--surface-2': '#111619',
        '--sand': '#CFC6B4',
        '--slate': '#7F8489',
        '--accent': '#C9973F',
        '--accent-ink': '#8A682B',
        '--accent-text': '#C9973F',
        '--on-accent': '#0C1013',
        '--muted-ink': '#6A6E73',
        '--accent-pale': '#EFE3C0',
        '--accent-deep': '#6B4E15',
        '--accent-soft': 'rgba(201,151,63,.14)',
        '--line': 'rgba(207,198,180,.16)',
        '--font-display': '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
        '--font-body': '"Inter Tight", Inter, system-ui, -apple-system, sans-serif',
        '--font-mono': '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
        '--display-weight': '700',
        '--display-track': '-0.03em',
        '--display-case': 'none',
        '--radius': '4px',
        '--rule': '1px'
      }
    }
  };

  var ORDER = ['ember', 'clay', 'forge'];

  /* ---------- contrast maths, so the book can show real numbers ---------- */
  function srgb(c) { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function luminance(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return 0.2126 * srgb(parseInt(h.slice(0, 2), 16)) +
           0.7152 * srgb(parseInt(h.slice(2, 4), 16)) +
           0.0722 * srgb(parseInt(h.slice(4, 6), 16));
  }
  function contrast(a, b) {
    var la = luminance(a), lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }

  function apply(key, doc) {
    doc = doc || global.document;
    var pkg = PACKAGES[key] || PACKAGES.ember;
    var root = doc.documentElement;
    root.setAttribute('data-package', key in PACKAGES ? key : 'ember');
    Object.keys(pkg.tokens).forEach(function (k) {
      root.style.setProperty(k, pkg.tokens[k]);
    });
    var m = mode();
    root.setAttribute('data-mode', m);
    if (m === 'light') {
      root.style.setProperty('--ink', pkg.tokens['--paper']);
      root.style.setProperty('--paper', pkg.tokens['--ink']);
      root.style.setProperty('--surface', '#FFFDFA');
      root.style.setProperty('--surface-2', '#ffffff');
      root.style.setProperty('--line', 'rgba(0,0,0,.10)');
      root.style.setProperty('--accent-soft', 'color-mix(in srgb,' + pkg.tokens['--accent'] + ' 12%, transparent)');
      /* the mock-site "reference" palette was tuned for a dark ground: invert it */
      root.style.setProperty('--sand', '#5A5049');
      root.style.setProperty('--slate', pkg.tokens['--muted-ink']);
      root.style.setProperty('--ref-muted-dark', '#5A5049');
      root.style.setProperty('--ref-hair', 'rgba(0,0,0,.12)');
      root.style.setProperty('--ref-cream', pkg.tokens['--ink']);
      root.style.setProperty('--ref-panel', '#FFFFFF');
      root.style.setProperty('--ref-panel-2', '#FFFFFF');
    } else {
      ['--ref-muted-dark', '--ref-hair', '--ref-cream', '--ref-panel', '--ref-panel-2'].forEach(function (k) {
        root.style.removeProperty(k);
      });
    }
    return key;
  }

  function current() {
    try { return global.localStorage.getItem('99-package') || 'ember'; } catch (e) { return 'ember'; }
  }

  function set(key) {
    try { global.localStorage.setItem('99-package', key); } catch (e) {}
    return apply(key);
  }

  /* ---------- logo catalogue: one mark per direction (currentColor, so it themes) ---------- */
  var LOGOS = {
    'the-sign': '<svg viewBox="0 0 256 256" aria-hidden="true"><g fill="currentColor"><path d="M78 56a42 42 0 1 1 0 84a42 42 0 1 1 0 -84ZM120 98C120 150.5 109.5 179.9 59.1 198.8L51.75 186.07C86.4 168.56 99 148.4 97.93 136.22ZM178 56a42 42 0 1 1 0 84a42 42 0 1 1 0 -84ZM220 98C220 150.5 209.5 179.9 159.1 198.8L151.75 186.07C186.4 168.56 199 148.4 197.93 136.22Z"/></g></svg>',
    'the-wordmark': '<svg viewBox="0 0 344 256" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" transform="translate(28 15) scale(1.3)" d="M52 8 C23 8 4 28 4 56 C4 84 22 102 48 102 C60 102 70 98 77 90 C73 119 55 136 24 144 L32 166 C79 154 104 120 104 65 V57 C104 27 84 8 52 8 Z M52 31 C36 31 27 41 27 56 C27 71 37 80 52 80 C68 80 79 70 79 55 C79 40 69 31 52 31 Z"/><path fill="currentColor" fill-rule="evenodd" transform="translate(181 15) scale(1.3)" d="M52 8 C23 8 4 28 4 56 C4 84 22 102 48 102 C60 102 70 98 77 90 C73 119 55 136 24 144 L32 166 C79 154 104 120 104 65 V57 C104 27 84 8 52 8 Z M52 31 C36 31 27 41 27 56 C27 71 37 80 52 80 C68 80 79 70 79 55 C79 40 69 31 52 31 Z"/></svg>',
    'the-sign-off': '<svg viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M28 92a46 46 0 1 0 92 0a46 46 0 1 0 -92 0Z M52 92a22 22 0 1 0 44 0a22 22 0 1 0 -44 0Z"/><path fill="currentColor" d="M96 92h24v80h-24Z"/><path fill="currentColor" fill-rule="evenodd" d="M136 92a46 46 0 1 0 92 0a46 46 0 1 0 -92 0Z M160 92a22 22 0 1 0 44 0a22 22 0 1 0 -44 0Z"/><path fill="currentColor" d="M204 92H228V192A24 24 0 0 1 204 216H28V192H204Z"/></svg>',
    'the-seal': '<svg viewBox="0 0 256 256" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M 52 24 H 204 L 232 52 V 204 L 204 232 H 52 L 24 204 V 52 Z M 56 52 H 104 L 116 64 V 192 L 104 204 H 56 L 80 180 H 92 V 136 H 56 L 44 124 V 64 Z M 68 76 H 92 V 112 H 68 Z M 152 52 H 200 L 212 64 V 192 L 200 204 H 152 L 176 180 H 188 V 136 H 152 L 140 124 V 64 Z M 164 76 H 188 V 112 H 164 Z"/></svg>'
  };
  var LOGO_ORDER = ['the-sign', 'the-wordmark', 'the-sign-off', 'the-seal'];

  function getLogo() {
    try { var k = global.localStorage.getItem('99-logo'); return k in LOGOS ? k : 'the-sign'; }
    catch (e) { return 'the-sign'; }
  }
  function setLogo(key) {
    try { global.localStorage.setItem('99-logo', key in LOGOS ? key : 'the-sign'); } catch (e) {}
  }
  function logoMark(key) { return LOGOS[key in LOGOS ? key : getLogo()]; }
  function injectLogos(doc) {
    doc = doc || global.document;
    var key = getLogo();
    Array.prototype.forEach.call(doc.querySelectorAll('[data-logo-slot]'), function (el) {
      el.innerHTML = logoMark(key);
      el.setAttribute('data-logo', key);
    });
    /* Only "The Sign" is a quotation mark, so only then does it need the "99" wordmark
       beside it. Every other mark already reads "99" — pairing them would say it twice. */
    var needsWord = (key === 'the-sign');
    Array.prototype.forEach.call(doc.querySelectorAll('[data-wordmark]'), function (el) {
      el.style.display = needsWord ? '' : 'none';
    });
  }

  function boot() {
    apply(current());
    injectLogos();
    mountControl();
    // keep sibling mock-site tabs in step
    global.addEventListener('storage', function (e) {
      if (e.key === '99-package') { apply(e.newValue || 'ember'); syncControl(); }
      if (e.key === '99-logo') { injectLogos(); syncControl(); }
      if (e.key === '99-mode') { apply(current()); syncControl(); }
    });
  }

  /* ---------- global control: sticky brand bar (mark + system + mode) ---------- */
  var SW_LABELS = { 'the-sign': 'The Sign', 'the-wordmark': 'Wordmark', 'the-sign-off': 'Sign-off', 'the-seal': 'Seal' };

  function isBook() {
    try { return global.location && (global.location.pathname === '/' || global.location.pathname === '/index'); }
    catch (e) { return false; }
  }
  function mode() {
    try { return global.localStorage.getItem('99-mode') === 'light' ? 'light' : 'dark'; } catch (e) { return 'dark'; }
  }
  function setMode(m) {
    try { global.localStorage.setItem('99-mode', m); } catch (e) {}
    apply(current()); injectLogos();
  }

  function controlCSS() {
    return '.bc-topbar{position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;align-items:center;gap:10px;min-height:48px;' +
      'padding:6px 14px;background:color-mix(in srgb,var(--ink) 96%,transparent);backdrop-filter:blur(12px);' +
      'border-bottom:1px solid var(--line);border-top:2px solid var(--accent);font-family:var(--font-body)}' +
      '.bc-topbar .bc-tag{font-family:var(--font-mono);font-size:.56rem;letter-spacing:.14em;text-transform:uppercase;color:var(--slate);' +
      'border:1px solid var(--line);padding:4px 9px;border-radius:6px;white-space:nowrap}' +
      '.bc-topbar .bc-ctl{display:flex;align-items:center;gap:6px;margin-left:auto}' +
      '.bc-dd{position:relative}' +
      '.bc-btn{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--line);background:transparent;' +
      'color:var(--paper);border-radius:99px;padding:6px 11px;font-size:.76rem;font-family:inherit;cursor:pointer;' +
      'transition:.18s;white-space:nowrap}' +
      '.bc-btn:hover{border-color:var(--accent)}' +
      '.bc-mini{width:18px;height:18px;color:var(--accent);display:inline-grid;place-items:center}' +
      '.bc-mini svg{width:100%;height:100%}' +
      '.bc-sw{display:inline-flex;gap:2px}' +
      '.bc-sw i{width:8px;height:14px;border-radius:2px}' +
      '.bc-menu{position:absolute;right:0;top:calc(100% + 6px);min-width:200px;background:var(--surface-2);' +
      'border:1px solid var(--line);border-radius:12px;padding:6px;box-shadow:0 24px 60px -24px #000;z-index:1001}' +
      '.bc-menu[hidden]{display:none}' +
      '.bc-item{display:flex;align-items:center;gap:10px;width:100%;text-align:left;border:0;background:transparent;' +
      'color:var(--paper);padding:8px 10px;border-radius:8px;font-size:.8rem;font-family:inherit;cursor:pointer}' +
      '.bc-item:hover{background:var(--accent-soft)}' +
      '.bc-item[aria-checked="true"]{color:var(--accent)}' +
      '.bc-item .sw{display:inline-flex;gap:2px}' +
      '.bc-item .sw i{width:14px;height:14px;border-radius:3px}' +
      '.bc-hide{border-color:var(--line);color:var(--slate)}' +
      'body.bc-collapsed .bc-topbar{display:none}' +
      'body:not(.bc-collapsed){padding-top:var(--bc-bar-h,48px)}' +
      'body.bc-collapsed{padding-top:0}' +
      'body:not(.bc-collapsed) .nav{top:var(--bc-bar-h,48px)}' +
      'body:not(.bc-collapsed) .decisionbar{top:var(--bc-bar-h,48px)}' +
      '.bc-chip{position:fixed;top:8px;right:8px;z-index:1002;display:none;align-items:center;gap:6px;' +
      'background:var(--surface-2);border:1px solid var(--line);color:var(--paper);border-radius:99px;padding:6px 10px;' +
      'font-size:.7rem;cursor:pointer;box-shadow:0 12px 30px -16px #000;font-family:var(--font-body)}' +
      'body.bc-collapsed .bc-chip{display:flex}' +
      '.bc-progress{position:fixed;top:0;left:0;height:2px;background:var(--accent);width:0;z-index:2000;transition:width .08s linear}' +
      '.bc-notice{position:fixed;bottom:16px;right:12px;z-index:1001;max-width:300px;padding:11px 13px;border-radius:12px;' +
      'background:var(--paper);color:var(--ink);box-shadow:0 18px 50px -20px #000;font-size:.8rem;font-family:var(--font-body)}' +
      '.bc-notice b{font-family:var(--font-display);font-weight:var(--display-weight)}' +
      '.bc-notice button{margin-top:7px;border:1px solid var(--line);background:transparent;color:var(--ink);border-radius:99px;padding:5px 11px;font-size:.76rem;font-family:inherit;cursor:pointer}' +
      /* ---- WCAG contrast: separate tokens for text vs fill, and for light grounds ---- */
      '.cream,.on-cream,.est,.doc,.cpanel,.covers,.plan{--slate:var(--muted-ink)}' +
      '.micro,.eyebrow,.step .n,.slide .n,.jsteps .k,.jrow .tick,.jscreen .foot b,.cmenu-h,.citem small{color:var(--accent-text) !important}' +
      '.cream .micro,.on-cream .micro{color:var(--accent-ink) !important}' +
      '.btn-accent{background:var(--accent) !important;color:var(--on-accent) !important}' +
      '.band{background:var(--accent) !important;color:var(--on-accent) !important}' +
      '.band h2,.band p{color:var(--on-accent) !important;opacity:1 !important}' +
      '.est .right{color:var(--on-accent) !important}' +
      '.est .right .price,.est .right .incl span,.est .right .note{color:var(--on-accent) !important}' +
      '.on-cream .tone .t2{color:#756C67 !important}' +
      '.ticks{color:#5E544E !important}' +
      '.plan .price small,.plan li{color:var(--muted-ink) !important}' +
      '.doc .mut,.doc .brand .sub,.doc .mono.mut,.doc .row{color:var(--muted-ink) !important}' +
      '.sig .contact,.sig .legal{color:var(--muted-ink) !important}';
  }

  function mountControl() {
    if (!global.document || global.document.getElementById('bc-topbar')) return;
    if (!global.document.getElementById('bc-style')) {
      var st = global.document.createElement('style'); st.id = 'bc-style'; st.textContent = controlCSS();
      global.document.head.appendChild(st);
    }
    var kick = function (v) { try { global.localStorage.setItem('99-collapsed', v); } catch (e) {} };

    var logoMenu = '<div class="bc-menu" id="bc-mm" hidden>' + LOGO_ORDER.map(function (k) {
      return '<button type="button" class="bc-item" data-logo="' + k + '">'
        + '<span class="bc-mini" style="width:22px;height:22px">' + LOGOS[k] + '</span>' + SW_LABELS[k] + '</button>';
    }).join('') + '</div>';
    var sysMenu = '<div class="bc-menu" id="bc-ms" hidden>' + ORDER.map(function (k) {
      var t = PACKAGES[k].tokens;
      return '<button type="button" class="bc-item" data-pkg="' + k + '"><span class="sw">'
        + '<i style="background:' + t['--accent'] + '"></i><i style="background:' + t['--sand'] + '"></i><i style="background:' + t['--ink'] + '"></i></span>'
        + PACKAGES[k].name + '</button>';
    }).join('') + '</div>';

    var modeBtn = isBook() ? '' : '<button type="button" class="bc-btn bc-mode" id="bc-mode" title="Light / dark (mock website)">&#9681;</button>';
    var hideBtn = isBook() ? '' : '<button type="button" class="bc-btn bc-hide" id="bc-hide" title="Hide brand controls">&#8211;</button>';

    var bar = global.document.createElement('div');
    bar.className = 'bc-topbar'; bar.id = 'bc-topbar';
    bar.innerHTML = '<span class="bc-tag">99 &middot; brand system</span><div class="bc-ctl">'
      + '<div class="bc-dd"><button type="button" class="bc-btn bc-dd-btn" data-dd="bc-mm">'
      + '<span class="bc-mini" id="bc-logo-preview"></span>Mark &#9662;</button>' + logoMenu + '</div>'
      + '<div class="bc-dd"><button type="button" class="bc-btn bc-dd-btn" data-dd="bc-ms">'
      + '<span class="bc-sw" id="bc-sys-preview"></span>System &#9662;</button>' + sysMenu + '</div>'
      + modeBtn + hideBtn + '</div>';
    global.document.body.insertBefore(bar, global.document.body.firstChild);

    var chip = global.document.createElement('button');
    chip.type = 'button'; chip.className = 'bc-chip'; chip.id = 'bc-chip';
    chip.innerHTML = '<span class="bc-mini" id="bc-chip-logo"></span>Brand';
    global.document.body.appendChild(chip);
    chip.addEventListener('click', function () { global.document.body.classList.remove('bc-collapsed'); kick('0'); });

    try { if (global.localStorage.getItem('99-collapsed') === '1') global.document.body.classList.add('bc-collapsed'); } catch (e) {}
    var measure = function () {
      var h = bar.offsetHeight || 48;
      global.document.documentElement.style.setProperty('--bc-bar-h', h + 'px');
    };
    measure();
    global.addEventListener('resize', measure);
    global.setTimeout(measure, 120);

    var prog = global.document.createElement('div');
    prog.className = 'bc-progress'; prog.id = 'bc-progress';
    global.document.body.appendChild(prog);
    var ptick = false;
    global.addEventListener('scroll', function () {
      if (ptick) return; ptick = true;
      global.requestAnimationFrame(function () {
        ptick = false;
        var d = global.document.documentElement, max = d.scrollHeight - global.innerHeight;
        prog.style.width = (max > 0 ? ((global.scrollY || d.scrollTop) / max) * 100 : 0) + '%';
      });
    }, { passive: true });

    bar.addEventListener('click', function (e) {
      var t = e.target.closest('.bc-dd-btn');
      if (t) { var m = global.document.getElementById(t.dataset.dd); if (m) m.hidden = !m.hidden; return; }
      var it = e.target.closest('.bc-item');
      if (it) {
        if (it.dataset.logo) { setLogo(it.dataset.logo); injectLogos(); closeMenus(); syncControl(); }
        if (it.dataset.pkg) { set(it.dataset.pkg); closeMenus(); syncControl(); }
        return;
      }
      if (e.target.closest('#bc-mode')) { setMode(mode() === 'light' ? 'dark' : 'light'); closeMenus(); syncControl(); }
      if (e.target.closest('#bc-hide')) { global.document.body.classList.add('bc-collapsed'); kick('1'); }
    });
    global.document.addEventListener('click', function (e) { if (!bar.contains(e.target) && !chip.contains(e.target)) closeMenus(); });

    var site = global.document.getElementById('site-mode');
    var siteIco = global.document.getElementById('site-mode-ico');
    function paintSiteMode() { if (siteIco) siteIco.textContent = mode() === 'light' ? '\u2600' : '\u263D'; }
    if (site) {
      site.addEventListener('click', function () {
        setMode(mode() === 'light' ? 'dark' : 'light');
        paintSiteMode(); syncControl();
      });
      paintSiteMode();
    }

    /* mobile menu: hamburger that becomes an X */
    var burger = global.document.getElementById('navtoggle');
    var navEl = global.document.querySelector('.nav');
    if (burger && navEl) {
      burger.addEventListener('click', function () {
        var open = navEl.classList.toggle('open');
        burger.setAttribute('aria-expanded', String(open));
      });
      global.document.querySelectorAll('#navlinks a').forEach(function (a) {
        a.addEventListener('click', function () {
          navEl.classList.remove('open'); burger.setAttribute('aria-expanded', 'false');
        });
      });
    }

    syncControl();
    if (isBook()) mountNotice();
  }

  function closeMenus() {
    if (!global.document) return;
    Array.prototype.forEach.call(global.document.querySelectorAll('#bc-topbar .bc-menu'), function (m) { m.hidden = true; });
  }
  function mountNotice() {
    if (!global.document) return;
    try { if (global.localStorage.getItem('99-bright-seen')) return; } catch (e) { return; }
    var n = global.document.createElement('div');
    n.className = 'bc-notice'; n.setAttribute('role', 'note');
    n.innerHTML = '<b>Full effect at full brightness.</b> This identity is built on deep blacks \u2014 if the shadows look '
      + 'flat, raise your display brightness. Reads clearly? '
      + '<button type="button">Looks good \u2014 hide</button>';
    n.style.display = 'none';
    global.document.body.appendChild(n);
    global.setTimeout(function () { n.style.display = ''; }, 1600);
    global.setTimeout(function () { n.remove(); }, 11000);
    n.querySelector('button').addEventListener('click', function () {
      try { global.localStorage.setItem('99-bright-seen', '1'); } catch (e) {}
      n.remove();
    });
  }
  function syncControl() {
    if (!global.document) return;
    var lg = getLogo(), pk = current();
    var lp = global.document.getElementById('bc-logo-preview'); if (lp) lp.innerHTML = logoMark(lg);
    var cp = global.document.getElementById('bc-chip-logo'); if (cp) cp.innerHTML = logoMark(lg);
    var sp = global.document.getElementById('bc-sys-preview');
    if (sp) { var t = PACKAGES[pk].tokens; sp.innerHTML = '<i style="background:' + t['--accent'] + '"></i><i style="background:' + t['--sand'] + '"></i><i style="background:' + t['--ink'] + '"></i>'; }
    Array.prototype.forEach.call(global.document.querySelectorAll('#bc-topbar [data-logo]'), function (b) { b.setAttribute('aria-checked', String(b.dataset.logo === lg)); });
    Array.prototype.forEach.call(global.document.querySelectorAll('#bc-topbar [data-pkg]'), function (b) { b.setAttribute('aria-checked', String(b.dataset.pkg === pk)); });
    var mb = global.document.getElementById('bc-mode'); if (mb) mb.textContent = mode() === 'light' ? '\u25CB' : '\u25CF';
  }

  global.Brand99 = {
    PACKAGES: PACKAGES, ORDER: ORDER,
    LOGOS: LOGOS, LOGO_ORDER: LOGO_ORDER,
    apply: apply, set: set, current: current, boot: boot,
    getLogo: getLogo, setLogo: setLogo, logoMark: logoMark, injectLogos: injectLogos, syncControl: syncControl, setMode: setMode, mode: mode,
    contrast: contrast,
    ratios: function (key) {
      var t = (PACKAGES[key] || PACKAGES.ember).tokens;
      return {
        accentOnPaper: contrast(t['--accent-ink'], t['--paper']),
        accentBaseOnPaper: contrast(t['--accent'], t['--paper']),
        accentOnInk: contrast(t['--accent'], t['--ink']),
        paperOnInk: contrast(t['--paper'], t['--ink']),
        sandOnInk: contrast(t['--sand'], t['--ink'])
      };
    }
  };

  if (global.document && global.document.documentElement) { try { apply(current()); } catch (e) {} }
  if (global.document) {
    if (global.document.readyState === 'loading') {
      global.document.addEventListener('DOMContentLoaded', boot);
    } else { boot(); }
  }
})(typeof window !== 'undefined' ? window : this);

