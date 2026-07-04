# Doctor CMS — Admin Panel Backend

A lightweight Node.js Express CMS for managing a doctor's website content. The CMS provides an authenticated admin panel for editing the config, uploading images, managing testimonials, and publishing changes to the live website.

## Overview

- **Framework**: Express.js 4.18.2
- **Authentication**: Session-based with bcrypt password hashing
- **Storage**: JSON config file + timestamped backups + image uploads
- **Server**: Runs on port 5050 (proxied by Nginx at `/admin/` and `/api/`)
- **Target**: Single-doctor websites with static public site + dynamic CMS

## Features

- 🔐 Secure login with rate limiting (5 attempts / 15 min)
- ✏️ Edit all website content through tabbed admin panel
- 📸 Image upload with validation and sanitization
- 👥 Testimonial CRUD (create, edit, delete, reorder)
- 👁️ Draft preview mode with live banner
- 📦 Atomic publish with automatic backups
- ⏮️ Rollback to previous versions (last 5 backups)
- 📱 Mobile-friendly admin interface (375px+)
- 🔒 HTTPS-ready with security headers

## Installation

### Prerequisites

- Node.js 18+ 
- Nginx (for proxying to port 5050)
- `config/doctor-profile.json` exists in project root

### Setup Steps

#### 1. Install dependencies

```bash
cd cms
npm install
```

#### 2. Generate password hash

```bash
node -e "require('bcryptjs').hash('YOUR_CHOSEN_PASSWORD', 10, (e,h) => console.log('ADMIN_PASSWORD_HASH=' + h))"
```

Copy the output hash value.

#### 3. Create .env file

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```ini
ADMIN_USERNAME=doctor
ADMIN_PASSWORD_HASH=<paste hash from step 2>
SESSION_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
PORT=5050
NODE_ENV=production
```

#### 4. Create required directories

```bash
mkdir -p ../backups ../uploads cms/sessions
```

#### 5. Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The admin panel should now be accessible at `http://localhost:5050/admin/login`

## Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `ADMIN_USERNAME` | Yes | Username for admin login | `doctor` |
| `ADMIN_PASSWORD_HASH` | Yes | bcrypt hash of password | `$2a$10$...` |
| `SESSION_SECRET` | Yes | Secret for session encryption | `abc123...def456` |
| `PORT` | No | Server port (default: 5050) | `5050` |
| `NODE_ENV` | No | Environment (production/development) | `production` |

### File Structure

```
cms/
├── server.js              # Express app entry point
├── package.json           # Dependencies
├── .env.example           # Environment template
├── .gitignore             # Excluded files
├── README.md              # This file
├── middleware/
│   └── auth.js            # Authentication middleware
├── routes/
│   ├── auth.js            # Login/logout endpoints
│   ├── content.js         # Content CRUD endpoints
│   ├── publish.js         # Publish/backup/rollback endpoints
│   └── uploads.js         # Image upload endpoint
├── services/
│   ├── config.js          # Config file I/O
│   ├── backup.js          # Backup management
│   └── upload.js          # Upload validation & storage
├── public/
│   ├── login.html         # Login page
│   ├── dashboard.html     # Admin SPA
│   ├── js/
│   │   ├── api.js         # Fetch wrapper
│   │   ├── dashboard.js   # Tab routing
│   │   ├── editor.js      # Form builders
│   │   └── ui.js          # UI utilities
│   └── css/
│       ├── login.css      # Login styles
│       └── dashboard.css  # Dashboard styles
└── sessions/              # Session files (created at runtime)
```

## API Endpoints

All endpoints except `POST /api/login` require authentication (valid session cookie).

### Authentication

- **POST /api/login** — Log in with username/password
- **POST /api/logout** — Destroy session and log out

### Content Management

- **GET /api/content** — Fetch current live config
- **PUT /api/content** — Save draft changes
- **GET /api/preview/config** — Fetch draft config (for preview mode)

### Publishing

- **POST /api/publish** — Publish draft to live config (creates backup)
- **GET /api/backups** — List last 5 backups with timestamps
- **POST /api/rollback** — Restore a previous backup

### Uploads

- **POST /api/upload** — Upload an image (jpg/png/webp, max 5MB)

Full API specification: See `specs/003-doctor-cms/contracts/api.md`

## Workflow

### Typical Admin Workflow

1. **Log in** → `/admin/login` with username/password
2. **Edit content** → Click tabs, modify fields, click "Save Draft"
3. **Preview changes** → Click "Preview" button (opens page with `?preview=1`)
4. **Publish** → Click "Publish" button (creates backup, updates live config)
5. **Verify** → Public website reflects changes immediately
6. **Rollback** (if needed) → Click "Rollback" tab, select previous version

### Draft-Publish Workflow

- **Save Draft**: Writes to `backups/content.draft.json` — live config untouched
- **Publish**: Creates backup of current live config, replaces `config/doctor-profile.json` with draft
- **Live**: Public website reads from `config/doctor-profile.json` on next page load

### Preview Mode

- Doctor clicks "Preview" button → Opens current page with `?preview=1`
- `assets/js/app.js` detects `?preview=1` → Fetches `/api/preview/config` instead of live config
- Admin session required to view preview
- Public site shows "Preview Mode — Not Published" banner

## Security Features

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ HTTP-only session cookie (no JavaScript access)
- ✅ CSRF protection on all state-changing endpoints
- ✅ Rate limiting: 5 failed login attempts → 15-minute lockout
- ✅ Image upload validation: extension + MIME type checks
- ✅ Filename sanitization: UUID prefix + special char removal
- ✅ Path traversal prevention on all file operations
- ✅ Atomic writes to prevent partial config files

## Troubleshooting

### Port 5050 already in use

```bash
# Find process using port 5050
lsof -i :5050
# Kill process (e.g., PID 1234)
kill -9 1234
```

### Session files not persisting

Ensure `cms/sessions/` directory is writable:

```bash
chmod 755 cms/sessions
```

### Uploads not visible on public site

Verify Nginx is proxying `/uploads/` to `localhost:5050`:

```nginx
location /uploads/ {
  proxy_pass http://localhost:5050/uploads/;
}
```

### Password not working

Regenerate password hash and verify it was copied correctly:

```bash
node -e "require('bcryptjs').hash('test', 10, (e,h) => { console.log('Hash:', h); })"
```

## Testing

Manual test scenarios provided in `specs/003-doctor-cms/quickstart.md`:

- S1: Correct login credentials
- S2: Wrong password lockout
- S3: Draft save without publish
- S4: Preview mode detection
- S5: Publish creates backup
- S6: Image upload validation
- S7: Testimonial CRUD
- S8: Rollback to previous version
- S9: Mobile usability (375px)
- S10: Concurrent edit handling

## Deployment

See `specs/003-doctor-cms/DEPLOYMENT.md` for production VPS setup.

## License

MIT

## Support

For issues or questions, refer to:
- Feature spec: `specs/003-doctor-cms/spec.md`
- API contracts: `specs/003-doctor-cms/contracts/api.md`
- Data model: `specs/003-doctor-cms/data-model.md`
