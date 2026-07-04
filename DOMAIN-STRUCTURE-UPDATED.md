# Domain Structure Updated — `/doctor-cms/` Path Prefix

**Date**: 2026-07-04 | **Requirement**: Multi-doctor isolation with path-based routing

---

## Change Summary

All CMS endpoints have been updated to use the `/doctor-cms/` path prefix for better multi-doctor isolation and organization.

### OLD Structure (Single-Doctor)
```
smzentrix.info/admin/          ← Admin login
smzentrix.info/api/login       ← Doctor authentication
smzentrix.info/api/content     ← Content management
smzentrix.info/uploads/        ← Image storage
```

### NEW Structure (Multi-Doctor with Path Isolation)
```
smzentrix.info/doctor-cms/admin/          ← Admin login
smzentrix.info/doctor-cms/api/login       ← Doctor authentication
smzentrix.info/doctor-cms/api/content     ← Content management
smzentrix.info/doctor-cms/api/publish     ← Publishing
smzentrix.info/doctor-cms/api/public/...  ← Public API (websites)
smzentrix.info/doctor-cms/uploads/        ← Image storage
```

---

## What Changed

### 1. Nginx Configuration
**File**: `/etc/nginx/sites-available/smzentrix.info`

```nginx
# OLD
location /admin/ { proxy_pass http://localhost:5050/admin/; }
location /api/ { proxy_pass http://localhost:5050/api/; }
location /uploads/ { alias /var/www/smzentrix.info/uploads/; }

# NEW
location /doctor-cms/admin/ { proxy_pass http://localhost:5050/admin/; }
location /doctor-cms/api/ { proxy_pass http://localhost:5050/api/; }
location /doctor-cms/uploads/ { alias /var/www/smzentrix.info/uploads/; }
```

### 2. Admin Panel URL
```
OLD: https://smzentrix.info/admin/
NEW: https://smzentrix.info/doctor-cms/admin/
```

### 3. API Endpoints
```
OLD: POST https://smzentrix.info/api/login
NEW: POST https://smzentrix.info/doctor-cms/api/login

OLD: GET https://smzentrix.info/api/content
NEW: GET https://smzentrix.info/doctor-cms/api/content

OLD: GET https://smzentrix.info/api/public/config/deepali
NEW: GET https://smzentrix.info/doctor-cms/api/public/config/deepali
```

### 4. Website Integration
```javascript
// OLD
fetch('https://smzentrix.info/api/public/config/deepali')

// NEW
fetch('https://smzentrix.info/doctor-cms/api/public/config/deepali')
```

---

## Files Updated

| File | Changes |
|------|---------|
| [VPS-DEPLOYMENT-GUIDE.md](VPS-DEPLOYMENT-GUIDE.md) | Nginx config, test URLs, website integration examples |
| [VPS-DEPLOYMENT-CHECKLIST.md](VPS-DEPLOYMENT-CHECKLIST.md) | All test commands updated to `/doctor-cms/` path |
| [DEPLOYMENT-SUMMARY.md](DEPLOYMENT-SUMMARY.md) | Quick start URLs, verification URLs |
| [DOCTOR-CONFIG-GUIDE.md](DOCTOR-CONFIG-GUIDE.md) | Login URLs, testing examples |
| [MULTI-DOCTOR-IMPLEMENTATION-SUMMARY.md](MULTI-DOCTOR-IMPLEMENTATION-SUMMARY.md) | Architecture diagram updated |

---

## How It Works in Nginx

```
Client Request: https://smzentrix.info/doctor-cms/admin/
                            ↓
                    Nginx sees /doctor-cms/admin/
                            ↓
        Matches: location /doctor-cms/admin/ { ... }
                            ↓
            proxy_pass http://localhost:5050/admin/
                            ↓
        CMS receives: /admin/ (the /doctor-cms/ prefix is stripped)
                            ↓
                    CMS serves admin panel
                            ↓
        Response sent back with /doctor-cms/ path in URLs
```

The key insight: **Nginx handles the path prefix**, while the CMS server continues to work as before on port 5050.

---

## Important Notes

### ✅ What You DON'T Need to Change
- **CMS code** — No changes needed (still uses `/api/`, `/admin/`, etc. internally)
- **CMS files** — No updates required
- **API logic** — All business logic remains the same
- **Database/configs** — All data structures unchanged

### ✅ What You DO Need to Change
- **Nginx config** — Update location blocks (see guide above)
- **Website JavaScript** — Update fetch URLs to include `/doctor-cms/`
- **Testing URLs** — All curl/test commands need `/doctor-cms/` path
- **Documentation** — Already updated in all 4 guides

---

## CMS Server Still Runs on Port 5050

```
Nginx (port 80/443) ← Client
    ↓
/doctor-cms/ → localhost:5050
   
CMS Server (port 5050, no path prefix)
```

The CMS server **doesn't know about** the `/doctor-cms/` prefix. That's entirely handled by Nginx reverse proxy.

---

## Reverse Proxy Behavior

**Example flow for Dr. Deepali login**:

```
1. Browser requests: POST https://smzentrix.info/doctor-cms/api/login
2. Nginx receives this on port 443
3. Matches location /doctor-cms/api/ { proxy_pass ... }
4. Strips /doctor-cms prefix internally
5. Forwards to: POST http://localhost:5050/api/login
6. CMS processes: POST /api/login (no /doctor-cms/ in path)
7. CMS returns JSON response
8. Nginx forwards response back to browser
9. Browser receives response at /doctor-cms/api/login
```

From the browser's perspective: everything is at `/doctor-cms/api/`
From the CMS's perspective: everything is at `/api/`

This is the **power of reverse proxying** — path rewriting without touching app code.

---

## Testing After Update

```bash
# Admin panel
curl https://smzentrix.info/doctor-cms/admin/

# Doctor login
curl -X POST https://smzentrix.info/doctor-cms/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"deepali","password":"password"}'

# Public API (for websites)
curl https://smzentrix.info/doctor-cms/api/public/config/deepali
```

All should return valid responses with `/doctor-cms/` prefix in the URL path.

---

## Why This Change?

1. **Multi-doctor isolation** — Clear path separation for CMS vs other apps
2. **Organization** — All CMS endpoints grouped under one path
3. **Scalability** — Easy to add future services at different paths (e.g., `/doctor-blog/`)
4. **Security** — Can apply different rate limiting/authentication per path
5. **Clarity** — Clear from URL that it's the doctor CMS, not the main website

---

## Deployment Steps

When deploying:

1. ✅ Update Nginx config (VPS-DEPLOYMENT-GUIDE.md Step 1 in Phase 4)
2. ✅ Test with curl commands (VPS-DEPLOYMENT-CHECKLIST.md Phase 7)
3. ✅ Update website JavaScript (DEPLOYMENT-SUMMARY.md → Integrate Websites)
4. ✅ Verify all logins work with new URLs

All guides have been updated with the new domain structure.

---

**Summary**: Everything is the same, just with `/doctor-cms/` prefix in external URLs. Nginx handles the path routing transparently. 🎯
