# Research: Admin Dashboard (Multi-Site Manager)

**Feature**: 002-admin-dashboard
**Date**: 2026-06-29

## Research Tasks & Findings

### 1. SSH Library for Node.js

**Decision**: `node-ssh` (v13.2.1)

**Rationale**: Promise-based wrapper around ssh2. Provides `putFile()`, `getFile()`, `execCommand()` — exactly what's needed for pushing/pulling config files and testing connections. 332K weekly downloads, MIT license, active maintenance.

**Alternatives considered**:
- Raw `ssh2` — Lower-level, more boilerplate for simple file operations
- `simple-ssh` — Less maintained, fewer features
- Spawning `scp`/`rsync` child processes — Platform-dependent (requires Unix tools on Windows)

**Key API patterns**:
```javascript
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
await ssh.connect({ host, username, privateKeyPath });
await ssh.putFile(localPath, remotePath);  // Push config
await ssh.getFile(localPath, remotePath);  // Pull config
const result = await ssh.execCommand('cat /path/to/file');  // Read remote
ssh.dispose();
```

---

### 2. Secure Credential Storage

**Decision**: `keytar` (v7.9.0) for OS keychain access

**Rationale**: Native Node module that uses OS-level credential storage (Windows Credential Vault, macOS Keychain, Linux libsecret). SSH passwords/keys stored securely — never in plaintext JSON. 2.1M weekly downloads, MIT license, maintained by GitHub/Atom team.

**Alternatives considered**:
- Encrypting credentials in JSON file (AES-256) — Requires managing encryption key, which has the same storage problem
- Environment variables — Fragile, lost on restart, can leak in process lists
- `.ssh/config` only (no password storage) — Doesn't support the password auth fallback requirement

**Key API patterns**:
```javascript
const keytar = require('keytar');
await keytar.setPassword('doctor-dashboard', siteId, sshPassword);
const password = await keytar.getPassword('doctor-dashboard', siteId);
await keytar.deletePassword('doctor-dashboard', siteId);
const allCreds = await keytar.findCredentials('doctor-dashboard');
```

**Note**: For SSH key-based auth (primary method), no password storage needed — just the key path in the registry. `keytar` is only needed when password auth is used.

---

### 3. JSON Editor in Browser (No Framework)

**Decision**: CodeMirror 6 (loaded from CDN) for code editing; native `<textarea>` as fallback

**Rationale**: CodeMirror 6 is modular, lightweight (~150KB gzipped for JSON mode), framework-agnostic, and provides syntax highlighting, error markers, and line numbers. Can be loaded from CDN (no build step). Falls back gracefully if CDN unavailable.

**Alternatives considered**:
- Monaco Editor — Too heavy (~2MB), designed for VS Code, overkill for JSON editing
- Ace Editor — Legacy, larger than needed
- Plain `<textarea>` only — No syntax highlighting, poor UX for JSON editing
- Custom JSON form builder — Too much work for v1; code view is more flexible

**Integration approach**: Load from CDN (`https://cdn.jsdelivr.net/npm/@codemirror/...`), initialize on the editor container element. JSON validation via `JSON.parse()` on save.

---

### 4. SSL Certificate Expiry Check

**Decision**: Node.js built-in `tls` module with `tls.connect()`

**Rationale**: No external dependency needed. Connect to port 443, read the peer certificate, check `valid_to` date. Simple, reliable, zero dependencies.

**Alternatives considered**:
- `ssl-checker` npm package — Unnecessary dependency for a simple TLS connect
- OpenSSL child process — Platform-dependent
- External API (e.g., SSL Labs) — Network dependency, rate limits

**Key pattern**:
```javascript
const tls = require('tls');
function checkSSL(hostname) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(443, hostname, { servername: hostname }, () => {
      const cert = socket.getPeerCertificate();
      const expiryDate = new Date(cert.valid_to);
      const daysRemaining = Math.floor((expiryDate - Date.now()) / 86400000);
      socket.destroy();
      resolve({ expiryDate, daysRemaining });
    });
    socket.on('error', reject);
  });
}
```

---

### 5. JSON Diff View in Browser

**Decision**: Custom minimal diff using `JSON.stringify()` comparison + line-by-line highlight

**Rationale**: For v1, a simple side-by-side or inline diff showing changed lines (highlighted in green/red) is sufficient. Compute diff server-side by comparing old vs new JSON stringified with formatting, then highlight changed lines in the UI. No external diff library needed for structured JSON comparison.

**Alternatives considered**:
- `diff` npm package — Good option for future, but adds dependency for a v1 feature
- `jsdiff` in browser — Would work but adds 30KB for simple JSON comparison
- Structural diff (key-by-key) — More informative but complex to implement for v1

**V1 approach**: Stringify both JSONs with `JSON.stringify(obj, null, 2)`, split into lines, compare line-by-line, render with CSS classes for added/removed/changed lines. Simple, zero dependencies.

---

### 6. Dashboard Architecture Decision

**Decision**: Express.js backend + static HTML/CSS/JS frontend (served by Express)

**Rationale**: The dashboard needs server-side capabilities (SSH connections, file system access, keychain access) that browsers cannot provide. Express is the minimal viable HTTP framework — adds routing and middleware with zero magic. Frontend is pure HTML/CSS/Vanilla JS (aligns with project's simplicity ethos). Both served from the same process (`express.static` for frontend, `/api/*` for backend).

**Alternatives considered**:
- Electron app — Overkill for a developer tool; adds 100MB+ binary
- CLI tool (no UI) — Doesn't meet "single page" requirement
- VS Code extension — Viable but locks to VS Code; less portable
- Fastify — Slightly faster but less ecosystem for our simple needs

---

### 7. Local Storage Strategy

**Decision**: JSON files in `admin/server/data/` directory

**Rationale**: SQLite or a real database is overkill for a single-user tool managing <100 sites. JSON files are human-readable, easy to backup, and editable in emergencies. Two files: `dashboard-registry.json` (site list + non-sensitive metadata) and `deployment-log.json` (audit trail).

**Alternatives considered**:
- SQLite — More robust querying, but over-engineered for <100 records
- LevelDB/lowdb — Unnecessary abstraction over JSON files
- In-memory only — Lost on restart

**Data separation**:
- `dashboard-registry.json`: site_id, domain, ssh_host, ssh_port, ssh_user, auth_method, remote_config_path, status, last_checked (NO passwords — those go to keytar)
- `deployment-log.json`: Append-only log of deployments with timestamps

---

### 8. CORS & Config Fetch Strategy

**Decision**: Dashboard backend proxies config fetches (avoids browser CORS issues)

**Rationale**: Rather than relying on each deployed site having correct CORS headers configured, the dashboard backend fetches configs server-side (via `http.get` or `node-fetch`). This is more reliable — works even if CORS isn't set up yet on a new site. The browser frontend only talks to its own Express backend via `/api/*`.

**Alternatives considered**:
- Browser direct fetch with CORS — Requires CORS configured correctly on every site; fragile
- Browser fetch with proxy extension — Requires browser extension; poor UX

**Impact**: FR-028 CORS requirement in spec 001 becomes a nice-to-have rather than a hard requirement for dashboard functionality. The dashboard works regardless.
