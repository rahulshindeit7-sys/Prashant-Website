# Tasks: Doctor Website Template - Hybrid Multi-Page Implementation

**Input**: Design documents from `specs/001-doctor-website-template/`

**Prerequisites**: plan.md ✅, spec.md ✅ (with WhatsApp clarifications), research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅, constitution.md ✅

**Tests**: Not included in this scope (business decision: validation through quickstart.md manual scenarios and Lighthouse audits instead of automated test suite)

**Organization**: Tasks organized by user story (US1–US6) to enable independent implementation and testing. All foundational multi-page infrastructure is prerequisite and blocks user story work.

## Phase 1: Setup (Project Initialization)

**Purpose**: Prepare repository files for hybrid multi-page implementation while preserving the current homepage.

- [X] T001 Confirm feature docs and route contracts are current in specs/001-doctor-website-template/plan.md
- [X] T002 [P] Add/refresh multi-page config placeholders in config/doctor-profile.json
- [X] T003 [P] Document new page keys and expertise slug rules in CONFIG-GUIDE.md
- [X] T004 [P] Document hybrid navigation and page list in README.md
- [X] T005 Create base page shells for profile/expertise/detail/contact in profile.html

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared runtime and routing foundations required by all user stories.

**CRITICAL**: No user story work should begin before this phase is complete.

- [X] T006 Create route helper utilities for static page + slug parsing in assets/js/routes.js
- [X] T007 Implement shared config loader/error state for all pages in assets/js/app.js
- [X] T008 Implement shared safe-render helper for config-derived content in assets/js/app.js
- [X] T009 [P] Add shared page layout primitives for new route pages in assets/css/style.css
- [X] T010 [P] Add shared header/footer partial render hooks for route pages in assets/js/app.js
- [X] T011 Implement exclusion guard for Knowledgebase and Research/Publications links in assets/js/app.js
- [X] T012 [P] Add per-page SEO metadata setter utility (title/description/canonical) in assets/js/app.js
- [X] T013 Implement page bootstrap dispatcher by page type and slug in assets/js/app.js

**Checkpoint**: Foundation is complete; user stories can be implemented independently.

---

## Phase 3: User Story 1 - Patient Finds Doctor via Google Search (Priority: P1) 🎯 MVP

**Goal**: Deliver robust SEO and structured data across homepage and new route pages.

**Independent Test**: Run Lighthouse SEO (>=95) on home and one route page, validate JSON-LD and per-page metadata in Rich Results and social previews.

### Implementation for User Story 1

- [X] T014 [US1] Preserve homepage SEO/meta behavior while migrating to shared metadata utility in assets/js/app.js
- [X] T015 [P] [US1] Add profile page metadata mapping from seo.pages.profile in assets/js/app.js
- [X] T016 [P] [US1] Add expertise listing page metadata mapping from seo.pages.expertise in assets/js/app.js
- [X] T017 [P] [US1] Add contact page metadata mapping from seo.pages.contact in assets/js/app.js
- [X] T018 [US1] Implement expertise detail metadata templating by slug in assets/js/app.js
- [X] T019 [US1] Keep LocalBusiness/Physician JSON-LD generation valid after route expansion in assets/js/app.js
- [X] T020 [US1] Keep FAQPage JSON-LD conditional generation for homepage FAQ in assets/js/app.js
- [X] T021 [US1] Ensure canonical URLs differ correctly per route in assets/js/app.js
- [X] T022 [P] [US1] Verify route pages use semantic heading structure in profile.html
- [X] T023 [P] [US1] Verify expertise pages use semantic heading structure in expertise.html

**Checkpoint**: SEO and schema are route-aware and independently verifiable.

---

## Phase 4: User Story 2 - Patient Books Appointment Online (Priority: P1)

**Goal**: Keep appointment conversion flow stable while integrating hybrid navigation.

**Independent Test**: Complete booking from homepage CTA with valid data, verify Razorpay path and WhatsApp fallback path still work end-to-end.

### Implementation for User Story 2

- [X] T024 [US2] Preserve homepage appointment form markup and IDs during multi-page refactor in index.html
- [X] T025 [US2] Rebind appointment form initialization under new bootstrap dispatcher in assets/js/app.js
- [X] T026 [US2] Keep service dropdown population synced from config on homepage in assets/js/app.js
- [X] T027 [US2] Keep field validation, future-date checks, and inline errors for booking flow in assets/js/app.js
- [X] T028 [US2] Keep Razorpay initialization and success handler behavior in assets/js/app.js
- [X] T029 [US2] Keep WhatsApp fallback flow for missing/invalid Razorpay key in assets/js/app.js
- [X] T030 [US2] Keep confirmation modal rendering and receipt display in assets/js/app.js
- [X] T031 [P] [US2] Keep appointment_submit event tracking compatibility in assets/js/app.js

**Checkpoint**: Appointment conversion remains functional after architecture change.

---

## Phase 5: User Story 3 - Doctor/Staff Updates Website Content (Priority: P1)

**Goal**: Ensure all new pages remain fully config-driven with no content hardcoding.

**Independent Test**: Edit config values for profile, expertise, and contact; refresh pages and verify updates without touching HTML/CSS/JS.

### Implementation for User Story 3

- [X] T032 [US3] Add/normalize config schema handling for pages.* and seo.pages.* in assets/js/app.js
- [X] T033 [US3] Render Profile page doctor details from config in profile.html
- [X] T034 [US3] Render Expertise listing cards from expertise[] config in expertise.html
- [X] T035 [US3] Render expertise detail content_blocks via slug in expertise-detail.html
- [X] T036 [US3] Render Contact page data (address/phone/email/timings/map) from config in contact.html
- [X] T037 [US3] Render shared nav links with hybrid home anchors + route links from config in assets/js/app.js
- [X] T038 [US3] Render shared footer links while omitting excluded sections in assets/js/app.js
- [X] T039 [US3] Add graceful hide/fallback handling for optional route-page config fields in assets/js/app.js
- [X] T040 [P] [US3] Add sample expertise entries and page metadata examples in config/doctor-profile.json

**Checkpoint**: Config-only updates drive homepage and all new pages.

---

## Phase 6: User Story 4 - Patient Browses on Mobile Phone (Priority: P2)

**Goal**: Preserve mobile quality while adding route pages and detail templates.

**Independent Test**: Validate home + profile + expertise + contact on 375px viewport with no overflow, usable nav, and stable performance.

### Implementation for User Story 4

- [X] T041 [US4] Add mobile layout rules for Profile page sections in assets/css/style.css
- [X] T042 [P] [US4] Add mobile layout rules for Expertise listing and detail pages in assets/css/style.css
- [X] T043 [P] [US4] Add mobile layout rules for Contact page sections in assets/css/style.css
- [X] T044 [US4] Ensure hybrid nav works on mobile (anchor and route links) in assets/js/app.js
- [X] T045 [US4] Ensure floating WhatsApp visibility and touch target across all pages in assets/css/style.css
- [X] T046 [US4] Ensure lazy-loading strategy is correct for new page images in profile.html
- [X] T047 [P] [US4] Ensure lazy-loading strategy is correct for expertise/contact images in expertise.html
- [X] T048 [US4] Add route-page focus and keyboard accessibility states in assets/css/style.css

**Checkpoint**: Mobile experience remains smooth and accessible across routes.

---

## Phase 7: User Story 5 - New Doctor Clones Template for Their Practice (Priority: P2)

**Goal**: Keep clone-customize-deploy workflow simple with new page schema and routes.

**Independent Test**: Replace config for a second doctor, deploy, and verify route pages + homepage all reflect new identity without code edits.

### Implementation for User Story 5

- [X] T049 [US5] Update clone workflow docs for multi-page config keys in README.md
- [X] T050 [P] [US5] Update config field guide for expertise slug and seo.pages templates in CONFIG-GUIDE.md
- [X] T051 [US5] Ensure deploy script includes new HTML route pages in sync set within deploy.sh
- [X] T052 [US5] Keep site_id-based release structure and rollback behavior with expanded pages in deploy.sh
- [X] T053 [US5] Keep nginx static serving and SEO-friendly route handling for new pages in nginx.conf
- [X] T054 [US5] Re-verify read-only config endpoint and dashboard-only CORS policy in nginx.conf
- [X] T055 [US5] Update quickstart clone/deploy scenario for multi-page verification in specs/001-doctor-website-template/quickstart.md

**Checkpoint**: Reusability and deployment remain predictable with expanded architecture.

---

## Phase 8: User Story 6 - Patient Contacts via WhatsApp (Priority: P3)

**Goal**: Maintain instant WhatsApp contact behavior consistently across all route pages.

**Independent Test**: Trigger WhatsApp from floating button and contextual CTAs on multiple pages; verify correct wa.me link and message.

### Implementation for User Story 6

- [X] T056 [US6] Keep global WhatsApp link generator and sanitizer shared across pages in assets/js/app.js
- [X] T057 [US6] Add/verify contextual WhatsApp CTA binding on new route pages in assets/js/app.js
- [X] T058 [US6] Keep floating WhatsApp button rendered on all pages in assets/js/app.js
- [X] T059 [P] [US6] Keep whatsapp_click and phone_call_click event tracking for route pages in assets/js/app.js
- [X] T060 [US6] Ensure fallback greeting uses doctor identity from config consistently in assets/js/app.js

**Checkpoint**: WhatsApp-first contact remains reliable on home and new pages.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final hardening and acceptance validation across stories.

- [X] T061 [P] Run full quickstart validation for homepage + all new routes in specs/001-doctor-website-template/quickstart.md
- [X] T062 [P] Run Lighthouse SEO/Performance checks and resolve route regressions in specs/001-doctor-website-template/quickstart.md
- [X] T063 Validate excluded sections are absent from nav/routes/content in assets/js/app.js
- [X] T064 Validate schema, canonical, and social tags across pages in assets/js/app.js
- [X] T065 Validate config-driven rendering safety on new page paths in assets/js/app.js
- [X] T066 Final consistency pass on docs/contracts and implementation notes in specs/001-doctor-website-template/plan.md

---

## Phase 10: Refinement & Feature Updates (2026-07-03)

**Purpose**: Implement refinements based on user feedback - simplify appointment form and curate homepage expertise display.

**User Stories**:
- US-APPT: Simplify appointment booking form by removing optional time preference field
- US-EXPERTISE: Curate homepage expertise to show only distinctive specializations, avoid redundancy

### Phase 10a: Appointment Form Simplification

- [X] T067 Remove "Preferred Time" field and its select dropdown from appointment form in index.html
- [X] T068 Remove apt-time validation logic from form initialization in assets/js/app.js
- [X] T069 Update appointment form submission to exclude time field from payload in assets/js/app.js
- [X] T070 Test appointment form without time field on homepage in browser
- [X] T071 Test form submission still works with remaining fields (Name, Phone, Date, Service)
- [X] T072 Verify no console errors or validation issues after time field removal

### Phase 10b: Homepage Expertise Curation

- [X] T073 Add expertise_items_homepage array to config/doctor-profile.json with 4 curated items in config/doctor-profile.json
- [X] T074 Update initExpertise() in assets/js/app.js to use expertise_items_homepage on homepage
- [X] T075 Test homepage expertise section displays only 4 curated items (Oral Cancer, Thyroid, Parotid, Skull Base)
- [X] T076 Test expertise.html still lists all 17 expertise items (no regression)
- [X] T077 Verify all 4 curated homepage items have working detail pages
- [X] T078 Run Lighthouse Performance on homepage after expertise section changes
- [X] T079 Run Lighthouse SEO on homepage to ensure no ranking dilution
- [X] T080 Validate expertise card rendering (title, description, link) for all 4 items
- [X] T081 Cross-verify homepage expertise items are subset of expertise_items array

### Phase 10c: Integration Testing & Validation

- [X] T091 Remove WhatsApp button from expertise listing page (expertise.html) in assets/js/app.js
- [X] T092 Fix broken expertise image display by hiding .expertise-hero-wrap when no hero_image data exists in assets/js/app.js
- [ ] T082 Test appointment form on all pages (homepage only, should have form)
- [ ] T083 Test expertise section rendering consistency across fast/slow networks
- [ ] T084 Test responsive design on mobile for new homepage expertise layout
- [ ] T085 Test accessibility - ARIA labels and semantic HTML for new form layout
- [ ] T086 Update CONFIG-GUIDE.md with expertise_items_homepage documentation
- [ ] T087 Update README.md to mention homepage expertise curation approach
- [ ] T088 Final visual regression check - take screenshots of homepage before/after changes
- [ ] T089 Verify no console warnings or errors on any page after changes
- [ ] T090 Create summary of Phase 10 changes in plan.md revision notes

---

## Phase 10 Implementation Status

**Phase 10a - Appointment Form Simplification**: ✅ COMPLETE (T067-T072)
- Removed "Preferred Time" field from form markup in index.html
- Form now flows: Name → Phone → Date → Service (no time field)
- Verified no console errors

**Phase 10b - Homepage Expertise Curation**: ✅ COMPLETE (T073-T081)
- ✅ Added `expertise_items_homepage` with 4 curated items to config
- ✅ Updated app.js initExpertise() logic to use homepage array
- ✅ Verified homepage displays exactly 4 curated items (Oral Cancer, Thyroid, Parotid, Skull Base)
- ✅ Verified expertise.html still shows all 17 items (no regression)
- ✅ Verified all 4 items have working detail pages
- ✅ Implementation complete on production server (port 8081)

**Phase 10c - UI Polish & Bug Fixes**: ✅ COMPLETE (T091-T092)
- ✅ T091: Removed WhatsApp button from expertise listing page (expertise.html) - users still have CTA on detail pages
- ✅ T092: Fixed broken expertise image display when no hero_image data - hides empty image section with display:none
- Implementation complete and verified on production server

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all user stories.
- **Phase 3-8 (User Stories)**: Depend on Phase 2 completion.
- **Phase 9 (Polish)**: Depends on all selected user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Starts after Foundational; no dependency on other stories.
- **US2 (P1)**: Starts after Foundational; no dependency on other stories.
- **US3 (P1)**: Starts after Foundational; no dependency on other stories.
- **US4 (P2)**: Starts after Foundational; best validated after US3 route rendering.
- **US5 (P2)**: Starts after Foundational; best validated after US3 config updates.
- **US6 (P3)**: Starts after Foundational; independent but validated against route pages.

### Dependency Graph

- Setup -> Foundational -> US1 -> Polish
- Setup -> Foundational -> US2 -> Polish
- Setup -> Foundational -> US3 -> Polish
- Setup -> Foundational -> US4 -> Polish
- Setup -> Foundational -> US5 -> Polish
- Setup -> Foundational -> US6 -> Polish

---

## Parallel Opportunities

- Setup: T002, T003, and T004 can run in parallel.
- Foundational: T009, T010, and T012 can run in parallel.
- US1: T015, T016, and T017 can run in parallel after T014.
- US2: T031 can run in parallel with T028-T030.
- US3: T034 and T036 can run in parallel after T032.
- US4: T042 and T043 can run in parallel.
- US5: T050 and T055 can run in parallel.
- US6: T059 can run in parallel with T057-T058.
- Polish: T061 and T062 can run in parallel.

### Parallel Example: User Story 1

- Task: T015 [US1] Add profile page metadata mapping in assets/js/app.js
- Task: T016 [US1] Add expertise listing metadata mapping in assets/js/app.js
- Task: T017 [US1] Add contact page metadata mapping in assets/js/app.js

### Parallel Example: User Story 3

- Task: T034 [US3] Render Expertise listing cards in expertise.html
- Task: T036 [US3] Render Contact page data in contact.html
- Task: T040 [US3] Add sample expertise and metadata examples in config/doctor-profile.json

### Parallel Example: User Story 5

- Task: T050 [US5] Update config field guide in CONFIG-GUIDE.md
- Task: T055 [US5] Update quickstart deploy scenario in specs/001-doctor-website-template/quickstart.md

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational).
3. Complete Phase 3 (US1).
4. Validate SEO + schema independently.
5. Demo/deploy MVP if ready.

### Incremental Delivery

1. Finish Setup + Foundational.
2. Deliver US1 (SEO visibility).
3. Deliver US2 (booking conversion).
4. Deliver US3 (config-first multi-page rendering).
5. Deliver US4 (mobile quality), US5 (clone/deploy), then US6 (WhatsApp consistency).
6. Execute final Polish phase.

### Parallel Team Strategy

1. Team completes Phase 1 and Phase 2 together.
2. Split P1 stories after foundation:
   - Engineer A: US1
   - Engineer B: US2
   - Engineer C: US3
3. Run US4/US5/US6 in parallel once core rendering is stable.
4. Converge for Phase 9 validation and release readiness.

---

## Notes

- `[P]` tasks indicate independent files or non-blocking parallel work.
- `[USx]` labels map tasks to user stories for traceability.
- Each user story includes an explicit independent test criterion.
- Every task contains a concrete file path and is immediately executable.
