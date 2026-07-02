<!--
  SYNC IMPACT REPORT
  ==================
  Version change: N/A → 1.0.0 (initial ratification)
  Modified principles: None (first version)
  Added sections:
    - Core Principles (6 principles)
    - Additional Constraints
    - Development Workflow & Quality Gates
    - Governance
  Removed sections: None
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ (generic Constitution Check gate — compatible)
    - .specify/templates/spec-template.md ✅ (requirements structure — compatible)
    - .specify/templates/tasks-template.md ✅ (phase structure — compatible)
  Follow-up TODOs: None
-->

# Doctor Website Template Constitution

## Core Principles

### I. Config-First (NON-NEGOTIABLE)

Everything customizable MUST live in `config/doctor-profile.json`. Template
files (HTML, CSS, JS) MUST NEVER require editing for content changes.

- All text, images, colors, contact info, services, and schedule data MUST
  be driven by the JSON config file
- Adding a new content section MUST only require adding a key to the JSON
  schema — not modifying HTML structure
- The JSON file MUST be valid, well-documented with inline comments (via a
  separate schema/README), and safe for non-technical users to edit
- Template code reads config at runtime via `fetch()` or inline injection —
  no build step

**Rationale**: Doctors and clinic staff cannot edit HTML. A single JSON file
is the interface between the template and its users.

### II. SEO Excellence

Every feature MUST consider search ranking impact. Schema.org structured data,
meta tags, page speed, and semantic HTML are non-negotiable.

- Every page MUST include complete `<meta>` tags (title, description, og:*,
  twitter:*)
- Schema.org JSON-LD MUST be generated from doctor-profile.json (Physician,
  MedicalOrganization, LocalBusiness)
- HTML MUST use semantic elements (`<main>`, `<article>`, `<nav>`, `<section>`,
  `<header>`, `<footer>`)
- All images MUST have descriptive `alt` attributes derived from config
- URL structure and heading hierarchy MUST follow SEO best practices (single
  `<h1>`, logical `<h2>`–`<h6>` nesting)
- Page MUST pass Google Lighthouse SEO audit with score ≥ 95

**Rationale**: The primary business value of this template is helping doctors
rank high in local search results. SEO is not optional polish — it is the
product's core value proposition.

### III. Zero-Framework Simplicity

Pure HTML5 + CSS3 + Vanilla JavaScript only. No frameworks, no build tools,
no npm runtime dependencies.

- No React, Vue, Angular, Svelte, or any UI framework
- No Webpack, Vite, Parcel, or any bundler
- No TypeScript compilation step
- No npm runtime dependencies (`package.json` devDependencies for tooling
  only — linting, testing, deployment scripts)
- Only permitted external resources: Google Fonts CDN, Razorpay SDK
- All JavaScript MUST work without transpilation in modern browsers
  (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

**Rationale**: Simplicity guarantees fast load times, zero build failures,
easy debugging, and trivial deployment to any static hosting. A doctor's
website does not need a JavaScript framework.

### IV. Non-Technical User Friendly

A doctor or clinic staff member with zero coding knowledge MUST be able to
update all website content by editing only `config/doctor-profile.json`.

- The JSON config MUST have a clear, flat-as-possible structure with
  descriptive key names (e.g., `doctor_name`, not `dn`)
- A companion `CONFIG-GUIDE.md` MUST document every field with examples
- Error messages when config is malformed MUST be user-readable (not stack
  traces)
- Image updates MUST require only: (1) drop image in `assets/images/`,
  (2) update filename in JSON
- No terminal commands, no git knowledge, no code editing required for
  content updates

**Rationale**: The target user is a medical professional, not a developer.
The update workflow must be as simple as editing a Word document.

### V. Mobile-First & Performance

Mobile-first responsive design. Strict performance budgets enforced.

- CSS MUST be written mobile-first (base styles for mobile, `min-width`
  media queries for larger screens)
- Total page weight MUST be < 500KB excluding user-uploaded images
- First Contentful Paint MUST be < 1.5 seconds on Fast 3G
- Time to Interactive MUST be < 2 seconds on Fast 3G
- All images MUST use `loading="lazy"` except the hero/above-fold image
- CSS MUST use custom properties (`--var`) for theming and rebranding
- No render-blocking JavaScript — all scripts MUST use `defer` or be
  placed before `</body>`
- Google Lighthouse Performance score MUST be ≥ 90

**Rationale**: Most patients search for doctors on mobile devices. A slow
or poorly-formatted mobile experience directly loses potential patients.

### VI. Production Security

XSS prevention, CSP headers, input validation. No unsafe patterns.

- `eval()` MUST NEVER be used
- `innerHTML` MUST NEVER be used with unescaped user/config data — use
  `textContent` or a sanitization utility
- Nginx MUST serve Content-Security-Policy headers restricting inline
  scripts and external resources
- All form inputs (WhatsApp message, appointment requests) MUST be
  validated and sanitized client-side before submission
- Razorpay integration MUST follow their official security guidelines
  (server-side verification where applicable)
- No sensitive data (API keys, secrets) MUST appear in client-side code
  or the JSON config

**Rationale**: A medical professional's website handles patient trust.
Security vulnerabilities damage reputation and may violate healthcare
data protection expectations.

## Additional Constraints

### Technology Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Markup | HTML5 | Semantic, accessible |
| Styling | CSS3 | Variables, Grid, Flexbox |
| Scripting | Vanilla JS (ES2020+) | No frameworks |
| Config | JSON | Single file at `config/doctor-profile.json` |
| Server | Nginx | Static file serving + headers |
| Hosting | Hostinger VPS | Ubuntu + Nginx |
| Payments | Razorpay | Client SDK only |
| Messaging | WhatsApp | Click-to-chat URL API |

### Accessibility Requirements

- All interactive elements MUST have ARIA labels where semantic HTML is
  insufficient
- Keyboard navigation MUST work for all interactive components
- Color contrast MUST meet WCAG 2.1 AA (minimum 4.5:1 for text)
- Focus indicators MUST be visible
- Skip-to-content link MUST be present

### Theming & Rebranding

- All colors MUST be defined as CSS custom properties in `:root`
- Font families MUST be configurable via CSS variables
- Spacing scale MUST use CSS custom properties
- A new doctor MUST be able to rebrand the template by changing only
  CSS variables and the JSON config — no structural HTML/JS changes

### Deployment

- Deployment MUST work via `deploy.sh` script (rsync or scp to VPS)
- Nginx config (`nginx.conf`) MUST be included and production-ready
- HTTPS MUST be enforced (redirect HTTP → HTTPS)
- Gzip/Brotli compression MUST be enabled for text assets
- Cache headers MUST be set appropriately (immutable for hashed assets,
  short TTL for HTML/JSON)

## Development Workflow & Quality Gates

### Feature Addition Checklist

Every new feature or change MUST pass these gates before merge:

1. **Config-First Check**: Does the feature require JSON config changes
   only for content customization? If HTML/CSS/JS must be edited for
   content, the design is wrong.
2. **SEO Impact Check**: Does the feature maintain or improve Lighthouse
   SEO score? Does it add appropriate Schema.org data?
3. **Performance Budget Check**: Does total page weight remain < 500KB?
   Does Lighthouse Performance remain ≥ 90?
4. **Security Review**: No `eval()`, no unsafe `innerHTML`, no exposed
   secrets, CSP-compatible?
5. **Accessibility Check**: ARIA labels present? Keyboard navigable?
   Contrast ratios met?
6. **Mobile-First Verification**: Tested on 375px viewport? No
   horizontal scroll? Touch targets ≥ 44px?
7. **Sample Config Test**: Feature tested with the sample
   `doctor-profile.json`? Works with minimal config (only required
   fields)?

### Testing Requirements

- All JavaScript functions MUST be testable in isolation
- The sample `config/doctor-profile.json` MUST exercise all template
  features
- Template MUST render gracefully when optional config fields are missing
- Manual testing on Chrome, Firefox, Safari (mobile + desktop)

## Governance

### Authority

Constitution principles supersede convenience, deadlines, and personal
preference. If a proposed change conflicts with a principle, the principle
wins unless formally amended.

### Amendment Process

1. Propose amendment with rationale and impact analysis
2. Verify amendment does not contradict other principles
3. Update constitution version (SemVer):
   - MAJOR: Principle removal or incompatible redefinition
   - MINOR: New principle or material expansion
   - PATCH: Clarification or wording fix
4. Update `LAST_AMENDED_DATE`
5. Propagate changes to dependent templates and documentation

### Compliance

- Every feature specification MUST reference which principles it satisfies
- Code reviews MUST verify principle compliance
- Lighthouse audits (SEO ≥ 95, Performance ≥ 90) MUST pass before
  deployment
- The JSON config schema MUST be validated against sample profiles

**Version**: 1.0.0 | **Ratified**: 2026-06-28 | **Last Amended**: 2026-06-28
