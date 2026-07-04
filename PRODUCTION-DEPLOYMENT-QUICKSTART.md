# Doctor CMS — Production Deployment Guide

**Your Situation**: You have a running doctor website and want to enable the admin to edit content through the CMS.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Your VPS Server                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐              ┌──────────────────┐ │
│  │   Nginx Port 80  │◄─────────────►│  Express Port    │ │
│  │    (Reverse      │   /admin/*    │  5050 (CMS)      │ │
│  │    Proxy)        │   /api/*      └──────────────────┘ │
│  │                  │   /uploads/*                       │
│  │  - Homepage      │                                    │
│  │  - Contact       │   ┌──────────────────┐             │
│  │  - Expertise     │◄──┤ Stored Config    │             │
│  │  - Gallery       │   │ (JSON files)     │             │
│  │  - etc.          │   └──────────────────┘             │
│  └──────────────────┘                                    │
│         ▲                    ┌──────────────────┐         │
│         │                    │  Uploaded Images │         │
│         │                    │ /uploads/ folder │         │
│         │                    └──────────────────┘         │
│    Doctor visits             ┌──────────────────┐         │
│    yourdomain.com            │ Admin Panel      │         │
│    and edits content          │ /admin/login     │         │
│                               └──────────────────┘         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Quick Deploy (10 Minutes)

### Prerequisites

Your VPS must have:
- Ubuntu 20.04+ (or similar Linux)
- Node.js 18+ LTS
- npm 9+
- Nginx
- Git

**Check prerequisites**:
```bash
ssh user@your-vps-ip

node --version     # Should be v18.x or higher
npm --version      # Should be 9.x or higher
nginx -v           # Should be installed
```

---

## Step 1: Clone & Navigate to Project

```bash
# Navigate to your project (wherever it's hosted)
cd /var/www/doctor-website
# or
cd /home/ubuntu/doctor-website

# Verify structure
ls -la  # Should show: index.html, admin/, assets/, config/, cms/, etc.
ls -la cms/  # Should show: server.js, package.json, routes/, services/, public/
```

---

## Step 2: Install Dependencies

```bash
cd cms/
npm install
```

This installs all required packages (express, session, bcryptjs, multer, helmet, etc.)

---

## Step 3: Generate Security Credentials

### Generate Admin Password Hash

Choose a strong password and generate its bcrypt hash:

```bash
node -e "require('bcryptjs').hash('MySecurePassword123!', 10, (e,h) => console.log(h))"
```

**Output**: `$2a$10$abc123def456...` (copy this entire string)

### Generate Session Secret

```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

**Output**: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6` (32-character hex string)

---

## Step 4: Create `.env` Configuration

```bash
# Create .env from template
cp .env.example .env

# Edit it
nano .env
```

**Fill in these values**:

```env
# Admin login
ADMIN_USERNAME=doctor
ADMIN_PASSWORD_HASH=$2a$10$abc123def456...  # Paste from Step 3

# Session signing key
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6  # From Step 3

# Server
PORT=5050
NODE_ENV=production

# Optional: Allow requests from your domain
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

**⚠️ IMPORTANT**: Never commit `.env` to git. It contains secrets.

---

## Step 5: Create Required Directories

```bash
# From cms/ directory
mkdir -p sessions
mkdir -p ../backups
mkdir -p ../uploads

# Set permissions (for Nginx user)
sudo chown -R www-data:www-data ../uploads/
sudo chown -R www-data:www-data sessions/
sudo chown -R www-data:www-data ../backups/
```

---

## Step 6: Test Locally Before Going Live

```bash
# Start the CMS
npm start

# In another terminal, test login
curl -X POST http://localhost:5050/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"doctor","password":"MySecurePassword123!"}'

# Expected response:
# {"ok":true,"message":"Logged in successfully"}

# If you see that, you're good! Press Ctrl+C to stop.
```

---

## Step 7: Configure Nginx (The Bridge)

Edit your Nginx config:

```bash
sudo nano /etc/nginx/sites-available/doctor-website
# or
sudo nano /etc/nginx/sites-available/default
```

**Add these blocks inside your `server { }` block**:

```nginx
# ========================================
# CMS Admin Panel
# ========================================
location /admin/ {
    proxy_pass http://localhost:5050;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_redirect off;
}

# ========================================
# CMS API Routes (login, content, publish)
# ========================================
location /api/ {
    proxy_pass http://localhost:5050;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_redirect off;
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}

# ========================================
# Uploaded Images (doctor photos, gallery)
# ========================================
location /uploads/ {
    proxy_pass http://localhost:5050;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_cache_valid 200 30d;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

**Validate Nginx**:

```bash
sudo nginx -t
# Should output:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration will be useful
```

**Reload Nginx**:

```bash
sudo systemctl reload nginx
```

---

## Step 8: Start CMS in Production

### Option A: PM2 (Recommended - Auto-Restart)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the CMS
cd /var/www/doctor-website/cms
sudo pm2 start server.js --name "doctor-cms"

# Auto-start on server reboot
sudo pm2 startup
sudo pm2 save

# Check status
pm2 list
pm2 logs doctor-cms
```

### Option B: Systemd Service

Create a service file:

```bash
sudo tee /etc/systemd/system/doctor-cms.service > /dev/null <<EOF
[Unit]
Description=Doctor CMS
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/doctor-website/cms
Environment="NODE_ENV=production"
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable doctor-cms
sudo systemctl start doctor-cms
sudo systemctl status doctor-cms
```

---

## Step 9: Test the Live Deployment

### Test 1: Admin Panel Loads

```
Visit: https://yourdomain.com/admin/
Expected: Login form with username/password fields
```

### Test 2: Login Works

```
Username: doctor
Password: MySecurePassword123! (whatever you set)
Expected: Redirect to dashboard with 9 content tabs
```

### Test 3: Edit Content

1. Click "Home" tab
2. Change something (e.g., doctor's headline)
3. Click "Save Draft"
4. Expected: Toast notification "Draft saved"

### Test 4: Preview Changes

1. Click "Preview & Publish" tab
2. Click "Preview" button
3. Expected: Website opens with yellow "Preview Mode" banner at top showing draft changes

### Test 5: Publish to Live

1. Return to dashboard
2. Click "Publish"
3. Confirm in dialog
4. Expected: Success message, live website now shows new content

---

## How It Works for Your Doctor

### Login & Dashboard

```
1. Doctor visits: yourdomain.com/admin/
2. Enters username & password
3. Sees dashboard with 9 tabs:
   - Home (hero image, headline, tagline)
   - About/Profile (bio, qualifications, experience)
   - Contact (phone, email, address, hours)
   - Treatments (list of services)
   - Expertise (specialties with descriptions)
   - Testimonials (patient reviews)
   - Gallery (photos)
   - SEO (meta tags, titles, descriptions)
   - Preview & Publish (test changes → publish)
```

### Editing Content

```
1. Doctor clicks a tab (e.g., "Home")
2. Edits form fields (headline, bio, etc.)
3. Clicks "Save Draft"
   → Changes saved to draft, NOT live yet
4. Clicks "Preview"
   → Website opens with draft changes visible
   → Yellow banner shows "Preview Mode — Not Published"
5. If satisfied, clicks "Publish"
   → Draft changes written to live config
   → Public website immediately shows new content
```

### Uploaded Images

```
1. Doctor clicks file input button
2. Selects image (.jpg, .png, .webp)
3. File uploaded to /uploads/ folder
4. Image URL auto-filled in form
5. Image serves publicly via yourdomain.com/uploads/image-name.jpg
```

### Rollback

```
If doctor makes a mistake:
1. Click "Preview & Publish" tab
2. Scroll to "Rollback" section
3. Select a backup timestamp
4. Click "Restore"
5. Live config reverted to that backup
```

---

## Website Now Reads from CMS

Your website HTML (index.html, contact.html, etc.) loads the config at runtime:

```javascript
// At page load, JavaScript fetches live config:
fetch('/api/content')
  .then(r => r.json())
  .then(data => {
    // Render doctor.name, doctor.headline, etc.
    document.title = data.config.seo.homepage.title;
    // ... populate all page content from config
  });
```

**Result**: When doctor publishes changes, website instantly reflects them.

---

## File Locations on VPS

```
/var/www/doctor-website/
├── index.html              # Public website homepage
├── contact.html            # Contact page
├── expertise.html          # Expertise listing
├── admin/                  # Admin dashboard files
├── assets/                 # CSS, JavaScript, images
├── config/
│   └── doctor-profile.json # LIVE config (what public sees)
├── cms/                    # Express.js server
│   ├── server.js
│   ├── package.json
│   ├── .env                # Contains secrets (gitignored)
│   ├── routes/
│   ├── services/
│   ├── public/
│   ├── middleware/
│   └── sessions/           # Session files (auto-managed)
├── backups/                # Config backups (timestamped JSON)
└── uploads/                # Uploaded images (public)
```

---

## Monitoring & Maintenance

### Check CMS Status

```bash
# If using PM2
pm2 list
pm2 logs doctor-cms

# If using systemd
sudo systemctl status doctor-cms
sudo journalctl -u doctor-cms -f
```

### Check if CMS is Responding

```bash
curl http://localhost:5050/health
# Expected: {"ok":true,"message":"CMS running"}
```

### Clear Old Sessions (Optional)

```bash
# Sessions accumulate; clear them periodically
rm -f /var/www/doctor-website/cms/sessions/*
```

### Update Admin Password

```bash
# Generate new hash
node -e "require('bcryptjs').hash('NewPassword123!', 10, (e,h) => console.log(h))"

# Edit .env
nano .env  # Update ADMIN_PASSWORD_HASH

# Restart CMS
pm2 restart doctor-cms
```

---

## SSL/HTTPS (Important!)

If your website is HTTPS (which it should be), CMS will work via Nginx proxy. However, ensure:

```nginx
# Your Nginx should already have SSL configured:
server {
    listen 443 ssl http2;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Then add the CMS location blocks above
}
```

**Certbot (Let's Encrypt) Setup**:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
# Certbot auto-configures HTTPS and redirects HTTP→HTTPS
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **502 Bad Gateway on /admin/** | CMS not running. Check: `pm2 list` or `sudo systemctl status doctor-cms` |
| **Login fails** | Verify password hash in `.env`. Re-generate if needed. |
| **Images don't upload** | Check permissions: `sudo chown -R www-data:www-data /var/www/doctor-website/uploads/` |
| **Changes don't appear on website** | Ensure website JavaScript is fetching from `/api/content`. Check browser DevTools Network tab. |
| **Port 5050 in use** | Change PORT in `.env` to 5051 and update Nginx proxy_pass. |
| **Can't connect to VPS** | Verify SSH: `ssh user@your-vps-ip`. Check firewall rules allow port 22 (SSH), 80 (HTTP), 443 (HTTPS). |

---

## Summary Checklist

```
DEPLOYMENT STEPS:
□ Step 1: Clone & navigate to cms/ directory
□ Step 2: Run npm install
□ Step 3: Generate password hash & session secret
□ Step 4: Create .env with credentials
□ Step 5: Create directories (sessions, backups, uploads)
□ Step 6: Test locally (npm start → curl login test)
□ Step 7: Update Nginx with 3 proxy blocks
□ Step 8: Start CMS (PM2 or systemd)
□ Step 9: Test live deployment

VERIFICATION:
□ https://yourdomain.com/admin/ loads login form
□ Login with doctor credentials works
□ Can edit content and save draft
□ Preview button shows draft changes with banner
□ Publish button updates live website
□ Images upload and display
□ Website config instantly reflects changes
```

---

## Your Doctor Can Now

✅ Login to `/admin/` to edit content  
✅ Save drafts without affecting live website  
✅ Preview changes before publishing  
✅ Upload photos (profile, gallery)  
✅ Edit all 9 content sections  
✅ Publish changes instantly  
✅ Rollback to previous backups  
✅ Everything updates live with zero downtime  

---

**Deployment Complete!** 🚀

For issues, check:
- `pm2 logs doctor-cms` (CMS logs)
- `sudo tail -f /var/log/nginx/error.log` (Nginx logs)
- Verify .env file has correct values
- Ensure directories exist and have right permissions
