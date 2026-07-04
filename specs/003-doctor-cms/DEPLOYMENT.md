# Doctor CMS — Deployment Guide

**Target**: Ubuntu 20.04+ VPS with Nginx and Node.js 18+ LTS

---

## Prerequisites

- SSH access to VPS
- Root or sudo privileges
- Nginx installed and running
- Node.js 18+ LTS installed
- npm installed
- Git installed

### Quick Setup Check

```bash
# SSH to your VPS
ssh user@your-vps-ip

# Verify prerequisites
node --version          # Should be v18.x or higher
npm --version          # Should be 9.x or higher
nginx -v               # Should be installed
git --version          # Should be installed
```

---

## Step 1: Clone Repository & Navigate to CMS

```bash
# Navigate to your project root (e.g., /var/www/doctor-website)
cd /var/www/doctor-website

# Verify the cms/ directory exists
ls -la cms/

# Navigate into cms/
cd cms/
```

---

## Step 2: Install Dependencies

```bash
npm install
```

This installs all runtime dependencies listed in `cms/package.json`:
- express@^4.18.2
- express-session@^1.17.3
- session-file-store@^1.5.0
- multer@^1.4.5
- bcryptjs@^2.4.3
- uuid@^9.0.0
- express-rate-limit@^6.7.0
- dotenv@^16.0.3
- helmet@^7.0.0
- cors@^2.8.5

**Verify installation**:
```bash
ls -la node_modules/ | head -20
npm list --depth=0
```

---

## Step 3: Generate Admin Password Hash

The CMS uses bcrypt for password hashing. Generate a secure hash for your admin password:

```bash
# Choose a strong password and run:
node -e "require('bcryptjs').hash('YOUR_STRONG_PASSWORD_HERE', 10, (e,h) => console.log(h))"

# Example output: $2a$10$abcd1234efgh5678ijkl9012mnopqrstu...
```

**Copy the output hash** — you'll need it in the next step.

---

## Step 4: Create .env Configuration File

Copy the template and fill in real values:

```bash
cp .env.example .env
nano .env    # or use your preferred editor: vim, vi, etc.
```

Fill in these values:

```env
# .env
ADMIN_USERNAME=doctor
ADMIN_PASSWORD_HASH=$2a$10$abcd1234efgh5678ijkl9012mnopqrstu...  # Paste hash from Step 3
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q  # 32-char hex string
PORT=5050
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

### Generating SESSION_SECRET

If you don't have a 32-character hex string, generate one:

```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

Example output: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

---

## Step 5: Create Required Directories

```bash
# From cms/ directory
mkdir -p sessions
mkdir -p ../backups
mkdir -p ../uploads

# Verify
ls -la sessions/
ls -la ../backups/
ls -la ../uploads/
```

These directories store:
- `sessions/` — Express session files (automatically managed, can be cleared between restarts)
- `../backups/` — Timestamped config backups (e.g., `config.2026-07-03T14-30-00.json`)
- `../uploads/` — Doctor-uploaded images (profile photos, gallery images)

---

## Step 6: Test CMS Locally

Start the CMS server on localhost:5050 to verify configuration:

```bash
# From cms/ directory
npm start
```

Expected output:
```
[2026-07-03T14:30:00.123Z] Server running on port 5050
```

### Test Login

1. Open browser: `http://localhost:5050/admin/login`
2. Enter:
   - **Username**: `doctor` (or your ADMIN_USERNAME)
   - **Password**: The password you hashed in Step 3
3. Click "Login"

**Expected result**: Redirect to dashboard (if correct credentials) or error message (if wrong)

### Stop Server

```
Press Ctrl+C
```

---

## Step 7: Update Nginx Configuration

Edit your Nginx config to add CMS proxy blocks:

```bash
sudo nano /etc/nginx/sites-available/doctor-website
```

Add these location blocks (already in the main nginx.conf if you've updated it):

```nginx
# ---- CMS Admin Panel ----
location /admin/ {
    proxy_pass http://localhost:5050;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_redirect off;
}

# ---- CMS API Routes ----
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

# ---- Uploaded Images ----
location /uploads/ {
    proxy_pass http://localhost:5050;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_redirect off;
    expires 30d;
    add_header Cache-Control "public, immutable, no-transform";
}
```

**Validate Nginx config**:

```bash
sudo nginx -t
```

Expected output:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration will be useful
```

**Reload Nginx**:

```bash
sudo systemctl reload nginx
```

---

## Step 8: Start CMS in Production

### Option A: Node.js directly (for testing)

```bash
cd /var/www/doctor-website/cms
NODE_ENV=production npm start
```

### Option B: PM2 (Recommended for Production)

PM2 auto-restarts your service if it crashes.

#### Install PM2 globally

```bash
sudo npm install -g pm2
```

#### Start CMS with PM2

```bash
cd /var/www/doctor-website/cms
sudo pm2 start server.js --name "doctor-cms" --env production
```

#### Set PM2 to auto-start on reboot

```bash
sudo pm2 startup
# Follow the command it outputs
sudo pm2 save
```

#### Monitor CMS

```bash
pm2 list                    # Show running apps
pm2 logs doctor-cms         # View real-time logs
pm2 stop doctor-cms         # Stop the service
pm2 restart doctor-cms      # Restart the service
```

### Option C: Systemd Service (Alternative)

Create `/etc/systemd/system/doctor-cms.service`:

```bash
sudo nano /etc/systemd/system/doctor-cms.service
```

Add:

```ini
[Unit]
Description=Doctor CMS - Node.js Express Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/doctor-website/cms
Environment="NODE_ENV=production"
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable doctor-cms
sudo systemctl start doctor-cms

# Check status
sudo systemctl status doctor-cms
sudo journalctl -u doctor-cms -f    # View logs
```

---

## Step 9: Verify Deployment

### Test Admin Panel

```bash
# From any browser:
https://yourdomain.com/admin/

# Expected: Login form
```

### Test API Endpoint

```bash
curl -X GET https://yourdomain.com/api/content
# Expected: 401 Unauthorized (because not authenticated)
```

### Test Upload Endpoint

```bash
curl -X POST https://yourdomain.com/api/upload \
  -F "file=@/path/to/test.jpg"
# Expected: 401 Unauthorized (because not authenticated)
```

### Full Workflow Test

1. **Login**: https://yourdomain.com/admin/login
2. **Edit draft**: Change doctor name → Save Draft
3. **Preview**: Click Preview → See draft banner
4. **Publish**: Click Publish → View live website, verify changes
5. **Rollback**: Go to Rollback tab → Restore previous version

---

## Troubleshooting

### Issue: `npm install` fails

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Retry
npm install
```

### Issue: CMS won't start on port 5050

**Check what's using port 5050**:
```bash
sudo lsof -i :5050
sudo netstat -tlnp | grep 5050
```

**Kill process if needed**:
```bash
sudo kill -9 <PID>
```

**Or change port**:
```bash
# In .env
PORT=5051
```

### Issue: 401 errors when accessing /api/

**This is normal**. The API requires authentication. Test with login first:
```bash
# 1. POST /api/login with username/password
curl -X POST https://yourdomain.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"doctor","password":"YOUR_PASSWORD"}'

# 2. Then use the session cookie with -b flag for subsequent requests
```

### Issue: Nginx proxy returns 502 Bad Gateway

**Verify CMS is running**:
```bash
pm2 list
# or
curl http://localhost:5050/health
```

**Check Nginx logs**:
```bash
sudo tail -f /var/log/nginx/doctor-website.error.log
```

**Restart Nginx**:
```bash
sudo systemctl restart nginx
```

### Issue: File uploads fail

**Verify directories exist**:
```bash
ls -la /var/www/doctor-website/uploads/
ls -la /var/www/doctor-website/cms/sessions/
```

**Check permissions**:
```bash
sudo chown -R www-data:www-data /var/www/doctor-website/uploads/
sudo chown -R www-data:www-data /var/www/doctor-website/cms/sessions/
```

---

## Maintenance

### Clear Old Sessions

Sessions accumulate in `cms/sessions/`. Clear them regularly:

```bash
rm -f /var/www/doctor-website/cms/sessions/*
```

### Backup Your Backups

The CMS creates automatic backups in `backups/`. Keep these safe:

```bash
# Backup to external storage
tar -czf backups-$(date +%Y%m%d).tar.gz /var/www/doctor-website/backups/
```

### Update .env if Password Changes

```bash
# Generate new hash
node -e "require('bcryptjs').hash('NEW_PASSWORD', 10, (e,h) => console.log(h))"

# Update .env
nano .env  # Change ADMIN_PASSWORD_HASH

# Restart CMS
pm2 restart doctor-cms
```

### Monitor CMS Health

```bash
# Check if CMS is responding
curl http://localhost:5050/health

# Expected response:
# {"ok":true,"message":"CMS running"}
```

---

## Summary Checklist

- [ ] SSH access verified
- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] `npm install` completed
- [ ] Password hash generated
- [ ] `.env` file created with real values
- [ ] Directories created: `sessions/`, `backups/`, `uploads/`
- [ ] Local test successful
- [ ] Nginx config updated with 3 proxy blocks
- [ ] Nginx config validated with `nginx -t`
- [ ] Nginx reloaded
- [ ] CMS started (PM2 or systemd)
- [ ] Login test passed
- [ ] Full workflow test passed (edit → preview → publish)

**Deployment Complete!** 🎉

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review CMS README at `cms/README.md`
3. Check logs: `pm2 logs doctor-cms` or `sudo journalctl -u doctor-cms`
4. Test endpoints manually with curl

---

**Last Updated**: 2026-07-03
**Version**: 1.0
