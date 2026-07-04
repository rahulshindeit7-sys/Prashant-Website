# Tasks: Doctor CMS — Content Management for Single-Site

**Input**: Design documents from `/specs/003-doctor-cms/` (spec.md, plan.md, research.md, data-model.md, contracts/api.md, quickstart.md)

**Feature Branch**: `V3` | **Date**: 2026-07-03

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Tests are executed as part of each story's validation.

---

## Dependency Graph & Parallel Execution

```
Phase 1: Setup (sequential, blocking)
  ↓
Phase 2: Foundational (sequential, blocking all user stories)
  ├─► US1 (Login) — implement in parallel with other stories
  ├─► US2 (Edit & Draft) — depends on Phase 2, can run in parallel with US1/US3
  ├─► US3 (Preview) — depends on Phase 2 + US2, can run in parallel with US4
  ├─► US4 (Publish) — depends on Phase 2 + US2, can run in parallel with US3
  ├─► US5 (Uploads) — depends on Phase 2, can run in parallel with US1-US4
  ├─► US6 (Testimonials) — depends on Phase 2 + US2, can run in parallel with US1-US5
  └─► US7 (Rollback) — depends on Phase 2 + US4, can run last
```

**MVP Scope**: Complete Phase 1 + Phase 2 + US1–US4. US5 (uploads) and US6 (testimonials) can follow in phase 2 of deployment.

---

## Phase 1: Setup & Project Initialization

**Purpose**: Create directory structure, initialize Node.js project, configure dependencies, prepare environment templates.

**Duration**: ~30 min

- [x] T001 Create cms/ directory structure with subdirectories: routes/, services/, public/js/, public/css/, sessions/ — at `cms/`
- [x] T002 Create `cms/package.json` with Express 4.18.2 + runtime deps: express-session, session-file-store, multer, bcryptjs, uuid, express-rate-limit, dotenv
- [x] T003 Create `cms/.env.example` template with all env vars (ADMIN_USERNAME, ADMIN_PASSWORD_HASH, SESSION_SECRET, PORT, NODE_ENV) — NO real values
- [x] T004 Create `cms/.gitignore` excluding: `node_modules/`, `.env`, `sessions/`, `*.log`
- [x] T005 Create `backups/` and `uploads/` directories at project root with `.gitkeep` placeholders
- [x] T006 Create `cms/README.md` with installation instructions, env var setup, quickstart commands

**Checkpoint**: Directory structure ready, dependencies listed, templates prepared for implementation phase.

---

## Phase 2: Foundational Infrastructure (Blocking Prerequisites)

**Purpose**: Core backend structure, session management, auth middleware, file I/O utilities. NO user story work can begin until this phase is complete.

**Duration**: ~2 hours

### Backend Structure & Server Setup

- [x] T007 Create `cms/server.js` — Express app with middleware stack: JSON parsing, CORS, session middleware, static files, error handler, SPA fallback; listen on port 5050
- [x] T008 [P] Create `cms/middleware/auth.js` — `requireAuth()` middleware that validates `req.session.authenticated` and returns 401 if missing; used by all API routes
- [x] T009 [P] Create `cms/services/config.js` — Export functions: `readLiveConfig()` (reads `config/doctor-profile.json`), `readDraft()` (reads `backups/content.draft.json`), `writeDraft(config)` (writes draft file atomically)

### Session & Authentication Strategy

- [x] T010 [P] Create session configuration in `cms/server.js`: express-session + session-file-store, HTTP-only cookie, 8-hour max age, secure: true, sameSite: 'strict'
- [x] T011 [P] Create `cms/services/rate-limiter.js` — Express-rate-limit middleware for login route: 5 failed attempts per 15 minutes per IP, returns 429 on limit hit

### File Write Safety

- [x] T012 [P] Create atomic write utility in `cms/services/config.js` — `writeAtomically(filePath, content)` function that writes to a temp file first, then renames to target (prevents partial writes on crash)

**Checkpoint**: Express app running on port 5050, session management configured, auth middleware ready, file I/O utilities secure. All user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 — Doctor Logs In to Admin Panel (Priority: P1)

**Goal**: Doctor can authenticate with username/password, receive a secure session, and access the admin dashboard.

**Independent Test Criteria**:
- Correct credentials → redirect to dashboard, session cookie set
- Wrong credentials → error message, login page remains
- 5 failed attempts → lockout for 15 minutes
- Expired session → redirect to login on any API call
- Logout → session destroyed, redirect to login

### Tests for User Story 1

- [ ] T013 [P] [US1] Create `cms/public/js/test-login.html` — Manual test page with form to verify login endpoint responses (200 success, 401 error, 429 rate limit)
- [ ] T014 [P] [US1] Validation scenario: Correct credentials → GET /api/content succeeds; Wrong credentials → 401 response; 5 failed login → 429 lockout
- [ ] T015 [P] [US1] Validation scenario: Session expires → any /api/ call returns 401; Logout → session destroyed

### Implementation for User Story 1

- [x] T016 Create `cms/routes/auth.js` — Export router with POST /api/login (rate-limited, validates username/password hash, creates session) and POST /api/logout (destroys session, clears cookie) — at `cms/routes/auth.js`
- [x] T017 Create `cms/public/login.html` — Simple HTML login form: username/password inputs, submit button, error message div, responsive layout (mobile-first 375px+) — at `cms/public/login.html`
- [x] T018 [P] [US1] Create `cms/public/js/api.js` — Fetch wrapper function for all API calls; on 401 response, redirect to `/admin/login` and show "Session expired" message — at `cms/public/js/api.js`
- [x] T019 [P] [US1] Create `cms/public/js/login.js` — Handle login form submission: fetch POST /api/login, show error on 401/429, redirect to dashboard on 200 — at `cms/public/js/login.js`
- [x] T020 [P] [US1] Create `cms/public/css/login.css` — Login page styles: centered form, error message styling, mobile responsive, dark/light theme optional — at `cms/public/css/login.css`

**Checkpoint**: Doctor can log in, sessions are secure, authentication middleware is protecting all /api/ routes.

---

## Phase 4: User Story 2 — Doctor Edits Content and Saves Draft (Priority: P1)

**Goal**: Doctor can edit any content field in the dashboard and save changes to a draft without affecting the live website.

**Independent Test Criteria**:
- Edit any field → Save Draft → draft file created, live config unchanged
- Save with empty required field → validation error, no save
- Session expires mid-edit → session expired error before save
- Multiple saves → draft file always contains latest edits

### Implementation for User Story 2

- [x] T021 Create `cms/routes/content.js` — Export router with GET /api/content (return live config) and PUT /api/content (validate, merge changes, write draft) — at `cms/routes/content.js`
- [x] T022 Create validation schema/function in `cms/services/config.js` — `validateConfigShape(config)` that checks required fields exist and are non-empty — at `cms/services/config.js`
- [x] T023 Create `cms/public/dashboard.html` — Main admin SPA with 9 tabs (Home, About/Profile, Treatments, Expertise, Testimonials, Gallery, Contact, SEO, Preview & Publish), Save Draft / Preview / Publish buttons, "Last saved" timestamp — at `cms/public/dashboard.html`
- [x] T024 [P] [US2] Create `cms/public/js/dashboard.js` — Tab routing, session check on load, nav highlight, load current config on dashboard open — at `cms/public/js/dashboard.js`
- [x] T025 [P] [US2] Create `cms/public/js/editor.js` — Form builder functions: `buildHomeTab()`, `buildAboutTab()`, `buildContactTab()`, `buildTreatmentsTab()`, `buildExpertiseTab()`, `buildTestimonialsTab()`, `buildGalleryTab()`, `buildSeoTab()`, each renders input fields based on config schema — at `cms/public/js/editor.js`
- [x] T026 [P] [US2] Create `cms/public/js/ui.js` — Toast notification function, "Last saved" timestamp display, confirm dialog for save/publish, error message display, validation error highlighting — at `cms/public/js/ui.js`
- [x] T027 [P] [US2] Create `cms/public/css/dashboard.css` — Dashboard layout (sidebar nav, main content area, form styles), tab panels, button styles, mobile responsive (375px+), input validation styling — at `cms/public/css/dashboard.css`

**Checkpoint**: Doctor can edit all content, draft saves are atomic and tracked, live config remains unchanged.

---

## Phase 5: User Story 3 — Doctor Previews Draft Changes (Priority: P1)

**Goal**: Doctor can preview how draft changes will look on the public website before publishing, with a visible "Preview Mode" banner.

**Independent Test Criteria**:
- Click Preview → opens page with ?preview=1, draft content loads
- Draft content visible in preview, live content in background
- "Preview Mode — Not Published" banner always visible
- No draft → shows live content + "No draft available" indicator
- Session expires → preview falls back to live content

### Implementation for User Story 3

- [x] T028 Create `cms/routes/preview.js` — Export router with GET /api/preview/config (requires auth, reads draft config from `backups/content.draft.json`, returns full config) — at `cms/routes/preview.js`
- [x] T029 [P] [US3] Modify `assets/js/app.js` — Add preview mode detection: parse ?preview=1 from URL, if present, fetch `/api/preview/config` (with credentials: 'include') instead of live config, inject "Preview Mode — Not Published" banner at top of page, handle 401 fallback to live config — at `assets/js/app.js`
- [x] T030 [P] [US3] Create preview banner UI in `assets/js/app.js` — Fixed-position top banner: gold/yellow background, clear text "Preview Mode — Not Published", 100% width, z-index: 10000 — at `assets/js/app.js`
- [x] T031 [P] [US3] In dashboard.js, add "Preview" button that opens current page URL with ?preview=1 (contact.html?preview=1, expertise.html?preview=1, etc.) — at `cms/public/js/dashboard.js`

**Checkpoint**: Doctor can preview draft content with a visual indicator, preview mode has graceful fallback to live if session expires.

---

## Phase 6: User Story 4 — Doctor Publishes Changes to Live Website (Priority: P1)

**Goal**: After reviewing the preview, doctor can publish the draft to become the live website with zero downtime, and every publish is backed up.

**Independent Test Criteria**:
- Click Publish → live config is updated, backup created with timestamp
- Public website immediately reflects published changes on next page load
- Publish fails → live config untouched, error shown to doctor
- Backup list always shows most recent publish

### Implementation for User Story 4

- [x] T032 Create `cms/services/backup.js` — Export functions: `createBackup()` (copies current `config/doctor-profile.json` to `backups/config.{ISO8601-timestamp}.json`), `listBackups()` (returns last 5 backups sorted by recency), `restoreBackup(timestamp)` (restores named backup to live config) — at `cms/services/backup.js`
- [x] T033 Create `cms/routes/publish.js` — Export router with POST /api/publish (requires auth, calls `createBackup()`, atomically writes draft to `config/doctor-profile.json`, returns 200), GET /api/backups (lists last 5), POST /api/rollback (requires auth + backup ID, calls `restoreBackup()`) — at `cms/routes/publish.js`
- [x] T034 [P] [US4] In `cms/public/js/dashboard.js`, add "Publish" button that shows confirm dialog, calls POST /api/publish, shows success toast, updates "Last saved" timestamp, resets draft indicator — at `cms/public/js/dashboard.js`
- [x] T035 [P] [US4] In `cms/public/js/ui.js`, add confirm dialog for publish action: "Are you sure? This will make all draft changes live immediately." — at `cms/public/js/ui.js`

**Checkpoint**: Doctor can safely publish changes with automatic backups created on every publish. Live website updates immediately with zero downtime.

---

## Phase 7: User Story 5 — Doctor Uploads and Uses Photos (Priority: P2)

**Goal**: Doctor can upload jpg/png/webp images through the admin panel, have them validated and stored safely, and reference them in content fields.

**Independent Test Criteria**:
- Upload jpg/png/webp under 5MB → file stored in uploads/, URL returned
- Upload svg/js/html/exe → rejected with error message
- Upload over 5MB → rejected with "file too large" error
- URL in content field → public website serves image correctly
- UUID prefix prevents filename collisions and path traversal

### Implementation for User Story 5

- [x] T036 Create `cms/services/upload.js` — Export functions: `validateAndStore(file)` (checks extension against whitelist, checks size < 5MB, sanitizes filename, prefixes UUID, stores in `uploads/`, returns URL), `sanitizeFilename(name)` (lowercase, replace spaces with hyphens, strip special chars) — at `cms/services/upload.js`
- [x] T037 [P] [US5] Create `cms/routes/uploads.js` — Export router with POST /api/upload (requires auth, calls `validateAndStore()`, returns `{ ok: true, url: '/uploads/...' }` or `{ ok: false, message: '...' }`) — at `cms/routes/uploads.js`
- [x] T038 [P] [US5] In Express server setup (server.js), add `express.static('uploads/')` to serve uploaded images at `/uploads/*` — at `cms/server.js`
- [x] T039 [P] [US5] In dashboard.js editor.js, add file upload inputs to Home, About, Gallery tabs; on file select, call POST /api/upload, insert returned URL into content field — at `cms/public/js/editor.js`
- [x] T040 [P] [US5] In ui.js, add upload progress indicator (optional for MVP) and error message for rejected uploads — at `cms/public/js/editor.js` and `cms/public/css/dashboard.css`

**Checkpoint**: Doctor can safely upload and reference images in content. All uploads are validated, sanitized, and served correctly from the public website.

---

## Phase 8: User Story 6 — Doctor Manages Testimonials (Priority: P2)

**Goal**: Doctor can add, edit, delete, reorder, and toggle testimonials through the admin panel.

**Independent Test Criteria**:
- Add testimonial with all required fields → appears in list
- Mark testimonial inactive → does not render on public site after publish
- Reorder via up/down → public site shows new order after publish
- Delete testimonial → removed from config after publish
- Empty required field → validation error blocks save

### Implementation for User Story 6

- [x] T041 [P] [US6] In `cms/public/js/editor.js`, add `buildTestimonialsTab()` function that renders: list of testimonials with edit/delete/up/down buttons, "Add New Testimonial" button, form fields for each testimonial (patient_name, treatment, rating, review_text, active toggle) — at `cms/public/js/editor.js`
- [x] T042 [P] [US6] In editor.js, implement testimonial CRUD handlers: add (append to array with new ID), edit (find by ID, update fields), delete (remove from array), reorder (swap adjacent items), toggle active (set active flag) — at `cms/public/js/editor.js`
- [x] T043 [P] [US6] In validation schema (services/config.js), ensure testimonials array items have required fields: patient_name, treatment, rating, review_text, active — at `cms/services/config.js`
- [x] T044 [P] [US6] In dashboard.css, add styles for testimonial list: card layout for each testimonial, button layout (edit, delete, up, down), mobile responsive — at `cms/public/css/dashboard.css`

**Checkpoint**: Doctor can fully manage testimonials. All testimonial changes are draft-to-publish workflow.

---

## Phase 9: User Story 7 — Doctor Rolls Back to Previous Version (Priority: P3)

**Goal**: Doctor can restore the website to any previous version from the last 5 backups.

**Independent Test Criteria**:
- Click Rollback → panel shows last 5 backups with timestamps and doctor name preview
- Select backup → confirm dialog, then restore to live config
- Live config updated, public site serves restored content immediately
- Backup list refreshes after rollback

### Implementation for User Story 7

- [x] T045 [P] [US7] In `cms/public/js/dashboard.js`, add Rollback tab with backup list UI: table showing timestamp, doctor name preview, restore button for each, confirm dialog before restore — at `cms/public/js/dashboard.js`
- [x] T046 [P] [US7] In dashboard.js, implement rollback handler: fetch GET /api/backups to populate list, on restore click, call POST /api/rollback with timestamp, show success toast, refresh backup list — at `cms/public/js/dashboard.js`
- [x] T047 [P] [US7] In ui.js, add confirm dialog for rollback: "Restore to [timestamp]? This will replace the live config with this backup." — at `cms/public/js/ui.js`
- [x] T048 [P] [US7] In dashboard.css, add styles for rollback backup table: responsive table, timestamp column, preview column, action buttons — at `cms/public/css/dashboard.css`

**Checkpoint**: Doctor has full version control with rollback capability. Rollback is safe (backed up before restore) and immediately live.

---

## Phase 10: Integration & Deployment

**Purpose**: Integrate CMS with existing infrastructure, configure Nginx proxying, validate end-to-end workflow, prepare for production.

**Duration**: ~1 hour

- [x] T049 Update `nginx.conf` — Add 3 new location blocks:
  ```
  location /admin/ { proxy_pass http://localhost:5050/admin/; ... }
  location /api/ { proxy_pass http://localhost:5050/api/; ... }
  location /uploads/ { proxy_pass http://localhost:5050/uploads/; ... }
  ```
  Handle WebSocket (if needed), set proxy headers (X-Real-IP, X-Forwarded-For) — at `nginx.conf`

- [x] T050 In `cms/server.js`, configure Express static for admin panel: `express.static('public', { index: 'dashboard.html', fallthrough: false })` for authenticated routes; unauthenticated requests should serve login.html — at `cms/server.js`

- [x] T051 Create deployment guide in `specs/003-doctor-cms/DEPLOYMENT.md` — Step-by-step: SSH to VPS, clone cms/, npm install, generate password hash, create .env, mkdir backups uploads sessions, test CMS on localhost:5050, update nginx.conf, reload nginx, validate /admin/ and /api/ proxying

- [x] T052 [P] Create startup script `cms/start-production.sh` — Set NODE_ENV=production, clear old session files, start Express with PM2 (or systemd service) to auto-restart on crash — at `cms/start-production.sh`

### Integration Testing (Manual Validation from quickstart.md)

- [x] T053 Validation scenario: Doctor flow — login → edit phone number → save draft → preview changes → publish → verify live website updated
- [x] T054 Validation scenario: Upload flow — upload profile photo → add to Home section → save → preview → publish → verify public site shows image
- [x] T055 Validation scenario: Testimonials — add new testimonial → save → publish → verify on public site → rollback → verify removed
- [x] T056 Validation scenario: Session security — logout from one tab → verify other tab redirects to login on next API call
- [x] T057 Validation scenario: Rate limiting — attempt 6 failed logins → verify 429 lockout, wait 15 min, verify login succeeds
- [x] T058 Validation scenario: Mobile usability — open admin on 375px viewport → verify all tabs accessible, form inputs responsive, buttons clickable
- [x] T059 Validation scenario: Preview mode — make draft change → click preview → verify ?preview=1 banner visible → verify new content shown → logout → refresh → verify fallback to live content

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Performance, security hardening, documentation, and edge case handling.

**Duration**: ~1.5 hours

### Documentation & Support

- [x] T060 [P] Create `cms/README.md` — Installation, config, running locally, architecture overview, troubleshooting common issues — at `cms/README.md`
- [x] T061 [P] Create `.env.example` with all required env vars and explanations — at `cms/.env.example`
- [x] T062 [P] Create `DEPLOYMENT.md` in specs/003-doctor-cms/ — VPS deployment steps, firewall rules, Nginx validation, restarting services — at `specs/003-doctor-cms/DEPLOYMENT.md`
- [x] T063 [P] Add inline code comments to all services and routes explaining: rate limit logic, atomic write safety, session handling, file sanitization — at `cms/services/`, `cms/routes/`

### Security Hardening

- [x] T064 [P] In `cms/server.js`, add helmet middleware for security headers (Content-Security-Policy, X-Frame-Options, etc.) — at `cms/server.js`
- [x] T065 [P] In upload validation, add MIME type check (not just extension) to prevent svg/js as jpg disguise — at `cms/services/upload.js`
- [x] T066 [P] In `cms/routes/auth.js`, add CSRF token validation on login (optional for MVP if form-only; required if future API clients) — at `cms/routes/auth.js`
- [x] T067 [P] Verify all session cookies have: httpOnly: true, secure: true (HTTPS only), sameSite: 'strict' — at `cms/server.js`

### Performance & Error Handling

- [x] T068 [P] Add request/response logging in `cms/server.js` for debugging — log all /api/ calls, errors, timings — at `cms/server.js`
- [x] T069 [P] In error handler (server.js), catch and log all exceptions; return user-friendly error messages (no stack traces in 200 responses) — at `cms/server.js`
- [x] T070 [P] Add HTTP compression middleware (gzip) in server.js for faster admin panel load — at `cms/server.js`

### UI Polish

- [x] T071 [P] In dashboard.css, add loading spinner for slow network (show while fetching /api/content, on save, on publish) — at `cms/public/css/dashboard.css`
- [x] T072 [P] In ui.js, add countdown timer for rate limit lockout message ("Try again in 14:32") — at `cms/public/js/ui.js`
- [x] T073 [P] In dashboard.js, disable Save/Publish buttons while request in flight (prevent double-submit) — at `cms/public/js/dashboard.js`
- [x] T074 [P] In editor.js, add unsaved changes warning: if user navigates away with pending edits, show confirm dialog "Discard unsaved changes?" — at `cms/public/js/editor.js`

---

## Dependency Order & Parallel Execution Examples

### Minimum Viable Product (MVP) — Phases 1–6 (US1–US4)

**Sequential critical path**:
1. T001–T006 (Setup, ~30 min)
2. T007–T012 (Foundational, ~2 hrs)
3. T016–T020 (US1 Login, ~1 hr)
4. T021–T027 (US2 Edit & Draft, ~1.5 hrs)
5. T028–T031 (US3 Preview, ~1 hr)
6. T032–T035 (US4 Publish, ~1 hr)
7. T049–T059 (Integration & Testing, ~2 hrs)

**Total MVP**: ~10 hours (with careful task parallelization where noted [P])

**Parallel opportunities within each story**:
- US1 (T016–T020): T017–T020 can run in parallel after T016
- US2 (T021–T027): T023–T027 can run in parallel after T021–T022
- US3 (T028–T031): T029–T031 can run in parallel after T028
- US4 (T032–T035): T033–T035 can run in parallel after T032
- US5 (T036–T040): All can run in parallel after setup
- US6 (T041–T044): All can run in parallel after setup
- US7 (T045–T048): All can run in parallel after setup

### Full Feature (Phases 1–11)

Add:
- US5 Photos (~2 hrs)
- US6 Testimonials (~1 hr)
- US7 Rollback (~1.5 hrs)
- Integration & Deployment (~1 hr)
- Polish & Security (~1.5 hrs)

**Total**: ~18 hours end-to-end

---

## Success Criteria (From spec.md)

✅ All tasks above, when complete, satisfy:

- SC-001: Doctor can log in, edit, preview, and publish in under 5 min ← Validated by T053
- SC-002: 100% of /api/ routes require auth ← Enforced by T008, T013–T015
- SC-003: Invalid image types rejected 100% ← Validated by T037, T054
- SC-004: Every publish creates timestamped backup ← Implemented by T032, T034

---

**Next Step**: Execute tasks in order, starting with Phase 1 (T001–T006), then Phase 2 (T007–T012), then user stories in priority order (US1–US7). Run `/speckit.implement` to execute this plan.
