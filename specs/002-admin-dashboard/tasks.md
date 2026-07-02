# Tasks: Admin Dashboard (Multi-Site Manager)

**Input**: Design documents from `specs/002-admin-dashboard/`

**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/api.md ✓

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)
- Exact file paths included in all task descriptions

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize the admin dashboard Node.js project structure and dependencies.

- [x] T001 Create `admin/package.json` with project metadata, scripts (start, dev, test), and dependencies (express, node-ssh, keytar, cors)
- [x] T002 [P] Create `admin/server/index.js` with Express app skeleton (static file serving from `public/`, API route mounting, port 3500, error middleware)
- [x] T003 [P] Create `admin/server/data/dashboard-registry.json` with initial empty structure `{ "version": "1.0.0", "sites": [], "updated_at": null }`
- [x] T004 [P] Create `admin/server/data/deployment-log.json` with initial empty array `[]`
- [x] T005 [P] Create `admin/public/index.html` with dashboard HTML shell (summary bar, site grid container, modals placeholder, script/css links)
- [x] T006 [P] Create `admin/public/css/dashboard.css` with CSS custom properties, grid layout, card styles, status indicators, responsive breakpoints
- [x] T007 [P] Create `admin/README.md` with setup instructions, prerequisites, usage guide

## Phase 2: Foundational Services (Backend Core)

**Purpose**: Implement shared backend services that all user stories depend on.

- [x] T008 Create `admin/server/services/registry.js` with CRUD operations: loadRegistry(), saveRegistry(), addSite(), removeSite(), getSite(), getAllSites(), updateSiteStatus()
- [x] T009 Create `admin/server/services/ssh.js` with SSH operations: testConnection(), pushFile(), pullFile(), using node-ssh library
- [x] T010 [P] Create `admin/server/services/credentials.js` with keytar integration: storePassword(), getPassword(), deletePassword() for SSH credential management
- [x] T011 [P] Create `admin/server/services/health.js` with health check logic: checkHttpStatus(), checkSSLExpiry(), determineSiteStatus() using Node.js tls module
- [x] T012 Create `admin/server/services/logger.js` with deployment logging: logAction(), getLogEntries(), filterBysite() writing to deployment-log.json

## Phase 3: User Story 1 — View All Managed Sites (P1)

**Story Goal**: Developer opens dashboard and sees all managed sites with status at a glance.

**Independent Test**: Load dashboard with 3+ registered sites, verify all appear with names, domains, and correct status indicators.

- [x] T013 [US1] Create `admin/server/routes/sites.js` with GET /api/sites endpoint returning all sites with summary counts (total, online, offline, warnings)
- [x] T014 [US1] Create `admin/server/routes/health.js` with POST /api/sites/refresh endpoint that checks status of all (or specified) sites and updates registry
- [x] T015 [P] [US1] Create `admin/public/js/api.js` with fetch wrapper: getSites(), refreshSites(), and error handling utilities
- [x] T016 [US1] Create `admin/public/js/ui.js` with UI helpers: renderSiteCard(), renderSummaryBar(), renderEmptyState(), showToast(), showModal()
- [x] T017 [US1] Create `admin/public/js/app.js` with main dashboard initialization: load sites on startup, render grid, bind refresh button, implement search/filter (FR-014)

## Phase 4: User Story 3 — Add New Site (P1)

**Story Goal**: Developer registers a new site by providing URL and SSH credentials, with connection testing.

**Independent Test**: Click "Add Site", fill form, test connection, verify site appears in grid.

- [x] T018 [US3] Add POST /api/sites endpoint to `admin/server/routes/sites.js` with input validation (domain_url, ssh_host, ssh_port, ssh_user, auth_method, remote_config_path)
- [x] T019 [US3] Add POST /api/sites/:siteId/test-connection endpoint to `admin/server/routes/sites.js` testing SSH + HTTP + SSL connectivity
- [x] T020 [US3] Implement site registration flow in registry service: fetch remote config to extract site_id/doctor_name/clinic_name, check for duplicates, persist to registry in `admin/server/services/registry.js`
- [x] T021 [P] [US3] Add "Add Site" modal HTML to `admin/public/index.html` with form fields (domain, SSH host, port, user, auth method, key path, remote path) and "Test Connection" button
- [x] T022 [US3] Add addSite() and testConnection() functions to `admin/public/js/api.js` and wire up form submission + test button in `admin/public/js/app.js`

## Phase 5: User Story 2 — Edit & Deploy Config (P1)

**Story Goal**: Developer edits a site's config in an inline editor and pushes changes to the remote VPS.

**Independent Test**: Open editor for a site, modify a field, preview diff, deploy, verify live site updates.

- [x] T023 [US2] Create `admin/server/routes/config.js` with GET /api/sites/:siteId/config endpoint fetching remote config via HTTP proxy
- [x] T024 [US2] Add PUT /api/sites/:siteId/config endpoint to `admin/server/routes/config.js` validating JSON and pushing via SSH with deployment logging
- [x] T025 [US2] Add POST /api/sites/:siteId/config/diff endpoint to `admin/server/routes/config.js` computing line-by-line diff between proposed and live config
- [x] T026 [US2] Create `admin/public/js/editor.js` with config editor component: initEditor(), loadConfig(), getEditorContent(), highlightErrors() using CodeMirror CDN for JSON editing
- [x] T027 [US2] Add editor panel HTML to `admin/public/index.html` with editor container, "Preview Diff" button, "Save & Deploy" button, and diff view panel
- [x] T028 [US2] Wire up editor flow in `admin/public/js/app.js`: open editor on card click → load config → enable editing → preview diff → deploy → show confirmation toast

## Phase 6: User Story 4 — Remove Site (P2)

**Story Goal**: Developer removes a site from the dashboard registry without affecting the deployed site.

**Independent Test**: Remove a site, verify it disappears from grid and deployed site remains live.

- [x] T029 [US4] Add DELETE /api/sites/:siteId endpoint to `admin/server/routes/sites.js` with credential cleanup (keytar delete) and log entry
- [x] T030 [P] [US4] Add confirmation modal HTML to `admin/public/index.html` with "Are you sure?" message and site name display
- [x] T031 [US4] Add removeSite() to `admin/public/js/api.js` and wire up remove button on site cards with confirmation flow in `admin/public/js/app.js`

## Phase 7: User Story 5 — Health Monitoring (P3)

**Story Goal**: Dashboard shows SSL expiry warnings, stale config indicators, and detailed health info.

**Independent Test**: Register a site with expiring SSL, verify yellow warning badge appears on card.

- [x] T032 [US5] Enhance `admin/server/services/health.js` with SSL expiry check (tls.connect), stale config detection (>90 days), and multi-status priority logic
- [x] T033 [US5] Add health detail endpoint GET /api/sites/:siteId/health to `admin/server/routes/health.js` returning full health breakdown (ssl_days, last_update_days, error_history)
- [x] T034 [P] [US5] Update `admin/public/js/ui.js` to render warning badges (yellow SSL Expiring, blue Stale Config) on site cards and health detail panel on click
- [x] T035 [US5] Wire up health badge click → detail panel display in `admin/public/js/app.js`

## Phase 8: Deployment Log & Audit (Cross-Cutting)

**Purpose**: Audit trail for all deployment actions.

- [x] T036 Create `admin/server/routes/logs.js` with GET /api/logs endpoint supporting ?site_id and ?limit query params
- [x] T037 [P] Add deployment log panel to `admin/public/index.html` (collapsible section at bottom or separate tab) showing recent actions
- [x] T038 Wire up log display in `admin/public/js/app.js`: fetch logs on demand, render log entries with timestamp, site, action, result

## Phase 9: Polish & Integration

**Purpose**: Error handling, edge cases, final wiring.

- [x] T039 Add global error handling middleware to `admin/server/index.js` (catch unhandled errors, return structured JSON error responses)
- [x] T040 [P] Add offline/error graceful degradation in `admin/public/js/app.js`: show cached last-known state when backend unreachable, display "No connection" banner
- [x] T041 [P] Add input sanitization to all API route handlers in `admin/server/routes/sites.js` and `admin/server/routes/config.js` (prevent path traversal in remote_config_path, validate URLs)
- [x] T042 Register all route files in `admin/server/index.js` (sites, config, health, logs) and verify full API connectivity end-to-end
- [x] T043 Run `npm install` in `admin/` and verify dashboard starts with `npm start`, serves UI at http://localhost:3500, all API endpoints respond

---

## Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational Services) → Phase 3 (US1: View Sites)
                                                   → Phase 4 (US3: Add Site) [after Phase 3]
                                                   → Phase 5 (US2: Edit Config) [after Phase 4]
                                                   → Phase 6 (US4: Remove Site) [after Phase 3]
                                                   → Phase 7 (US5: Health) [after Phase 3]
Phase 8 (Logs) → depends on Phase 2 only
Phase 9 (Polish) → after all other phases
```

## Parallel Execution Opportunities

| Tasks | Reason |
|-------|--------|
| T002, T003, T004, T005, T006, T007 | All create independent files in Phase 1 |
| T010, T011 | Independent services (keytar vs tls) |
| T015, T016 | Independent frontend modules |
| T021, T030 | Independent HTML modals |
| T032, T034 | Backend health service + frontend badges (different layers) |
| T039, T040, T041 | Independent polish tasks (different files) |

## Implementation Strategy

**MVP Scope**: Phases 1–5 (Setup + Foundational + US1 + US3 + US2)
- Delivers: View all sites, add new sites, edit & deploy configs
- Independently testable and immediately useful

**Increment 2**: Phase 6 (Remove) + Phase 8 (Logs)
- Adds management cleanup and audit trail

**Increment 3**: Phase 7 (Health Monitoring) + Phase 9 (Polish)
- Adds proactive monitoring and production hardening
