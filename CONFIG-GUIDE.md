# Doctor Website Config Guide

This guide explains how to update the website by editing only [config/doctor-profile.json](config/doctor-profile.json).

## Zero-JSON Option (Recommended for Non-Technical Team)

You can generate the full config file using an interactive wizard.

1. Run:

```bash
npm run intake
```

2. Answer the prompts in terminal.
3. The tool creates/updates [config/doctor-profile.json](config/doctor-profile.json).
4. Validate output:

```bash
npm run check:config
```

Notes:

- Existing config is auto-backed up in `config/doctor-profile.backup-<timestamp>.json`.
- A client approval summary is generated at `config/intake-summary-<site_id>-<timestamp>.txt`.
- If a field is unknown, you can leave optional prompts blank.
- You can still edit the JSON manually after generation.

## 1) Before You Start

- Keep the file valid JSON.
- Use double quotes for all keys and text values.
- Save the file, then refresh the site in browser.
- If you see a config error page, validate JSON syntax first.

## 2) Required Information To Collect

### Doctor Profile

- name: full display name (for example, Dr. Prashant Subhash Pawar)
- degree: degree string (for example, BDS, MDS, FHNO)
- specialization: primary specialization
- experience_years: collected numeric value, not derived
- languages: at least 1 language
- about: 120-300 words, 2-4 short paragraphs, patient-friendly tone
- photo: relative path, for example assets/images/doctor.jpg

Optional but recommended:

- registration_number
- certifications[]
- awards[]
- secondary_specializations[]

### Photo Requirements

- Format: JPG, PNG, or WebP
- Minimum quality: 1200px on the longer side
- Framing: clear face, good lighting, clinical/professional background

### Clinic and Location

- address: include street/landmark, locality, city, state
- city
- pincode
- phone (display phone)
- whatsapp (with country code, used for wa.me)
- email
- website
- google_maps_embed
- geo.latitude and geo.longitude
- area_served[]: 5-10 nearby localities

How to get geo coordinates:

1. Open Google Maps and search clinic location.
2. Right-click on exact map point.
3. Copy the shown latitude, longitude.
4. Paste into clinic.geo.

How to get Google Maps embed URL:

1. Open clinic location in Google Maps.
2. Click Share.
3. Click Embed a map.
4. Copy HTML, then extract URL from iframe src.
5. Paste URL into clinic.google_maps_embed.

Multiple branches:

- v1 displays one primary clinic.
- Put main branch in clinic fields.
- Put other branch details in clinic.branches_note.

Appointment-only clinic:

- Set clinic.appointment_only to true.
- Use explicit timing text like By appointment only.

Timing model:

- Visibility toggle: set `clinic.show_timing` to `false` to hide timings on website for that doctor.
- Basic: weekdays, saturday, sunday
- Advanced: timing.day_wise with monday to sunday keys

### Services and Pricing

- Recommended services count: 6-12
- price_range formats:
  - exact (₹500)
  - range (₹500 - ₹1500)
  - variable (On Consultation)
- icon can be emoji or short text marker

### Optional Expertise Grid (Separate from Services)

You can maintain a separate section titled:
`Complete Expertise in Head and Neck Cancer Treatment`

Use `expertise_items[]` in config, with each item as:

- `title`
- `description`
- `read_more_url` (optional, must start with https if used)

You can also control section heading text via `expertise_section`:

- `label` (small label above title)
- `title` (main section title)
- `subtitle` (optional descriptive line below title)

This section is optional and auto-hides if `expertise_items` is empty.

### Hybrid Multi-Page Keys (New)

Use these keys to power additional pages while keeping homepage behavior unchanged:

- `pages.home.anchors[]`: existing homepage section anchors (keep these aligned with section IDs)
- `pages.profile`, `pages.expertise`, `pages.contact`: each has:
  - `enabled` (true/false)
  - `path` (for example `profile.html`)
  - `nav_label`

For expertise detail pages, use `expertise[]` (not `expertise_items[]`):

- `slug`: required, unique, lowercase URL-safe value (`[a-z0-9-]+`)
- `title`
- `summary`
- `hero_image` (optional)
- `content_blocks[]` where each block can be paragraph/list style content
- `related_slugs[]` (optional)

SEO keys for route pages:

- `seo.pages.profile`
- `seo.pages.expertise`
- `seo.pages.contact`
- `seo.pages.expertise_detail` (template fields)

Excluded sections policy (must remain disabled for this scope):

- `sections.knowledgebase.enabled` = `false`
- `sections.research_publications.enabled` = `false`

### SEO and Identity

- site_id: unique per deployed site, do not change after deployment
  - slug format example: dr-prashant-pawar-pune
  - uuid format also allowed
  - v1 hosting path convention: /var/www/doctor-sites/<site_id>/
  - config path convention: /var/www/doctor-sites/<site_id>/config/doctor-profile.json
- meta_title pattern: Dr. Name | Specialty | City
- meta_description: <= 160 chars recommended
- keywords[]: broad service terms
- local_keywords[]: 10-20 terms in service + locality format
  - examples:
    - oral cancer surgeon narhe
    - thyroid surgeon pune
    - tongue cancer surgeon ambegaon
- schema_type: Dentist, Physician, or specialty-appropriate value

### Reviews, FAQ, and Social

- testimonials[]: collect at least 5 recent reviews with patient consent
- testimonial date format: YYYY-MM
- faqs[]: 6-10 practical questions and concise answers
- social.google_business is optional but strongly recommended for local ranking

### Payment and Communication

- payment.razorpay_key_id: use only active key from Razorpay dashboard
- consultation_fee: single default fee for online booking
- If multiple fee tiers exist, keep consultation_fee as base fee and explain tiers in FAQ/service text

## 3) Optional vs Not Applicable

- Optional field unknown: omit the key.
- Day not working: use Closed.
- Avoid N/A in SEO fields.
- media.videos is reserved for future versions and ignored in v1.

## 4) Quick Validation Checklist

- JSON syntax valid
- site_id present
- geo coordinates present
- area_served has 5-10 localities
- local_keywords has locality-specific entries
- doctor photo and og image paths are correct
- whatsapp number includes country code

## 5) Example Paths

- Doctor photo: assets/images/doctor.jpg
- OG image: assets/images/og-image.jpg

## 6) 2-Minute Smoke Test (Team Checklist)

Use this quick test before sharing a site preview with a doctor.

1. Pre-check

```bash
npm run check:config
```

Pass if output confirms JSON is valid.

2. Start local server

```bash
npm run start
```

Open `http://localhost:8000`.

3. Content sanity (home page)

- Hero has correct doctor name and specialization.
- About section has doctor bio and languages.
- Services section renders expected service cards.
- Contact section has correct address, phone, and email.

4. Appointment flow

- Click Book Appointment and fill required fields.
- Submit the form.
- If Razorpay key is placeholder, WhatsApp fallback prompt appears.
- If Razorpay key is valid, checkout opens.

5. WhatsApp flow

- Click floating WhatsApp button.
- Verify wa.me link opens with pre-filled message.

6. SEO/schema sanity

- Page title matches doctor profile data.
- View source and verify JSON-LD script exists.
- JSON-LD includes `site_id`, `geo`, and `areaServed`.

7. Mobile check

- Test at ~375px viewport width.
- No horizontal scroll.
- Mobile menu opens and closes correctly.
- Main buttons and WhatsApp CTA are easy to tap.

8. Pass/Fail

- Pass: all checks above succeed and no major console errors.
- Fail: correct config/assets and re-run this checklist.

### Smoke Test Report Template

Copy this block for each test run:

```text
Site ID:
Tester:
Date:

Config valid: Yes/No
Appointment flow: Pass/Fail
WhatsApp flow: Pass/Fail
SEO/schema check: Pass/Fail
Mobile check: Pass/Fail

Final status: Pass/Fail
Notes:
```
