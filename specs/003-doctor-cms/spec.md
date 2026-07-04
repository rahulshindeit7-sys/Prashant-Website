# Feature Specification: Doctor CMS — Content Management for Single-Site

**Feature Branch**: `003-doctor-cms`

**Created**: 2026-07-03

**Status**: Draft — Clarification in Progress

**Input**: User description: "Add a simple doctor-editable CMS/admin panel so the doctor can update website content without touching code. Goal: Doctor logs in to admin panel, edits content, uploads photos, manages testimonials, previews changes, and publishes to live website."

## Clarifications

### Session 2026-07-03

- Q: Should the CMS introduce new content storage files (data/content.live.json, data/content.draft.json) or edit the existing config/doctor-profile.json directly? → A: Option A — CMS edits config/doctor-profile.json directly. Draft state = timestamped backup copy created before every publish. Zero breaking changes to existing static JS.
- Q: Should the CMS manage full expertise detail page content (17 topics in scripts/expertise-details.js) or only config-level fields (expertise card titles/descriptions in config/doctor-profile.json)? → A: Option A — Expertise detail content in scripts/expertise-details.js is out of scope for v1. CMS manages config fields only (expertise_items titles, descriptions, slugs). Expertise detail page content editing deferred to future phase.
- Q: Should viewing the preview page (via ?preview=1) require an active admin login session, or should it generate a shareable link accessible without login? → A: Option A — Preview requires active admin login session. /api/preview/config validates session before serving draft content. Draft content is internal and not shareable externally.
- Q: Should long-form text fields (About Doctor bio, FAQ answers, service descriptions) use a rich text WYSIWYG editor or plain text textarea? → A: Option A — Plain text textarea for all long-form fields. Newlines render as paragraph breaks (already how site renders). Zero extra frontend dependencies or HTML sanitization needed.
- Q: For the Expertise tab, should the doctor be able to add new expertise topics and delete existing ones, or only edit existing items? → A: Option B — Full CRUD. Doctor can add new expertise items (slug auto-generated from title), edit title/description/active state of existing items, delete items, and reorder them. The expertise_items array in config/doctor-profile.json is fully manageable.

## Context

The existing website is a static HTML/CSS/Vanilla JS doctor website deployed on a Linux VPS behind Nginx. All site content is driven by a single config file: `config/doctor-profile.json`. The admin CMS is a **separate, lightweight Node.js Express backend** that provides authenticated editing of this config file, photo uploads, and a publish workflow. The static public website remains unchanged and continues to serve fast from Nginx.

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Doctor Logs In to Admin Panel (Priority: P1)

The doctor opens `/admin/` in a browser, sees a login page, enters username and password from `.env`, and gains access to the dashboard. Wrong credentials are rejected. Sessions expire after inactivity.

**Acceptance Scenarios**:
1. **Given** correct credentials, **When** doctor submits login form, **Then** they are redirected to the admin dashboard and a secure HTTP-only session cookie is set.
2. **Given** wrong password, **When** doctor submits login form, **Then** an error is shown and login is rejected; 5+ failed attempts trigger a 15-minute lockout.
3. **Given** a session cookie is expired/missing, **When** doctor tries to access any admin page or API, **Then** they are redirected to `/admin/login`.
4. **Given** doctor clicks Logout, **When** confirmed, **Then** session is destroyed and they are redirected to login.

---

### User Story 2 — Doctor Edits Content and Saves Draft (Priority: P1)

The doctor edits fields in the admin dashboard (doctor name, clinic timings, phone, services, FAQs, etc.), clicks "Save Draft", and the changes are written to a draft backup — the live website is NOT yet updated.

**Acceptance Scenarios**:
1. **Given** the doctor edits any content field and clicks Save Draft, **When** save completes, **Then** a timestamped backup of the current `config/doctor-profile.json` is written to `backups/`, and the edited version is written to a draft staging file — live config is unchanged.
2. **Given** a required field is empty, **When** doctor tries to save, **Then** validation highlights the empty field and prevents saving.
3. **Given** the doctor's session expires mid-edit, **When** they try to save, **Then** they are shown a session-expired warning before any data is written.

---

### User Story 3 — Doctor Previews Draft Changes (Priority: P1)

The doctor clicks "Preview", opens the existing website pages with `?preview=1`, and sees how the edited content will look before it goes live. A visible banner reads "Preview Mode — Not Published".

**Acceptance Scenarios**:
1. **Given** the doctor has unsaved draft changes, **When** they click Preview, **Then** the page opens with `?preview=1` and loads content from the draft staging file instead of live config.
2. **Given** preview mode is active, **When** any page renders, **Then** a clearly visible top banner reads "Preview Mode — Not Published".
3. **Given** no draft exists, **When** doctor clicks Preview, **Then** they see the live content with a banner indicating "No draft — showing live content".

---

### User Story 4 — Doctor Publishes Changes to Live Website (Priority: P1)

After reviewing the preview, the doctor clicks "Publish". The draft becomes the new live `config/doctor-profile.json`. The public website immediately reflects the changes on next page load.

**Acceptance Scenarios**:
1. **Given** doctor clicks Publish, **When** confirmed, **Then** the current `config/doctor-profile.json` is backed up with timestamp to `backups/`, draft content replaces `config/doctor-profile.json`, and public site reflects changes immediately.
2. **Given** publish succeeds, **When** doctor views the live site, **Then** all published changes appear on the public-facing pages.
3. **Given** publish fails (disk error, validation failure), **When** the error occurs, **Then** the live config is NOT modified and the doctor sees a clear error message.

---

### User Story 5 — Doctor Uploads and Uses Photos (Priority: P2)

The doctor uploads a photo (profile photo, clinic photo, testimonial photo) through the admin panel. The upload is validated, stored in `uploads/`, and the URL is available to use in content fields.

**Acceptance Scenarios**:
1. **Given** doctor uploads a valid jpg/png/webp under 5MB, **When** upload completes, **Then** the file is stored in `uploads/` with a sanitized filename and the URL (`/uploads/filename.jpg`) is returned.
2. **Given** doctor tries to upload an svg/js/html/php/exe, **When** upload is attempted, **Then** it is rejected with a clear error message.
3. **Given** doctor uploads a file over 5MB, **When** upload is attempted, **Then** it is rejected with a "file too large" message.

---

### User Story 6 — Doctor Manages Testimonials (Priority: P2)

The doctor adds, edits, deletes, and reorders testimonials through the admin panel. Changes are saved to the draft and published via the normal Publish workflow.

**Acceptance Scenarios**:
1. **Given** doctor adds a testimonial with all required fields (patient name, treatment, rating, text), **When** saved, **Then** it appears in the testimonials list in draft state.
2. **Given** doctor marks a testimonial inactive, **When** published, **Then** it does not render on the public website.
3. **Given** doctor reorders testimonials via drag-or-up/down, **When** published, **Then** the public website shows them in the new order.

---

### User Story 7 — Doctor Rolls Back to Previous Version (Priority: P3)

The doctor made an error and wants to revert to a previous version of the config. They open the Rollback panel, see the last 5 backups with timestamps, and restore one.

**Acceptance Scenarios**:
1. **Given** doctor clicks Rollback, **When** the panel opens, **Then** they see a list of the last 5 backups with timestamps and a preview of the doctor name from each.
2. **Given** doctor selects a backup to restore, **When** confirmed, **Then** that backup replaces `config/doctor-profile.json` and the live website immediately serves the restored content.

---

### Edge Cases

- What if `config/doctor-profile.json` becomes corrupt after a failed publish? → Always write to a temp file first, then atomically rename to avoid partial writes.
- What if the doctor uploads a file with a path traversal name (`../../etc/passwd`)? → Strip all path components; store only the filename in `uploads/` with an additional UUID prefix.
- What if two browser tabs are editing simultaneously? → Last write wins for v1; show a "Last saved" timestamp in the UI to indicate recent changes.
- What if the admin backend is not running when the doctor tries to access `/admin/`? → Nginx should return a 502 error; outside the CMS's control.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Admin panel MUST be protected by username/password login with credentials stored in `.env`.
- **FR-002**: All admin API routes MUST require a valid authenticated session; unauthenticated requests MUST return 401 and redirect to login.
- **FR-003**: Login MUST implement rate limiting: 5 failed attempts within 15 minutes triggers a temporary lockout.
- **FR-004**: CMS MUST allow editing all fields in `config/doctor-profile.json` through form-based UI organized in tabs: Home, About/Profile, Treatments, Expertise, Testimonials, Gallery, Contact, SEO, Preview & Publish.
- **FR-004a**: The Expertise tab MUST support full CRUD for `expertise_items`: add new items (slug auto-generated from title by lowercasing and replacing spaces with hyphens), edit title/description/active toggle on existing items, delete items, and reorder via up/down controls. All changes write to draft only.
- **FR-005**: Save Draft MUST write a timestamped backup of the current live config to `backups/` and write the draft version to a staging file; it MUST NOT update `config/doctor-profile.json` until Publish.
- **FR-006**: Publish MUST atomically replace `config/doctor-profile.json` with the staged draft (write to temp file, then rename).
- **FR-007**: Publish MUST create a timestamped backup of the pre-publish config in `backups/` before overwriting.
- **FR-008**: Preview mode MUST be triggered by `?preview=1` query parameter on any static page; the page JS MUST detect this flag and call the authenticated `/api/preview/config` endpoint to load draft content. Unauthenticated requests to `/api/preview/config` MUST return 401.
- **FR-009**: Preview MUST display a visible top banner reading "Preview Mode — Not Published".
- **FR-010**: Rollback MUST list the last 5 backups and allow restoring any one to become the live config.
- **FR-011**: Image upload MUST accept only jpg, jpeg, png, webp; reject all other types including svg, js, html, php, exe.
- **FR-012**: Image upload MUST reject files over 5MB.
- **FR-013**: Uploaded filenames MUST be sanitized (strip path traversal, replace special chars) and prefixed with a UUID to avoid collisions.
- **FR-014**: Uploaded images MUST be served at `/uploads/<filename>` and accessible from the public static website.
- **FR-015**: Testimonials MUST support add, edit, delete, reorder, and active/inactive toggle via the admin UI.
- **FR-016**: Admin backend MUST run on port 5050 (localhost).
- **FR-017**: Nginx MUST proxy `/admin/` and `/api/` to the backend; all other paths continue to serve the static website.
- **FR-018**: Logout MUST invalidate the server-side session and redirect to the login page.

### Key Entities

- **Config**: The single `config/doctor-profile.json` file — source of truth for all site content
- **Draft Staging File**: `backups/content.draft.json` — holds the in-progress edits before publish
- **Backup**: Timestamped copy of `config/doctor-profile.json` in `backups/` (e.g., `config.2026-07-03T14-30-00.json`)
- **Upload**: Image file stored in `uploads/` with UUID-prefixed sanitized filename
- **Session**: HTTP-only cookie backed by server-side session store (express-session + file or memory store)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Doctor can log in, edit content, preview, and publish in under 5 minutes for a simple change (e.g., phone number update).
- **SC-002**: 100% of admin API routes require authentication — no unauthenticated data access.
- **SC-003**: Invalid image types are rejected 100% of the time — no server-side execution of uploaded files.
- **SC-004**: Every publish creates a timestamped backup — zero data loss on failed or accidental publish.
- **SC-005**: Public website continues to load in under 1.5s (LCP) after CMS is added — no static serving changes.
- **SC-006**: Mobile admin panel is functional on 375px viewport (doctor can edit on phone).

## Assumptions

- Doctor CMS is a **separate backend** from the existing multi-site developer dashboard (`admin/`). It runs on port 5050.
- The existing `config/doctor-profile.json` remains the sole source of truth for the public website.
- `scripts/expertise-details.js` (detailed expertise topic content — key points, sections, FAQs for each topic) is **out of scope for v1** — the CMS manages only the `expertise_items` array in config (title, description, slug, active flag, CRUD). Expertise detail page content editing deferred to future phase.
- The doctor accesses the admin panel from the internet (not localhost-only) — Nginx proxies `/admin/` to port 5050.
- Node.js Express is used because `package.json` already exists in the project root.
- Photo uploads are served by the Node.js backend at `/uploads/` (proxied by Nginx alongside `/admin/` and `/api/`).
- Single-user authentication — one doctor login credential set in `.env`. No multi-user support in v1.
- The admin panel frontend is pure HTML/CSS/Vanilla JS (no React/Vue/etc.) consistent with project constitution Principle III.
