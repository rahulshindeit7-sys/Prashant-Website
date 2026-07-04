# Data Model: Doctor CMS

**Phase 1 Output** | Feature: `003-doctor-cms` | Date: 2026-07-03

---

## File System Entities

### 1. Live Config — `config/doctor-profile.json`
The single source of truth for the public website. **Written only by Publish action.** Read by the static website JS at page load. Already exists in project.

Key editable sections exposed in the CMS:

| CMS Tab | Config Key Path | Type |
|---------|----------------|------|
| Home | `doctor.name`, `doctor.tagline`, `doctor.hero_subtitle` | string |
| About/Profile | `doctor.about`, `doctor.degree`, `doctor.specialization`, `doctor.experience` | string |
| Contact | `clinic.address`, `clinic.phone`, `clinic.whatsapp`, `clinic.timings`, `clinic.google_maps_embed` | string/object |
| Treatments | `services[]` | array |
| Expertise | `expertise_items[]` | array |
| Testimonials | `testimonials[]` | array |
| Gallery | `gallery[]` | array |
| SEO | `seo.title`, `seo.description`, `seo.og_image` | string |

---

### 2. Draft Staging File — `backups/content.draft.json`

Holds the in-progress edit before publish. Written by Save Draft. Served by `/api/preview/config`. **NOT the live config.**

Structure: identical to `config/doctor-profile.json` (same schema, full copy with edits applied).

Lifecycle:
- Created/overwritten on every Save Draft
- Read by `/api/preview/config` (authenticated)
- Copied to `config/doctor-profile.json` on Publish
- Remains on disk after publish (as a record of the last published draft)

---

### 3. Timestamped Backups — `backups/config.{timestamp}.json`

Created automatically before every Publish action.

Naming format: `backups/config.2026-07-03T14-30-00.json`
(Colons replaced with hyphens for cross-platform filesystem compatibility.)

Retention: The rollback feature lists the last 5. Older backups are not auto-deleted in v1 (manual cleanup).

---

### 4. Upload Files — `uploads/{uuid}-{sanitized-name}.{ext}`

Files uploaded via the admin photo uploader.

Naming pattern: `uploads/a1b2c3d4-e5f6-7890-abcd-ef1234567890-clinic-photo.jpg`

Constraints:
- Allowed extensions: `.jpg`, `.jpeg`, `.png`, `.webp`
- Max size: 5MB
- UUID prefix: prevents collision and path traversal
- Original filename sanitized: lowercased, spaces → hyphens, special chars stripped

---

### 5. Session Files — `cms/sessions/`

Created by `session-file-store`. One file per active session. Automatically cleaned up on expiry.

---

## Environment Variables — `cms/.env`

```ini
ADMIN_USERNAME=doctor
ADMIN_PASSWORD_HASH=$2a$10$...   # bcrypt hash of actual password
SESSION_SECRET=<32-char-random-string>
PORT=5050
NODE_ENV=production
```

`.env.example` (committed to repo — no real values):
```ini
ADMIN_USERNAME=your_username
ADMIN_PASSWORD_HASH=run_setup_to_generate
SESSION_SECRET=replace_with_32_char_random_string
PORT=5050
NODE_ENV=production
```

---

## Session Entity

| Field | Value |
|-------|-------|
| Cookie name | `cms_session` |
| Store | File-based (`session-file-store`, `cms/sessions/`) |
| Max age | 8 hours |
| HTTP-only | true |
| Secure | true (production) |
| SameSite | strict |
| Resave | false |
| Save uninitialized | false |

---

## Rate Limit State (in-memory)

Tracked by `express-rate-limit` per IP address.

| Rule | Value |
|------|-------|
| Window | 15 minutes |
| Max attempts | 5 |
| Applied to | `POST /api/login` only |
| Response on limit | 429 with message "Too many attempts. Try again in 15 minutes." |

---

## Key Relationships

```
cms/.env
  └─ ADMIN_PASSWORD_HASH → verified against login POST body password via bcryptjs

POST /api/content (Save Draft)
  ├─ reads: config/doctor-profile.json (current live)
  ├─ merges: request body (edited fields)
  └─ writes: backups/content.draft.json

POST /api/publish
  ├─ reads: backups/content.draft.json
  ├─ creates: backups/config.{timestamp}.json  (backup of current live)
  ├─ writes (atomic): config/doctor-profile.json.tmp → rename → config/doctor-profile.json
  └─ public site immediately serves new config on next browser load

GET /api/preview/config  (requires auth session)
  └─ reads: backups/content.draft.json (or live config if draft missing)

POST /api/upload
  ├─ validates: extension, size
  ├─ sanitizes: filename
  └─ writes: uploads/{uuid}-{name}.{ext}

POST /api/rollback  (requires auth session)
  ├─ reads: backups/config.{requested-timestamp}.json
  ├─ creates: backups/config.{now-timestamp}.json  (backup before rollback)
  └─ writes (atomic): config/doctor-profile.json
```
