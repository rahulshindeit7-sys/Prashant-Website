# Data Model: Doctor Website Template

**Feature**: `001-doctor-website-template` | **Date**: 2026-06-29

## Entity Overview

All data is stored in a single JSON file: `config/doctor-profile.json`. There is no database. The JSON structure defines the complete website content.

## Entities

### 1. Doctor

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | ✅ | Full name with title (e.g., "Dr. Rajesh Sharma") |
| `degree` | string | ✅ | Academic qualifications (e.g., "BDS, MDS") |
| `specialization` | string | ✅ | Area of expertise |
| `secondary_specializations` | string[] | ❌ | Additional specialties (for multi-specialty doctors) |
| `experience_years` | number | ✅ | Years of experience (used in badges + counters) |
| `registration_number` | string | ❌ | Medical/Dental registration identifier |
| `certifications` | string[] | ❌ | Fellowship/certification list (e.g., FHNO) |
| `awards` | string[] | ❌ | Awards and recognitions shown in About section |
| `tagline` | string | ✅ | One-line value proposition |
| `languages` | string[] | ✅ | Languages spoken (displayed in About section) |
| `photo` | string | ✅ | Relative path to doctor photo (e.g., "assets/images/doctor.jpg") |
| `about` | string | ✅ | Multi-paragraph biography (\n separated) |

**Validation rules**:
- `name` must be non-empty, max 100 characters
- `about` should be 120-300 words, 2-4 short paragraphs, trust-focused tone
- `experience_years` must be positive integer
- `experience_years` is a collected value (not derived from start year)
- `photo` must be a valid relative path (no absolute URLs, no `..`)
- `photo` should be JPG/PNG/WebP, minimum 1200px on longer side, clear face and clinical background
- `languages` array must have at least one entry
- `awards`, `certifications`, `secondary_specializations` are optional arrays of non-empty strings

---

### 2. Clinic

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | ✅ | Clinic/practice name |
| `address` | string | ✅ | Street address |
| `city` | string | ✅ | City + state (e.g., "Pune, Maharashtra") |
| `pincode` | string | ❌ | Postal code for local SEO and maps consistency |
| `phone` | string | ✅ | Display phone (e.g., "+91 98765 43210") |
| `whatsapp` | string | ✅ | WhatsApp number with country code, digits only (e.g., "+919876543210") |
| `email` | string | ✅ | Contact email address |
| `website` | string | ❌ | Full URL (used in Schema.org canonical) |
| `timing` | Timing | ✅ | Clinic hours (nested object) |
| `google_maps_embed` | string | ❌ | Google Maps embed URL |
| `geo` | GeoCoordinates | ✅ | Latitude/longitude used in Schema.org local SEO |
| `area_served` | string[] | ✅ | List of 5-10 nearby localities for "near me" searches |
| `appointment_only` | boolean | ❌ | Whether clinic is strictly appointment-only |
| `branches_note` | string | ❌ | Note for additional branches when v1 shows only primary branch |
| `photos` | string[] | ❌ | Clinic/interior photos for trust section and media cards |

**Timing sub-entity**:

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `weekdays` | string | ✅ | Mon-Fri hours (e.g., "9:00 AM – 1:00 PM, 5:00 PM – 8:00 PM") |
| `saturday` | string | ✅ | Saturday hours or "Closed" |
| `sunday` | string | ✅ | Sunday hours or "Closed" |
| `day_wise` | object | ❌ | Explicit all-7-day map (`monday`..`sunday`) for advanced schedules |

**GeoCoordinates sub-entity**:

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `latitude` | number | ✅ | Latitude in decimal degrees (e.g., 18.5204) |
| `longitude` | number | ✅ | Longitude in decimal degrees (e.g., 73.8567) |

**Validation rules**:
- `phone` must match pattern `[0-9+\s\-]{10,15}`
- `whatsapp` must contain only digits and `+` sign (stripped for wa.me URL)
- `email` must be valid email format
- `google_maps_embed` if present must start with `https://www.google.com/maps/embed`
- `geo.latitude` must be in range `-90` to `90`
- `geo.longitude` must be in range `-180` to `180`
- `area_served` should contain 5-10 locality names, each non-empty
- `address` should be entered as: street/landmark, locality, city, state, pincode
- `timing.day_wise` (if present) should include all seven keys: monday..sunday
- `appointment_only: true` should pair with clear wording like `By appointment only` in timings

---

### 3. Site Metadata

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `site_id` | string | ✅ | Unique identifier (UUID or slug) for this deployed site instance |

**Validation rules**:
- `site_id` must be non-empty and unique per deployment
- Recommended format: lowercase slug (`dr-rajesh-sharma-pune`) or UUID

---

### 4. Service

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | ✅ | Service name (also used in appointment dropdown) |
| `icon` | string | ✅ | Emoji icon for display |
| `description` | string | ✅ | 1-2 sentence service description |
| `price_range` | string | ✅ | Price display text (e.g., "₹500 – ₹1,500") |

**Relationship**: Services array populates both the Services Grid section AND the appointment form's service dropdown.

**Validation rules**:
- Array must have at least 1 service
- `name` must be unique within the array (used as form value)

---

### 5. Testimonial

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | ✅ | Patient name |
| `location` | string | ✅ | Patient city/location |
| `rating` | number | ✅ | Star rating (1-5) |
| `text` | string | ✅ | Review text |
| `date` | string | ✅ | Month of review (format: "YYYY-MM") |

**Validation rules**:
- `rating` must be integer 1-5
- `date` must match format `YYYY-MM`
- Array can be empty (section hides gracefully)

---

### 6. FAQ

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `question` | string | ✅ | FAQ question text |
| `answer` | string | ✅ | FAQ answer text (plain text, not HTML) |

**Relationship**: FAQs are used both for the accordion UI AND for Schema.org FAQPage structured data.

**Validation rules**:
- Array can be empty (section hides, FAQ schema not injected)
- `question` and `answer` must be non-empty strings

---

### 7. Payment

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `razorpay_key_id` | string | ❌ | Razorpay public key (starts with "rzp_") |
| `consultation_fee` | number | ✅ | Fee in INR (whole rupees, converted to paise for Razorpay) |
| `currency` | string | ✅ | Currency code (default: "INR") |

**Validation rules**:
- `razorpay_key_id` if invalid/placeholder → WhatsApp-only fallback
- `consultation_fee` must be positive integer ≥ 1
- `currency` defaults to "INR" if missing

---

### 8. SEO

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `meta_title` | string | ✅ | Page `<title>` tag (max 60 chars recommended) |
| `meta_description` | string | ✅ | Meta description (max 160 chars) |
| `keywords` | string[] | ✅ | SEO keywords array |
| `local_keywords` | string[] | ✅ | Locality + service keyword combos (e.g., "oral surgeon narhe") |
| `og_image` | string | ✅ | Path to OG image (1200×630px) |
| `schema_type` | string | ✅ | Schema.org type (e.g., "Dentist", "Physician") |
| `google_analytics_id` | string | ❌ | GA4 measurement ID (e.g., "G-XXXXXXXXXX") |

**Validation rules**:
- `meta_title` should be ≤ 60 characters
- `meta_title` recommended pattern: `Dr. Name | Specialty | City`
- `meta_description` should be ≤ 160 characters
- `og_image` must be valid relative path
- `google_analytics_id` if placeholder value → GA not loaded
- `local_keywords` should include locality + intent combinations for local ranking

---

### 9. Media (Optional)

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `videos` | object[] | ❌ | Not used in v1 UI. Reserved for future versions. |

**Validation rules**:
- Video support is out of scope for v1 template. Do not collect videos unless extension work is planned.

---

### 10. Social

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `google_business` | string | ❌ | Google Business Profile URL |
| `instagram` | string | ❌ | Instagram profile URL |
| `facebook` | string | ❌ | Facebook page URL |

**Validation rules**:
- All fields optional; if empty/missing/placeholder → link not rendered in footer
- URLs must start with `https://`

---

## Data Collection Rules

- Optional vs not applicable:
	- Omit optional keys when not available.
	- Use `"Closed"` for day slots that do not operate.
	- Avoid placeholder text like `N/A` in SEO or public-facing fields.
- Services guidance: recommend 6-12 services for balanced SEO and readability.
- Testimonials guidance: recommend minimum 5 recent testimonials with patient consent.
- FAQ guidance: recommend 6-10 practical questions tied to specialty and appointments.
- Pricing guidance: `price_range` may use exact amount, range, or `On Consultation`.
- Razorpay prerequisite: collect key ID only after account activation (test/live mode).
- GBP URL is optional, but highly recommended for local ranking and review CTA.

---

## State Transitions

### Appointment Booking Flow

```
[Form Empty] → (user fills fields) → [Form Filled]
[Form Filled] → (submit) → [Validating]
[Validating] → (validation fails) → [Form Errors Shown]
[Validating] → (validation passes, Razorpay available) → [Payment Modal Open]
[Validating] → (validation passes, Razorpay unavailable) → [WhatsApp Fallback Prompt]
[Payment Modal Open] → (payment success) → [WhatsApp Sent + Confirmation Modal]
[Payment Modal Open] → (payment failed) → [Error Alert + Retry]
[Payment Modal Open] → (user dismisses) → [Form Filled]
[WhatsApp Fallback Prompt] → (user confirms) → [WhatsApp Sent + Confirmation Modal]
[WhatsApp Fallback Prompt] → (user cancels) → [Form Filled]
```

### Config Loading State

```
[Page Load] → (fetch config) → [Config Loaded] → (init all sections) → [Site Rendered]
[Page Load] → (fetch fails) → [Error State] → (display friendly error message)
```

## Relationships Diagram

```
doctor-profile.json
├── site_id ────────────── Site instance identity (admin-dashboard integration)
├── doctor ─────────────── Hero, About, Footer, Schema.org, OG Meta
├── clinic ─────────────── Navbar, Contact, Schema.org, WhatsApp URLs, Footer
│   ├── geo ────────────── GeoCoordinates for local search signals
│   └── area_served[] ──── Locality targeting in Schema.org `areaServed`
├── services[] ─────────── Services Grid, Appointment Form Dropdown
├── testimonials[] ──────── Testimonials Section, aggregateRating Schema
├── faqs[] ─────────────── FAQ Accordion, FAQPage Schema
├── payment ────────────── Appointment Form (Razorpay amount + key)
├── seo ────────────────── <head> meta tags, JSON-LD, GA script
│   └── local_keywords[] ─ Area-specific keyword targeting
└── social ─────────────── Footer social links
```
