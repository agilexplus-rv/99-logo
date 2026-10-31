/* 99 — mock website behaviour: interactive estimator, scroll reveals, number counters.
   Mirrors the interaction model of the reference shot (segmented toggle, device slider,
   live price, stamped tags) without reusing any of its assets. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Device tiers + a price band. These are illustrative placeholders for a mock site —
     not 99's published prices. */
  var TIERS = [
    { at: 0,   label: '0',    price: 0 },
    { at: 5,   label: '5',    price: 240 },
    { at: 25,  label: '25',   price: 780 },
    { at: 50,  label: '50',   price: 1280 },
    { at: 100, label: '100',  price: 2100 },
    { at: 200, label: '200+', price: 3400 }
  ];

  function bandFor(value) {
    var pick = TIERS[0];
    TIERS.forEach(function (t) { if (value >= t.at) pick = t; });
    return pick;
  }

  function money(n) {
    return '€' + n.toLocaleString('en-IE');
  }

  /* ---------------- estimator ---------------- */
  function initEstimator() {
    var root = $('#estimator');
    if (!root) return;
    var slider = $('#devices', root);
    var out = $('#price', root);
    var outNote = $('#price-note', root);
    var ticks = $$('.ticks span', root);
    var yearly = false;

    function paint() {
      var v = Number(slider.value);
      var band = bandFor(v);
      var price = band.price;
      if (yearly) price = Math.round(price * 0.85);
      out.textContent = price ? money(price) : 'Scoped';
      outNote.textContent = price
        ? (yearly ? 'per month, billed yearly — 15% saved' : 'per month, billed monthly')
        : 'scoping required — talk to us';
      var pct = (v / Number(slider.max)) * 100;
      slider.style.setProperty('--fill', pct + '%');
      ticks.forEach(function (t) {
        t.classList.toggle('on', t.dataset.at === String(v));
      });
      var box = $('#est-summary', root);
      if (box) box.textContent = v + ' systems · ' + (yearly ? 'yearly' : 'monthly');
    }

    slider.addEventListener('input', paint);
    $$('.seg button', root).forEach(function (b) {
      b.addEventListener('click', function () {
        yearly = b.dataset.billing === 'yearly';
        $$('.seg button', root).forEach(function (o) {
          o.setAttribute('aria-pressed', String(o === b));
        });
        paint();
      });
    });
    paint();

    /* click a tick to jump there */
    ticks.forEach(function (t) {
      t.style.cursor = 'pointer';
      t.addEventListener('click', function () {
        slider.value = t.dataset.at;
        paint();
      });
    });
  }

  /* ---------------- scroll reveal ---------------- */
  function initReveal() {
    var els = $$('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
        var n = en.target.querySelector('[data-count]');
        if (n) countUp(n);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    els.forEach(function (e) { io.observe(e); });
    // Safety net: never let content stay invisible if an observer callback is missed.
    window.addEventListener('load', function () {
      setTimeout(function () {
        els.forEach(function (e) {
          var r = e.getBoundingClientRect();
          if (r.top < window.innerHeight && !e.classList.contains('in')) e.classList.add('in');
        });
      }, 400);
    });
  }

  function countUp(el) {
    var target = Number(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    var dur = 900, t0 = performance.now();
    function frame(t) {
      var p = Math.min(1, (t - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString('en-IE') + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- timeline lights up as you scroll ---------------- */
  function initTimeline() {
    var steps = $$('.tl-step');
    if (!steps.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) en.target.classList.add('is-on');
      });
    }, { threshold: 0.6 });
    steps.forEach(function (s, i) { s.style.transitionDelay = (i * 90) + 'ms'; io.observe(s); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initEstimator();
    initReveal();
    initTimeline();
  });
})();

/* ---------------- conveyor: dots + arrows ---------------- */
(function () {
  var rail = document.getElementById('rail');
  if (!rail) return;
  var dots = document.getElementById('dots');
  var slides = Array.prototype.slice.call(rail.querySelectorAll('.slide'));

  slides.forEach(function (s, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', 'Stage ' + (i + 1));
    b.addEventListener('click', function () { go(i); });
    dots.appendChild(b);
  });
  var btns = Array.prototype.slice.call(dots.children);

  function current() {
    var best = 0, min = Infinity;
    slides.forEach(function (s, i) {
      var d = Math.abs(s.offsetLeft - rail.scrollLeft - rail.offsetLeft);
      if (d < min) { min = d; best = i; }
    });
    return best;
  }
  function paint() {
    var i = current();
    btns.forEach(function (b, j) { b.setAttribute('aria-current', String(i === j)); });
  }
  function go(i) {
    var s = slides[Math.max(0, Math.min(slides.length - 1, i))];
    if (s) rail.scrollTo({ left: s.offsetLeft - rail.offsetLeft, behavior: 'smooth' });
  }
  rail.addEventListener('scroll', function () { window.requestAnimationFrame(paint); }, { passive: true });
  document.getElementById('rail-prev').addEventListener('click', function () { go(current() - 1); });
  document.getElementById('rail-next').addEventListener('click', function () { go(current() + 1); });
  rail.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current() + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(current() - 1); }
  });
  paint();
})();

/* ---------------- tablet journey: scroll drives the screens, the tilt and the cursor ---------------- */
(function () {
  var section = document.getElementById('journey');
  if (!section) return;
  var screens = Array.prototype.slice.call(section.querySelectorAll('.jscreen'));
  var steps = Array.prototype.slice.call(section.querySelectorAll('.jsteps li'));
  var tabs = Array.prototype.slice.call(section.querySelectorAll('.screen-nav .tab'));
  var tablet = section.querySelector('.tablet');
  var cursor = section.querySelector('.cursor');
  var bar = section.querySelector('.jbar i');
  var current = -1;
  var mq = window.matchMedia('(max-width: 980px)');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function setStep(i) {
    if (i === current) return;
    current = i;
    screens.forEach(function (s, j) {
      s.classList.toggle('active', j === i);
      s.setAttribute('aria-hidden', String(j !== i));
    });
    steps.forEach(function (s, j) { s.setAttribute('aria-current', String(j === i)); });
    tabs.forEach(function (t, j) { t.setAttribute('aria-current', String(j === i)); });
    placeCursor(i, true);
  }

  /* the black dot travels to the active tab and "taps" it, as if opening a page */
  function placeCursor(i, tap) {
    if (!cursor || !tabs.length) return;
    var t = tabs[i], sc = section.querySelector('.screen');
    if (!t || !sc) return;
    var tr = t.getBoundingClientRect(), sr = sc.getBoundingClientRect();
    cursor.style.left = (tr.left - sr.left + t.offsetWidth / 2) + 'px';
    cursor.style.top = (tr.top - sr.top + t.offsetHeight / 2) + 'px';
    cursor.classList.add('on');
    if (tap) {
      cursor.classList.remove('tap');
      void cursor.offsetWidth;
      cursor.classList.add('tap');
      setTimeout(function () { cursor.classList.remove('tap'); }, 320);
    }
  }

  function progress() {
    if (mq.matches || reduced.matches) return null;
    var rect = section.getBoundingClientRect();
    var total = rect.height - window.innerHeight;
    if (total <= 0) return null;
    return Math.max(0, Math.min(1, -rect.top / total));
  }

  var ticking = false;
  function update() {
    ticking = false;
    var p = progress();
    if (p === null) { setStep(0); resetTilt(); return; }
    if (bar) bar.style.width = (p * 100).toFixed(1) + '%';

    /* tilt inwards then outwards: rotateY sweeps +11° -> 0 -> -11° across the section */
    if (tablet) {
      var ang = (0.5 - p) * 22;                 // +11 at start, 0 at middle, -11 at end
      tablet.style.transform = 'rotateY(' + ang.toFixed(2) + 'deg) translateZ(10px)';
    }

    var i = Math.min(screens.length - 1, Math.floor(p * screens.length * 0.999));
    setStep(i);
  }
  function resetTilt() { if (tablet) tablet.style.transform = 'rotateY(0deg)'; }
  function onScroll() { if (!ticking) { ticking = true; window.requestAnimationFrame(update); } }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  setStep(0);
  update();

  /* narrowing the layout re-measures the cursor anchor */
  if (window.ResizeObserver) {
    new ResizeObserver(function () { if (current >= 0) placeCursor(current, false); })
      .observe(section.querySelector('.screen'));
  }

  /* reduced motion / small screens: show every screen, stop pinning and tilt */
  function applyMode() {
    var small = mq.matches || reduced.matches;
    document.body.classList.toggle('no-journey', small);
    screens.forEach(function (s) { s.setAttribute('aria-hidden', String(small ? false : s !== screens[current])); });
    if (small) resetTilt(); else { setStep(0); }
    onScroll();
  }
  if (mq.addEventListener) { mq.addEventListener('change', applyMode); reduced.addEventListener('change', applyMode); }
  applyMode();
})();
