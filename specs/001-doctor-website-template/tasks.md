# Tasks: Doctor Website Template (Hybrid Multi-Page + Feedback)

**Input**: Design documents from `/specs/001-doctor-website-template/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ (config-schema.md, routes.md, feedback-api.md), quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Root: repository root (static site files)
- Config: `config/doctor-profile.json`
- Pages: `index.html`, `profile.html`, `expertise.html`, `expertise-detail.html`, `contact.html`
- Assets: `assets/js/`, `assets/css/`, `assets/images/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Extend config schema and create page shells for multi-page architecture

- [x] T001 Extend `config/doctor-profile.json` with `pages`, `expertise[]`, `seo.pages`, `sections` exclusions, and `feedback` config groups per contracts/config-schema.md
- [x] T002 [P] Create `profile.html` page shell with shared head/body structure in profile.html
- [x] T003 [P] Create `expertise.html` listing page shell in expertise.html
- [x] T004 [P] Create `expertise-detail.html` reusable detail template shell in expertise-detail.html
- [x] T005 [P] Create `contact.html` page shell in contact.html
- [x] T006 [P] Add sample expertise entries (3-5 items with slugs, summaries, content_blocks) to config/doctor-profile.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core JS infrastructure that ALL pages and user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Implement config loader module (fetch + parse + error handling for malformed/missing JSON) in assets/js/app.js
- [x] T008 Implement XSS escaping utility function (sanitize all config-derived text before DOM insertion) in assets/js/app.js
- [x] T009 Implement shared navigation renderer (hybrid: homepage anchors + route links for Profile/Expertise/Contact, excluding Knowledgebase and Research & Publications) in assets/js/app.js
- [x] T010 Implement shared footer renderer (branding, nav links, social links from config) in assets/js/app.js
- [x] T011 Implement route/slug helper utilities (parse slug from query string, resolve expertise by slug, unknown-slug fallback) in assets/js/routes.js
- [x] T012 [P] Add error state rendering (user-friendly messages for malformed config, missing config, file:// protocol detection) in assets/js/app.js

**Checkpoint**: Foundation ready — config loads, escapes, nav renders, routes resolve. User story implementation can now begin.

---

## Phase 3: User Story 3 — Doctor/Staff Updates Website Content (Priority: P1) 🎯 MVP

**Goal**: All website content renders dynamically from `config/doctor-profile.json`. Changing any config value and refreshing shows updated content with zero HTML/CSS/JS edits.

**Independent Test**: Modify doctor-profile.json (change name, add service, update timing, add expertise item), refresh each page, verify all changes reflect immediately.

### Implementation for User Story 3

- [x] T013 [US3] Implement homepage hero section renderer (doctor photo, name, specialization, experience badges, triple CTAs) from config in assets/js/app.js
- [x] T014 [P] [US3] Implement about section renderer (credentials, biography, awards, languages) from config in assets/js/app.js
- [x] T015 [P] [US3] Implement services grid renderer (icon, name, description, price range from config services array) in assets/js/app.js
- [x] T016 [P] [US3] Implement "Why Choose Us" section renderer with animated counters (patients, rating, years, transparency) from config in assets/js/app.js
- [x] T017 [P] [US3] Implement testimonials section renderer (star rating, name, location, text, date from config testimonials array) plus "Review us on Google" button linked to GBP review page in assets/js/app.js
- [x] T018 [P] [US3] Implement FAQ accordion renderer (question/answer pairs from config, Schema.org FAQPage-compliant markup) in assets/js/app.js
- [x] T019 [P] [US3] Implement contact info section renderer (Google Maps embed, address, phone, email, timings from config) in assets/js/app.js
- [x] T020 [US3] Implement Profile page content renderer (extended doctor info, education, awards, languages, full biography) in profile.html and assets/js/app.js
- [x] T021 [US3] Implement Expertise listing page renderer (render all expertise[] items with title, summary, link to detail) in expertise.html and assets/js/app.js
- [x] T022 [US3] Implement Expertise detail template renderer (resolve slug, render content_blocks, hero_image, related expertise links; show not-found state for invalid slugs; default to featured expertise when no slug provided) in expertise-detail.html and assets/js/routes.js
- [x] T023 [US3] Implement Contact page content renderer (clinic info, map, timings, phone, email, WhatsApp section) in contact.html and assets/js/app.js
- [x] T024 [US3] Implement graceful handling of optional/missing config sections (hide sections when testimonials/FAQ/social arrays are empty or absent) in assets/js/app.js
- [x] T025 [US3] Implement image fallback behavior (placeholder display when referenced images don't exist, no broken image icons) in assets/js/app.js

**Checkpoint**: All pages render fully from config. Content updates require only JSON edits.

---

## Phase 4: User Story 1 — Patient Finds Doctor via Google Search (Priority: P1) 🎯 MVP

**Goal**: Website appears in top search results with rich snippets showing ratings, specialization, and clinic hours. Lighthouse SEO ≥ 95.

**Independent Test**: Run Lighthouse SEO audit (score ≥ 95), validate Schema.org with Google Rich Results Test, verify meta tags render correctly in social sharing previews.

### Implementation for User Story 1

- [x] T026 [US1] Implement per-page meta tag injection (title, description, keywords, canonical) from config seo.pages object in assets/js/app.js
- [x] T027 [P] [US1] Implement Open Graph and Twitter Card meta tag injection from config in assets/js/app.js
- [x] T028 [P] [US1] Implement Schema.org JSON-LD generation for Dentist/Physician type (with GeoCoordinates lat/long + areaServed localities from config) in assets/js/app.js
- [x] T029 [P] [US1] Implement Schema.org FAQPage JSON-LD generation from config FAQ array in assets/js/app.js
- [x] T030 [US1] Implement expertise detail page SEO (slug-based canonical, title/description template interpolation from config seo.pages.expertise_detail) in assets/js/routes.js
- [x] T031 [US1] Ensure semantic HTML structure across all pages (single h1, logical h2-h6 nesting, semantic elements: main, article, nav, section, header, footer) in index.html, profile.html, expertise.html, expertise-detail.html, contact.html
- [x] T032 [P] [US1] Add local_keywords array support in config SEO section and inject into meta keywords in assets/js/app.js
- [x] T033 [P] [US1] Add descriptive alt attributes to all images derived from config data in assets/js/app.js

**Checkpoint**: All pages have unique meta, valid Schema.org, semantic HTML. Rich Results Test passes.

---

## Phase 5: User Story 2 — Patient Books Appointment Online (Priority: P1) 🎯 MVP

**Goal**: Patient fills appointment form, pays via Razorpay, receives WhatsApp confirmation with booking details.

**Independent Test**: Fill appointment form with valid data, submit, verify Razorpay modal opens with correct amount, complete payment, verify WhatsApp opens with pre-filled details and confirmation modal appears.

### Implementation for User Story 2

- [x] T034 [US2] Implement appointment booking form HTML (name, phone, date, time slot, service dropdown populated from config services array, optional message) in index.html
- [x] T035 [US2] Implement client-side form validation with inline error messages (required fields, phone format, future dates only, service selection required) in assets/js/app.js
- [x] T036 [US2] Implement Razorpay payment integration (load SDK, open modal with consultation fee from config payment object, handle success/failure callbacks) in assets/js/app.js
- [x] T037 [US2] Implement WhatsApp pre-filled message on successful payment (patient name, phone, service, date, time, payment ID via wa.me link) in assets/js/app.js
- [x] T038 [US2] Implement booking confirmation modal (summary with all details + payment receipt ID) in assets/js/app.js
- [x] T039 [US2] Implement graceful degradation when Razorpay key is missing or payment fails (fallback to WhatsApp-only booking, retry option on failure) in assets/js/app.js
- [x] T040 [P] [US2] Implement "Book Appointment" CTA behavior on non-homepage pages (navigate to index.html and scroll to form section) in assets/js/app.js

**Checkpoint**: Complete appointment booking flow works end-to-end with payment and confirmation.

---

## Phase 6: User Story 4 — Patient Browses on Mobile Phone (Priority: P2)

**Goal**: Smooth, fast-loading mobile experience on 375px viewport. All content readable, navigation works, page loads < 2s on Fast 3G.

**Independent Test**: Load site on 375px viewport, verify all sections readable without horizontal scroll, hamburger menu works, Lighthouse Performance ≥ 90, FCP < 1.5s.

### Implementation for User Story 4

- [x] T041 [US4] Implement mobile-first base CSS (breakpoints: 480px, 768px, 1024px using min-width queries) in assets/css/style.css
- [x] T042 [P] [US4] Implement responsive navigation with hamburger menu for mobile (tap to open/close, section links close menu on tap) in assets/css/style.css and assets/js/app.js
- [x] T043 [P] [US4] Implement responsive services grid, testimonials, and FAQ layouts for mobile viewports in assets/css/style.css
- [x] T044 [US4] Ensure all touch targets are ≥ 44px and no horizontal scrolling occurs on viewports 320px–1920px in assets/css/style.css
- [x] T045 [US4] Implement lazy loading for all images except hero (loading="lazy" attribute) in all HTML files and assets/js/app.js
- [x] T046 [P] [US4] Implement Google Fonts loading with preconnect (Playfair Display + Inter) optimized for performance in all HTML files
- [x] T047 [US4] Ensure all scripts use defer attribute and are non-render-blocking in all HTML files
- [x] T048 [US4] Implement portrait-mode specific CSS for WhatsApp button and contact section using `@media (orientation: portrait)` with sticky bottom positioning and 60px content clearance in assets/css/style.css

**Checkpoint**: Site performs well on mobile. Lighthouse Performance ≥ 90, FCP < 1.5s on Fast 3G.

---

## Phase 7: User Story 5 — New Doctor Clones Template for Their Practice (Priority: P2)

**Goal**: A developer clones the repo, replaces config JSON with new doctor data, deploys via deploy.sh, and gets a fully branded site with zero code changes.

**Independent Test**: Clone repo, replace JSON config with a completely different doctor (different specialization, city, services), deploy, verify entire website reflects new doctor.

### Implementation for User Story 5

- [x] T049 [P] [US5] Implement CSS custom properties in :root for all colors, fonts, spacing (enabling full rebranding by changing only CSS variables) in assets/css/style.css
- [x] T050 [P] [US5] Create deploy.sh script for automated deployment to Hostinger VPS (rsync+SSH, file sync, Nginx reload) in deploy.sh
- [x] T051 [P] [US5] Create production Nginx config with SSL, Gzip compression, security headers (CSP, X-Frame-Options, X-Content-Type-Options), cache policies, and CORS for config endpoint (GET-only, restricted to admin dashboard domain) in nginx.conf
- [x] T052 [P] [US5] Create/update CONFIG-GUIDE.md documenting every config field with examples for non-technical users in CONFIG-GUIDE.md
- [x] T053 [US5] Ensure site_id field in config is used consistently for template identification (referenced in feedback submission, admin dashboard integration) in assets/js/app.js

**Checkpoint**: Template is clone-and-deploy ready. New doctor site achievable with only JSON + image changes.

---

## Phase 8: User Story 6 — Patient Contacts via WhatsApp (Priority: P3)

**Goal**: Patient can quickly message doctor via floating WhatsApp button from any page, with pre-filled greeting.

**Independent Test**: Click floating WhatsApp button, verify it opens wa.me link with correct phone number and pre-filled message.

### Implementation for User Story 6

- [x] T054 [US6] Implement floating WhatsApp button (fixed bottom-right, green, pulse animation, opens wa.me with config phone + pre-filled greeting) in assets/js/app.js and assets/css/style.css
- [x] T055 [US6] Implement WhatsApp contact section in Contact page (doctor's WhatsApp number, "Message us on WhatsApp" CTA per FR-017a) in contact.html and assets/js/app.js
- [x] T056 [US6] Implement GA4 custom event tracking for phone_call_click, whatsapp_click, and appointment_submit events (when GA ID configured in config) in assets/js/app.js
- [x] T057 [US6] Implement sticky WhatsApp button behavior on portrait mobile (no overlap with form inputs/CTAs, dismissible via CSS, adequate content padding per SC-008a/SC-008b) in assets/css/style.css

**Checkpoint**: WhatsApp accessible from all pages, click tracking works, no content overlap on mobile.

---

## Phase 9: Patient Feedback Feature (FR-034 to FR-039)

**Goal**: On-page patient feedback form submits to admin dashboard API. Rating ≥4 auto-publishes to testimonials; <4 routes to doctor via WhatsApp notification.

**Independent Test**: Submit feedback with 5-star rating → verify POST to API with correct payload and success confirmation. Set API endpoint to unreachable URL → verify WhatsApp fallback appears.

### Implementation for Feedback Feature

- [x] T058 Implement patient feedback form section (patient name, interactive star rating 1-5, feedback text, service dropdown from config services array) conditionally rendered when feedback.enabled=true in index.html and assets/js/app.js
- [x] T059 Implement client-side feedback form validation (required fields, patient_name max 100 chars, text max 500 chars, service must match config services, same validation pattern as appointment form) in assets/js/app.js
- [x] T060 Implement feedback submission via fetch() POST to `{feedback.api_endpoint}/submit` with payload (site_id, patient_name, rating, text, service, submitted_at) per contracts/feedback-api.md in assets/js/app.js
- [x] T061 Implement feedback submission success state (confirmation message to patient, indicate if published or sent for review based on API response) in assets/js/app.js
- [x] T062 Implement feedback API fallback (timeout >10s or network error → show "Unable to submit feedback online" error message + WhatsApp fallback with pre-filled feedback text via wa.me link) in assets/js/app.js
- [x] T063 [P] Implement feedback form section hiding when feedback.enabled=false or feedback field missing from config in assets/js/app.js

**Checkpoint**: Feedback form works end-to-end with API submission and graceful WhatsApp fallback.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, accessibility, edge cases, and cross-page consistency

- [x] T064 [P] Implement keyboard navigation support for all interactive elements (Tab, Enter, Escape for modals/menus/accordion) across all pages
- [x] T065 [P] Implement edge case: file:// protocol detection with clear error message explaining HTTP server requirement in assets/js/app.js
- [x] T066 Verify exclusion enforcement: confirm Knowledgebase and Research & Publications do not appear in any nav, footer, route, or generated page across all HTML files
- [x] T067 Validate cross-page navigation consistency (nav active states, "Book Appointment" CTA navigates to homepage form from all pages, WhatsApp button consistent across pages)
- [x] T068 Validate page weight budget < 500KB excluding user images (audit all assets)
- [x] T069 Run Lighthouse audits: SEO ≥ 95, Performance ≥ 90, validate FCP < 1.5s on Fast 3G throttle
- [x] T070 Run Google Rich Results Test for Schema.org Dentist/Physician + FAQPage validation
- [x] T071 Validate responsive rendering on viewports 320px, 375px, 768px, 1024px, 1920px (no horizontal scroll, readable text, functional nav)

**Checkpoint**: All quality gates pass. Site is production-ready.

---

## Dependencies & Execution Order

```
Phase 1 (Setup) → Phase 2 (Foundational) → Phases 3-9 (User Stories)
                                          → Phase 10 (Polish)

Phase 3 (US3: Config-Driven) ──┐
Phase 4 (US1: SEO)             │── Can begin after Phase 2
Phase 5 (US2: Appointment)     │   (some parallelism within phases)
                               │
Phase 6 (US4: Mobile) ─────────┤── Can begin after Phase 3
Phase 7 (US5: Reusability) ────┤   (needs rendered content to style/deploy)
Phase 8 (US6: WhatsApp) ───────┤
Phase 9 (Feedback) ────────────┘

Phase 10 (Polish) → After all other phases complete
```

### Parallel Execution Opportunities

**Within Phase 1**: T002, T003, T004, T005, T006 are all independent files
**Within Phase 3**: T014, T015, T016, T017, T018, T019 render independent homepage sections
**Within Phase 4**: T027, T028, T029, T032, T033 inject independent metadata types
**Within Phase 5**: T034-T040 are sequential (form → validation → payment → confirmation)
**Within Phase 6**: T042, T043, T046 style independent components
**Within Phase 7**: T049, T050, T051, T052 produce independent output files
**Within Phase 9**: T063 is independent of the main submission flow (T058-T062)

## Implementation Strategy

**MVP Scope (Recommended)**: Phases 1 + 2 + 3 + 4 + 5 = Setup + Foundation + US3 + US1 + US2

This delivers a fully functional, SEO-optimized, config-driven website with appointment booking — the three P1 user stories that represent core business value.

**Incremental Delivery Order**:
1. MVP (Phases 1-5): Config-driven multi-page site + SEO + Appointment booking
2. Mobile Polish (Phase 6): Responsive CSS + performance optimization
3. Deployment (Phase 7): Clone-and-deploy workflow + Nginx + documentation
4. WhatsApp (Phase 8): Floating button + GA4 tracking
5. Feedback (Phase 9): Patient feedback form + admin dashboard integration
6. Final Polish (Phase 10): Accessibility, edge cases, Lighthouse validation
