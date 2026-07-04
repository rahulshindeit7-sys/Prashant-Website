# Quickstart & Validation Guide: Doctor CMS

**Phase 1 Output** | Feature: `003-doctor-cms` | Date: 2026-07-03

---

## Prerequisites

- Node.js 18+ installed on the VPS
- Nginx installed and serving the static website
- `config/doctor-profile.json` exists and is valid JSON
- SSH access to the VPS (for deployment)

---

## Installation

### 1. Install CMS dependencies

```bash
cd cms/
npm install
```

### 2. Generate password hash and create .env

```bash
node -e "require('bcryptjs').hash('YOUR_CHOSEN_PASSWORD', 10, (e,h) => console.log('ADMIN_PASSWORD_HASH=' + h))"
```

Copy the output, then:

```bash
cp .env.example .env
# Edit .env and set:
# ADMIN_USERNAME=doctor
# ADMIN_PASSWORD_HASH=<paste hash here>
# SESSION_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
# PORT=5050
# NODE_ENV=production
```

### 3. Create required directories

```bash
mkdir -p ../backups ../uploads cms/sessions
```

### 4. Start the CMS server

**Development:**
```bash
cd cms && npm run dev
# Server starts on http://localhost:5050
```

**Production (with PM2):**
```bash
npm install -g pm2
cd cms && pm2 start server.js --name doctor-cms
pm2 save
pm2 startup   # enables auto-start on reboot
```

### 5. Update Nginx config

Add the proxy blocks from [contracts/api.md](../contracts/api.md) to `nginx.conf` inside the `server {}` block for port 443, then:

```bash
sudo nginx -t          # test config
sudo nginx -s reload   # apply
```

---

## Validation Scenarios

### Scenario 1 — Login Works

1. Navigate to `https://yourdomain.com/admin/`
2. Enter correct username and password
3. **Expected**: Redirected to `/admin/dashboard`; session cookie `cms_session` set

### Scenario 2 — Wrong Password Rejected

1. Navigate to `/admin/login`
2. Enter wrong password 3 times
3. **Expected**: Each attempt returns "Invalid username or password"; no session created
4. Enter wrong password 5 times in 15 minutes
5. **Expected**: 6th attempt returns "Too many attempts. Try again in 15 minutes."

### Scenario 3 — Save Draft (Live Site Unchanged)

1. Log in to admin panel
2. Change the doctor phone number in the Contact tab
3. Click **Save Draft**
4. **Expected**: Success toast; `backups/content.draft.json` updated
5. Open `config/doctor-profile.json` — **Expected**: Phone number unchanged
6. Open the live website — **Expected**: Old phone number still showing

### Scenario 4 — Preview Shows Draft Changes

1. After Scenario 3 (draft saved with new phone)
2. Click **Preview** button → opens `https://yourdomain.com/contact.html?preview=1`
3. **Expected**: Page shows NEW phone number
4. **Expected**: Yellow banner at top reads "Preview Mode — Not Published"

### Scenario 5 — Publish Updates Live Website

1. After Scenario 4 (draft with new phone)
2. In admin panel, click **Publish** → confirm dialog
3. **Expected**: Success toast with timestamp
4. **Expected**: `backups/config.{timestamp}.json` created (backup of old config)
5. Open live website contact page (no `?preview=1`)
6. **Expected**: NEW phone number showing on live site

### Scenario 6 — Upload Photo

1. In admin panel, go to Gallery tab
2. Click **Upload Photo**, select a `.jpg` file under 5MB
3. **Expected**: Upload succeeds; URL `/uploads/{uuid}-filename.jpg` returned
4. Image should be accessible at `https://yourdomain.com/uploads/{uuid}-filename.jpg`

### Scenario 7 — Upload Rejected (Wrong Type)

1. In admin panel, attempt to upload a `.svg` file
2. **Expected**: Error message "Invalid file type. Allowed: jpg, jpeg, png, webp"
3. Attempt to upload a `.js` file
4. **Expected**: Same rejection message; file NOT stored on server

### Scenario 8 — Rollback Restores Old Content

1. After Scenario 5 (phone number published)
2. In admin panel, go to **Preview & Publish** tab → **Rollback**
3. **Expected**: List shows at least 1 backup with timestamp and doctor name
4. Click **Restore** on the oldest backup → confirm
5. **Expected**: `config/doctor-profile.json` reverted to pre-publish state
6. **Expected**: Live website shows old phone number immediately

### Scenario 9 — Unauthenticated Access Blocked

1. Without logging in, call `GET /api/content` directly
2. **Expected**: `401 Unauthorized`
3. Navigate to `/admin/dashboard` without session
4. **Expected**: Redirected to `/admin/login`

### Scenario 10 — Mobile Usability

1. Open admin panel on 375px viewport (mobile)
2. Navigate to Contact tab, edit phone number, save draft
3. **Expected**: All form fields accessible and usable without horizontal scroll
4. **Expected**: Save Draft button visible and tappable

---

## Expected File Structure After Setup

```
/var/www/doctor-website/
├── config/
│   └── doctor-profile.json          # Live config (public)
├── backups/
│   ├── content.draft.json           # Current draft (created after first Save Draft)
│   └── config.2026-07-03T14-35-00.json  # Backup created on publish
├── uploads/
│   └── a1b2c3-clinic-photo.jpg      # Uploaded image
└── cms/
    ├── .env                          # Credentials (never in git)
    ├── server.js
    ├── sessions/                     # Session files
    ├── package.json
    └── public/
        ├── login.html
        └── dashboard.html
```
