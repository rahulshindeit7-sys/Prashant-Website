# API Contracts: Doctor CMS

**Phase 1 Output** | Feature: `003-doctor-cms` | Date: 2026-07-03

Base URL: `http://localhost:5050` (proxied via Nginx at domain `/api/` and `/admin/`)

All `/api/` endpoints except `/api/login` require a valid session cookie (`cms_session`). Unauthenticated requests return `401 Unauthorized`.

---

## Authentication

### POST /api/login

Authenticate the doctor and create a session.

**Rate limit**: 5 attempts per 15 minutes per IP.

**Request**:
```json
{ "username": "doctor", "password": "plaintext_password" }
```

**Response 200** (success):
```json
{ "ok": true, "message": "Logged in" }
```
Sets HTTP-only session cookie `cms_session`.

**Response 401** (wrong credentials):
```json
{ "ok": false, "message": "Invalid username or password" }
```

**Response 429** (rate limited):
```json
{ "ok": false, "message": "Too many attempts. Try again in 15 minutes." }
```

---

### POST /api/logout

Destroy the current session and clear the session cookie. Requires auth.

**Response 200**:
```json
{ "ok": true, "message": "Logged out" }
```

---

## Content

### GET /api/content

Return the current live `config/doctor-profile.json`. Requires auth.

**Response 200**: Full config object.
```json
{
  "doctor": { "name": "...", "degree": "...", ... },
  "clinic": { "phone": "...", "address": "...", ... },
  "services": [...],
  "expertise_items": [...],
  "testimonials": [...],
  ...
}
```

**Response 500**: `{ "ok": false, "message": "Failed to read config" }`

---

### PUT /api/content

Save draft. Merges the submitted config over the current live config and writes to `backups/content.draft.json`. Does **not** modify `config/doctor-profile.json`. Requires auth.

**Request**: Full or partial config object (same schema as GET /api/content).

**Validation**:
- `doctor.name` must be non-empty string
- `clinic.phone` must be non-empty string
- `seo.title` must be non-empty string

**Response 200**:
```json
{ "ok": true, "message": "Draft saved", "savedAt": "2026-07-03T14:30:00.000Z" }
```

**Response 400** (validation failure):
```json
{ "ok": false, "message": "doctor.name is required" }
```

**Response 500**: `{ "ok": false, "message": "Failed to save draft" }`

---

### GET /api/preview/config

Return the current draft staging file (`backups/content.draft.json`). If no draft exists, returns the live config. Requires auth.

Used by static pages in preview mode (`?preview=1`).

**Response 200**: Config object (draft or live).
```json
{
  "_preview": true,
  "_draftSavedAt": "2026-07-03T14:30:00.000Z",
  "doctor": { ... },
  ...
}
```

The `_preview` and `_draftSavedAt` keys are injected by the server; static JS can use them to render the preview banner with a timestamp.

**Response 401**: Session required (static page JS falls back to live config).

---

## Publish & Rollback

### POST /api/publish

Publish the current draft to live. Requires auth.

**Steps executed server-side**:
1. Read `backups/content.draft.json`
2. Validate JSON is parseable
3. Write current `config/doctor-profile.json` to `backups/config.{timestamp}.json`
4. Atomic write: draft → `config/doctor-profile.json.tmp` → rename

**Response 200**:
```json
{ "ok": true, "message": "Published", "publishedAt": "2026-07-03T14:35:00.000Z" }
```

**Response 400** (no draft):
```json
{ "ok": false, "message": "No draft to publish. Save a draft first." }
```

**Response 500** (write failure):
```json
{ "ok": false, "message": "Publish failed. Live config was not modified." }
```

---

### GET /api/backups

List the last 5 backup files with metadata. Requires auth.

**Response 200**:
```json
{
  "ok": true,
  "backups": [
    { "filename": "config.2026-07-03T14-35-00.json", "timestamp": "2026-07-03T14:35:00.000Z", "doctorName": "Dr. Prashant Pawar" },
    { "filename": "config.2026-07-03T10-00-00.json", "timestamp": "2026-07-03T10:00:00.000Z", "doctorName": "Dr. Prashant Pawar" }
  ]
}
```

---

### POST /api/rollback

Restore a backup to become the live config. Requires auth.

**Request**:
```json
{ "filename": "config.2026-07-03T10-00-00.json" }
```

**Validation**: filename must match pattern `config.{timestamp}.json`; must exist in `backups/`; no path traversal.

**Response 200**:
```json
{ "ok": true, "message": "Rolled back to 2026-07-03T10:00:00.000Z" }
```

**Response 400** (invalid filename):
```json
{ "ok": false, "message": "Invalid backup filename" }
```

**Response 404** (not found):
```json
{ "ok": false, "message": "Backup file not found" }
```

---

## Uploads

### POST /api/upload

Upload an image file. Requires auth.

**Request**: `multipart/form-data` with field `image`.

**Validation**:
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`
- Allowed extensions (double-check against MIME): `.jpg`, `.jpeg`, `.png`, `.webp`
- Max file size: 5MB
- Filename sanitized before storage

**Response 200**:
```json
{ "ok": true, "url": "/uploads/a1b2c3d4-e5f6-clinic-photo.jpg", "filename": "a1b2c3d4-e5f6-clinic-photo.jpg" }
```

**Response 400** (invalid type):
```json
{ "ok": false, "message": "Invalid file type. Allowed: jpg, jpeg, png, webp" }
```

**Response 413** (too large):
```json
{ "ok": false, "message": "File too large. Maximum size is 5MB." }
```

---

## Admin Panel Pages (served by Express static)

| Path | Description |
|------|-------------|
| `GET /admin/` | Redirect to `/admin/login` if no session; redirect to `/admin/dashboard` if authenticated |
| `GET /admin/login` | Login page (`cms/public/login.html`) |
| `GET /admin/dashboard` | Admin dashboard SPA (`cms/public/dashboard.html`) |
| `GET /uploads/{filename}` | Serve uploaded images (`express.static('uploads/')`) |

---

## Nginx Configuration Additions

```nginx
# Doctor CMS backend
location /admin/ {
    proxy_pass         http://localhost:5050/admin/;
    proxy_http_version 1.1;
    proxy_set_header   Upgrade $http_upgrade;
    proxy_set_header   Connection 'upgrade';
    proxy_set_header   Host $host;
    proxy_cache_bypass $http_upgrade;
}

location /api/ {
    proxy_pass         http://localhost:5050/api/;
    proxy_http_version 1.1;
    proxy_set_header   Host $host;
    proxy_set_header   X-Real-IP $remote_addr;
}

location /uploads/ {
    proxy_pass         http://localhost:5050/uploads/;
    proxy_http_version 1.1;
    proxy_set_header   Host $host;
    # Cache uploaded images aggressively
    proxy_cache_valid  200 1d;
    add_header         Cache-Control "public, max-age=86400";
}
```
