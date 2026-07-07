# Implementation Plan: Doctor Website Template

**Branch**: `001-doctor-website-template` | **Date**: 2026-07-06 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-doctor-website-template/spec.md`

## Summary

Evolve the existing config-driven doctor template from single-page to a hybrid multi-page website that follows the reference information architecture while preserving the current homepage as-is. Add route-based pages for Profile, Expertise listing, expertise detail (slug-based template), and Contact. Explicitly exclude Knowledgebase and Research & Publications from routing, navigation, and generated pages. Add on-page patient feedback form with auto-classification (≥4 stars = public, <4 stars = doctor review via WhatsApp).

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ES2020+ (no transpilation)

**Primary Dependencies**: None (runtime). External: Google Fonts CDN, Razorpay Checkout SDK, Admin Dashboard API (spec 002) for feedback submission

**Storage**: N/A (static files + JSON config loaded via fetch). Feedback stored server-side by admin dashboard.

**Testing**: Manual validation + Lighthouse + Rich Results + route checks + feedback flow verification

**Target Platform**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

**Project Type**: Static website template with hybrid navigation (anchor links on homepage + route links to dedicated pages) and dynamic feedback submission to external API

**Performance Goals**: FCP < 1.5s on Fast 3G, Lighthouse Performance >= 90, Lighthouse SEO >= 95

**Constraints**: Total page weight < 500KB excluding user images, no framework, no build step, config-first updates only

**Scale/Scope**: Existing homepage retained; add 3 top-level route pages + slug-based expertise details using one reusable detail template + patient feedback form with admin dashboard integration

All previously unresolved areas are now clarified in `spec.md` (FR-029 to FR-039 and Sessions 2026-07-03 through 2026-07-06 clarifications). No open NEEDS CLARIFICATION items remain.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Pre-Design | Post-Design | Notes |
|---|-----------|:----------:|:-----------:|-------|
| I | Config-First (NON-NEGOTIABLE) | PASS | PASS | New pages, expertise details, and feedback form are config-driven; approved feedback syncs to config testimonials array |
| II | SEO Excellence | PASS | PASS | Per-page metadata strategy and crawlable expertise URLs retained; testimonials with Review schema unchanged |
| III | Zero-Framework Simplicity | PASS | PASS | Vanilla JS routing/data binding and fetch() for feedback submission only |
| IV | Non-Technical User Friendly | PASS | PASS | Staff edits only `doctor-profile.json`; feedback flows automatically through admin dashboard |
| V | Mobile-First & Performance | PASS | PASS | Shared assets, lightweight route pages, responsive feedback form preserve budget |
| VI | Production Security | PASS | PASS | Client-side validation + XSS escaping + CORS on feedback API + sanitization |

**Gate Result**: PASS

## Phase 0: Research

1. Confirm best-practice route strategy for static hosting with SEO-friendly expertise detail URLs.
2. Confirm config model for expertise listing and detail content without introducing page duplication.
3. Confirm navigation strategy to preserve homepage anchors and add route links cleanly.
4. Confirm exclusion strategy for Knowledgebase and Research & Publications in nav and generation.
5. Confirm feedback submission architecture for static site → admin dashboard API.
6. Confirm auto-classification strategy (star rating threshold) and approval flow.
7. Confirm approved feedback display sync mechanism (admin dashboard → config → redeploy).
8. Confirm negative feedback notification channel (WhatsApp to doctor).
9. Confirm fallback behavior when admin dashboard API is unavailable.

**Output**: `research.md` updated with decisions, rationale, alternatives.

## Phase 1: Design & Contracts

1. Update data model for multi-page and expertise detail entities.
2. Update config contract to include page, expertise detail, and feedback schema requirements.
3. Add route contract for page map and slug behavior.
4. Add feedback API contract (template → admin dashboard submission endpoint).
5. Update quickstart validation to include route checks, excluded-page assertions, and feedback flow verification.
6. Keep homepage behavior unchanged as an explicit design invariant.

**Outputs**:
- `data-model.md`
- `contracts/config-schema.md`
- `contracts/routes.md`
- `contracts/feedback-api.md`
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
│   ├── routes.md
│   └── feedback-api.md
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
├── assets/js/app.js           # Shared config loading, binding, and feedback form logic
├── assets/js/routes.js        # Optional route helpers / slug parsing
└── config/doctor-profile.json # Single source of content truth (includes feedback config)
```

## Re-evaluated Constitution Check (Post-Design)

Post-design artifacts preserve all constitution principles and do not introduce violations. The feedback feature integrates cleanly: config-driven form rendering, vanilla JS submission, approved feedback flows back to config testimonials array via admin dashboard, no new runtime dependencies on the static site itself.

## Risks & Mitigations

- Risk: route/page drift from config schema.
	- Mitigation: define explicit route contract and validation checks in quickstart.
- Risk: accidental homepage regression while adding new pages.
	- Mitigation: homepage-preservation rule and side-by-side regression checks in quickstart.
- Risk: SEO dilution from duplicate metadata across pages.
	- Mitigation: per-page metadata keys and canonical strategy in config contract.
- Risk: admin dashboard API unavailability blocks feedback submission.
	- Mitigation: WhatsApp fallback (same graceful degradation pattern as Razorpay in FR-012).
- Risk: spam/bot feedback submissions overwhelm the system.
	- Mitigation: server-side rate limiting (5/IP/hour) by admin dashboard; client-side basic validation.
- Risk: delay between feedback approval and display on site (requires config redeploy).
	- Mitigation: acceptable for v1 (near-real-time not required); admin dashboard can batch-sync periodically.

## Done Criteria

- Planning artifacts updated for clarified scope (multi-page hybrid nav + patient feedback).
- Exclusions (Knowledgebase, Research & Publications) represented in design/contracts.
- Feedback API contract defined between template and admin dashboard.
- Agent context points to this plan file.
