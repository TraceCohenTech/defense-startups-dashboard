# Defense Tech Funding Dataset — QA Report

**Generated:** 2026-04-09
**Dataset:** 43 companies, $10M+ defense startup rounds (2025–26)
**Source:** Startupriders.com infographic, CrunchBase, company websites, press releases

---

## 1. Companies with Conflicting Funding Numbers

| Company | Issue | Recommended Action |
|---------|-------|--------------------|
| **TEKEVER** | £400M figure may include mix of equity, grants, project financing, and government contracts. TEKEVER has operated since 2001 — not a typical startup. | Verify breakdown of equity vs. non-equity capital |
| **Ursa Major** | $100M may refer to a specific round, not total raised. Historical total likely higher. | Cross-reference with Crunchbase for full funding history |
| **World View** | $10M figure appears to be a recent round only. Company has raised $100M+ historically and gone through restructuring. | Verify current capitalization table and recent round details |
| **Virtualitics** | $15M may refer to a specific round. Company has raised more historically (founded 2016). | Verify total vs. round amount |
| **Forterra** | May have complex corporate history (spinout/acquisition). $188M may not all be equity. | Verify corporate structure and funding breakdown |

## 2. Companies with Uncertain Investor Data

| Company | Issue |
|---------|-------|
| **Roark Aerospace** | No confirmed investor list publicly available |
| **Rivet Industries** | No investor data found |
| **Chariot Defense** | No investor data found |
| **Allen Control Systems** | No investor data found |
| **Grid Aero** | No investor data found |
| **Aeolus Labs** | No investor data found |
| **Swarmbotics AI** | No investor data found |
| **Aeon** | No investor data found |
| **Aurelius Systems** | No investor data found |
| **Rune Technologies** | No investor data found |
| **Gallatin** | No investor data found |

## 3. Companies Whose Capital Event May Not Be a Standard VC Round

| Company | Concern |
|---------|---------|
| **TEKEVER** | Likely includes government grants, NATO funding, and project financing alongside equity |
| **Forterra** | May include government contract-linked capital; corporate history unclear |
| **World View** | Complex funding history with restructuring; $10M may be post-restructuring raise |
| **Valinor** | Funding type entirely unclear; no public round details |
| **Seneca** | Funding type not confirmed as standard equity |
| **Onodrim** | European defense — may include government grants or defense fund allocation |
| **Vector** | Identity and funding structure both unverified |

## 4. Companies Whose Identity Could Not Be Confidently Verified

| Company | Issue |
|---------|-------|
| **Vector** | Multiple companies named "Vector" exist (Vector Launch went bankrupt 2019, Vector databases, etc.). The defense/space manufacturing Vector needs manual identification. |
| **Twenty** | A well-known open-source CRM is also called "Twenty". Verify this is a separate defense cyber entity. |
| **Seneca** | Common company name. Verify this is the correct defense-focused entity. |
| **Aeon** | Very common name. Multiple companies. Needs identity confirmation. |
| **Valinor** | Tolkien-derived name used by multiple entities. Verify defense company identity. |
| **Onodrim** | Tolkien-derived name. European defense sensing — country not confirmed. |
| **Gallatin** | Common name. Verify correct defense logistics entity. |

## 5. Missing Fields Requiring Manual Completion

### Critical missing data (high priority):
- **Roark Aerospace**: website, HQ, founded year, founders, investor list, round details
- **Rivet Industries**: all metadata fields
- **Valinor**: nearly all fields missing
- **Seneca**: all metadata and most funding fields
- **Twenty**: all metadata fields
- **Onodrim**: country, all metadata fields
- **Vector**: identity verification needed before any fields can be populated
- **Aeon**: all metadata fields

### Moderate gaps (medium priority):
- **CHAOS Industries**: founder names, founded year confirmation
- **Harmattan AI**: founder names, HQ confirmation
- **HavocAI**: HQ, founded year, founders
- **Cambium**: website, HQ, founders
- **Swarm Aero**: HQ, founded year, founders
- **Chariot Defense**: all metadata
- **Allen Control Systems**: all metadata
- **Seasats**: HQ, founded year
- **Grid Aero**: all metadata
- **Aeolus Labs**: all metadata
- **Swarmbotics AI**: all metadata
- **Aurelius Systems**: all metadata
- **Gallatin**: all metadata
- **Rune Technologies**: all metadata

## 6. Summary Statistics

| Metric | Value |
|--------|-------|
| Total companies | 43 |
| Green data quality | 14 (33%) |
| Yellow data quality | 13 (30%) |
| Red data quality | 16 (37%) |
| Manual review needed | 27 (63%) |
| Companies with confirmed investors | 20 |
| Companies with unknown investors | 23 |
| Non-USD currencies | 5 (EUR: 3, GBP: 1, mixed: 1) |

---

## Methodology Notes

- **Currency conversion**: EUR→USD at 1.20, GBP→USD at 1.25 (approximate 2025 rates)
- **"Total raised"** figures from the source list may represent different things: cumulative equity, single largest round, or mixed capital. Each is flagged individually.
- Companies with `data_quality_flag: red` should not be cited without manual verification.
- This dataset is best used as a starting framework, not a finished product. ~37% of entries need significant manual enrichment.
