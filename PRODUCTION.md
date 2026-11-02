# Before go-live — verified status

Final identity: **Forge colour roles + Ember typography**, primary logo **rounded 99 + mixed-weight ninetynine**, domain **ninetynine.eu**.

## Must confirm before public issue
- [ ] **Legal details are fictional.** Registered address, company registration number and VAT are marked
      `[UNVERIFIED — confirm before publication]` in the site footer and in every specimen document.
- [ ] **Domain and mailboxes.** `ninetynine.eu` labelling does not provision DNS or mailboxes.
      `ninetynine.eu` answered HTTP 307 at the time of writing; its owner and intended target are unconfirmed.
- [ ] **Contact form transport.** `/api/submit` still returns 503 without `RESEND_API_KEY` or an `EMAIL` binding.
- [ ] **Trademark clearance.** Name remains close to 99x and 99designs; professional search required.
- [ ] **Print colour.** Screen HEX only; obtain printer conversion and a physical proof. No Pantone/CMYK values are asserted.
- [ ] **Optical size test.** Minimum sizes in the guidelines are proposals; no actual-size legibility test has been run.

## Fixed in this round
- Six specimen collateral PDFs, guidelines PDF and company-activities PDF are generated in CI from the approved identity.
- All prices remain private; specimen documents are labelled fictitious and not valid for payment or signature.
- Fonts are served locally (Inter Tight, JetBrains Mono, SIL OFL) so the site and PDFs need no Google Fonts request.
- Reduced-motion handling added in CSS and JS; logo/domain/typography assertions run in CI.
