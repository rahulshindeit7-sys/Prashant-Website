# Data Model: Doctor Website Template

**Feature**: `001-doctor-website-template` | **Date**: 2026-07-03

## Entity Overview

All content remains in one file: `config/doctor-profile.json`. Multi-page expansion is represented as additional config groups and route metadata.

## Core Entities

### 1. Doctor

Unchanged core doctor fields remain shared across homepage, profile, expertise, contact, schema, and footer.

### 2. Clinic

Unchanged clinic fields remain shared across homepage and contact page plus schema output.

### 3. Site Metadata

`site_id` remains required and unique per deployment.

### 4. Services

Service entries remain homepage and booking-form inputs.

## New/Extended Multi-Page Entities

### 5. Page Navigation

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `pages.profile.enabled` | boolean | ✅ | Enables Profile route/page |
| `pages.expertise.enabled` | boolean | ✅ | Enables Expertise listing route/page |
| `pages.contact.enabled` | boolean | ✅ | Enables Contact route/page |
| `pages.home.anchors` | object[] | ✅ | Existing homepage anchors preserved |

**Validation rules**:
- Homepage anchor behavior must remain unchanged.
- If a route page is enabled, corresponding nav entry must resolve.

### 6. Expertise

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `expertise[]` | array | ✅ | Expertise listing data source |
| `expertise[].slug` | string | ✅ | Unique slug for detail page resolution |
| `expertise[].title` | string | ✅ | Listing and detail heading |
| `expertise[].summary` | string | ✅ | Listing snippet |
| `expertise[].hero_image` | string | ❌ | Optional detail hero image |
| `expertise[].content_blocks[]` | object[] | ✅ | Detail page sections (heading/body/list) |
| `expertise[].related_slugs[]` | string[] | ❌ | Optional cross-linking |

**Validation rules**:
- `slug` must be unique and URL-safe (`[a-z0-9-]+`).
- Detail template must resolve one expertise item by slug and fail gracefully if missing.
- Content blocks must be plain text/config content, not unsafe HTML.

### 7. Route Metadata

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `seo.pages.profile` | object | ✅ | Meta title/description/canonical for profile route |
| `seo.pages.expertise` | object | ✅ | Meta title/description/canonical for expertise listing |
| `seo.pages.contact` | object | ✅ | Meta title/description/canonical for contact page |
| `seo.pages.expertise_detail` | object | ✅ | Meta template for slug-based expertise detail pages |

**Validation rules**:
- Each route must have non-empty title and description.
- Expertise detail metadata must support slug/title interpolation.

## Explicit Exclusion Entity

### 8. Excluded Sections

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `sections.knowledgebase.enabled` | boolean | ✅ | Must be false in this scope |
| `sections.research_publications.enabled` | boolean | ✅ | Must be false in this scope |

**Validation rules**:
- Excluded sections must not appear in nav, route map, or generated pages.

## State Transitions

### Route Rendering Flow

```text
[Page Request] -> [Load doctor-profile.json] -> [Resolve route]
[Resolve route] -> (home) -> [Render existing homepage sections]
[Resolve route] -> (profile|expertise|contact) -> [Render dedicated page]
[Resolve route] -> (expertise detail slug) -> [Render expertise-detail template with slug data]
[Resolve route] -> (unknown slug/route) -> [Show friendly not-found state]
```

### Exclusion Guard

```text
[Build nav/routes] -> [Apply exclusions] -> [Hide Knowledgebase + Research/Publications]
```

## Relationships Diagram

```text
doctor-profile.json
├── doctor, clinic, services, testimonials, faqs, payment, social
├── pages.* ---------------------- Route-level enablement and homepage anchors
├── expertise[] ------------------ Listing + slug-based detail content
├── seo.pages.* ------------------ Per-page metadata
└── sections exclusions ---------- Knowledgebase + Research/Publications disabled
```
