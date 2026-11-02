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
        '--accent-cream': '#C53E0A',
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
        '--slate': '#948A82',
        '--accent': '#B75B37',
        '--accent-ink': '#AA5636',
        '--accent-text': '#C26641',
        '--on-accent': '#FFFFFF',
        '--muted-ink': '#766B65',
        '--accent-cream': '#AB5534',
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
        '--accent-ink': '#7E6026',
        '--accent-text': '#C9973F',
        '--on-accent': '#0C1013',
        '--muted-ink': '#6A6E73',
        '--accent-cream': '#7E6026',
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

  // Approved identity: Forge colour roles, Ember typography. Legacy palettes remain
  // available in the source archive only; active pages use the approved combination.
  ['--font-display', '--font-body', '--font-mono', '--display-weight', '--display-track', '--display-case'].forEach(function (k) {
    PACKAGES.forge.tokens[k] = PACKAGES.ember.tokens[k];
  });
  PACKAGES.forge.tagline = 'Cool charcoal, brass accents, Inter Tight typography';
  PACKAGES.forge.mood = 'The approved ninetynine identity: Forge colours with Ember typography.';
  var ORDER = ['forge'];
  try {
    if (global.localStorage.getItem('99-identity-version') !== 'approved-eu-1') {
      global.localStorage.setItem('99-package', 'forge');
      global.localStorage.setItem('99-logo', 'ninetynine-the-wordmark');
      global.localStorage.setItem('99-identity-version', 'approved-eu-1');
    }
  } catch (e) {}

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
    key = 'forge';
    var pkg = PACKAGES.forge;
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
      root.style.setProperty('--surface', '#F4F2ED');
      root.style.setProperty('--surface-2', '#ffffff');
      root.style.setProperty('--line', 'rgba(0,0,0,.10)');
      root.style.setProperty('--accent-soft', 'color-mix(in srgb,' + pkg.tokens['--accent'] + ' 12%, transparent)');
      /* the mock-site "reference" palette was tuned for a dark ground: invert it */
      root.style.setProperty('--sand', '#454B50');
      root.style.setProperty('--slate', pkg.tokens['--muted-ink']);
      root.style.setProperty('--accent-text', pkg.tokens['--accent-cream']);
      root.style.setProperty('--ref-muted-light', '#756C67');
      root.style.setProperty('--ref-muted-dark', '#454B50');
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

  function current() { return 'forge'; }

  function set(key) {
    try { global.localStorage.setItem('99-package', key); } catch (e) {}
    var result = apply(key);
    notifyBrand();
    return result;
  }

  /* ---------- logo catalogue: one mark per direction (currentColor, so it themes) ---------- */
  var LOGOS = {
    "the-sign": "<svg viewBox=\"0 0 256 256\" aria-hidden=\"true\"><g fill=\"currentColor\"><circle cx=\"78\" cy=\"98\" r=\"42\"/><circle cx=\"178\" cy=\"98\" r=\"42\"/><path d=\"M120 98C120 150.5 109.5 179.9 59.1 198.8L51.75 186.07C86.4 168.56 99 148.4 78 98Z\"/><path d=\"M220 98C220 150.5 209.5 179.9 159.1 198.8L151.75 186.07C186.4 168.56 199 148.4 178 98Z\"/></g></svg>",
    "the-wordmark": "<svg viewBox=\"0 0 344 256\" aria-hidden=\"true\"><path fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"translate(28 15) scale(1.3)\" d=\"M52 8 C23 8 4 28 4 56 C4 84 22 102 48 102 C60 102 70 98 77 90 C73 119 55 136 24 144 L32 166 C79 154 104 120 104 65 V57 C104 27 84 8 52 8 Z M52 31 C36 31 27 41 27 56 C27 71 37 80 52 80 C68 80 79 70 79 55 C79 40 69 31 52 31 Z\"/><path fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"translate(181 15) scale(1.3)\" d=\"M52 8 C23 8 4 28 4 56 C4 84 22 102 48 102 C60 102 70 98 77 90 C73 119 55 136 24 144 L32 166 C79 154 104 120 104 65 V57 C104 27 84 8 52 8 Z M52 31 C36 31 27 41 27 56 C27 71 37 80 52 80 C68 80 79 70 79 55 C79 40 69 31 52 31 Z\"/></svg>",
    "the-sign-off": "<svg viewBox=\"0 0 256 256\" aria-hidden=\"true\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M28 92a46 46 0 1 0 92 0a46 46 0 1 0 -92 0Z M52 92a22 22 0 1 0 44 0a22 22 0 1 0 -44 0Z\"/><path fill=\"currentColor\" d=\"M96 92h24v80h-24Z\"/><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M136 92a46 46 0 1 0 92 0a46 46 0 1 0 -92 0Z M160 92a22 22 0 1 0 44 0a22 22 0 1 0 -44 0Z\"/><path fill=\"currentColor\" d=\"M204 92H228V192A24 24 0 0 1 204 216H28V192H204Z\"/></svg>",
    "the-seal": "<svg viewBox=\"0 0 256 256\" aria-hidden=\"true\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M 52 24 H 204 L 232 52 V 204 L 204 232 H 52 L 24 204 V 52 Z M 56 52 H 104 L 116 64 V 192 L 104 204 H 56 L 80 180 H 92 V 136 H 56 L 44 124 V 64 Z M 68 76 H 92 V 112 H 68 Z M 152 52 H 200 L 212 64 V 192 L 200 204 H 152 L 176 180 H 188 V 136 H 152 L 140 124 V 64 Z M 164 76 H 188 V 112 H 164 Z\"/></svg>",
    "ninetynine": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1040 256\" role=\"img\" aria-label=\"ninetynine\"><title>ninetynine — light ninety, bold nine</title><path fill=\"currentColor\" data-part=\"ninety\" data-weight=\"400\" d=\"M38.37 118.2V190.82H20V70.01H37.72V89.03H39.45Q43.66 79.73 52.31 74.12Q60.95 68.5 74.68 68.5Q86.89 68.5 96.07 73.47Q105.26 78.44 110.39 88.54Q115.52 98.64 115.52 114.1V190.82H97.15V115.39Q97.15 101.24 89.7 93.19Q82.24 85.14 69.38 85.14Q60.52 85.14 53.5 89.03Q46.47 92.92 42.42 100.27Q38.37 107.61 38.37 118.2ZM138 190.82V70.01H156.37V190.82ZM147.29 49.91Q141.89 49.91 138 46.24Q134.11 42.56 134.11 37.38Q134.11 32.19 138 28.52Q141.89 24.84 147.29 24.84Q152.7 24.84 156.59 28.52Q160.48 32.19 160.48 37.38Q160.48 42.56 156.59 46.24Q152.7 49.91 147.29 49.91ZM197.22 118.2V190.82H178.85V70.01H196.57V89.03H198.3Q202.51 79.73 211.15 74.12Q219.8 68.5 233.52 68.5Q245.73 68.5 254.92 73.47Q264.1 78.44 269.24 88.54Q274.37 98.64 274.37 114.1V190.82H256V115.39Q256 101.24 248.54 93.19Q241.09 85.14 228.23 85.14Q219.37 85.14 212.34 89.03Q205.32 92.92 201.27 100.27Q197.22 107.61 197.22 118.2ZM347.42 193.41Q330.02 193.41 317.32 185.63Q304.62 177.85 297.82 163.86Q291.01 149.86 291.01 131.39Q291.01 112.8 297.71 98.64Q304.41 84.49 316.57 76.49Q328.72 68.5 345.04 68.5Q354.44 68.5 363.73 71.63Q373.03 74.76 380.64 81.79Q388.26 88.81 392.8 100.37Q397.34 111.94 397.34 128.79V136.79H304.19V120.8H387.29L378.75 126.85Q378.75 114.75 374.97 105.34Q371.19 95.94 363.68 90.54Q356.17 85.14 345.04 85.14Q333.91 85.14 325.97 90.59Q318.02 96.05 313.81 104.8Q309.6 113.56 309.6 123.61V134.2Q309.6 147.92 314.35 157.43Q319.1 166.94 327.64 171.85Q336.18 176.77 347.42 176.77Q354.66 176.77 360.6 174.66Q366.54 172.56 370.86 168.29Q375.19 164.02 377.46 157.75L395.39 162.94Q392.58 172.02 385.94 178.88Q379.29 185.74 369.46 189.58Q359.63 193.41 347.42 193.41ZM465.85 70.01V85.79H403.39V70.01ZM421.54 41.27H439.91V156.24Q439.91 165.64 443.8 170.02Q447.69 174.39 456.12 174.39Q457.96 174.39 459.96 174.18Q461.96 173.96 464.33 173.53L468.22 190.17Q465.63 191.14 461.9 191.74Q458.18 192.33 454.39 192.33Q439.81 192.33 430.67 183.69Q421.54 175.04 421.54 161.21ZM494.16 235.99Q489.4 236.09 485.73 235.34Q482.06 234.58 480.54 233.83L485.3 217.62L487.13 218.05Q496.43 220.21 502.75 217.13Q509.07 214.05 513.83 200.98L517.28 191.47L472.76 70.01H492.86L526.14 166.4H527.44L560.72 70.01H580.82L529.6 208.32Q526.14 217.72 521.07 223.88Q515.99 230.04 509.29 233.01Q502.59 235.99 494.16 235.99Z\"/><path fill=\"currentColor\" data-part=\"nine\" data-weight=\"750\" d=\"M627.29 121.53V190.82H591.37V70.01H626.79V91.9H627.91Q631.98 81.02 640.96 74.76Q649.95 68.5 663.44 68.5Q676.11 68.5 685.48 74.07Q694.86 79.65 700.03 89.87Q705.2 100.08 705.2 113.95V190.82H669.28V120.69Q669.28 110.16 663.86 104.16Q658.45 98.15 648.84 98.15Q642.48 98.15 637.61 100.94Q632.74 103.73 630.01 108.93Q627.29 114.12 627.29 121.53ZM722.87 190.82V70.01H758.79V190.82ZM740.79 55.36Q732.97 55.36 727.41 50.18Q721.86 44.99 721.86 37.68Q721.86 30.3 727.41 25.15Q732.97 20 740.79 20Q748.61 20 754.17 25.15Q759.72 30.3 759.72 37.64Q759.72 44.98 754.17 50.17Q748.61 55.36 740.79 55.36ZM812.39 121.53V190.82H776.47V70.01H811.89V91.9H813.02Q817.08 81.02 826.06 74.76Q835.05 68.5 848.55 68.5Q861.21 68.5 870.58 74.07Q879.96 79.65 885.13 89.87Q890.3 100.08 890.3 113.95V190.82H854.38V120.69Q854.38 110.16 848.97 104.16Q843.55 98.15 833.95 98.15Q827.58 98.15 822.71 100.94Q817.85 103.73 815.12 108.93Q812.39 114.12 812.39 121.53ZM963.69 193.11Q944.93 193.11 931.33 185.59Q917.72 178.08 910.46 164.12Q903.2 150.17 903.2 130.93Q903.2 112.27 910.47 98.23Q917.74 84.19 930.99 76.34Q944.24 68.5 962.22 68.5Q974.65 68.5 985.19 72.42Q995.73 76.35 1003.54 84.09Q1011.35 91.84 1015.66 103.32Q1019.97 114.81 1019.97 130V139.36H916.54V117.92H1002.73L985.95 123.22Q985.95 114.44 983.3 108.11Q980.66 101.77 975.45 98.29Q970.25 94.82 962.53 94.82Q954.8 94.82 949.47 98.31Q944.13 101.8 941.36 107.94Q938.58 114.09 938.58 122.24V137.52Q938.58 146.63 941.78 153.19Q944.99 159.75 950.8 163.27Q956.61 166.79 964.3 166.79Q969.57 166.79 973.89 165.28Q978.2 163.78 981.32 160.84Q984.43 157.89 986.02 153.67L1019.08 155.22Q1016.8 166.72 1009.55 175.25Q1002.3 183.77 990.69 188.44Q979.08 193.11 963.69 193.11Z\"/></svg>",
    "ninetynine-the-sign": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1014 256\" role=\"img\" aria-label=\"ninetynine\"><title>the-sign + ninetynine</title><g transform=\"translate(16.10 25.60) scale(0.8000)\"><g fill=\"currentColor\"><circle cx=\"78\" cy=\"98\" r=\"42\" /><circle cx=\"178\" cy=\"98\" r=\"42\" /><path d=\"M120 98C120 150.5 109.5 179.9 59.1 198.8L51.75 186.07C86.4 168.56 99 148.4 78 98Z\" /><path d=\"M220 98C220 150.5 209.5 179.9 159.1 198.8L151.75 186.07C186.4 168.56 199 148.4 178 98Z\" /></g></g><g transform=\"translate(245 35.84) scale(.72)\"><path xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" data-part=\"ninety\" data-weight=\"400\" d=\"M38.37 118.2V190.82H20V70.01H37.72V89.03H39.45Q43.66 79.73 52.31 74.12Q60.95 68.5 74.68 68.5Q86.89 68.5 96.07 73.47Q105.26 78.44 110.39 88.54Q115.52 98.64 115.52 114.1V190.82H97.15V115.39Q97.15 101.24 89.7 93.19Q82.24 85.14 69.38 85.14Q60.52 85.14 53.5 89.03Q46.47 92.92 42.42 100.27Q38.37 107.61 38.37 118.2ZM138 190.82V70.01H156.37V190.82ZM147.29 49.91Q141.89 49.91 138 46.24Q134.11 42.56 134.11 37.38Q134.11 32.19 138 28.52Q141.89 24.84 147.29 24.84Q152.7 24.84 156.59 28.52Q160.48 32.19 160.48 37.38Q160.48 42.56 156.59 46.24Q152.7 49.91 147.29 49.91ZM197.22 118.2V190.82H178.85V70.01H196.57V89.03H198.3Q202.51 79.73 211.15 74.12Q219.8 68.5 233.52 68.5Q245.73 68.5 254.92 73.47Q264.1 78.44 269.24 88.54Q274.37 98.64 274.37 114.1V190.82H256V115.39Q256 101.24 248.54 93.19Q241.09 85.14 228.23 85.14Q219.37 85.14 212.34 89.03Q205.32 92.92 201.27 100.27Q197.22 107.61 197.22 118.2ZM347.42 193.41Q330.02 193.41 317.32 185.63Q304.62 177.85 297.82 163.86Q291.01 149.86 291.01 131.39Q291.01 112.8 297.71 98.64Q304.41 84.49 316.57 76.49Q328.72 68.5 345.04 68.5Q354.44 68.5 363.73 71.63Q373.03 74.76 380.64 81.79Q388.26 88.81 392.8 100.37Q397.34 111.94 397.34 128.79V136.79H304.19V120.8H387.29L378.75 126.85Q378.75 114.75 374.97 105.34Q371.19 95.94 363.68 90.54Q356.17 85.14 345.04 85.14Q333.91 85.14 325.97 90.59Q318.02 96.05 313.81 104.8Q309.6 113.56 309.6 123.61V134.2Q309.6 147.92 314.35 157.43Q319.1 166.94 327.64 171.85Q336.18 176.77 347.42 176.77Q354.66 176.77 360.6 174.66Q366.54 172.56 370.86 168.29Q375.19 164.02 377.46 157.75L395.39 162.94Q392.58 172.02 385.94 178.88Q379.29 185.74 369.46 189.58Q359.63 193.41 347.42 193.41ZM465.85 70.01V85.79H403.39V70.01ZM421.54 41.27H439.91V156.24Q439.91 165.64 443.8 170.02Q447.69 174.39 456.12 174.39Q457.96 174.39 459.96 174.18Q461.96 173.96 464.33 173.53L468.22 190.17Q465.63 191.14 461.9 191.74Q458.18 192.33 454.39 192.33Q439.81 192.33 430.67 183.69Q421.54 175.04 421.54 161.21ZM494.16 235.99Q489.4 236.09 485.73 235.34Q482.06 234.58 480.54 233.83L485.3 217.62L487.13 218.05Q496.43 220.21 502.75 217.13Q509.07 214.05 513.83 200.98L517.28 191.47L472.76 70.01H492.86L526.14 166.4H527.44L560.72 70.01H580.82L529.6 208.32Q526.14 217.72 521.07 223.88Q515.99 230.04 509.29 233.01Q502.59 235.99 494.16 235.99Z\" /><path xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" data-part=\"nine\" data-weight=\"750\" d=\"M627.29 121.53V190.82H591.37V70.01H626.79V91.9H627.91Q631.98 81.02 640.96 74.76Q649.95 68.5 663.44 68.5Q676.11 68.5 685.48 74.07Q694.86 79.65 700.03 89.87Q705.2 100.08 705.2 113.95V190.82H669.28V120.69Q669.28 110.16 663.86 104.16Q658.45 98.15 648.84 98.15Q642.48 98.15 637.61 100.94Q632.74 103.73 630.01 108.93Q627.29 114.12 627.29 121.53ZM722.87 190.82V70.01H758.79V190.82ZM740.79 55.36Q732.97 55.36 727.41 50.18Q721.86 44.99 721.86 37.68Q721.86 30.3 727.41 25.15Q732.97 20 740.79 20Q748.61 20 754.17 25.15Q759.72 30.3 759.72 37.64Q759.72 44.98 754.17 50.17Q748.61 55.36 740.79 55.36ZM812.39 121.53V190.82H776.47V70.01H811.89V91.9H813.02Q817.08 81.02 826.06 74.76Q835.05 68.5 848.55 68.5Q861.21 68.5 870.58 74.07Q879.96 79.65 885.13 89.87Q890.3 100.08 890.3 113.95V190.82H854.38V120.69Q854.38 110.16 848.97 104.16Q843.55 98.15 833.95 98.15Q827.58 98.15 822.71 100.94Q817.85 103.73 815.12 108.93Q812.39 114.12 812.39 121.53ZM963.69 193.11Q944.93 193.11 931.33 185.59Q917.72 178.08 910.46 164.12Q903.2 150.17 903.2 130.93Q903.2 112.27 910.47 98.23Q917.74 84.19 930.99 76.34Q944.24 68.5 962.22 68.5Q974.65 68.5 985.19 72.42Q995.73 76.35 1003.54 84.09Q1011.35 91.84 1015.66 103.32Q1019.97 114.81 1019.97 130V139.36H916.54V117.92H1002.73L985.95 123.22Q985.95 114.44 983.3 108.11Q980.66 101.77 975.45 98.29Q970.25 94.82 962.53 94.82Q954.8 94.82 949.47 98.31Q944.13 101.8 941.36 107.94Q938.58 114.09 938.58 122.24V137.52Q938.58 146.63 941.78 153.19Q944.99 159.75 950.8 163.27Q956.61 166.79 964.3 166.79Q969.57 166.79 973.89 165.28Q978.2 163.78 981.32 160.84Q984.43 157.89 986.02 153.67L1019.08 155.22Q1016.8 166.72 1009.55 175.25Q1002.3 183.77 990.69 188.44Q979.08 193.11 963.69 193.11Z\" /></g></svg>",
    "ninetynine-the-wordmark": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1014 256\" role=\"img\" aria-label=\"ninetynine\"><title>the-wordmark + ninetynine</title><g transform=\"translate(16.00 51.72) scale(0.5959)\"><path fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"translate(28 15) scale(1.3)\" d=\"M52 8 C23 8 4 28 4 56 C4 84 22 102 48 102 C60 102 70 98 77 90 C73 119 55 136 24 144 L32 166 C79 154 104 120 104 65 V57 C104 27 84 8 52 8 Z M52 31 C36 31 27 41 27 56 C27 71 37 80 52 80 C68 80 79 70 79 55 C79 40 69 31 52 31 Z\" /><path fill=\"currentColor\" fill-rule=\"evenodd\" transform=\"translate(181 15) scale(1.3)\" d=\"M52 8 C23 8 4 28 4 56 C4 84 22 102 48 102 C60 102 70 98 77 90 C73 119 55 136 24 144 L32 166 C79 154 104 120 104 65 V57 C104 27 84 8 52 8 Z M52 31 C36 31 27 41 27 56 C27 71 37 80 52 80 C68 80 79 70 79 55 C79 40 69 31 52 31 Z\" /></g><g transform=\"translate(245 35.84) scale(.72)\"><path xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" data-part=\"ninety\" data-weight=\"400\" d=\"M38.37 118.2V190.82H20V70.01H37.72V89.03H39.45Q43.66 79.73 52.31 74.12Q60.95 68.5 74.68 68.5Q86.89 68.5 96.07 73.47Q105.26 78.44 110.39 88.54Q115.52 98.64 115.52 114.1V190.82H97.15V115.39Q97.15 101.24 89.7 93.19Q82.24 85.14 69.38 85.14Q60.52 85.14 53.5 89.03Q46.47 92.92 42.42 100.27Q38.37 107.61 38.37 118.2ZM138 190.82V70.01H156.37V190.82ZM147.29 49.91Q141.89 49.91 138 46.24Q134.11 42.56 134.11 37.38Q134.11 32.19 138 28.52Q141.89 24.84 147.29 24.84Q152.7 24.84 156.59 28.52Q160.48 32.19 160.48 37.38Q160.48 42.56 156.59 46.24Q152.7 49.91 147.29 49.91ZM197.22 118.2V190.82H178.85V70.01H196.57V89.03H198.3Q202.51 79.73 211.15 74.12Q219.8 68.5 233.52 68.5Q245.73 68.5 254.92 73.47Q264.1 78.44 269.24 88.54Q274.37 98.64 274.37 114.1V190.82H256V115.39Q256 101.24 248.54 93.19Q241.09 85.14 228.23 85.14Q219.37 85.14 212.34 89.03Q205.32 92.92 201.27 100.27Q197.22 107.61 197.22 118.2ZM347.42 193.41Q330.02 193.41 317.32 185.63Q304.62 177.85 297.82 163.86Q291.01 149.86 291.01 131.39Q291.01 112.8 297.71 98.64Q304.41 84.49 316.57 76.49Q328.72 68.5 345.04 68.5Q354.44 68.5 363.73 71.63Q373.03 74.76 380.64 81.79Q388.26 88.81 392.8 100.37Q397.34 111.94 397.34 128.79V136.79H304.19V120.8H387.29L378.75 126.85Q378.75 114.75 374.97 105.34Q371.19 95.94 363.68 90.54Q356.17 85.14 345.04 85.14Q333.91 85.14 325.97 90.59Q318.02 96.05 313.81 104.8Q309.6 113.56 309.6 123.61V134.2Q309.6 147.92 314.35 157.43Q319.1 166.94 327.64 171.85Q336.18 176.77 347.42 176.77Q354.66 176.77 360.6 174.66Q366.54 172.56 370.86 168.29Q375.19 164.02 377.46 157.75L395.39 162.94Q392.58 172.02 385.94 178.88Q379.29 185.74 369.46 189.58Q359.63 193.41 347.42 193.41ZM465.85 70.01V85.79H403.39V70.01ZM421.54 41.27H439.91V156.24Q439.91 165.64 443.8 170.02Q447.69 174.39 456.12 174.39Q457.96 174.39 459.96 174.18Q461.96 173.96 464.33 173.53L468.22 190.17Q465.63 191.14 461.9 191.74Q458.18 192.33 454.39 192.33Q439.81 192.33 430.67 183.69Q421.54 175.04 421.54 161.21ZM494.16 235.99Q489.4 236.09 485.73 235.34Q482.06 234.58 480.54 233.83L485.3 217.62L487.13 218.05Q496.43 220.21 502.75 217.13Q509.07 214.05 513.83 200.98L517.28 191.47L472.76 70.01H492.86L526.14 166.4H527.44L560.72 70.01H580.82L529.6 208.32Q526.14 217.72 521.07 223.88Q515.99 230.04 509.29 233.01Q502.59 235.99 494.16 235.99Z\" /><path xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" data-part=\"nine\" data-weight=\"750\" d=\"M627.29 121.53V190.82H591.37V70.01H626.79V91.9H627.91Q631.98 81.02 640.96 74.76Q649.95 68.5 663.44 68.5Q676.11 68.5 685.48 74.07Q694.86 79.65 700.03 89.87Q705.2 100.08 705.2 113.95V190.82H669.28V120.69Q669.28 110.16 663.86 104.16Q658.45 98.15 648.84 98.15Q642.48 98.15 637.61 100.94Q632.74 103.73 630.01 108.93Q627.29 114.12 627.29 121.53ZM722.87 190.82V70.01H758.79V190.82ZM740.79 55.36Q732.97 55.36 727.41 50.18Q721.86 44.99 721.86 37.68Q721.86 30.3 727.41 25.15Q732.97 20 740.79 20Q748.61 20 754.17 25.15Q759.72 30.3 759.72 37.64Q759.72 44.98 754.17 50.17Q748.61 55.36 740.79 55.36ZM812.39 121.53V190.82H776.47V70.01H811.89V91.9H813.02Q817.08 81.02 826.06 74.76Q835.05 68.5 848.55 68.5Q861.21 68.5 870.58 74.07Q879.96 79.65 885.13 89.87Q890.3 100.08 890.3 113.95V190.82H854.38V120.69Q854.38 110.16 848.97 104.16Q843.55 98.15 833.95 98.15Q827.58 98.15 822.71 100.94Q817.85 103.73 815.12 108.93Q812.39 114.12 812.39 121.53ZM963.69 193.11Q944.93 193.11 931.33 185.59Q917.72 178.08 910.46 164.12Q903.2 150.17 903.2 130.93Q903.2 112.27 910.47 98.23Q917.74 84.19 930.99 76.34Q944.24 68.5 962.22 68.5Q974.65 68.5 985.19 72.42Q995.73 76.35 1003.54 84.09Q1011.35 91.84 1015.66 103.32Q1019.97 114.81 1019.97 130V139.36H916.54V117.92H1002.73L985.95 123.22Q985.95 114.44 983.3 108.11Q980.66 101.77 975.45 98.29Q970.25 94.82 962.53 94.82Q954.8 94.82 949.47 98.31Q944.13 101.8 941.36 107.94Q938.58 114.09 938.58 122.24V137.52Q938.58 146.63 941.78 153.19Q944.99 159.75 950.8 163.27Q956.61 166.79 964.3 166.79Q969.57 166.79 973.89 165.28Q978.2 163.78 981.32 160.84Q984.43 157.89 986.02 153.67L1019.08 155.22Q1016.8 166.72 1009.55 175.25Q1002.3 183.77 990.69 188.44Q979.08 193.11 963.69 193.11Z\" /></g></svg>",
    "ninetynine-the-sign-off": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1014 256\" role=\"img\" aria-label=\"ninetynine\"><title>the-sign-off + ninetynine</title><g transform=\"translate(16.10 25.60) scale(0.8000)\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M28 92a46 46 0 1 0 92 0a46 46 0 1 0 -92 0Z M52 92a22 22 0 1 0 44 0a22 22 0 1 0 -44 0Z\" /><path fill=\"currentColor\" d=\"M96 92h24v80h-24Z\" /><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M136 92a46 46 0 1 0 92 0a46 46 0 1 0 -92 0Z M160 92a22 22 0 1 0 44 0a22 22 0 1 0 -44 0Z\" /><path fill=\"currentColor\" d=\"M204 92H228V192A24 24 0 0 1 204 216H28V192H204Z\" /></g><g transform=\"translate(245 35.84) scale(.72)\"><path xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" data-part=\"ninety\" data-weight=\"400\" d=\"M38.37 118.2V190.82H20V70.01H37.72V89.03H39.45Q43.66 79.73 52.31 74.12Q60.95 68.5 74.68 68.5Q86.89 68.5 96.07 73.47Q105.26 78.44 110.39 88.54Q115.52 98.64 115.52 114.1V190.82H97.15V115.39Q97.15 101.24 89.7 93.19Q82.24 85.14 69.38 85.14Q60.52 85.14 53.5 89.03Q46.47 92.92 42.42 100.27Q38.37 107.61 38.37 118.2ZM138 190.82V70.01H156.37V190.82ZM147.29 49.91Q141.89 49.91 138 46.24Q134.11 42.56 134.11 37.38Q134.11 32.19 138 28.52Q141.89 24.84 147.29 24.84Q152.7 24.84 156.59 28.52Q160.48 32.19 160.48 37.38Q160.48 42.56 156.59 46.24Q152.7 49.91 147.29 49.91ZM197.22 118.2V190.82H178.85V70.01H196.57V89.03H198.3Q202.51 79.73 211.15 74.12Q219.8 68.5 233.52 68.5Q245.73 68.5 254.92 73.47Q264.1 78.44 269.24 88.54Q274.37 98.64 274.37 114.1V190.82H256V115.39Q256 101.24 248.54 93.19Q241.09 85.14 228.23 85.14Q219.37 85.14 212.34 89.03Q205.32 92.92 201.27 100.27Q197.22 107.61 197.22 118.2ZM347.42 193.41Q330.02 193.41 317.32 185.63Q304.62 177.85 297.82 163.86Q291.01 149.86 291.01 131.39Q291.01 112.8 297.71 98.64Q304.41 84.49 316.57 76.49Q328.72 68.5 345.04 68.5Q354.44 68.5 363.73 71.63Q373.03 74.76 380.64 81.79Q388.26 88.81 392.8 100.37Q397.34 111.94 397.34 128.79V136.79H304.19V120.8H387.29L378.75 126.85Q378.75 114.75 374.97 105.34Q371.19 95.94 363.68 90.54Q356.17 85.14 345.04 85.14Q333.91 85.14 325.97 90.59Q318.02 96.05 313.81 104.8Q309.6 113.56 309.6 123.61V134.2Q309.6 147.92 314.35 157.43Q319.1 166.94 327.64 171.85Q336.18 176.77 347.42 176.77Q354.66 176.77 360.6 174.66Q366.54 172.56 370.86 168.29Q375.19 164.02 377.46 157.75L395.39 162.94Q392.58 172.02 385.94 178.88Q379.29 185.74 369.46 189.58Q359.63 193.41 347.42 193.41ZM465.85 70.01V85.79H403.39V70.01ZM421.54 41.27H439.91V156.24Q439.91 165.64 443.8 170.02Q447.69 174.39 456.12 174.39Q457.96 174.39 459.96 174.18Q461.96 173.96 464.33 173.53L468.22 190.17Q465.63 191.14 461.9 191.74Q458.18 192.33 454.39 192.33Q439.81 192.33 430.67 183.69Q421.54 175.04 421.54 161.21ZM494.16 235.99Q489.4 236.09 485.73 235.34Q482.06 234.58 480.54 233.83L485.3 217.62L487.13 218.05Q496.43 220.21 502.75 217.13Q509.07 214.05 513.83 200.98L517.28 191.47L472.76 70.01H492.86L526.14 166.4H527.44L560.72 70.01H580.82L529.6 208.32Q526.14 217.72 521.07 223.88Q515.99 230.04 509.29 233.01Q502.59 235.99 494.16 235.99Z\" /><path xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" data-part=\"nine\" data-weight=\"750\" d=\"M627.29 121.53V190.82H591.37V70.01H626.79V91.9H627.91Q631.98 81.02 640.96 74.76Q649.95 68.5 663.44 68.5Q676.11 68.5 685.48 74.07Q694.86 79.65 700.03 89.87Q705.2 100.08 705.2 113.95V190.82H669.28V120.69Q669.28 110.16 663.86 104.16Q658.45 98.15 648.84 98.15Q642.48 98.15 637.61 100.94Q632.74 103.73 630.01 108.93Q627.29 114.12 627.29 121.53ZM722.87 190.82V70.01H758.79V190.82ZM740.79 55.36Q732.97 55.36 727.41 50.18Q721.86 44.99 721.86 37.68Q721.86 30.3 727.41 25.15Q732.97 20 740.79 20Q748.61 20 754.17 25.15Q759.72 30.3 759.72 37.64Q759.72 44.98 754.17 50.17Q748.61 55.36 740.79 55.36ZM812.39 121.53V190.82H776.47V70.01H811.89V91.9H813.02Q817.08 81.02 826.06 74.76Q835.05 68.5 848.55 68.5Q861.21 68.5 870.58 74.07Q879.96 79.65 885.13 89.87Q890.3 100.08 890.3 113.95V190.82H854.38V120.69Q854.38 110.16 848.97 104.16Q843.55 98.15 833.95 98.15Q827.58 98.15 822.71 100.94Q817.85 103.73 815.12 108.93Q812.39 114.12 812.39 121.53ZM963.69 193.11Q944.93 193.11 931.33 185.59Q917.72 178.08 910.46 164.12Q903.2 150.17 903.2 130.93Q903.2 112.27 910.47 98.23Q917.74 84.19 930.99 76.34Q944.24 68.5 962.22 68.5Q974.65 68.5 985.19 72.42Q995.73 76.35 1003.54 84.09Q1011.35 91.84 1015.66 103.32Q1019.97 114.81 1019.97 130V139.36H916.54V117.92H1002.73L985.95 123.22Q985.95 114.44 983.3 108.11Q980.66 101.77 975.45 98.29Q970.25 94.82 962.53 94.82Q954.8 94.82 949.47 98.31Q944.13 101.8 941.36 107.94Q938.58 114.09 938.58 122.24V137.52Q938.58 146.63 941.78 153.19Q944.99 159.75 950.8 163.27Q956.61 166.79 964.3 166.79Q969.57 166.79 973.89 165.28Q978.2 163.78 981.32 160.84Q984.43 157.89 986.02 153.67L1019.08 155.22Q1016.8 166.72 1009.55 175.25Q1002.3 183.77 990.69 188.44Q979.08 193.11 963.69 193.11Z\" /></g></svg>",
    "ninetynine-the-seal": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1014 256\" role=\"img\" aria-label=\"ninetynine\"><title>the-seal + ninetynine</title><g transform=\"translate(16.10 25.60) scale(0.8000)\"><path fill=\"currentColor\" fill-rule=\"evenodd\" d=\"M 52 24 H 204 L 232 52 V 204 L 204 232 H 52 L 24 204 V 52 Z M 56 52 H 104 L 116 64 V 192 L 104 204 H 56 L 80 180 H 92 V 136 H 56 L 44 124 V 64 Z M 68 76 H 92 V 112 H 68 Z M 152 52 H 200 L 212 64 V 192 L 200 204 H 152 L 176 180 H 188 V 136 H 152 L 140 124 V 64 Z M 164 76 H 188 V 112 H 164 Z\" /></g><g transform=\"translate(245 35.84) scale(.72)\"><path xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" data-part=\"ninety\" data-weight=\"400\" d=\"M38.37 118.2V190.82H20V70.01H37.72V89.03H39.45Q43.66 79.73 52.31 74.12Q60.95 68.5 74.68 68.5Q86.89 68.5 96.07 73.47Q105.26 78.44 110.39 88.54Q115.52 98.64 115.52 114.1V190.82H97.15V115.39Q97.15 101.24 89.7 93.19Q82.24 85.14 69.38 85.14Q60.52 85.14 53.5 89.03Q46.47 92.92 42.42 100.27Q38.37 107.61 38.37 118.2ZM138 190.82V70.01H156.37V190.82ZM147.29 49.91Q141.89 49.91 138 46.24Q134.11 42.56 134.11 37.38Q134.11 32.19 138 28.52Q141.89 24.84 147.29 24.84Q152.7 24.84 156.59 28.52Q160.48 32.19 160.48 37.38Q160.48 42.56 156.59 46.24Q152.7 49.91 147.29 49.91ZM197.22 118.2V190.82H178.85V70.01H196.57V89.03H198.3Q202.51 79.73 211.15 74.12Q219.8 68.5 233.52 68.5Q245.73 68.5 254.92 73.47Q264.1 78.44 269.24 88.54Q274.37 98.64 274.37 114.1V190.82H256V115.39Q256 101.24 248.54 93.19Q241.09 85.14 228.23 85.14Q219.37 85.14 212.34 89.03Q205.32 92.92 201.27 100.27Q197.22 107.61 197.22 118.2ZM347.42 193.41Q330.02 193.41 317.32 185.63Q304.62 177.85 297.82 163.86Q291.01 149.86 291.01 131.39Q291.01 112.8 297.71 98.64Q304.41 84.49 316.57 76.49Q328.72 68.5 345.04 68.5Q354.44 68.5 363.73 71.63Q373.03 74.76 380.64 81.79Q388.26 88.81 392.8 100.37Q397.34 111.94 397.34 128.79V136.79H304.19V120.8H387.29L378.75 126.85Q378.75 114.75 374.97 105.34Q371.19 95.94 363.68 90.54Q356.17 85.14 345.04 85.14Q333.91 85.14 325.97 90.59Q318.02 96.05 313.81 104.8Q309.6 113.56 309.6 123.61V134.2Q309.6 147.92 314.35 157.43Q319.1 166.94 327.64 171.85Q336.18 176.77 347.42 176.77Q354.66 176.77 360.6 174.66Q366.54 172.56 370.86 168.29Q375.19 164.02 377.46 157.75L395.39 162.94Q392.58 172.02 385.94 178.88Q379.29 185.74 369.46 189.58Q359.63 193.41 347.42 193.41ZM465.85 70.01V85.79H403.39V70.01ZM421.54 41.27H439.91V156.24Q439.91 165.64 443.8 170.02Q447.69 174.39 456.12 174.39Q457.96 174.39 459.96 174.18Q461.96 173.96 464.33 173.53L468.22 190.17Q465.63 191.14 461.9 191.74Q458.18 192.33 454.39 192.33Q439.81 192.33 430.67 183.69Q421.54 175.04 421.54 161.21ZM494.16 235.99Q489.4 236.09 485.73 235.34Q482.06 234.58 480.54 233.83L485.3 217.62L487.13 218.05Q496.43 220.21 502.75 217.13Q509.07 214.05 513.83 200.98L517.28 191.47L472.76 70.01H492.86L526.14 166.4H527.44L560.72 70.01H580.82L529.6 208.32Q526.14 217.72 521.07 223.88Q515.99 230.04 509.29 233.01Q502.59 235.99 494.16 235.99Z\" /><path xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" data-part=\"nine\" data-weight=\"750\" d=\"M627.29 121.53V190.82H591.37V70.01H626.79V91.9H627.91Q631.98 81.02 640.96 74.76Q649.95 68.5 663.44 68.5Q676.11 68.5 685.48 74.07Q694.86 79.65 700.03 89.87Q705.2 100.08 705.2 113.95V190.82H669.28V120.69Q669.28 110.16 663.86 104.16Q658.45 98.15 648.84 98.15Q642.48 98.15 637.61 100.94Q632.74 103.73 630.01 108.93Q627.29 114.12 627.29 121.53ZM722.87 190.82V70.01H758.79V190.82ZM740.79 55.36Q732.97 55.36 727.41 50.18Q721.86 44.99 721.86 37.68Q721.86 30.3 727.41 25.15Q732.97 20 740.79 20Q748.61 20 754.17 25.15Q759.72 30.3 759.72 37.64Q759.72 44.98 754.17 50.17Q748.61 55.36 740.79 55.36ZM812.39 121.53V190.82H776.47V70.01H811.89V91.9H813.02Q817.08 81.02 826.06 74.76Q835.05 68.5 848.55 68.5Q861.21 68.5 870.58 74.07Q879.96 79.65 885.13 89.87Q890.3 100.08 890.3 113.95V190.82H854.38V120.69Q854.38 110.16 848.97 104.16Q843.55 98.15 833.95 98.15Q827.58 98.15 822.71 100.94Q817.85 103.73 815.12 108.93Q812.39 114.12 812.39 121.53ZM963.69 193.11Q944.93 193.11 931.33 185.59Q917.72 178.08 910.46 164.12Q903.2 150.17 903.2 130.93Q903.2 112.27 910.47 98.23Q917.74 84.19 930.99 76.34Q944.24 68.5 962.22 68.5Q974.65 68.5 985.19 72.42Q995.73 76.35 1003.54 84.09Q1011.35 91.84 1015.66 103.32Q1019.97 114.81 1019.97 130V139.36H916.54V117.92H1002.73L985.95 123.22Q985.95 114.44 983.3 108.11Q980.66 101.77 975.45 98.29Q970.25 94.82 962.53 94.82Q954.8 94.82 949.47 98.31Q944.13 101.8 941.36 107.94Q938.58 114.09 938.58 122.24V137.52Q938.58 146.63 941.78 153.19Q944.99 159.75 950.8 163.27Q956.61 166.79 964.3 166.79Q969.57 166.79 973.89 165.28Q978.2 163.78 981.32 160.84Q984.43 157.89 986.02 153.67L1019.08 155.22Q1016.8 166.72 1009.55 175.25Q1002.3 183.77 990.69 188.44Q979.08 193.11 963.69 193.11Z\" /></g></svg>"
};
  var LOGO_ORDER = ['ninetynine-the-wordmark', 'the-wordmark'];

  function getLogo() {
    try { var k = global.localStorage.getItem('99-logo'); return k === 'the-wordmark' ? k : 'ninetynine-the-wordmark'; }
    catch (e) { return 'ninetynine-the-wordmark'; }
  }
  function setLogo(key) {
    try { global.localStorage.setItem('99-logo', key === 'the-wordmark' ? key : 'ninetynine-the-wordmark'); } catch (e) {}
    notifyBrand();
  }
  function notifyBrand() {
    if (global.document && global.CustomEvent) global.dispatchEvent(new global.CustomEvent('brand99:change'));
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
    var needsWord = false;  /* client decision: mark only, never paired with "99" */
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
  var SW_LABELS = {"the-sign": "The Sign", "the-wordmark": "Wordmark", "the-sign-off": "Sign-off", "the-seal": "Seal", "ninetynine": "ninetynine", "ninetynine-the-sign": "The Sign + ninetynine", "ninetynine-the-wordmark": "Wordmark + ninetynine", "ninetynine-the-sign-off": "Sign-off + ninetynine", "ninetynine-the-seal": "Seal + ninetynine"};

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
      '.bc-menu{position:absolute;right:0;top:calc(100% + 6px);min-width:260px;max-height:70vh;overflow-y:auto;background:var(--surface-2);' +
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
      '.cream,.on-cream,.est,.doc,.cpanel,.covers{--slate:var(--muted-ink)}' +
      '.micro,.eyebrow,.step .n,.slide .n,.jsteps .k,.jrow .tick,.jscreen .foot b,.cmenu-h,.citem small{color:var(--accent-text) !important}' +
      '.cream .micro,.on-cream .micro{color:var(--accent-ink) !important}' +
      '.btn-accent{background:var(--accent) !important;color:var(--on-accent) !important}' +
      /* solid buttons: explicit per-mode pairs so hover can never go white-on-white */
      'html[data-mode="dark"] .btn-solid{background:#F7F2EB !important;color:#120301 !important}' +
      'html[data-mode="dark"] .btn-solid:hover{background:#FFFFFF !important;color:#120301 !important}' +
      'html[data-mode="light"] .btn-solid{background:#120301 !important;color:#F7F2EB !important}' +
      'html[data-mode="light"] .btn-solid:hover{background:#263039 !important;color:#F7F2EB !important}' +
      'html[data-mode="light"] .btn-ghost:hover{color:var(--accent-cream) !important;border-color:var(--accent-cream) !important}' +
      '.band{background:var(--accent) !important;color:var(--on-accent) !important}' +
      '.band h2,.band p{color:var(--on-accent) !important;opacity:1 !important}' +
      '.est .right{color:var(--on-accent) !important}' +
      '.est .right .price,.est .right .incl span,.est .right .note{color:var(--on-accent) !important}' +
      '.on-cream .tone .t2{color:#756C67 !important}' +
      '.ticks{color:#5E544E !important}' +
      '.plan .price small,.plan li{color:var(--slate) !important}' +
      '.metrics span{color:#726965 !important}' +
      '.doc{background:#FFFFFF !important;color:#120C0A !important}' +
      '.doc .mut,.doc .brand .sub,.doc .mono,.doc .row,.doc .run,.doc td,.doc th,.doc .sig .contact,.doc .sig .legal{color:#756C66 !important}' +
      '.doc .nm,.doc h2,.doc .tot,.doc td,.doc .avatar+*{color:#120C0A !important}' +
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
        + '<span class="bc-mini" style="width:' + (k.indexOf('ninetynine') === 0 ? 88 : 22) + 'px;height:22px">' + LOGOS[k] + '</span>' + SW_LABELS[k] + '</button>';
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
    bar.innerHTML = '<span class="bc-tag">ninetynine &middot; approved brand</span><div class="bc-ctl">'
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

    /* same-page anchors must clear the fixed brand bar + sticky nav */
    global.document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href*="#"]');
      if (!a) return;
      var href = a.getAttribute('href');
      var cut = href.indexOf('#');
      if (cut === -1) return;
      var path = href.slice(0, cut);
      var id = href.slice(cut + 1);
      if (!id) return;
      if (path) {
        /* a link like "services#engagement" is same-page when we're already on services */
        var here = global.location.pathname.replace(/\.html$/, '').replace(/\/$/, '');
        var there = path.replace(/\.html$/, '').replace(/\/$/, '').replace(/^\//, '');
        if (!here.endsWith('/' + there) && here !== '/' + there) return;
      }
      var el = global.document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      var bar = global.document.getElementById('bc-topbar');
      var nav = global.document.querySelector('.nav');
      // a pinned (sticky) section must land ON its sticky top; ordinary sections get
      // extra breathing room so the heading is not jammed under the navbars
      var off = (bar ? bar.offsetHeight : 0) + (nav ? nav.offsetHeight : 0);
      var top = el.getBoundingClientRect().top + (global.scrollY || global.document.documentElement.scrollTop) - off;
      global.scrollTo({ top: Math.max(0, top), behavior: global.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      try { global.history.replaceState(null, '', '#' + id); } catch (err) {}
    });

    /* arriving from another page with #how in the URL must also clear the chrome */
    if (global.location.hash) {
      global.setTimeout(function () {
        var el = global.document.getElementById(global.location.hash.slice(1));
        if (!el) return;
        var bar = global.document.getElementById('bc-topbar');
        var nav = global.document.querySelector('.nav');
        var off = (bar ? bar.offsetHeight : 0) + (nav ? nav.offsetHeight : 0);
        var top = el.getBoundingClientRect().top + (global.scrollY || 0) - off;
        global.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
      }, 260);
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
    var lp = global.document.getElementById('bc-logo-preview'); if (lp) { lp.innerHTML = logoMark(lg); lp.style.width = lg.indexOf('ninetynine') === 0 ? '76px' : '18px'; }
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

