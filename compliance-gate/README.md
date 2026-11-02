# ninetynine delivery compliance gate

One command standing between "delivered" and "invoiced". It answers, in order:

1. **Does legislation apply?** — computed from a manifest, not from an opinion.
2. **Which legislation?** — with the instrument and article-level reference.
3. **What is required to comply?** — a control per obligation, with how it is built and how it is proven.
4. **Can it be tested?** — automated controls are executed against the software; the rest need a named human sign-off.

```bash
python3 compliance-gate/gate.py --manifest compliance-gate/manifests/local-ai-b2b.json --out out
python3 compliance-gate/selftest.py          # proves the rules engine still behaves
```

Exit codes: `0` satisfied · `1` failed or unevidenced control · `2` bad manifest.

## Why it is deterministic

Applicability is a set of explicit predicates over the manifest (`applies()` in `gate.py`). The same
manifest always yields the same regimes, so a reviewer can dispute a rule instead of arguing with a
black box. No model, no network call, no drift between runs.

## The manifest

One JSON file per delivery, kept with the project, not with this tool.

| Field | Values | Effect |
|---|---|---|
| `delivery` | `bespoke` `product` `saas` `appliance` | CRA, Data Act |
| `customers` | `b2b` `b2c` `public-sector` | EAA, consumer law, e-commerce |
| `hosting` | `client on-prem` `client cloud` `our cloud` `we operate` | NIS2, Data Act |
| `managed_service` | boolean | NIS2 Art. 6(39) — see the definition in `brand-system/EU-LEGISLATION.md` |
| `data` | `personal` `special-category` `financial` `health` `children` | GDPR |
| `accounts` | boolean | GDPR |
| `cookies` `marketing` `analytics` | boolean | ePrivacy |
| `ai` | `none` `assistive` `high-risk` | AI Act |
| `payments` | boolean | PSD2 |
| `esignature` | boolean | eIDAS |
| `public_service` | boolean | E-Commerce information duties |

## Evidence, and the honesty rule

A control is either **auto** (a named check supplies a boolean) or **manual** (a human signs it).

- `unknown` means the check could not run. It is **never** reported as a pass.
- `--strict` turns `unknown` into a failure, which is the default posture in CI.
- Operator attestations are supplied in a file (`GATE_ATTESTATION`), never inferred from a page.

Automated evidence is collected in GitHub Actions by `checks/web_checks.mjs`, because browsers must not
run on the build host: document routes, cookie-before-consent, HSTS/CSP, axe accessibility, keyboard
operation, and staging probes for data-subject-request and bulk-export endpoints.

Repository-level checks run anywhere: committed secrets, SBOM presence, copyleft dependency licences,
`MODEL.md` for AI deliveries, and a scheduled retention job.

## What it cannot do

- It cannot decide legal questions. It encodes a defensible reading and flags what a human must confirm.
- It cannot test an obligation that has no runtime signature — a signed DPA, a breach runbook, a role
  statement. Those stay manual on purpose; pretending otherwise is how compliance theatre starts.
- It does not certify compliance, and its output must not be presented as certification.

## Wiring into delivery

1. Copy a manifest into the project, fill it in honestly.
2. Run the workflow against the staging URL.
3. Attach `compliance-out/compliance-report.md` to the delivery record.
4. Resolve every `FAIL`; obtain human sign-off for every `manual` row.
5. Re-run after material changes. A gate that passed before a feature change is not evidence after it.
