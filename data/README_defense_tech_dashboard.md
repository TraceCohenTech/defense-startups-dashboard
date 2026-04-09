# Defense Tech Funding Dashboard — Dataset README

## Overview

This dataset maps **43 defense technology startups** that raised **$10M+** in venture or growth rounds during **2025–2026**, covering both US and European companies.

**Primary source:** Startupriders.com infographic (CrunchBase data, compiled 2025–Q1 2026), enriched with company websites, press releases, and investor databases.

## Dataset Files

| File | Description |
|------|-------------|
| `companies.json` | Full structured dataset (JSON, one object per company) |
| `defense_tech_funding_dashboard.csv` | Flat CSV version for spreadsheet/BI tools |
| `defense_tech_funding_QA.md` | Quality assurance report with flagged issues |
| `README_defense_tech_dashboard.md` | This file |

## Field Definitions

### Identity Fields
| Field | Description |
|-------|-------------|
| `company_name` | Official company name |
| `normalized_company_name` | Lowercase, underscore-separated identifier |
| `website` | Company website URL (null if unknown) |
| `headquarters_city` | HQ city |
| `headquarters_country` | HQ country (full name) |
| `country_code` | ISO 3166-1 alpha-2 code |
| `region` | North America or Europe |
| `founded_year` | Year of incorporation/founding |
| `founder_names` | Semicolon-separated list of founders |
| `founder_background_short` | Brief background on founders |

### Business / Category Fields
| Field | Description |
|-------|-------------|
| `company_description_short` | 1-sentence description |
| `primary_category` | Main category from taxonomy |
| `secondary_category` | Secondary category (nullable) |
| `category_bucket` | Broader category grouping |
| `hardware_software_mix` | hardware_heavy, software_heavy, software_only, mixed |
| `defense_subsector` | Specific defense vertical |
| `dual_use_or_defense_only` | dual_use, defense_only, defense_primary |
| `active_status` | active, inactive, acquired, restructuring |

### Funding Fields
| Field | Description |
|-------|-------------|
| `total_raised_usd` | Total capital raised, converted to USD |
| `total_raised_original_currency` | Total raised in original currency |
| `original_currency` | ISO currency code |
| `latest_round_size` | Most recent round size (nullable) |
| `latest_round_currency` | Currency of latest round |
| `latest_round_name` | Series A, B, C, Growth, etc. |
| `latest_round_date` | Year or YYYY-MM-DD |
| `latest_post_money_valuation_usd` | Post-money valuation in USD |
| `funding_data_confidence` | high, medium, low |

### Investor Fields
| Field | Description |
|-------|-------------|
| `lead_investor_latest_round` | Lead investor in most recent round |
| `notable_investors` | Semicolon-separated key investors |
| `investor_count_known` | Number of known investors |
| `strategic_investors` | Corporate/strategic investors |
| `government_backing_flag` | Whether government funding is involved |

### Operations Fields
| Field | Description |
|-------|-------------|
| `customer_type` | military, government, commercial, etc. |
| `deployment_status` | deployed, testing, development |
| `manufacturing_capability` | Boolean |
| `contracts_or_programs_note` | Known contracts or programs |
| `revenue_model_guess` | Estimated revenue model |
| `moat_type` | Competitive advantage type |

### Meta Fields
| Field | Description |
|-------|-------------|
| `source_urls` | Pipe-delimited source URLs |
| `source_count` | Number of sources consulted |
| `notes` | Free-text notes and caveats |
| `data_quality_flag` | green (verified), yellow (partial), red (unverified) |
| `manual_review_needed` | Boolean |

## Category Taxonomy

### Primary Categories
autonomy_ai, drones_uav, counter_drone, naval_autonomy, ground_autonomy, defense_software, milops_planning, sensing_perception, space_defense, hypersonics, propulsion, manufacturing, materials, cyber, communications, logistics, robotics, directed_energy, procurement_data, dual_use_infra

### Category Buckets
autonomy_platforms, frontline_hardware, defense_ai_software, space_hypersonics, sensing_detection, manufacturing_infrastructure, logistics_support, communications_networks

## Currency Normalization

| Currency | Rate to USD | Note |
|----------|------------|------|
| EUR | 1.20 | Approximate 2025 mid-year rate |
| GBP | 1.25 | Approximate 2025 mid-year rate |
| USD | 1.00 | Base currency |

All `total_raised_usd` values use these rates. Original currency values preserved in separate fields.

## What Counts as "Total Raised"

The `total_raised_usd` field represents the **total figure reported by the source** (Startupriders/CrunchBase). This may include:
- Standard equity VC rounds
- Growth equity
- Government grants (flagged where known)
- Project financing (flagged where known)
- Strategic investments

Where the composition is unclear, the `data_quality_flag` is set to yellow or red, and `notes` explain the ambiguity.

## Exclusions

- Companies raising under $10M not included
- Purely government-funded programs without private capital are excluded
- Defense primes (Lockheed, Raytheon, etc.) are excluded
- Companies that raised before 2025 without a 2025–26 round are excluded

## Companies Requiring Manual Review

27 of 43 companies (63%) are flagged for manual review. Key reasons:
- Limited public information (many defense startups operate in stealth)
- Ambiguous company identity (common names like "Vector", "Twenty", "Aeon")
- Unclear funding structure (equity vs. grants vs. contracts)
- Missing founder and HQ data

See `defense_tech_funding_QA.md` for the full QA report.

## Methodological Caveats

1. **Defense secrecy**: Many defense startups intentionally limit public information, making verification difficult
2. **Funding opacity**: Defense funding often mixes VC equity with government grants, OTA contracts, and strategic investments — totals may not be directly comparable
3. **Currency fluctuation**: EUR and GBP rates are approximate; actual conversion at time of raise may differ
4. **Startup vs. scaleup**: Some companies (TEKEVER founded 2001, Govini 2011) are mature companies, not startups in the traditional sense
5. **Source limitations**: Primary source is a single infographic compiled from CrunchBase data, which has known coverage gaps in defense
