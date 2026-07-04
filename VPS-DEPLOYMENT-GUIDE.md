# VPS Deployment Guide — Doctor CMS (Multi-Doctor)

**Date**: 2026-07-04 | **Target Domain**: smzentrix.info/doctor-cms/admin/

---

## TABLE OF CONTENTS

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [VPS Access & Initial Setup](#vps-access--initial-setup)
3. [Deploy CMS Application](#deploy-cms-application)
4. [Configure Nginx](#configure-nginx)
5. [Setup SSL/HTTPS](#setup-ssltls)
6. [Create Doctor Accounts](#create-doctor-accounts)
7. [Verify Deployment](#verify-deployment)
8. [Integrate Patient Websites](#integrate-patient-websites)
9. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Pre-Deployment Checklist

Before you start, gather:

- [ ] VPS IP address & SSH credentials (username, password/key)
- [ ] Domain: smzentrix.info (with DNS access)
- [ ] Doctor information:
  - [ ] Dr. Deepali's credentials (username, password)
  - [ ] Dr. Prashant's credentials (username, password)
  - [ ] Future doctors (if any)
- [ ] SSL certificate (Let's Encrypt recommended)
- [ ] Node.js version: 16.x or higher
- [ ] PM2 for process management
- [ ] Nginx for reverse proxy

---

## VPS Access & Initial Setup

### Step 1: Connect to VPS

```bash
# SSH into VPS
ssh root@YOUR_VPS_IP

# Or with SSH key
ssh -i /path/to/private/key root@YOUR_VPS_IP
```

### Step 2: Update System

```bash
apt update
apt upgrade -y
```

### Step 3: Install Node.js & npm

```bash
# Install NVM (Node Version Manager)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be v18.x or higher
npm --version
```

### Step 4: Install PM2 (Process Manager)

```bash
npm install -g pm2
pm2 startup
pm2 save
```

### Step 5: Install Nginx

```bash
apt-get install -y nginx

# Start Nginx
systemctl start nginx
systemctl enable nginx

# Verify
systemctl status nginx
```

### Step 6: Create Directory Structure

```bash
# Create web root
mkdir -p /var/www/smzentrix.info

# Navigate there
cd /var/www/smzentrix.info

# Create subdirectories
mkdir -p cms config backups uploads logs

# Set permissions
chown -R www-data:www-data /var/www/smzentrix.info
chmod -R 755 /var/www/smzentrix.info
```

---

## Deploy CMS Application

### Step 1: Upload CMS Files from Local Machine

From your **local machine** (Windows):

```powershell
# Using SCP to upload entire cms folder to VPS
scp -r "C:\Users\rahul\Project\Prashant-Website\cms" root@YOUR_VPS_IP:/var/www/smzentrix.info/

# Upload config folder
scp -r "C:\Users\rahul\Project\Prashant-Website\config" root@YOUR_VPS_IP:/var/www/smzentrix.info/

# Upload backups folder (with per-doctor structure)
scp -r "C:\Users\rahul\Project\Prashant-Website\backups" root@YOUR_VPS_IP:/var/www/smzentrix.info/
```

> **Note**: If SCP not available on Windows, use:
> - **WinSCP** (GUI tool) - https://winscp.net/
> - **PuTTY SCP** - https://www.putty.org/
> - Or use VS Code Remote SSH extension

### Step 2: Verify Files on VPS

```bash
# SSH into VPS
ssh root@YOUR_VPS_IP

# Navigate to project
cd /var/www/smzentrix.info

# List contents
ls -la
# Should show: cms/, config/, backups/, uploads/, logs/

# Check cms structure
ls -la cms/
# Should show: server.js, routes/, services/, public/, etc.
```

### Step 3: Install Dependencies

```bash
# Navigate to cms folder
cd /var/www/smzentrix.info/cms

# Install npm packages
npm install

# Verify package.json loaded correctly
npm list
```

### Step 4: Create Environment File

```bash
# Navigate to cms folder (if not already there)
cd /var/www/smzentrix.info/cms

# Create .env file
cat > .env << EOF
NODE_ENV=production
PORT=5050
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
EOF

# Verify
cat .env
```

### Step 5: Test CMS Locally on VPS

```bash
# From cms directory
cd /var/www/smzentrix.info/cms

# Run server temporarily to verify
node server.js

# You should see:
# "Doctor CMS server running on port 5050"

# Stop server (Ctrl+C)
```

### Step 6: Start CMS with PM2

```bash
# Navigate to cms folder
cd /var/www/smzentrix.info/cms

# Start with PM2
pm2 start server.js --name "doctor-cms"

# Save PM2 config for auto-restart on reboot
pm2 save

# Verify it's running
pm2 list
pm2 logs doctor-cms
```

---

## Configure Nginx

### Step 1: Create Nginx Config for smzentrix.info

```bash
# Create nginx config file
cat > /etc/nginx/sites-available/smzentrix.info << 'EOF'
upstream cms_backend {
    server 127.0.0.1:5050;
}

server {
    listen 80;
    server_name smzentrix.info www.smzentrix.info;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name smzentrix.info www.smzentrix.info;

    # SSL certificates (will update after Let's Encrypt setup)
    # ssl_certificate /etc/letsencrypt/live/smzentrix.info/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/smzentrix.info/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    # Logs
    access_log /var/www/smzentrix.info/logs/access.log;
    error_log /var/www/smzentrix.info/logs/error.log;

    # ============================================================
    # Admin Panel - Reverse Proxy to CMS
    # ============================================================
    location /doctor-cms/admin/ {
        proxy_pass http://cms_backend/admin/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Session timeout for long-running admin sessions
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }

    # ============================================================
    # API Routes - Reverse Proxy to CMS
    # ============================================================
    location /doctor-cms/api/ {
        proxy_pass http://cms_backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # ============================================================
    # Uploaded Files - Direct Access
    # ============================================================
    location /doctor-cms/uploads/ {
        alias /var/www/smzentrix.info/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # ============================================================
    # Default - Redirect to Admin
    # ============================================================
    location / {
        return 301 /doctor-cms/admin/;
    }
}
EOF
```

### Step 2: Enable the Nginx Config

```bash
# Create symlink to enable site
ln -s /etc/nginx/sites-available/smzentrix.info /etc/nginx/sites-enabled/smzentrix.info

# Test nginx config
nginx -t
# Should output: "syntax is ok" and "test is successful"

# Reload nginx
systemctl reload nginx
```

### Step 3: Point Domain to VPS

Go to your domain registrar (where smzentrix.info is registered):
1. Update DNS A record: `smzentrix.info` → your VPS IP address
2. Update DNS A record: `www.smzentrix.info` → your VPS IP address
3. Wait 5-30 minutes for DNS to propagate

Verify DNS:
```bash
# From your local machine
nslookup smzentrix.info
# Should show your VPS IP address
```

---

## Setup SSL/HTTPS

### Step 1: Install Certbot

```bash
apt-get install -y certbot python3-certbot-nginx
```

### Step 2: Generate SSL Certificate

```bash
# Obtain certificate from Let's Encrypt
certbot certonly --nginx -d smzentrix.info -d www.smzentrix.info

# Follow prompts:
# - Enter email address
# - Agree to terms
# - No for sharing email with EFF
```

### Step 3: Update Nginx Config with SSL Paths

```bash
# Edit the nginx config
nano /etc/nginx/sites-available/smzentrix.info

# Uncomment and verify these lines:
# ssl_certificate /etc/letsencrypt/live/smzentrix.info/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/smzentrix.info/privkey.pem;
```

### Step 4: Verify SSL & Reload Nginx

```bash
# Test config
nginx -t

# Reload
systemctl reload nginx

# Test HTTPS
curl https://smzentrix.info/doctor-cms/api/health
# Should return: {"ok": true, "message": "CMS running"}
```

### Step 5: Setup Auto-Renewal

```bash
# Certbot auto-renewal runs daily via cron
# Verify it's set up:
systemctl list-timers | grep certbot

# Optional: Test renewal (dry run)
certbot renew --dry-run
```

---

## Create Doctor Accounts

### Step 1: Generate Password Hashes for Doctors

On **VPS** (or local machine with Node.js):

```bash
# SSH to VPS if doing this there
ssh root@YOUR_VPS_IP

# Generate hash for Dr. Deepali
node -e "require('bcryptjs').hash('deepali_password_123', 10, (e,h) => console.log('Dr. Deepali hash:', h))"

# Generate hash for Dr. Prashant
node -e "require('bcryptjs').hash('prashant_password_456', 10, (e,h) => console.log('Dr. Prashant hash:', h))"

# Generate hash for any additional doctors
node -e "require('bcryptjs').hash('new_doctor_password', 10, (e,h) => console.log('New doctor hash:', h))"
```

**Copy the output hashes** — you'll need them in the next step.

### Step 2: Create/Update doctors-list.json on VPS

```bash
# SSH to VPS
ssh root@YOUR_VPS_IP

# Navigate to config directory
cd /var/www/smzentrix.info/config

# Create doctors-list.json with real doctors
cat > doctors-list.json << 'EOF'
{
  "doctors": [
    {
      "id": "deepali",
      "name": "Dr. Deepali Shinde",
      "username": "deepali",
      "password_hash": "PASTE_DEEPALI_HASH_HERE",
      "specialty": "Dental Surgery",
      "config_file": "config/deepali-profile.json"
    },
    {
      "id": "prashant",
      "name": "Dr. Prashant Pawar",
      "username": "prashant",
      "password_hash": "PASTE_PRASHANT_HASH_HERE",
      "specialty": "General Medicine",
      "config_file": "config/prashant-profile.json"
    }
  ]
}
EOF
```

### Step 3: Customize Doctor Configs

```bash
# SSH to VPS
ssh root@YOUR_VPS_IP

# Navigate to config
cd /var/www/smzentrix.info/config

# Edit Dr. Deepali's config
nano deepali-profile.json
# - Change doctor.name, email, phone, specialties, etc.
# - Add her clinic address, qualifications, services
# - Save (Ctrl+X, Y, Enter)

# Edit Dr. Prashant's config
nano prashant-profile.json
# - Change doctor.name, email, phone, specialties, etc.
# - Add his clinic address, qualifications, services
# - Save

# Verify both exist
ls -la *-profile.json
```

### Step 4: Set Correct Permissions

```bash
# Ensure www-data can read/write configs
chown -R www-data:www-data /var/www/smzentrix.info/config
chown -R www-data:www-data /var/www/smzentrix.info/backups
chown -R www-data:www-data /var/www/smzentrix.info/uploads

chmod -R 755 /var/www/smzentrix.info/config
chmod -R 755 /var/www/smzentrix.info/backups
chmod -R 755 /var/www/smzentrix.info/uploads
```

### Step 5: Restart CMS

```bash
# Restart CMS to load new doctor configs
pm2 restart doctor-cms

# Check logs for any errors
pm2 logs doctor-cms
```

---

## Verify Deployment

### Step 1: Test CMS Health

```bash
# From your local machine
curl https://smzentrix.info/api/health

# Expected response:
# {"ok":true,"message":"CMS running"}
```

### Step 2: Test Doctor Login (Dr. Deepali)

```bash
# From your local machine
curl -X POST https://smzentrix.info/doctor-cms/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"deepali","password":"deepali_password_123"}'

# Expected response:
# {"ok":true,"message":"Logged in successfully","doctor":{"id":"deepali","name":"Dr. Deepali Shinde","specialty":"Dental Surgery"}}
```

### Step 3: Test Doctor Login (Dr. Prashant)

```bash
curl -X POST https://smzentrix.info/doctor-cms/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"prashant","password":"prashant_password_456"}'

# Expected response:
# {"ok":true,"message":"Logged in successfully","doctor":{"id":"prashant","name":"Dr. Prashant Pawar","specialty":"General Medicine"}}
```

### Step 4: Test Public API (Get Dr. Deepali's Config)

```bash
curl https://smzentrix.info/doctor-cms/api/public/config/deepali

# Expected response:
# JSON object with doctor's full config (name, services, testimonials, etc.)
```

### Step 5: Access Admin Panel from Browser

1. Open browser: `https://smzentrix.info/doctor-cms/admin/`
2. Login with:
   - **Username**: deepali
   - **Password**: deepali_password_123
3. Verify you see the CMS dashboard
4. Logout and test with prashant credentials

### Step 6: Check PM2 Status

```bash
# SSH to VPS
ssh root@YOUR_VPS_IP

# Check if doctor-cms is running
pm2 list

# Should show:
# id │ name        │ namespace   │ version │ mode    │ pid      │ ...
# 0  │ doctor-cms  │ default     │ 1.0.0   │ fork    │ 12345   │ online
```

---

## Integrate Patient Websites

### For Dr. Deepali's Website

If her website is at `/var/www/drdeepalishinde.smzentrix.info/`:

**Modify assets/js/app.js** (or equivalent):

```javascript
// Before: Hardcoded config
// const config = {
//   "doctor": { "name": "Dr. Deepali Shinde", ... },
//   ...
// };

// After: Fetch from CMS
async function loadDoctorConfig() {
  try {
    const response = await fetch('https://smzentrix.info/doctor-cms/api/public/config/deepali');
    const data = await response.json();
    
    if (data.ok) {
      const config = data.config;
      
      // Update page with fetched config
      document.getElementById('doctorName').textContent = config.doctor.name;
      document.getElementById('specialty').textContent = config.doctor.specialty;
      document.getElementById('email').href = 'mailto:' + config.doctor.email;
      document.getElementById('phone').href = 'tel:' + config.doctor.phone;
      
      // Render services, testimonials, expertise, gallery from config
      renderServices(config.services);
      renderTestimonials(config.testimonials);
      renderExpertise(config.expertise);
      renderGallery(config.gallery);
    }
  } catch (error) {
    console.error('Failed to load config:', error);
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', loadDoctorConfig);
```

### For Dr. Prashant's Website

If he has his own domain `drprashantpawar.com`:

**Modify the site's JavaScript** (enable CORS on the public endpoint):

Verify Nginx allows CORS:
```bash
# In /etc/nginx/sites-available/smzentrix.info
location /doctor-cms/api/public/ {
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, OPTIONS" always;
    proxy_pass http://cms_backend;
}
```

Then in his website's JavaScript:
```javascript
async function loadDoctorConfig() {
  try {
    // Cross-origin fetch from drprashantpawar.com
    const response = await fetch('https://smzentrix.info/doctor-cms/api/public/config/prashant');
    const data = await response.json();
    
    if (data.ok) {
      // Same rendering logic as Dr. Deepali
      const config = data.config;
      document.getElementById('doctorName').textContent = config.doctor.name;
      // ... etc
    }
  } catch (error) {
    console.error('Failed to load config:', error);
  }
}

document.addEventListener('DOMContentLoaded', loadDoctorConfig);
```

---

## Monitoring & Maintenance

### Monitor CMS

```bash
# SSH to VPS
ssh root@YOUR_VPS_IP

# View real-time logs
pm2 logs doctor-cms

# View log file
tail -f /var/www/smzentrix.info/logs/error.log
tail -f /var/www/smzentrix.info/logs/access.log

# Monitor system resources
pm2 monit
```

### Backup Strategies

Create a backup script:

```bash
# Create backup script
cat > /home/backup-cms.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/var/backups/cms-backups"
mkdir -p $BACKUP_DIR

# Backup config, backups, and uploads
tar -czf $BACKUP_DIR/cms-backup-$(date +%Y%m%d-%H%M%S).tar.gz \
  /var/www/smzentrix.info/config/ \
  /var/www/smzentrix.info/backups/ \
  /var/www/smzentrix.info/uploads/

# Keep only last 10 backups
ls -1t $BACKUP_DIR/cms-backup-*.tar.gz | tail -n +11 | xargs rm -f

echo "Backup completed: $BACKUP_DIR"
EOF

chmod +x /home/backup-cms.sh

# Schedule daily backup at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /home/backup-cms.sh") | crontab -
```

### Update Node.js Packages (If Needed)

```bash
# SSH to VPS
ssh root@YOUR_VPS_IP

# Check for updates
cd /var/www/smzentrix.info/cms
npm outdated

# Update packages safely
npm update

# Test CMS still runs
pm2 restart doctor-cms
pm2 logs doctor-cms
```

### Add a New Doctor (After Deployment)

```bash
# SSH to VPS
ssh root@YOUR_VPS_IP

# Step 1: Generate hash for new doctor
node -e "require('bcryptjs').hash('new_password_123', 10, (e,h) => console.log(h))"

# Step 2: Edit doctors-list.json
cd /var/www/smzentrix.info/config
nano doctors-list.json

# Add new entry:
# {
#   "id": "newdoctor",
#   "name": "Dr. New Doctor",
#   "username": "newdoctor",
#   "password_hash": "PASTE_HASH",
#   "specialty": "...",
#   "config_file": "config/newdoctor-profile.json"
# }

# Step 3: Create new doctor's config
cp doctor-profile.json newdoctor-profile.json
nano newdoctor-profile.json  # Edit with their info

# Step 4: Create backup directory
mkdir -p /var/www/smzentrix.info/backups/newdoctor

# Step 5: Restart CMS
pm2 restart doctor-cms
```

---

## Troubleshooting

### CMS not starting?

```bash
# Check logs
pm2 logs doctor-cms

# Common issues:
# 1. Missing dependencies: npm install
# 2. Wrong permissions: chown -R www-data:www-data /var/www/smzentrix.info
# 3. Port 5050 in use: lsof -i :5050
```

### Cannot access smzentrix.info?

```bash
# Check DNS resolution
nslookup smzentrix.info

# Check Nginx status
systemctl status nginx

# Check Nginx config
nginx -t

# Check if CMS is running
pm2 list

# Check firewall
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
```

### Login fails?

```bash
# Verify doctor in doctors-list.json
cat /var/www/smzentrix.info/config/doctors-list.json

# Verify bcryptjs is installed
cd /var/www/smzentrix.info/cms && npm list bcryptjs

# Test password manually
node -e "const b = require('bcryptjs'); b.compare('password', 'hash', (e,r) => console.log(r))"
```

### SSL certificate issues?

```bash
# Check certificate
certbot certificates

# Renew manually
certbot renew

# Check Nginx SSL config
openssl s_client -connect smzentrix.info:443 -tls1_2
```

---

## Deployment Summary

| Item | Status |
|------|--------|
| VPS Setup | ✅ Node.js, npm, PM2, Nginx |
| CMS Deployed | ✅ /var/www/smzentrix.info/cms |
| Domain | ✅ smzentrix.info/admin/ |
| SSL/HTTPS | ✅ Let's Encrypt certificate |
| Doctor Logins | ✅ deepali, prashant (+ unlimited more) |
| Admin Panel | ✅ https://smzentrix.info/admin/ |
| Public API | ✅ https://smzentrix.info/api/public/config/{doctorId} |
| Patient Websites | ⏳ Integration pending |

---

## Quick Reference Commands

```bash
# Connect to VPS
ssh root@YOUR_VPS_IP

# CMS management
pm2 list                          # See running processes
pm2 logs doctor-cms               # View logs
pm2 restart doctor-cms            # Restart CMS
pm2 stop doctor-cms               # Stop CMS
pm2 start doctor-cms              # Start CMS

# Check services
systemctl status nginx            # Nginx status
systemctl status certbot.timer    # SSL auto-renewal

# Navigate
cd /var/www/smzentrix.info        # Project root
cd /var/www/smzentrix.info/cms    # CMS folder
cd /var/www/smzentrix.info/config # Doctors config

# Edit files
nano doctors-list.json            # Edit doctor registry
nano deepali-profile.json         # Edit Dr. Deepali's config
nano prashant-profile.json        # Edit Dr. Prashant's config

# Test endpoints
curl https://smzentrix.info/api/health
curl https://smzentrix.info/api/public/config/deepali
```

---

**You're all set!** Follow these steps in order and your multi-doctor CMS will be live. 🚀

Questions? Check `/var/www/smzentrix.info/logs/` for detailed error messages.
