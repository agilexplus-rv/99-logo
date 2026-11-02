#!/usr/bin/env python3
"""Self-test for the compliance gate rules engine.

The gate decides which legislation applies. That decision must be deterministic and
reviewable, so it is asserted here rather than trusted. Run in CI and locally:
    python3 compliance-gate/selftest.py
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

GATE = Path(__file__).with_name("gate.py")
MANIFESTS = Path(__file__).with_name("manifests")


def regimes_for(manifest: dict) -> list[str]:
    with tempfile.TemporaryDirectory() as td:
        m = Path(td) / "m.json"
        m.write_text(json.dumps(manifest))
        out = Path(td) / "out"
        subprocess.run([sys.executable, str(GATE), "--manifest", str(m), "--out", str(out)],
                       capture_output=True, text=True, check=False)
        report = json.loads((out / "compliance-report.json").read_text())
        return [r["id"] for r in report["regimes"]]


def ok(name, condition, detail=""):
    print(("PASS " if condition else "FAIL ") + name + (f"  [{detail}]" if detail and not condition else ""))
    return condition


results = []

# 1. Bespoke B2B work with personal data: data protection and contract/IP, no consumer law.
bespoke = {"name": "t", "delivery": "bespoke", "customers": "b2b", "hosting": "client on-prem",
           "data": ["personal"], "accounts": True, "ai": "none"}
r = regimes_for(bespoke)
results.append(ok("bespoke B2B includes GDPR", "gdpr" in r, str(r)))
results.append(ok("bespoke B2B excludes consumer law", "consumer" not in r and "eaa" not in r, str(r)))
results.append(ok("bespoke B2B always includes IP and VAT", {"ip", "vat"} <= set(r), str(r)))

# 2. Managed service: NIS2 must appear, because we operate the client's systems.
managed = dict(bespoke, hosting="we operate", managed_service=True)
r = regimes_for(managed)
results.append(ok("managed service triggers NIS2", "nis2" in r, str(r)))

# 3. Consumer shop: accessibility, consumer protection and e-commerce must all appear.
shop = json.loads((MANIFESTS / "consumer-shop.json").read_text())
r = regimes_for(shop)
results.append(ok("consumer shop triggers EAA", "eaa" in r, str(r)))
results.append(ok("consumer shop triggers consumer law", "consumer" in r, str(r)))
results.append(ok("consumer shop triggers e-commerce", "ecommerce" in r, str(r)))
results.append(ok("payments trigger PSD2", "psd2" in r, str(r)))
results.append(ok("SaaS triggers CRA", "cra" in r, str(r)))

# 4. Local AI: AI Act applies, and an appliance delivery also triggers the Data Act and CRA.
ai = json.loads((MANIFESTS / "local-ai-b2b.json").read_text())
r = regimes_for(ai)
results.append(ok("AI delivery triggers AI Act", "ai-act" in r, str(r)))
results.append(ok("managed AI delivery triggers NIS2", "nis2" in r, str(r)))
appliance = dict(ai, delivery="appliance")
r = regimes_for(appliance)
results.append(ok("appliance delivery triggers CRA and Data Act", {"cra", "data-act"} <= set(r), str(r)))

# 5. No personal data and no accounts: GDPR must not be asserted.
anon = {"name": "t", "delivery": "bespoke", "customers": "b2b", "data": [], "accounts": False}
r = regimes_for(anon)
results.append(ok("no personal data excludes GDPR", "gdpr" not in r, str(r)))

# 6. Evidence discipline: missing browser evidence is 'unknown', never 'pass'.
with tempfile.TemporaryDirectory() as td:
    out = Path(td) / "out"
    subprocess.run([sys.executable, str(GATE), "--manifest", str(MANIFESTS / "local-ai-b2b.json"),
                    "--out", str(out)], capture_output=True, text=True, check=False)
    report = json.loads((out / "compliance-report.json").read_text())
    statuses = {c["status"] for c in report["controls"]}
    results.append(ok("unevidenced checks are not marked pass", "ok" not in statuses or "unknown" in statuses, str(statuses)))
    results.append(ok("report records the verdict", report["verdict"] in {"pass", "incomplete", "fail"}, report["verdict"]))
    results.append(ok("every control states how it is proven",
                      all(c["verify"] and c["build_in"] for c in report["controls"])))

# 7. Copyleft detection actually fires.
with tempfile.TemporaryDirectory() as td:
    root = Path(td) / "repo"
    (root / "src").mkdir(parents=True)
    (root / "src" / "package.json").write_text('{"license": "AGPL-3.0"}')
    out = Path(td) / "out"
    subprocess.run([sys.executable, str(GATE), "--manifest", str(MANIFESTS / "local-ai-b2b.json"),
                    "--root", str(root), "--out", str(out)], capture_output=True, text=True, check=False)
    report = json.loads((out / "compliance-report.json").read_text())
    licence_row = next(c for c in report["controls"] if c["control"] == "ip.oss")
    results.append(ok("copyleft licence is caught", licence_row["status"] == "fail", licence_row["note"]))

# 8. Committed secrets are caught.
with tempfile.TemporaryDirectory() as td:
    root = Path(td) / "repo"
    root.mkdir(parents=True)
    (root / "config.js").write_text('const api_key = "REDACTEDKEY00000000000000";')
    out = Path(td) / "out"
    subprocess.run([sys.executable, str(GATE), "--manifest", str(MANIFESTS / "local-ai-b2b.json"),
                    "--root", str(root), "--out", str(out)], capture_output=True, text=True, check=False)
    report = json.loads((out / "compliance-report.json").read_text())
    results.append(ok("inline credential is detected", bool(report["repository_scan"]["secrets"]),
                      str(report["repository_scan"]["secrets"])))

print()
if all(results):
    print(f"PASS: {len(results)} compliance-gate assertions")
    sys.exit(0)
print(f"FAIL: {results.count(False)} of {len(results)} assertions")
sys.exit(1)
