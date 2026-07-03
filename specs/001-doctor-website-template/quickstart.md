# Quickstart: Hybrid Multi-Page Validation Guide

**Feature**: `001-doctor-website-template` | **Date**: 2026-07-03

## Prerequisites

- Local HTTP server (`python -m http.server 8000` or equivalent)
- Valid `config/doctor-profile.json`
- Browser with DevTools (Chrome recommended)

## Run Locally

```bash
cd Doctor-Website
python -m http.server 8000
```

Open `http://localhost:8000`.

## Validation Scenarios

### 1. Homepage Preservation (Must Stay As-Is)

Steps:
1. Open homepage.
2. Verify hero, section order, anchor behavior, and visual style match the currently approved homepage.
3. Click existing navbar anchor links.

Expected:
- Existing homepage behavior is unchanged.
- No regressions in anchor scrolling.

### 2. New Route Pages Exist

Steps:
1. Open route pages:
   - `/profile` (or `profile.html`)
   - `/expertise` (or `expertise.html`)
   - `/contact` (or `contact.html`)
2. Confirm each page renders config-driven content.

Expected:
- All three pages load without console errors.
- Metadata and headings match page context.

### 3. Expertise Slug Detail Rendering

Steps:
1. Open expertise listing page.
2. Click an expertise item.
3. Open URL for detail page with slug.
4. Test an invalid slug.

Expected:
- Detail page uses one reusable template.
- Valid slug resolves correct content from config.
- Invalid slug shows friendly not-found state with back link.

### 4. Exclusion Enforcement

Steps:
1. Check navbar, footer links, and route map.
2. Search for links to excluded sections/pages.

Expected:
- No Knowledgebase route or nav item.
- No Research & Publications route or nav item.

### 5. SEO Checks Per Route

Steps:
1. Inspect `<title>`, meta description, canonical on Home, Profile, Expertise, Expertise Detail, and Contact.
2. Run Lighthouse SEO on at least Home + one route page.

Expected:
- Per-page metadata differs appropriately.
- SEO score remains at target threshold.

### 6. Config-First Content Update

Steps:
1. Change one profile field, one expertise summary, and one contact field in config.
2. Refresh relevant pages.

Expected:
- Updated values appear without editing HTML/CSS/JS.
- Homepage and route pages remain in sync with single config source.

### 7. Clone and Deploy Multi-Page Verification

Steps:
1. Set a new `site_id` and update doctor/clinic text in config.
2. Deploy with `deploy.sh` to VPS.
3. Verify these pages on deployed domain:
   - `/`
   - `/profile`
   - `/expertise`
   - `/expertise/<slug>`
   - `/contact`

Expected:
- All route pages render doctor-specific content from config.
- Homepage remains unchanged in structure/behavior.
- Excluded sections (Knowledgebase, Research & Publications) are absent from nav/routes.

## References

- Route contract: `contracts/routes.md`
- Config contract: `contracts/config-schema.md`
- Data model: `data-model.md`
