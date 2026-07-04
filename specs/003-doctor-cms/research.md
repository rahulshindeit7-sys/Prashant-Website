# Research: Doctor CMS — Technical Decisions

**Phase 0 Output** | Feature: `003-doctor-cms` | Date: 2026-07-03

## Decision 1: Session Management — express-session + session-file-store

**Decision**: Use `express-session` with `session-file-store` for persistent server-side sessions.

**Rationale**: JWT would require a token revocation mechanism to support logout (blacklist or short expiry). For a single-user admin panel where logout must be instant and reliable, server-side sessions with a file store are simpler and more appropriate. `session-file-store` persists sessions to disk so they survive server restarts (unlike default in-memory store).

**Alternatives considered**: JWT cookie — rejected due to logout complexity. connect-sqlite3 — more setup overhead than file store for single-user use.

**Configuration**: HTTP-only session cookie with `secure: true`, `sameSite: 'strict'`, 8-hour max age.

---

## Decision 2: Password Storage — bcryptjs hash in .env

**Decision**: Store a bcrypt hash of the admin password in `.env` as `ADMIN_PASSWORD_HASH`. Plain-text password is never stored.

**Rationale**: If `.env` is ever accidentally exposed (git commit, log file), a bcrypt hash is not immediately usable. bcrypt with cost factor 10 is fast enough for login (~100ms) but hard to brute-force.

**Setup command** (run once during installation):
```bash
node -e "require('bcryptjs').hash('YOUR_PASSWORD', 10, (e,h) => console.log('ADMIN_PASSWORD_HASH=' + h))"
```

**Alternatives considered**: Plain-text password in .env — rejected for security. Argon2 — better but adds native binary dependency, bcryptjs is pure JS.

---

## Decision 3: Atomic File Write Pattern

**Decision**: Publish writes to a temporary file first, then uses `fs.renameSync()` to atomically replace `config/doctor-profile.json`.

**Rationale**: On Linux (POSIX filesystems), `rename()` is atomic — the live config is never in a partially-written state. If the process crashes mid-write, the temp file is left behind but the live config is untouched.

**Pattern**:
```javascript
const tmpPath = configPath + '.tmp.' + Date.now();
fs.writeFileSync(tmpPath, JSON.stringify(config, null, 2), 'utf8');
fs.renameSync(tmpPath, configPath); // atomic on POSIX
```

**Alternatives considered**: Direct `fs.writeFileSync` to config path — rejected because partial write on crash would corrupt live site. Streaming write — unnecessary complexity for a ~50KB JSON file.

---

## Decision 4: Preview Interception in app.js

**Decision**: Detect `?preview=1` in `URLSearchParams` at the top of the initial fetch in `assets/js/app.js`. If preview mode, fetch from `/api/preview/config` (authenticated endpoint on Express) instead of `./config/doctor-profile.json`.

**Existing fetch call** (from code inspection):
```javascript
fetch('./config/doctor-profile.json?v=' + Date.now())
```

**Modified pattern**:
```javascript
var _isPreview = new URLSearchParams(window.location.search).get('preview') === '1';
var _configUrl = _isPreview
  ? '/api/preview/config'
  : './config/doctor-profile.json?v=' + Date.now();
fetch(_configUrl, _isPreview ? { credentials: 'include' } : {})
```

`credentials: 'include'` sends the session cookie so `/api/preview/config` can validate the admin session. If session is invalid, endpoint returns 401, and the catch block falls back to live config with a console warning.

**Preview banner injection**: After config loads, if `_isPreview === true`, inject a fixed-position top banner via DOM.

---

## Decision 5: CMS Directory — Separate from admin/

**Decision**: Create a new `cms/` directory with its own `package.json` (port 5050). The existing `admin/` (port 3500, multi-site developer dashboard) is unchanged.

**Rationale**: The existing `admin/` serves a completely different purpose (developer multi-site management via SSH). Mixing doctor-CMS routes into it would create tight coupling. Separate directory = separate concern, separate process, independent deployment.

**Port allocation**:
| Service | Directory | Port | Audience |
|---------|-----------|------|----------|
| Static site | Nginx root | 80/443 | Public patients |
| Doctor CMS | `cms/` | 5050 | Doctor (via Nginx /admin/) |
| Dev dashboard | `admin/` | 3500 | Developer (direct access) |

**Nginx additions** (3 new location blocks):
```nginx
location /admin/ { proxy_pass http://localhost:5050/admin/; }
location /api/ { proxy_pass http://localhost:5050/api/; }
location /uploads/ { proxy_pass http://localhost:5050/uploads/; }
```

---

## Decision 6: Uploads Serving — Express Static Middleware

**Decision**: Express serves the `uploads/` directory via `express.static()`, proxied by Nginx at `/uploads/`.

**Rationale**: Simpler than copying to Nginx's static root. Nginx still handles TLS, so performance is comparable for image serving. Access control can be added later if needed (some uploads might be private).

**File naming**: `{uuid-v4}-{sanitized-original-name}`. UUID prevents collision and path traversal. Sanitized name retains human-readable context.

**Sanitization**: Strip path components (`path.basename`), replace spaces/special chars with hyphens, convert to lowercase, preserve extension.

---

## Resolved Unknowns Summary

| Unknown | Resolution |
|---------|-----------|
| Session strategy | express-session + session-file-store |
| Password storage | bcryptjs hash in .env |
| Atomic write | fs.writeFileSync(tmp) + fs.renameSync → config path |
| Preview interception | URLSearchParams check in app.js, fetch /api/preview/config with credentials |
| CMS structure | New cms/ directory, port 5050, independent from admin/ |
| Uploads serving | Express static at /uploads/, Nginx proxied |
