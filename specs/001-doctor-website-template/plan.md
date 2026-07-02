# Implementation Plan: Doctor Website Template

**Branch**: `001-doctor-website-template` | **Date**: 2026-06-29 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-doctor-website-template/spec.md`

## Summary

Build a complete, production-ready, SEO-optimized doctor website template using pure HTML5 + CSS3 + Vanilla JS. All content is driven by a single JSON config file (`config/doctor-profile.json`). The site includes 10 sections (navbar through footer), Razorpay payment integration, WhatsApp appointment flow, Schema.org SEO markup, and automated deployment to Hostinger VPS via Nginx. The template is reusable — only the JSON config changes between doctor instances.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ES2020+ (no transpilation)

**Primary Dependencies**: None (runtime). External: Google Fonts CDN, Razorpay Checkout SDK

**Storage**: N/A (static site, JSON config file read via fetch)

**Testing**: Manual (Lighthouse audits, Google Rich Results Test, cross-browser/device testing)

**Target Platform**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) — Desktop & Mobile

**Project Type**: Static website template (single-page, multi-section)

**Performance Goals**: FCP < 1.5s on Fast 3G, Lighthouse Performance ≥ 90, Lighthouse SEO ≥ 95

**Constraints**: Total page weight < 500KB (excl. images), no build tools, no npm runtime deps, zero-framework

**Scale/Scope**: Single HTML page, 10 UI sections, 1 JSON config, ~1500 lines CSS, ~500 lines JS

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Pre-Design | Post-Design | Notes |
|---|-----------|:----------:|:-----------:|-------|
| I | Config-First (NON-NEGOTIABLE) | ✅ | ✅ | All content from `doctor-profile.json`; template never needs content edits |
| II | SEO Excellence | ✅ | ✅ | Schema.org JSON-LD (Dentist + FAQPage), full OG/Twitter meta, semantic HTML, heading hierarchy |
| III | Zero-Framework Simplicity | ✅ | ✅ | Pure HTML5 + CSS3 + Vanilla JS; no bundler, no TypeScript, no framework |
| IV | Non-Technical User Friendly | ✅ | ✅ | JSON-only updates, CONFIG-GUIDE.md, user-friendly error on malformed config |
| V | Mobile-First & Performance | ✅ | ✅ | Mobile-first CSS, lazy loading, <500KB budget, `defer`/`</body>` scripts |
| VI | Production Security | ✅ | ✅ | `escHtml()` for all DOM injection, CSP headers in Nginx, no `eval()`, no exposed secrets |

**Gate: PASSED** — Zero violations. No complexity justification required.

## Project Structure

### Documentation (this feature)

```text
specs/001-doctor-website-template/
├── plan.md              # This file
├── research.md          # Phase 0: Technology decisions
├── data-model.md        # Phase 1: JSON config schema & entities
├── quickstart.md        # Phase 1: Validation & deployment guide
├── contracts/           # Phase 1: Public interface contracts
│   └── config-schema.md # JSON config contract
└── tasks.md             # Phase 2: Implementation tasks (via /speckit.tasks)
```

### Source Code (repository root)

```text
doctor-website-template/
├── config/
│   └── doctor-profile.json       # THE config file (only thing to edit)
├── index.html                    # Template HTML (10 sections, never needs content edits)
├── assets/
│   ├── css/
│   │   └── style.css             # Complete design system (CSS variables for theming)
│   ├── js/
│   │   └── app.js                # Template engine (reads config, populates DOM)
│   └── images/
│       ├── doctor.jpg            # Doctor photo (user-provided)
│       └── og-image.jpg          # Open Graph image (1200x630px, user-provided)
├── nginx.conf                    # Production Nginx config (SSL + Gzip + CSP)
├── deploy.sh                     # Auto-deploy to Hostinger VPS
├── CONFIG-GUIDE.md               # Non-technical guide for editing JSON config
└── README.md                     # Developer: how to deploy + clone for new doctor
```

**Structure Decision**: Static website with flat file structure. No `src/` directory needed — the entire application is 3 files (HTML + CSS + JS) plus config. This is the simplest possible structure that satisfies all constitutional principles.
