# Implementation Plan: Doctor Website Template

**Branch**: `001-doctor-website-template` | **Date**: 2026-07-03 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-doctor-website-template/spec.md`

## Summary

Evolve the existing config-driven doctor template from single-page to a hybrid multi-page website that follows the reference information architecture while preserving the current homepage as-is. Add route-based pages for Profile, Expertise listing, expertise detail (slug-based template), and Contact. Explicitly exclude Knowledgebase and Research & Publications from routing, navigation, and generated pages.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ES2020+ (no transpilation)

**Primary Dependencies**: None (runtime). External: Google Fonts CDN, Razorpay Checkout SDK

**Storage**: N/A (static files + JSON config loaded via fetch)

**Testing**: Manual validation + Lighthouse + Rich Results + route checks

**Target Platform**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

**Project Type**: Static website template with hybrid navigation (anchor links on homepage + route links to dedicated pages)

**Performance Goals**: FCP < 1.5s on Fast 3G, Lighthouse Performance >= 90, Lighthouse SEO >= 95

**Constraints**: Total page weight < 500KB excluding user images, no framework, no build step, config-first updates only

**Scale/Scope**: Existing homepage retained; add 3 top-level route pages + slug-based expertise details using one reusable detail template

All previously unresolved areas are now clarified in `spec.md` (FR-029 to FR-033 and Session 2026-07-03 clarifications). No open NEEDS CLARIFICATION items remain.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Pre-Design | Post-Design | Notes |
|---|-----------|:----------:|:-----------:|-------|
| I | Config-First (NON-NEGOTIABLE) | PASS | PASS | New pages and expertise details are config-driven; no content hardcoding in templates |
| II | SEO Excellence | PASS | PASS | Per-page metadata strategy and crawlable expertise URLs retained |
| III | Zero-Framework Simplicity | PASS | PASS | Vanilla JS routing/data binding only |
| IV | Non-Technical User Friendly | PASS | PASS | Staff still edits only `doctor-profile.json` |
| V | Mobile-First & Performance | PASS | PASS | Shared assets and lightweight route pages preserve budget |
| VI | Production Security | PASS | PASS | Existing escaping and CSP approach preserved for new page rendering |

**Gate Result**: PASS

## Phase 0: Research

1. Confirm best-practice route strategy for static hosting with SEO-friendly expertise detail URLs.
2. Confirm config model for expertise listing and detail content without introducing page duplication.
3. Confirm navigation strategy to preserve homepage anchors and add route links cleanly.
4. Confirm exclusion strategy for Knowledgebase and Research & Publications in nav and generation.

**Output**: `research.md` updated with decisions, rationale, alternatives.

## Phase 1: Design & Contracts

1. Update data model for multi-page and expertise detail entities.
2. Update config contract to include page and expertise detail schema requirements.
3. Add route contract for page map and slug behavior.
4. Update quickstart validation to include route checks and excluded-page assertions.
5. Keep homepage behavior unchanged as an explicit design invariant.

**Outputs**:
- `data-model.md`
- `contracts/config-schema.md`
- `contracts/routes.md`
- `quickstart.md`

## Project Structure

### Documentation (this feature)

```text
specs/001-doctor-website-template/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── config-schema.md
│   └── routes.md
└── tasks.md
```

### Source Code (planned impact)

```text
Doctor-Website/
├── index.html                 # Existing homepage; keep visual/interaction behavior as-is
├── profile.html               # New profile page
├── expertise.html             # New expertise listing page
├── expertise-detail.html      # Reusable detail template resolved by slug
├── contact.html               # New contact page
├── assets/js/app.js           # Shared config loading and binding
├── assets/js/routes.js        # Optional route helpers / slug parsing
└── config/doctor-profile.json # Single source of content truth
```

## Re-evaluated Constitution Check (Post-Design)

Post-design artifacts preserve all constitution principles and do not introduce violations. The design keeps template simplicity and content maintainability while extending information architecture.

## Risks & Mitigations

- Risk: route/page drift from config schema.
	- Mitigation: define explicit route contract and validation checks in quickstart.
- Risk: accidental homepage regression while adding new pages.
	- Mitigation: homepage-preservation rule and side-by-side regression checks in quickstart.
- Risk: SEO dilution from duplicate metadata across pages.
	- Mitigation: per-page metadata keys and canonical strategy in config contract.

## Done Criteria

- Planning artifacts updated for clarified scope (multi-page hybrid nav).
- Exclusions (Knowledgebase, Research & Publications) represented in design/contracts.
- Agent context points to this plan file.
