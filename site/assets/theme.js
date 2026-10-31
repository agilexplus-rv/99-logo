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
        '--accent': '#D8440B',
        '--accent-ink': '#CB400A',
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
        '--accent': '#C0603A',
        '--accent-ink': '#AC5634',
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
        '--accent-ink': '#8B692C',
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
    return key;
  }

  function current() {
    try { return global.localStorage.getItem('99-package') || 'ember'; } catch (e) { return 'ember'; }
  }

  function set(key) {
    try { global.localStorage.setItem('99-package', key); } catch (e) {}
    return apply(key);
  }

  function boot() {
    apply(current());
    // keep sibling mock-site tabs in step
    global.addEventListener('storage', function (e) {
      if (e.key === '99-package') apply(e.newValue || 'ember');
    });
  }

  global.Brand99 = {
    PACKAGES: PACKAGES, ORDER: ORDER,
    apply: apply, set: set, current: current, boot: boot,
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

  if (global.document) {
    if (global.document.readyState === 'loading') {
      global.document.addEventListener('DOMContentLoaded', boot);
    } else { boot(); }
  }
})(typeof window !== 'undefined' ? window : this);
