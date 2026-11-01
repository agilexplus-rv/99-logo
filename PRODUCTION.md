# Before go-live — open items

Tracked so nothing is lost between review rounds.

## Must fix before launch
- [ ] **Open Graph image.** Tags point at `/og-image.png` (1200×630), which does not exist yet.
      Generate a PNG from the 99 mark + palette (CI step or a one-off export) and commit it,
      or the share card shows no image.
- [ ] **`services` and `about` still use the older layout.** They share tokens, nav, anchors and
      language, but not the section design of `home`.
- [ ] **Custom-domain cache.** The Pages custom domain has served stale HTML more than once.
      `_headers` now revalidates HTML, and zone purge is scripted — confirm on a clean browser.
- [ ] **Contact form does not send email.** `/api/submit` returns 503; blocked on a mail transport.
- [ ] **`contact@99.systems` vs `99.systems`.** Footers use `contact@99.systems` as instructed;
      the domain research recommended `99.systems`. Confirm which is the real domain before print.
- [ ] **Trademark clearance.** Name is close to 99x and 99designs; a professional search is required.
- [ ] **Favicon / web manifest.** No favicon set; browsers and bookmarks show a blank tab icon.

## Nice to have
- [ ] Hover-state contrast assertions in CI (the axe audit only measures resting states).
- [ ] Tablet journey: verify on a real touch device.
- [ ] Small-size cut for The Seal mark below 24 px.
