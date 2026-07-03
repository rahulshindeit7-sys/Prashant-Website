# Research: Doctor Website Template

**Feature**: `001-doctor-website-template` | **Date**: 2026-07-03

## 1. Hybrid Information Architecture

**Decision**: Use hybrid navigation: keep homepage anchors unchanged and add dedicated route pages for Profile, Expertise, expertise detail, and Contact.

**Rationale**: This satisfies the explicit requirement to preserve the previously designed homepage while still matching the multi-page pattern of the reference site.

**Alternatives considered**:
- Full route-only navigation for every section: rejected because it would alter homepage behavior.
- Keep single-page only: rejected because it does not satisfy new scope.

## 2. Expertise Detail Page Strategy

**Decision**: Implement one reusable expertise detail template resolved by `slug` from config, with unique SEO-friendly URLs per expertise topic.

**Rationale**: Maintains config-first simplicity and avoids duplicated markup while still supporting crawlable, sharable expertise pages.

**Alternatives considered**:
- One physical HTML file per expertise topic: high maintenance and error-prone.
- No detail pages: rejected because requirement includes expertise detail pages.

## 3. Exclusion Policy for Removed Sections

**Decision**: Exclude Knowledgebase and Research & Publications from nav, routes, and generated page output.

**Rationale**: User explicitly requested copying pattern except those sections. Exclusion at contract level avoids accidental re-introduction in future edits.

**Alternatives considered**:
- Keep hidden placeholders: rejected due to SEO confusion and maintenance overhead.
- Keep routes but no nav links: rejected because pages must be absent, not discoverable.

## 4. Config Model Extension for Multi-Page Content

**Decision**: Extend `doctor-profile.json` with page-level and expertise-detail content groups while preserving all existing homepage keys.

**Rationale**: Config-first constitutional rule requires that new pages remain editable without template code changes.

**Alternatives considered**:
- Split config into multiple files: rejected to preserve single-file editing workflow.
- Hardcode static text on new pages: rejected by constitution.

## 5. SEO & Metadata for Route Pages

**Decision**: Add per-page metadata keys (title, description, canonical/slug) for Profile, Expertise listing, Expertise detail, and Contact.

**Rationale**: Prevents duplicate metadata and supports page-specific indexing quality for the expanded architecture.

**Alternatives considered**:
- Reuse homepage metadata globally: rejected due to duplicate titles/descriptions.
- Client-side metadata only after render with no canonical strategy: weaker crawl reliability.

## 6. Static Hosting Compatibility

**Decision**: Use explicit HTML page routes (`profile.html`, `expertise.html`, `expertise-detail.html`, `contact.html`) and query/slug resolution in vanilla JS.

**Rationale**: Works reliably on simple static hosting and Nginx without adding SPA rewrite complexity.

**Alternatives considered**:
- Full SPA history routing: rejected due to hosting rewrite requirements and avoidable complexity.
- Server-side templating: rejected by zero-framework and no-build constraints.
