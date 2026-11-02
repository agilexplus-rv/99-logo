# EU legislation relevant to ninetynine's services

**Status: informational register, not legal advice.** Applicability depends on contract terms, customer sector, company size, where the customer is established and whether the offering is business-to-business or consumer-facing. Confirm with Maltese counsel before relying on any item, and re-check dates — several regimes are still phasing in.

## Service scope assumed

Discovery and scoping → software design and development → testing and delivery → hosting and operation → maintenance and enhancement → business-process optimisation, data/reporting and technology consultancy. Business customers only; no public price list; no regulated financial, legal, accountancy or certification services.

## 1. Data protection — always applies

| Instrument | Why it applies |
|---|---|
| **GDPR — Regulation (EU) 2016/679** | Applies to any processing of personal data. When hosting or maintaining a customer's system, ninetynine is normally a **processor** (Art. 28 requires a written data processing agreement); for its own website, enquiries and marketing it is a **controller**. Obligations: lawful basis and records (Art. 30), security (Art. 32), breach notification (Art. 33/34), data subject requests, privacy by design (Art. 25), and confidentiality of staff. |
| **ePrivacy Directive 2002/58/EC** (as implemented in Malta) | Cookies and similar storage, electronic marketing, traffic data. Relevant to the marketing website, analytics and any email campaigns. |
| **Standard contractual clauses — Decision 2021/914** | Needed for transfers of personal data outside the EEA (e.g. non-EU sub-processors, support tooling, US cloud regions). |
| **Data Act — Regulation (EU) 2023/2854** | Cloud and data-processing service contracts: switching rights, contractual transparency and, later, withdrawal of switching charges (from 12 January 2027). Relevant where ninetynine provides hosting or cloud services to customers. |

## 2. Cybersecurity and product rules

| Instrument | Relevance |
|---|---|
| **NIS2 — Directive (EU) 2022/2555** | Digital infrastructure and **ICT service management** are in scope, including cloud computing, data-centre and managed service providers. Entity classification (essential/important) turns on sector and size, so a small provider may not be directly in scope — but in-scope customers must impose supply-chain security requirements contractually (Art. 21). Expect security questionnaires, incident-notification clauses and audit rights regardless. Malta transposed NIS2 nationally; check the current Maltese implementing law. |
### What NIS2 means by "managed service provider"

NIS2 defines it in Article 6(39), verbatim:

> "managed service provider" means an entity that provides services related to the **installation, management, operation or maintenance** of ICT products, networks, infrastructure, applications or any other network and information systems, **via assistance or active administration** carried out **either on customers' premises or remotely**.

Four things follow from that wording, and each matters for this business:

1. **It is far wider than "we run your IT".** Installation, management, operation *or* maintenance are each sufficient on their own. Ongoing support of software running on a client's own server qualifies.
2. **"Assistance" is enough — you do not need admin rights.** Advising on or helping with operation counts, though hands-on "active administration" is the clearer case.
3. **On-premises counts.** Supporting a locally installed AI system on a customer's hardware is squarely inside the definition; the "remote or on customers' premises" wording closes the old assumption that managed services mean remote hosting.
4. **There is no express "continuing basis" test** in the definition, despite what is often repeated in commentary. In practice the words "management, operation or maintenance" imply a relationship rather than a one-off delivery, but do not rely on a duration argument — check the actual service terms.

**Related definitions:** a *managed security service provider* (Art. 6(40)) is a managed service provider that carries out or assists with cybersecurity risk-management activities — a stricter label, not a different business. Hosting on your own platform can additionally make you a *cloud computing service provider* (Art. 6(30)) or *data centre service provider* (Art. 6(31)).

**Sector placement:** managed service providers sit in Annex I under "ICT service management (B2B)", so classification as essential or important turns on size (medium-sized: ≥50 staff, or annual turnover *or* balance sheet above EUR 10 million) plus any Member State designations. Small providers may fall outside direct scope — but in-scope clients must still impose supply-chain security requirements (Art. 21(2)(d)) and contractual terms, so the practical obligations arrive through the contract either way.

**Practical test for ninetynine:** if an engagement includes administering, monitoring, patching or supporting systems the client runs — including local AI installations — treat it as managed-service work and expect MSP-style terms, even where the entity itself is below the NIS2 size threshold.

| **Cyber Resilience Act — Regulation (EU) 2024/2847** | Obligations for **products with digital elements** placed on the EU market, which can include software. Reporting duties from **11 September 2026**; full application from **11 December 2027**. Bespoke development for one client is arguably not "placing on the market", but reusable components, licensed products and hosted products may be. Treat scope as contract-specific and confirm. |
| **AI Act — Regulation (EU) 2024/1689** | Only if a solution includes AI features. General-purpose AI obligations phased from August 2025; high-risk obligations later. Determine the provider/deployer role per use case, and assess prohibited practices before build. |
| **Product Liability Directive — (EU) 2024/2853** | Treats software as a product; applies to products placed on the market from **9 December 2026**. Relevant to defect liability and insurance. |

## 3. Accessibility

| Instrument | Relevance |
|---|---|
| **European Accessibility Act — Directive (EU) 2019/882** | Applies from **28 June 2025** to specified consumer-facing services, including e-commerce. If ninetynine builds or operates such a service for a client, accessibility requirements attach to the economic operator — usually the client, but the build must be able to satisfy them. |
| **Web Accessibility Directive — (EU) 2016/2102** | Public-sector bodies' websites and apps; relevant when the customer is a public body. |

## 4. Trading, contracts and consumer law

| Instrument | Relevance |
|---|---|
| **E-Commerce Directive 2000/31/EC** (and Malta's Electronic Commerce Act) | Information-society services: provider identification and information duties, contract formation by electronic means, and hosting liability rules. |
| **Consumer Rights Directive 2011/83/EU**, **Unfair Commercial Practices Directive 2005/29/EC**, **Unfair Contract Terms Directive 93/13/EEC** | Only where ninetynine deals with consumers. A pure B2B engagement is generally outside these, but the dividing line is factual — mixed-use offerings need care. |
| **Payment Services Directive 2 — (EU) 2015/2366** | Only if payments are handled or initiated on a customer's behalf; otherwise keep payments with a regulated provider under a clearly separated contract. |
| **eIDAS — Regulation (EU) 910/2014** | Electronic signatures and trust services where signed documents matter. |

## 5. Intellectual property and licensing

| Instrument | Relevance |
|---|---|
| **Software Directive 2009/24/EC** | Protection of computer programs; copying, decompilation and interoperability limits. Contract must state who owns bespoke code and what licence the customer receives. |
| **Copyright and DSM Directive (EU) 2019/790**, **Database Directive 96/9/EC** | Content, documentation and datasets in delivered systems. |
| **Trade Secrets Directive (EU) 2016/943** | Confidentiality of client processes and ninetynine's own methods; supports NDAs and access controls. |
| **Open-source licences** (contractual, not EU law) | Copyleft licences can override commercial terms. Maintain a component inventory per project. |

## 6. Tax and invoicing

| Instrument | Relevance |
|---|---|
| **VAT Directive 2006/112/EC** and Implementing Regulation | Place-of-supply rules for services; reverse charge for B2B cross-border; one-stop-shop for B2C digital services. |
| **VAT in the Digital Age (ViDA)** | Phased e-invoicing and digital-reporting changes through 2030; monitor before building customer invoicing integrations. |

## Practical consequences for the brand system

1. Every hosting or maintenance engagement should have a **data processing agreement** and a documented sub-processor list.
2. Contracts should separate **software licence / hosting / support / enhancement** so obligations (and CRA/NIS2 exposure) attach to the right activity.
3. Accessibility, security and data-protection requirements belong in the **definition of done**, not in a post-launch appendix.
4. Do not publish security, uptime, certification or compliance claims that are not evidenced — this is also why the brand guidelines ban unsubstantiated claims.
5. Keep a **component and licence inventory** for every delivered system.

## Open questions to resolve with counsel

- Is ninetynine itself an in-scope NIS2 entity, given its size and the managed-service character of hosting and support?
- Does any reusable product cross into CRA "placing on the market"?
- Malta-specific registration, VAT and e-invoicing obligations for 99 Invest Ltd.
- Whether any client engagement touches regulated data (health, financial) with additional sector rules.

**Unverified:** entity size and registration details, customer sectors, contract terms, and Malta's current NIS2 implementing provisions. Nothing here asserts compliance.
