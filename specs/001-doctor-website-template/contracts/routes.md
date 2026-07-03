# Contract: Route and Navigation Map

**Feature**: `001-doctor-website-template`

## Goal

Define stable page routing and navigation behavior for hybrid architecture.

## Route Map

- Home: `/` or `index.html`
- Profile: `/profile` or `profile.html`
- Expertise listing: `/expertise` or `expertise.html`
- Expertise detail: `/expertise/{slug}` or `expertise-detail.html?slug={slug}`
- Contact: `/contact` or `contact.html`

## Navigation Contract

- Home keeps anchor links for existing sections (for example: `#about`, `#services`, `#why-us`, `#contact`).
- Top-level route links are added for Profile, Expertise, and Contact.
- Route links must not alter existing homepage section order or behavior.

## Expertise Detail Contract

- A single reusable detail template renders all expertise details.
- Input key: `slug`.
- Data source: `expertise[]` in `doctor-profile.json`.
- Unknown slug behavior: show friendly not-found state and link back to expertise listing.

## Excluded Routes

These routes must not exist in this scope:

- `/knowledgebase`
- `/research-publications`

## SEO Contract

- Every route page has its own title/description/canonical.
- Expertise detail pages use slug-based canonical and title template.
- No page should reuse homepage canonical for a different route.
