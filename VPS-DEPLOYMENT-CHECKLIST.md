# VPS Deployment Checklist — Doctor CMS

**Domain**: smzentrix.info/doctor-cms/admin/ | **Status**: Ready for Deployment

---

## PHASE 1: VPS SETUP (15 minutes)

- [ ] **SSH into VPS** → `ssh root@YOUR_VPS_IP`
- [ ] **Update system** → `apt update && apt upgrade -y`
- [ ] **Install Node.js** → `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && apt-get install -y nodejs`
- [ ] **Verify Node.js** → `node --version` (should be v18+)
- [ ] **Install PM2** → `npm install -g pm2 && pm2 startup && pm2 save`
- [ ] **Install Nginx** → `apt-get install -y nginx && systemctl start nginx && systemctl enable nginx`
- [ ] **Create directories** → 
  ```bash
  mkdir -p /var/www/smzentrix.info/{cms,config,backups,uploads,logs}
  chown -R www-data:www-data /var/www/smzentrix.info
  chmod -R 755 /var/www/smzentrix.info
  ```

---

## PHASE 2: UPLOAD CMS FILES (10 minutes)

From **your local machine** (Windows PowerShell):

- [ ] **Upload cms folder**
  ```powershell
  scp -r "C:\Users\rahul\Project\Prashant-Website\cms" root@YOUR_VPS_IP:/var/www/smzentrix.info/
  ```

- [ ] **Upload config folder**
  ```powershell
  scp -r "C:\Users\rahul\Project\Prashant-Website\config" root@YOUR_VPS_IP:/var/www/smzentrix.info/
  ```

- [ ] **Upload backups folder**
  ```powershell
  scp -r "C:\Users\rahul\Project\Prashant-Website\backups" root@YOUR_VPS_IP:/var/www/smzentrix.info/
  ```

> **Alternative**: Use **WinSCP** (GUI) if SCP not available

- [ ] **Verify files on VPS**
  ```bash
  ssh root@YOUR_VPS_IP
  ls -la /var/www/smzentrix.info/
  # Should show: cms/, config/, backups/, uploads/, logs/
  ```

---

## PHASE 3: INSTALL & RUN CMS (5 minutes)

- [ ] **Install npm dependencies**
  ```bash
  cd /var/www/smzentrix.info/cms
  npm install
  ```

- [ ] **Create .env file**
  ```bash
  cat > .env << EOF
  NODE_ENV=production
  PORT=5050
  SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
  EOF
  ```

- [ ] **Test CMS** → `node server.js`
  - Should show: "Doctor CMS server running on port 5050"
  - Stop with Ctrl+C

- [ ] **Start with PM2**
  ```bash
  pm2 start server.js --name "doctor-cms"
  pm2 save
  pm2 list  # Verify it shows "online"
  ```

---

## PHASE 4: NGINX CONFIGURATION (5 minutes)

- [ ] **Create Nginx config**
  ```bash
  # Copy the exact config from VPS-DEPLOYMENT-GUIDE.md
  # Section "Configure Nginx" → Step 1
  nano /etc/nginx/sites-available/smzentrix.info
  ```

- [ ] **Enable site**
  ```bash
  ln -s /etc/nginx/sites-available/smzentrix.info /etc/nginx/sites-enabled/smzentrix.info
  nginx -t  # Should show "syntax is ok"
  systemctl reload nginx
  ```

---

## PHASE 5: DOMAIN & SSL (20 minutes)

- [ ] **Point domain to VPS**
  - Go to your domain registrar (where smzentrix.info is registered)
  - Update DNS A record: `smzentrix.info` → YOUR_VPS_IP
  - Update DNS A record: `www.smzentrix.info` → YOUR_VPS_IP
  - Wait 5-30 minutes for propagation
  - Verify: `nslookup smzentrix.info`

- [ ] **Install SSL (Let's Encrypt)**
  ```bash
  apt-get install -y certbot python3-certbot-nginx
  certbot certonly --nginx -d smzentrix.info -d www.smzentrix.info
  ```

- [ ] **Update Nginx config with SSL paths**
  ```bash
  nano /etc/nginx/sites-available/smzentrix.info
  
  # Uncomment these lines:
  # ssl_certificate /etc/letsencrypt/live/smzentrix.info/fullchain.pem;
  # ssl_certificate_key /etc/letsencrypt/live/smzentrix.info/privkey.pem;
  ```

- [ ] **Reload Nginx**
  ```bash
  nginx -t
  systemctl reload nginx
  ```

---

## PHASE 6: CREATE DOCTOR ACCOUNTS (10 minutes)

**On VPS**:

- [ ] **Generate password hashes**
  ```bash
  # Dr. Deepali
  node -e "require('bcryptjs').hash('YOUR_DEEPALI_PASSWORD', 10, (e,h) => console.log('Deepali:', h))"
  
  # Dr. Prashant
  node -e "require('bcryptjs').hash('YOUR_PRASHANT_PASSWORD', 10, (e,h) => console.log('Prashant:', h))"
  ```
  **Copy the hashes** ↓

- [ ] **Create doctors-list.json**
  ```bash
  cd /var/www/smzentrix.info/config
  
  cat > doctors-list.json << 'EOF'
  {
    "doctors": [
      {
        "id": "deepali",
        "name": "Dr. Deepali Shinde",
        "username": "deepali",
        "password_hash": "PASTE_DEEPALI_HASH_HERE",
        "specialty": "Dental Surgery"
      },
      {
        "id": "prashant",
        "name": "Dr. Prashant Pawar",
        "username": "prashant",
        "password_hash": "PASTE_PRASHANT_HASH_HERE",
        "specialty": "General Medicine"
      }
    ]
  }
  EOF
  ```

- [ ] **Customize doctor configs**
  ```bash
  # Edit Dr. Deepali's config
  nano deepali-profile.json
  # Change: doctor.name, email, phone, specialties, etc.
  
  # Edit Dr. Prashant's config
  nano prashant-profile.json
  # Change: doctor.name, email, phone, specialties, etc.
  ```

- [ ] **Set permissions**
  ```bash
  chown -R www-data:www-data /var/www/smzentrix.info/config
  chmod -R 755 /var/www/smzentrix.info/config
  ```

- [ ] **Restart CMS**
  ```bash
  pm2 restart doctor-cms
  pm2 logs doctor-cms  # Wait for "Doctor CMS server running on port 5050"
  ```

---

## PHASE 7: VERIFICATION (5 minutes)

- [ ] **Test CMS Health**
  ```bash
  curl https://smzentrix.info/doctor-cms/api/health
  # Response: {"ok":true,"message":"CMS running"}
  ```

- [ ] **Test Dr. Deepali Login**
  ```bash
  curl -X POST https://smzentrix.info/doctor-cms/api/login \
    -H "Content-Type: application/json" \
    -d '{"username":"deepali","password":"YOUR_DEEPALI_PASSWORD"}'
  # Response: {"ok":true,"message":"Logged in successfully",...}
  ```

- [ ] **Test Dr. Prashant Login**
  ```bash
  curl -X POST https://smzentrix.info/doctor-cms/api/login \
    -H "Content-Type: application/json" \
    -d '{"username":"prashant","password":"YOUR_PRASHANT_PASSWORD"}'
  # Response: {"ok":true,"message":"Logged in successfully",...}
  ```

- [ ] **Test Public API**
  ```bash
  curl https://smzentrix.info/doctor-cms/api/public/config/deepali
  # Response: JSON object with doctor config
  ```

- [ ] **Access Admin Panel in Browser**
  - Open: https://smzentrix.info/doctor-cms/admin/
  - Login with deepali / password
  - Verify dashboard loads
  - Logout

- [ ] **Verify PM2 Status**
  ```bash
  pm2 list
  # Should show: doctor-cms - online
  ```

---

## PHASE 8: INTEGRATE PATIENT WEBSITES (Optional, Later)

- [ ] **For Dr. Deepali's Website** (`drdeepalishinde.smzentrix.info`)
  - Modify her website's JavaScript to fetch from:
    ```javascript
    fetch('https://smzentrix.info/api/public/config/deepali')
    ```

- [ ] **For Dr. Prashant's Website** (`drprashantpawar.com`)
  - Modify his website's JavaScript to fetch from:
    ```javascript
    fetch('https://smzentrix.info/api/public/config/prashant')
    ```

---

## PHASE 9: ONGOING MAINTENANCE

### Daily Monitoring
- [ ] **Check CMS is running**
  ```bash
  ssh root@YOUR_VPS_IP
  pm2 list
  # Should show: doctor-cms - online
  ```

### Weekly Backups
- [ ] **Create backup script** (see VPS-DEPLOYMENT-GUIDE.md)
  ```bash
  tar -czf cms-backup-$(date +%Y%m%d).tar.gz \
    /var/www/smzentrix.info/config/ \
    /var/www/smzentrix.info/backups/ \
    /var/www/smzentrix.info/uploads/
  ```

### When Adding New Doctors
- [ ] Generate password hash
- [ ] Add entry to doctors-list.json
- [ ] Create new doctor's config file
- [ ] Create backup directory
- [ ] Restart CMS: `pm2 restart doctor-cms`

---

## QUICK REFERENCE COMMANDS

```bash
# Connect to VPS
ssh root@YOUR_VPS_IP

# CMS Management
pm2 list                          # See running processes
pm2 logs doctor-cms               # View logs (Ctrl+C to exit)
pm2 restart doctor-cms            # Restart CMS
pm2 stop doctor-cms               # Stop CMS
pm2 start doctor-cms              # Start CMS

# Navigate Project
cd /var/www/smzentrix.info        # Project root
cd /var/www/smzentrix.info/cms    # CMS code
cd /var/www/smzentrix.info/config # Doctor configs

# Edit Files
nano doctors-list.json            # Edit doctor registry
nano deepali-profile.json         # Edit Dr. Deepali's config
nano prashant-profile.json        # Edit Dr. Prashant's config

# Check Logs
tail -f /var/www/smzentrix.info/logs/error.log
tail -f /var/www/smzentrix.info/logs/access.log

# Services
systemctl status nginx            # Check Nginx
systemctl restart nginx           # Restart Nginx
certbot certificates              # Check SSL status
certbot renew                     # Renew SSL (manual)
```

---

## ESTIMATED TIME

- **Phase 1** (VPS Setup): 15 min
- **Phase 2** (Upload Files): 10 min
- **Phase 3** (Install CMS): 5 min
- **Phase 4** (Nginx): 5 min
- **Phase 5** (Domain & SSL): 20 min *(most of this is DNS propagation)*
- **Phase 6** (Doctor Setup): 10 min
- **Phase 7** (Verification): 5 min

**TOTAL**: ~70 minutes *(excluding DNS propagation wait time)*

---

## SUPPORT

If something goes wrong:
1. **Check logs**: `pm2 logs doctor-cms`
2. **Read VPS-DEPLOYMENT-GUIDE.md** → Troubleshooting section
3. **Common issues**:
   - CMS won't start? → Check npm install completed
   - Cannot access domain? → Check DNS propagation + Nginx status
   - Login fails? → Verify password hashes are correct
   - SSL issues? → Run `certbot certificates`

---

**Ready? Start with PHASE 1!** 🚀
