#!/usr/bin/env python3
"""ninetynine delivery compliance gate.

Every delivery passes through one command. It answers four questions in order:

  1. Does legislation apply to this delivery?
  2. Which legislation, with the article-level reference?
  3. What must we do to be compliant?
  4. Which of those can be verified by testing the software, and did the test pass?

Design rules (deliberate):
  * Applicability is computed from a manifest by explicit predicates, never by a model.
    The same manifest always yields the same regimes, so the gate is reviewable.
  * A control is either AUTO (a named automated check supplies evidence) or MANUAL
    (human evidence with an owner and a date). The gate never implies a manual
    control passed because an automated one did.
  * Missing evidence is a failure, not a warning. Absence of proof is absence.
  * This is a delivery gate, not legal advice. It records what was checked.

Usage
  python3 compliance-gate/gate.py --manifest compliance-gate/manifests/local-ai-b2b.json
  python3 compliance-gate/gate.py --manifest ... --evidence evidence/auto.json --strict
Exit codes: 0 satisfied, 1 evidence missing/failed, 2 bad input.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

# ---------------------------------------------------------------- regimes


@dataclass
class Control:
    id: str
    title: str
    evidence: str          # "auto:<check-id>" or "manual"
    build_in: str          # what implementation makes this true
    verify: str            # how it is proven


@dataclass
class Regime:
    id: str
    name: str
    reference: str
    why: str
    controls: list[Control] = field(default_factory=list)


def C(cid, title, evidence, build_in, verify):
    return Control(cid, title, evidence, build_in, verify)


GDPR = Regime(
    "gdpr", "GDPR", "Regulation (EU) 2016/679",
    "personal data is processed",
    [
        C("gdpr.lawful-base", "Lawful basis recorded per purpose", "manual",
          "purpose register in the data model", "signed-off purpose register"),
        C("gdpr.notice", "Privacy notice reachable from every page", "auto:privacy-link",
          "footer/route to /privacy", "link found in rendered DOM"),
        C("gdpr.minimise", "Fields collected match the purpose register", "manual",
          "schema review", "data map review against form/API fields"),
        C("gdpr.retention", "Retention and deletion enforced, not documented", "auto:retention-job",
          "scheduled purge + soft-delete policy", "job definition present and scheduled"),
        C("gdpr.rights", "Export and erasure route exists for a data subject", "auto:dsr-route",
          "self-service export/delete endpoints or operator runbook", "endpoint responds in staging"),
        C("gdpr.transport", "TLS enforced, HSTS present", "auto:https-hsts",
          "reverse proxy config", "header probe"),
        C("gdpr.processor", "Data processing agreement in place with each client", "manual",
          "contract pack", "countersigned DPA on file"),
        C("gdpr.breach", "Breach runbook with 72h notification path", "manual",
          "incident process", "runbook reviewed and dated"),
    ],
)

EPRIVACY = Regime(
    "eprivacy", "ePrivacy", "Directive 2002/58/EC (as implemented in Malta)",
    "cookies or similar storage, or electronic marketing",
    [
        C("eprivacy.consent", "No non-essential cookie before consent", "auto:cookie-consent",
          "consent gate before analytics/marketing tags", "first-load cookie probe"),
        C("eprivacy.marketing", "Marketing consent records kept", "manual",
          "consent log with timestamp and source", "sample export of consent records"),
    ],
)

NIS2 = Regime(
    "nis2", "NIS2", "Directive (EU) 2022/2555",
    "managed service activity: installing, managing, operating or maintaining client systems (Art. 6(39))",
    [
        C("nis2.risk", "Risk-management measures are documented and applied (Art. 21)", "manual",
          "control set aligned to Art. 21(2) a–j", "reviewed control matrix"),
        C("nis2.report", "Significant incident can be reported within 24h (Art. 23)", "manual",
          "runbook plus named contact and channel", "tabletop exercise record"),
        C("nis2.supply", "Supply-chain requirements imposed on our own suppliers (Art. 21(2)(d))", "manual",
          "supplier register with security terms", "reviewed supplier register"),
        C("nis2.logging", "Access and admin actions logged", "auto:audit-log",
          "append-only audit trail for privileged actions", "log entries produced by a test action"),
        C("nis2.patch", "Patching route evidenced, not promised", "auto:component-inventory",
          "SBOM plus tracked update channel", "SBOM artefact present"),
    ],
)

CRA = Regime(
    "cra", "Cyber Resilience Act", "Regulation (EU) 2024/2847",
    "a product with digital elements is placed on the market (reporting from 11 Sep 2026, full 11 Dec 2027)",
    [
        C("cra.sbom", "Machine-readable component inventory shipped with the product", "auto:component-inventory",
          "CycloneDX/SPDX SBOM in build output", "SBOM file parsed"),
        C("cra.vuln", "Vulnerability handling process and contact", "manual",
          "security.txt or published contact plus triage process", "security.txt reachable"),
        C("cra.updates", "Security updates supported for a stated period", "manual",
          "support period in release policy", "dated support statement"),
        C("cra.secure-default", "Secure defaults: no default credentials, least privilege", "manual",
          "configuration review", "review signed off"),
    ],
)

DATA_ACT = Regime(
    "data-act", "EU Data Act", "Regulation (EU) 2023/2854",
    "cloud or data-processing service supplied to a customer",
    [
        C("data-act.switching", "Switching and exit terms can be met technically", "auto:export-route",
          "bulk export of customer data in an open format", "export exercised in staging"),
        C("data-act.contract", "Contract states switching support, notice periods and charges", "manual",
          "service schedule", "signed service schedule"),
    ],
)

AI_ACT = Regime(
    "ai-act", "AI Act", "Regulation (EU) 2024/1689",
    "an AI system or model is developed, integrated or operated",
    [
        C("ai-act.role", "Provider vs deployer role decided per engagement", "manual",
          "role statement in contract", "signed role statement"),
        C("ai-act.prohibited", "No prohibited practice in scope (Art. 5)", "manual",
          "design review against Art. 5 list", "review record"),
        C("ai-act.model-card", "Model purpose, limits and data described", "auto:model-card",
          "MODEL.md shipped with the system", "document present and populated"),
        C("ai-act.logging", "Inputs/outputs retained where needed for traceability", "auto:ai-trace",
          "request/response logging with retention", "log artefacts produced by a test call"),
        C("ai-act.human", "Human oversight point exists where the use is consequential", "manual",
          "review/approval step in the workflow", "workflow screenshot in evidence"),
        C("ai-act.gpai", "Third-party model terms and licences respected", "manual",
          "model licence register", "licence register reviewed"),
    ],
)

EAA = Regime(
    "eaa", "European Accessibility Act", "Directive (EU) 2019/882",
    "consumer-facing service (e-commerce, banking, transport, e-books) from 28 Jun 2025",
    [
        C("eaa.axe", "No serious automated accessibility violations", "auto:axe",
          "semantics, labels, contrast in build", "axe run over key pages"),
        C("eaa.keyboard", "Keyboard-only operation of the primary journey", "auto:keyboard",
          "focus order and visible focus", "keyboard walk of primary journey"),
        C("eaa.statement", "Accessibility statement published", "auto:accessibility-statement",
          "static page with contact route", "page found"),
        C("eaa.manual", "Manual screen-reader pass on the primary journey", "manual",
          "assistive-technology testing", "test notes with date"),
    ],
)

CONSUMER = Regime(
    "consumer", "Consumer protection", "Directive 2011/83/EU; Directive 2005/29/EC; Directive 93/13/EEC",
    "sales or services to consumers",
    [
        C("consumer.info", "Pre-contract information: price, term, cancellation", "auto:checkout-info",
          "order summary before payment", "fields present in checkout"),
        C("consumer.withdraw", "14-day withdrawal route for distance sales", "manual",
          "cancellation flow and policy", "policy plus flow test notes"),
    ],
)

PSD2 = Regime(
    "psd2", "PSD2", "Directive (EU) 2015/2366",
    "money movement handled or initiated on behalf of a customer",
    [
        C("psd2.outsource", "Payments delegated to a regulated provider, not held in-house", "manual",
          "contract with PSP, no card data touching our systems", "architecture review"),
        C("psd2.sca", "Strong customer authentication on the payment path", "manual",
          "hosted checkout from the PSP", "PSP configuration record"),
    ],
)

EIDAS = Regime(
    "eidas", "eIDAS", "Regulation (EU) 910/2014",
    "electronic signatures or trust services used in the delivery",
    [
        C("eidas.level", "Signature level matches the legal need", "manual",
          "stated signature level per document type", "decision record"),
    ],
)

ECOMMERCE = Regime(
    "ecommerce", "E-Commerce Directive", "Directive 2000/31/EC (and Malta Electronic Commerce Act)",
    "an information-society service is operated",
    [
        C("ecommerce.identity", "Provider identity and contact published", "auto:imprint",
          "imprint/legal page with entity, address, contact", "page found"),
        C("ecommerce.terms", "Terms of service reachable before contracting", "auto:terms-link",
          "terms route linked in footer and checkout", "link found"),
    ],
)

IP = Regime(
    "ip", "IP and software licensing", "Directive 2009/24/EC; Directive (EU) 2016/943; Directive (EU) 2019/790",
    "software is delivered or distributed",
    [
        C("ip.ownership", "Ownership and licence of delivered code stated per contract", "manual",
          "IP clause plus licence grant", "signed contract clause"),
        C("ip.oss", "Open-source obligations reviewed for copyleft", "auto:licence-scan",
          "dependency licence inventory with allowlist", "licence scan output"),
        C("ip.confidentiality", "Client information kept confidential, access limited", "manual",
          "access control and NDA", "access review"),
    ],
)

VAT = Regime(
    "vat", "VAT and invoicing", "Directive 2006/112/EC",
    "consideration is charged for the services",
    [
        C("vat.treatment", "Place of supply and VAT treatment decided per invoice", "manual",
          "invoice rules in billing config", "sample invoice review"),
    ],
)

# ---------------------------------------------------------------- rules


def applies(m: dict) -> list[Regime]:
    data = set(m.get("data", []))
    out: list[Regime] = []
    if data & {"personal", "special-category", "financial", "health", "children"} or m.get("accounts"):
        out.append(GDPR)
    if m.get("cookies") or m.get("marketing") or m.get("analytics"):
        out.append(EPRIVACY)
    if m.get("managed_service") or m.get("hosting") == "we operate":
        out.append(NIS2)
    if m.get("delivery") in {"product", "saas", "appliance"}:
        out += [CRA, DATA_ACT] if m.get("delivery") in {"product", "appliance"} else [CRA]
    if m.get("hosting") in {"our cloud", "client cloud"} and m.get("delivery") == "bespoke":
        out.append(DATA_ACT)
    if m.get("ai") and m["ai"] != "none":
        out.append(AI_ACT)
    if m.get("customers") in {"b2c", "public-sector"}:
        out.append(EAA)
    if m.get("customers") == "b2c":
        out += [CONSUMER, ECOMMERCE]
    if m.get("customers") == "b2b" and m.get("public_service"):
        out.append(ECOMMERCE)
    if m.get("payments"):
        out.append(PSD2)
    if m.get("esignature"):
        out.append(EIDAS)
    if m.get("websites_operated"):
        out.append(ECOMMERCE)
    out.append(IP)
    out.append(VAT)
    seen, uniq = set(), []
    for r in out:
        if r.id not in seen:
            seen.add(r.id)
            uniq.append(r)
    return uniq


# ---------------------------------------------------------------- automated checks
# Maps check-id -> (predicate over collected facts, explanation). Facts come from
# evidence/auto.json (produced in CI where a browser is available) and from the
# repository scan, which runs anywhere.

SECRET_PATTERNS = [
    (re.compile(r"AKIA[0-9A-Z]{16}"), "AWS access key id"),
    (re.compile(r"-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----"), "private key"),
    (re.compile(r"(?i)(api[_-]?key|secret|token)\s*[:=]\s*['\"][A-Za-z0-9_\-]{20,}"), "inline credential"),
]


def repo_facts(root: Path) -> dict:
    facts = {"secrets": [], "sbom": False, "licences": [], "model_card": False, "retention_job": False}
    for path in root.rglob("*"):
        if not path.is_file() or ".git" in path.parts or path.stat().st_size > 2_000_000:
            continue
        if path.suffix.lower() in {".png", ".jpg", ".pdf", ".zip", ".woff2", ".ttf", ".ico"}:
            continue
        try:
            text = path.read_text(errors="ignore")
        except OSError:
            continue
        for rx, label in SECRET_PATTERNS:
            if rx.search(text):
                facts["secrets"].append(f"{path}: {label}")
        if path.name.lower() in {"model.md", "model-card.md"}:
            facts["model_card"] = True
        if path.name.lower() in {"sbom.json", "bom.json", "sbom.cdx.json"}:
            facts["sbom"] = True
        if "retention" in path.name.lower() and path.suffix in {".py", ".js", ".ts", ".yml", ".yaml"}:
            facts["retention_job"] = True
        for m in re.finditer(r'"license"\s*:\s*"([^"]+)"', text):
            facts["licences"].append(m.group(1))
    return facts


def auto_results(regimes, web: dict, repo: dict) -> dict:
    """check-id -> (ok|fail|unknown, note). 'unknown' means the check could not run."""
    def webok(key, note_ok, note_missing="check not run (needs CI browser)"):
        if key not in web:
            return ("unknown", note_missing)
        return ("ok", note_ok) if web[key] else ("fail", f"{key} failed")

    results = {}
    results["privacy-link"] = webok("privacy_link", "privacy route linked")
    results["terms-link"] = webok("terms_link", "terms route linked")
    results["imprint"] = webok("imprint", "imprint page carries entity details")
    results["accessibility-statement"] = webok("accessibility_statement", "statement route found")
    results["cookie-consent"] = webok("cookie_consent", "no non-essential cookie before consent")
    results["https-hsts"] = webok("hsts", "HSTS present")
    results["axe"] = webok("axe_violations_zero", "no serious axe violations")
    results["keyboard"] = webok("keyboard_ok", "keyboard journey completed")
    results["checkout-info"] = webok("checkout_info", "pre-contract information present")
    if "dsr_route" in web:
        results["dsr-route"] = ("ok", "export/erasure route responds") if web["dsr_route"] else ("fail", "DSR route failed")
    else:
        results["dsr-route"] = ("unknown", "check not run (needs staging endpoint)")
    if "export_route" in web:
        results["export-route"] = ("ok", "bulk export works") if web["export_route"] else ("fail", "export failed")
    else:
        results["export-route"] = ("unknown", "check not run (needs staging endpoint)")
    results["audit-log"] = webok("audit_log", "privileged action produced a log entry")
    results["ai-trace"] = webok("ai_trace", "model call produced a trace entry")
    results["model-card"] = (("ok", "MODEL.md present") if repo["model_card"] else ("fail", "no MODEL.md"))
    results["component-inventory"] = (("ok", "SBOM present") if repo["sbom"] else ("fail", "no SBOM artefact"))
    results["retention-job"] = (("ok", "retention job defined") if repo["retention_job"] else ("fail", "no retention job"))
    licences = {l.lower() for l in repo["licences"]}
    copyleft = {l for l in licences if l.startswith(("gpl", "agpl", "sspl", "osl"))}
    results["licence-scan"] = ("fail", f"copyleft licences present: {sorted(copyleft)}") if copyleft else \
                              ("ok", "no copyleft licences detected") if licences else ("unknown", "no dependency metadata found")
    if repo["secrets"]:
        results["secret-scan"] = ("fail", "; ".join(repo["secrets"][:3]))
    else:
        results["secret-scan"] = ("ok", "no obvious secrets in tracked files")
    return results


# ---------------------------------------------------------------- report


def build(manifest: dict, web: dict, repo: dict) -> tuple[dict, str]:
    regimes = applies(manifest)
    results = auto_results(regimes, web, repo)
    rows, failures, unknowns, manual = [], [], [], []
    for r in regimes:
        for c in r.controls:
            if c.evidence == "manual":
                status, note = "manual", "human evidence required"
                manual.append(f"{r.name} · {c.title}")
            else:
                key = c.evidence.split(":", 1)[1]
                status, note = results.get(key, ("unknown", "no such check"))
                if status == "fail":
                    failures.append(f"{r.name} · {c.title} ({note})")
                elif status == "unknown":
                    unknowns.append(f"{r.name} · {c.title} ({note})")
            rows.append(dict(regime=r.name, reference=r.reference, control=c.id, title=c.title,
                             status=status, note=note, build_in=c.build_in, verify=c.verify))
    verdict = "fail" if failures else ("incomplete" if unknowns else "pass")
    report = dict(project=manifest.get("name"), manifest=manifest, verdict=verdict,
                  regimes=[dict(id=r.id, name=r.name, reference=r.reference, why=r.why) for r in regimes],
                  controls=rows, failures=failures, unknown=unknowns, manual=manual,
                  repository_scan=repo)
    md = [f"# Compliance gate — {manifest.get('name', 'unnamed delivery')}", "",
          f"**Verdict: {verdict.upper()}**", "",
          "This record shows what was checked. It is not legal advice and does not certify compliance.",
          "", "## What applies, and why", "", "| Regime | Reference | Trigger |", "|---|---|---|"]
    md += [f"| {r.name} | {r.reference} | {r.why} |" for r in regimes]
    md += ["", "## Controls", "", "| Regime | Control | Status | Evidence |", "|---|---|---|---|"]
    icon = {"ok": "pass", "fail": "FAIL", "unknown": "not run", "manual": "manual"}
    md += [f"| {x['regime']} | {x['title']} | {icon.get(x['status'], x['status'])} | {x['note']} |" for x in rows]
    if failures:
        md += ["", "## Blocking failures", ""] + [f"- {f}" for f in failures]
    if unknowns:
        md += ["", "## Not yet evidenced", ""] + [f"- {u}" for u in unknowns]
    if manual:
        md += ["", "## Human sign-off required", ""] + [f"- {m}" for m in manual]
    md += ["", "## How each control is built and proven", ""]
    for r in regimes:
        md.append(f"### {r.name}")
        for c in r.controls:
            md.append(f"- **{c.title}** — build: {c.build_in}; prove: {c.verify}")
    return report, "\n".join(md) + "\n"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--manifest", required=True)
    ap.add_argument("--evidence", help="auto.json from CI browser checks")
    ap.add_argument("--root", default=".", help="repository root to scan")
    ap.add_argument("--out", default=".")
    ap.add_argument("--strict", action="store_true", help="treat unknown as failure")
    a = ap.parse_args()
    try:
        manifest = json.loads(Path(a.manifest).read_text())
    except Exception as e:
        print(f"manifest unreadable: {e}", file=sys.stderr)
        return 2
    web = {}
    if a.evidence and Path(a.evidence).exists():
        web = json.loads(Path(a.evidence).read_text())
    repo = repo_facts(Path(a.root))
    report, md = build(manifest, web, repo)
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    (out / "compliance-report.json").write_text(json.dumps(report, indent=2) + "\n")
    (out / "compliance-report.md").write_text(md)
    print(md)
    if report["verdict"] == "fail":
        return 1
    if a.strict and report["verdict"] == "incomplete":
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
