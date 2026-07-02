# Quickstart: Doctor Website Template Validation Guide

**Feature**: `001-doctor-website-template` | **Date**: 2026-06-29

## Prerequisites

- A web browser (Chrome recommended for Lighthouse)
- A local HTTP server (any of the following):
  - Python: `python -m http.server 8000`
  - Node.js: `npx serve .`
  - VS Code Live Server extension
- `config/doctor-profile.json` filled with valid data
- Doctor photo at `assets/images/doctor.jpg`

## Quick Start (Local Development)

### 1. Serve the site locally

```bash
cd Doctor-Website/
python -m http.server 8000
# OR
npx serve . -p 8000
```

Open `http://localhost:8000` in browser.

### 2. Verify config loading

- Page renders with doctor name, clinic info, services, etc.
- No browser console errors (F12 → Console tab)
- If config is missing/malformed: a friendly error page appears (not blank)

## Validation Scenarios

### Scenario 1: SEO Audit (User Story 1)

**Steps**:
1. Open `http://localhost:8000` in Chrome
2. Open DevTools → Lighthouse tab
3. Run audit with categories: Performance, SEO, Accessibility, Best Practices
4. Select "Mobile" device

**Expected outcomes**:
- SEO score ≥ 95
- Performance score ≥ 90
- No critical issues flagged
- Page `<title>` matches `seo.meta_title` from config
- View page source: Schema.org JSON-LD present in `<script type="application/ld+json">`

**Validate Schema.org**:
1. Go to https://search.google.com/test/rich-results
2. Enter the deployed URL (or paste HTML source)
3. Verify: `Dentist` entity detected, `FAQPage` detected, no errors

---

### Scenario 2: Appointment Booking Flow (User Story 2)

**Steps**:
1. Click "Book Appointment" button in hero or navbar
2. Page scrolls smoothly to the form
3. Fill form: Name, Phone (+91 format), Date (future), Time slot, Service
4. Submit form

**Expected outcomes (with valid Razorpay key)**:
- Razorpay modal opens showing consultation fee amount from config
- Complete payment with test card: `4111 1111 1111 1111` (test mode only)
- After success: WhatsApp opens with pre-filled appointment details
- Confirmation modal appears with booking summary + payment ID

**Expected outcomes (without Razorpay key / placeholder)**:
- Alert prompts: "Online payment unavailable. Send via WhatsApp instead?"
- On confirm: WhatsApp opens with appointment details
- Confirmation modal appears (Payment ID shows "N/A")

**Validation errors test**:
- Submit empty form → inline errors appear on all required fields
- Enter invalid phone (e.g., "abc") → phone validation error
- Select past date → date validation (date input min attribute blocks it)

---

### Scenario 3: Config-Driven Content Update (User Story 3)

**Steps**:
1. Open `config/doctor-profile.json`
2. Change `doctor.name` to "Dr. Test Update"
3. Add a new service to `services` array:
   ```json
   { "name": "Test Service", "icon": "🧪", "description": "Test desc", "price_range": "₹100" }
   ```
4. Save and refresh browser

**Expected outcomes**:
- Doctor name updates in: hero, about section, navbar logo area (if using name), meta title
- New service appears in services grid
- New service appears in appointment form dropdown
- No code changes were needed — only JSON edit

---

### Scenario 4: Mobile Responsiveness (User Story 4)

**Steps**:
1. Open Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
2. Select "iPhone 12 Pro" (390px) or custom 375px viewport
3. Navigate through all sections

**Expected outcomes**:
- No horizontal scrolling at any point
- Hamburger menu appears (3-line icon) instead of desktop nav
- Tapping hamburger opens mobile menu; tapping a link scrolls and closes menu
- All buttons/links have touch targets ≥ 44px
- WhatsApp floating button visible and tappable
- Services cards stack vertically (1 column)
- Testimonials stack vertically
- Form inputs are full-width

---

### Scenario 5: WhatsApp Integration (User Story 6)

**Steps**:
1. Click the floating green WhatsApp button (bottom-right)
2. Verify WhatsApp opens (web or app)

**Expected outcomes**:
- URL format: `https://wa.me/919876543210?text=Hello%20Dr...`
- Phone number is correct (digits only with country code)
- Pre-filled message includes doctor name

---

### Scenario 6: Graceful Degradation

**Steps**:
1. Remove `testimonials` array from config (or set to `[]`)
2. Remove `faqs` array from config
3. Set `payment.razorpay_key_id` to placeholder value
4. Remove `social` object entirely
5. Refresh browser

**Expected outcomes**:
- Testimonials section disappears (or shows empty state gracefully)
- FAQ section disappears, no FAQPage schema in JSON-LD
- Booking form falls back to WhatsApp-only flow
- Footer social links section hidden
- NO JavaScript errors in console
- Site remains fully functional for remaining sections

---

### Scenario 7: Local SEO and Site Identity Fields

**Steps**:
1. Open `config/doctor-profile.json`
2. Verify these fields exist and are populated:
   - `site_id`
   - `clinic.geo.latitude` and `clinic.geo.longitude`
   - `clinic.area_served` (5-10 localities)
   - `seo.local_keywords` (locality + service keywords)
3. Refresh browser and inspect injected JSON-LD in page source

**Expected outcomes**:
- JSON-LD contains `identifier` from `site_id`
- JSON-LD contains `geo` with latitude/longitude
- JSON-LD contains `areaServed` list
- Meta keywords include standard keywords plus local intent terms from config

---

### Scenario 8: Replace with a Second Doctor (Clone Validation)

**Steps**:
1. Copy the project to a new folder.
2. Update `config/doctor-profile.json` with a different doctor:
   - `site_id`
   - `doctor.*`
   - `clinic.*`
   - `services[]`
   - `seo.*` and `seo.local_keywords[]`
3. Replace `assets/images/doctor.jpg` and `assets/images/og-image.jpg`.
4. Update color variables in `assets/css/style.css` under `:root`.
5. Serve locally and refresh.

**Expected outcomes**:
- All page content reflects new doctor data without editing HTML or JS.
- SEO tags and JSON-LD reflect the new doctor and `site_id`.
- Booking and WhatsApp flows use updated clinic contact details.
- UI theme updates globally from CSS variable changes.

---

### Scenario 9: Multi-Site Release Deploy and Rollback (v1 SaaS)

**Steps**:
1. Ensure `site_id` is set in `config/doctor-profile.json` (for example: `dr-demo-pune`).
2. Run deployment: `VPS_HOST=your.server.ip VPS_USER=root ./deploy.sh`.
3. On VPS, verify structure:
   - `/var/www/doctor-sites/<site_id>/releases/<timestamp>/`
   - `/var/www/doctor-sites/<site_id>/current` symlink points to latest release.
4. Run a second deploy after changing a visible config value.
5. Verify `current` points to a new release folder.
6. Simulate a bad activation condition (for example invalid Nginx config in server context), run deploy, and verify rollback message.

**Expected outcomes**:
- Deploy writes files to a new release directory, not in-place.
- Activation is atomic via `current` symlink switch.
- On activation failure, deploy restores `current` to previous release.
- No partial live state should remain after failed activation.

---

## Deployment Validation

### Deploy to VPS

```bash
# Edit deploy.sh — set VPS_HOST and VPS_USER
export VPS_HOST=your.server.ip
./deploy.sh
```

**Expected outcome**: "✅ Deploy successful! Site live at https://yourdomain.com"

### Post-Deploy Checks

1. Visit `https://yourdomain.com` — site loads over HTTPS
2. Visit `http://yourdomain.com` — redirects to HTTPS
3. Check response headers (DevTools → Network → document):
   - `Content-Security-Policy` present
   - `Strict-Transport-Security` present
   - `X-Frame-Options: SAMEORIGIN`
   - `X-Content-Type-Options: nosniff`
4. Verify gzip: `curl -sI -H "Accept-Encoding: gzip" https://yourdomain.com/assets/css/style.css | grep content-encoding`
   - Should show `content-encoding: gzip`
5. Verify read-only config endpoint behavior:
   - `GET https://yourdomain.com/config/doctor-profile.json` returns `200`
   - `POST/PUT/PATCH/DELETE` to same endpoint are rejected (`405` or equivalent)
   - CORS `Access-Control-Allow-Origin` allows only the admin dashboard domain
