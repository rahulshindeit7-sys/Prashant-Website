# Tasks: Doctor Website Template

**Input**: Design documents from /specs/001-doctor-website-template/

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are optional for this feature and were not explicitly requested in the specification, so implementation tasks are prioritized.

**Organization**: Tasks are grouped by user story to enable independent implementation and validation.

## Phase 1: Setup (Project Initialization)

**Purpose**: Align baseline project files and documentation with the current feature contract.

- [x] T001 Normalize feature metadata and npm scripts in package.json
- [x] T002 [P] Align sample site configuration fields with contract keys in config/doctor-profile.json
- [x] T003 [P] Document non-technical config editing workflow in CONFIG-GUIDE.md
- [x] T004 [P] Update developer setup and deployment overview in README.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared runtime, structure, and security foundations required by all user stories.

**CRITICAL**: No user story work should begin before this phase is complete.

- [x] T005 Build and verify semantic section anchors and landmarks in index.html
- [x] T006 [P] Define global design tokens, typography, and spacing variables in assets/css/style.css
- [x] T007 [P] Establish responsive layout primitives for 480/768/1024 breakpoints in assets/css/style.css
- [x] T008 Implement config loading lifecycle with friendly error-state rendering in assets/js/app.js
- [x] T009 Implement XSS-safe rendering helpers for all config-derived content in assets/js/app.js
- [x] T010 Implement application bootstrap orchestration and section init ordering in assets/js/app.js
- [x] T011 [P] Add Google Fonts preconnect and stylesheet loading in index.html
- [x] T012 Implement shared analytics event helper with no-op fallback when GA is absent in assets/js/app.js

**Checkpoint**: Foundation is complete; user stories can be implemented independently.

---

## Phase 3: User Story 1 - Patient Finds Doctor via Google Search (Priority: P1) 🎯 MVP

**Goal**: Deliver complete SEO metadata and structured data for local ranking and rich results.

**Independent Test**: Run Lighthouse SEO audit (>=95), validate JSON-LD in Rich Results Test, and verify OG/Twitter metadata previews.

### Implementation for User Story 1

- [x] T013 [US1] Inject title, meta description, canonical, and robots tags from config in assets/js/app.js
- [x] T014 [P] [US1] Inject Open Graph metadata (title, description, image, url, type) in assets/js/app.js
- [x] T015 [P] [US1] Inject Twitter Card metadata (card, title, description, image) in assets/js/app.js
- [x] T016 [US1] Merge seo.keywords and seo.local_keywords into meta keywords output in assets/js/app.js
- [x] T017 [US1] Generate LocalBusiness/Doctor JSON-LD with site_id, geo, and areaServed in assets/js/app.js
- [x] T018 [US1] Generate FAQPage JSON-LD with graceful skip for empty FAQs in assets/js/app.js
- [x] T019 [US1] Render testimonials-based aggregate rating signals in schema generation in assets/js/app.js
- [x] T020 [P] [US1] Enforce single-h1 and semantic heading hierarchy in index.html
- [x] T021 [P] [US1] Ensure descriptive image alt text and SEO-safe media attributes in index.html
- [x] T022 [US1] Conditionally load GA4 script from seo.google_analytics_id in assets/js/app.js

**Checkpoint**: Search and social metadata are complete and independently verifiable.

---

## Phase 4: User Story 2 - Patient Books Appointment Online (Priority: P1)

**Goal**: Provide a complete booking flow with validation, payment, fallback, and confirmation.

**Independent Test**: Submit valid booking, confirm Razorpay checkout uses configured fee, and verify WhatsApp + confirmation modal on success.

### Implementation for User Story 2

- [x] T023 [US2] Build appointment form state styles and inline validation UI in assets/css/style.css
- [x] T024 [US2] Populate dynamic service options and enforce future date constraints in assets/js/app.js
- [x] T025 [US2] Implement field validation for name, phone, date, time, and service in assets/js/app.js
- [x] T026 [US2] Integrate Razorpay checkout options from payment config in assets/js/app.js
- [x] T027 [US2] Implement appointment WhatsApp payload formatter in assets/js/app.js
- [x] T028 [US2] Implement payment success path (receipt capture, WhatsApp open, modal data) in assets/js/app.js
- [x] T029 [US2] Implement missing/invalid Razorpay fallback to WhatsApp-only flow in assets/js/app.js
- [x] T030 [US2] Implement payment failure/retry messaging and cancellation handling in assets/js/app.js
- [x] T031 [P] [US2] Implement confirmation modal structure and interaction styling in index.html
- [x] T032 [P] [US2] Wire analytics event emission for appointment_submit on valid submission in assets/js/app.js

**Checkpoint**: Appointment conversion works end-to-end with graceful degradation.

---

## Phase 5: User Story 3 - Doctor/Staff Updates Website Content (Priority: P1)

**Goal**: Guarantee config-only updates for all site content without code edits.

**Independent Test**: Edit config values (name, services, timings, testimonials), refresh, and verify updates across all rendered sections.

### Implementation for User Story 3

- [x] T033 [US3] Render navbar branding, contact CTA, and section links from config in assets/js/app.js
- [x] T034 [US3] Render hero doctor identity, badges, and CTA targets from config in assets/js/app.js
- [x] T035 [US3] Render about section biography, credentials, awards, and languages in assets/js/app.js
- [x] T036 [US3] Render services grid and synchronize services with booking dropdown in assets/js/app.js
- [x] T037 [US3] Render trust counters/why-choose-us values from config and derived fields in assets/js/app.js
- [x] T038 [US3] Render testimonials cards with star rating and review CTA in assets/js/app.js
- [x] T039 [US3] Render accessible FAQ accordion behavior and content mapping in assets/js/app.js
- [x] T040 [US3] Render contact section (address, timings, map, tel, mail) from config in assets/js/app.js
- [x] T041 [US3] Render footer branding, nav shortcuts, and social links from config in assets/js/app.js
- [x] T042 [US3] Implement graceful hiding rules for optional content blocks in assets/js/app.js

**Checkpoint**: Config-first editing promise is fully satisfied.

---

## Phase 6: User Story 4 - Patient Browses on Mobile Phone (Priority: P2)

**Goal**: Deliver mobile-first usability and performance across all key patient journeys.

**Independent Test**: Validate 375px viewport behavior, no horizontal scrolling, touch-friendly controls, and Lighthouse mobile performance target.

### Implementation for User Story 4

- [x] T043 [US4] Implement mobile navigation menu behavior and close-on-select flow in assets/js/app.js
- [x] T044 [US4] Implement responsive navigation, header, and CTA stack rules in assets/css/style.css
- [x] T045 [P] [US4] Implement responsive layout rules for services, testimonials, FAQ, and contact blocks in assets/css/style.css
- [x] T046 [US4] Implement mobile-optimized appointment form spacing and input sizing in assets/css/style.css
- [x] T047 [US4] Ensure floating WhatsApp placement and minimum touch target size on mobile in assets/css/style.css
- [x] T048 [US4] Apply lazy-loading attributes for all non-hero images in index.html
- [x] T049 [US4] Add keyboard focus visibility and reduced-motion support styles in assets/css/style.css
- [x] T050 [US4] Defer non-critical scripts and optimize above-the-fold markup loading in index.html

**Checkpoint**: Mobile users can browse and convert without usability regressions.

---

## Phase 7: User Story 5 - New Doctor Clones Template for Their Practice (Priority: P2)

**Goal**: Make cloning, rebranding, and deployment repeatable for each doctor instance.

**Independent Test**: Replace config and images for a second doctor, deploy to VPS, and verify site identity, SEO, and integrations update correctly.

### Implementation for User Story 5

- [x] T051 [US5] Document clone-customize-deploy workflow for new doctors in README.md
- [x] T052 [P] [US5] Expand config field guide examples including site_id/geo/area_served/local_keywords in CONFIG-GUIDE.md
- [x] T053 [US5] Implement deploy preflight checks (config validity, ssh connectivity, target path readiness) in deploy.sh
- [x] T054 [US5] Implement v1 multi-site path convention handling using /var/www/doctor-sites/<site_id>/ in deploy.sh
- [x] T055 [US5] Implement versioned release directory and atomic current symlink switch in deploy.sh
- [x] T056 [US5] Implement failed deploy automatic rollback to previous symlink target in deploy.sh
- [x] T057 [US5] Document shared SSH key operational requirement and key rotation checklist in README.md
- [x] T058 [US5] Configure Nginx production headers, TLS redirects, cache, and gzip policies in nginx.conf
- [x] T059 [US5] Enforce read-only /config/doctor-profile.json methods and dashboard-only CORS in nginx.conf
- [x] T060 [P] [US5] Add quickstart validation scenario for second-doctor replacement and deploy verification in specs/001-doctor-website-template/quickstart.md

**Checkpoint**: Reuse and deployment flow is operationally repeatable for multi-site v1 hosting.

---

## Phase 8: User Story 6 - Patient Contacts via WhatsApp (Priority: P3)

**Goal**: Provide immediate low-friction contact via WhatsApp from persistent and contextual CTAs.

**Independent Test**: Click floating and contextual WhatsApp CTAs, verify wa.me URL, recipient number, and prefilled message correctness.

### Implementation for User Story 6

- [x] T061 [US6] Implement normalized wa.me link generation for clinic.whatsapp in assets/js/app.js
- [x] T062 [US6] Implement floating WhatsApp CTA initialization and message template in assets/js/app.js
- [x] T063 [P] [US6] Implement floating WhatsApp button markup/accessibility attributes in index.html
- [x] T064 [US6] Implement WhatsApp button visual states and pulse animation in assets/css/style.css
- [x] T065 [US6] Align hero and navbar WhatsApp CTA behavior with floating CTA logic in assets/js/app.js
- [x] T066 [US6] Track whatsapp_click and phone_call_click events with GA helper in assets/js/app.js

**Checkpoint**: WhatsApp-first patient outreach works consistently across device types.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening across performance, accessibility, security, and release readiness.

- [x] T067 [P] Audit all config-driven render paths for unsafe HTML insertion in assets/js/app.js
- [x] T068 [P] Validate final semantic/accessibility pass (landmarks, labels, keyboard flows) in index.html
- [x] T069 Validate Lighthouse targets and close remaining performance/SEO issues in index.html
- [x] T070 Validate quickstart scenarios end-to-end and update edge-case notes in specs/001-doctor-website-template/quickstart.md
- [x] T071 Validate static asset budget and optimize oversized images under assets/images/
- [x] T072 Final release-readiness pass for config, deploy, and server config in config/doctor-profile.json

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user stories.
- **Phase 3-8 (User Stories)**: Depend on Phase 2 completion.
- **Phase 9 (Polish)**: Depends on all selected user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Starts after Foundational; independent of other stories.
- **US2 (P1)**: Starts after Foundational; independent of other stories.
- **US3 (P1)**: Starts after Foundational; independent of other stories.
- **US4 (P2)**: Starts after Foundational; best validated once US3 content rendering is available.
- **US5 (P2)**: Starts after Foundational; operationally strengthened by completed P1 stories.
- **US6 (P3)**: Starts after Foundational; independent of other stories.

### Dependency Graph

- Setup -> Foundational -> US1 -> Polish
- Setup -> Foundational -> US2 -> Polish
- Setup -> Foundational -> US3 -> Polish
- Setup -> Foundational -> US4 -> Polish
- Setup -> Foundational -> US5 -> Polish
- Setup -> Foundational -> US6 -> Polish

---

## Parallel Opportunities

- Setup: T002, T003, T004 can run in parallel.
- Foundational: T006, T007, T011 can run in parallel.
- US1: T014, T015, T020, T021 can run in parallel after T013.
- US2: T031 and T032 can run in parallel with T026-T030.
- US3: T038 and T039 can run in parallel after T036.
- US4: T045 can run in parallel with T044 and T046.
- US5: T052 and T060 can run in parallel with deploy script tasks.
- US6: T063 and T064 can run in parallel with T061-T062.
- Polish: T067 and T068 can run in parallel before T069-T072.

### Parallel Example: User Story 1

- Task: T014 [US1] Inject Open Graph metadata in assets/js/app.js
- Task: T015 [US1] Inject Twitter Card metadata in assets/js/app.js
- Task: T020 [US1] Enforce heading hierarchy in index.html
- Task: T021 [US1] Ensure descriptive image alt text in index.html

### Parallel Example: User Story 5

- Task: T052 [US5] Expand config guide examples in CONFIG-GUIDE.md
- Task: T060 [US5] Add deploy validation scenario in specs/001-doctor-website-template/quickstart.md

---

## Implementation Strategy

### MVP First (User Stories 1-3)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational).
3. Complete Phase 3 (US1: SEO visibility).
4. Complete Phase 4 (US2: appointment conversion).
5. Complete Phase 5 (US3: config-first maintainability).
6. Validate independently before expanding scope.

### Incremental Delivery

1. Deliver US4 for mobile quality.
2. Deliver US5 for clone/deploy repeatability.
3. Deliver US6 for low-friction contact.
4. Complete Polish phase and release.

### Parallel Team Strategy

1. Team completes Setup + Foundational together.
2. Split by stories after Phase 2:
   - Engineer A: US1
   - Engineer B: US2
   - Engineer C: US3
3. Run US4, US5, and US6 in parallel streams.
4. Converge for Phase 9 validation and release hardening.

---

## Notes

- [P] tasks indicate independent files or non-blocking work.
- [USx] labels map every story task to its source user story.
- Every user story phase includes an independent test criterion.
- All tasks include concrete file paths and are immediately executable.
