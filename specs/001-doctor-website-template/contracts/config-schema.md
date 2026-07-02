# Contract: doctor-profile.json Configuration Schema

**Type**: JSON Configuration File  
**Location**: `config/doctor-profile.json`  
**Consumer**: `assets/js/app.js` (runtime fetch)  
**Producer**: Doctor/clinic staff (manual editing)

## Purpose

This is the single public interface of the Doctor Website Template. All website content, branding, and integrations are controlled exclusively through this JSON file. Template code (HTML/CSS/JS) never needs modification for content changes.

## Schema Contract

```json
{
  "site_id": "string (required, unique identifier: UUID or slug)",
  "doctor": {
    "name": "string (required, max 100 chars)",
    "degree": "string (required)",
    "specialization": "string (required)",
    "secondary_specializations": ["string (optional)"],
    "experience_years": "number (required, positive integer)",
    "registration_number": "string (optional)",
    "certifications": ["string (optional)"],
    "awards": ["string (optional)"],
    "tagline": "string (required)",
    "languages": ["string (min 1 entry)"],
    "photo": "string (required, relative path)",
    "about": "string (required, \\n for paragraphs)"
  },
  "clinic": {
    "name": "string (required)",
    "address": "string (required)",
    "city": "string (required)",
    "pincode": "string (optional)",
    "phone": "string (required, pattern: [0-9+\\s\\-]{10,15})",
    "whatsapp": "string (required, digits + country code)",
    "email": "string (required, valid email)",
    "website": "string (optional, full URL)",
    "timing": {
      "weekdays": "string (required)",
      "saturday": "string (required)",
      "sunday": "string (required)",
      "day_wise": {
        "monday": "string (optional)",
        "tuesday": "string (optional)",
        "wednesday": "string (optional)",
        "thursday": "string (optional)",
        "friday": "string (optional)",
        "saturday": "string (optional)",
        "sunday": "string (optional)"
      }
    },
    "google_maps_embed": "string (optional, Google Maps embed URL)",
    "geo": {
      "latitude": "number (required, range: -90..90)",
      "longitude": "number (required, range: -180..180)"
    },
    "area_served": ["string (required, 5-10 nearby localities)"],
    "appointment_only": "boolean (optional)",
    "branches_note": "string (optional)",
    "photos": ["string (optional, clinic/interior image paths)"]
  },
  "services": [
    {
      "name": "string (required, unique)",
      "icon": "string (required, emoji)",
      "description": "string (required)",
      "price_range": "string (required)"
    }
  ],
  "testimonials": [
    {
      "name": "string (required)",
      "location": "string (required)",
      "rating": "number (required, 1-5)",
      "text": "string (required)",
      "date": "string (required, YYYY-MM)"
    }
  ],
  "faqs": [
    {
      "question": "string (required)",
      "answer": "string (required)"
    }
  ],
  "payment": {
    "razorpay_key_id": "string (optional, rzp_live_* or rzp_test_*)",
    "consultation_fee": "number (required, positive integer in INR)",
    "currency": "string (required, default 'INR')"
  },
  "seo": {
    "meta_title": "string (required, ≤60 chars)",
    "meta_description": "string (required, ≤160 chars)",
    "keywords": ["string (required, min 1)"],
    "local_keywords": ["string (required, locality+service combos)"],
    "og_image": "string (required, relative path)",
    "schema_type": "string (required, e.g. 'Dentist')",
    "google_analytics_id": "string (optional, G-* format)"
  },
  "social": {
    "google_business": "string (optional, https URL)",
    "instagram": "string (optional, https URL)",
    "facebook": "string (optional, https URL)"
  },
  "media": {
    "videos": [
      {
        "title": "string (optional)",
        "url": "string (optional)",
        "platform": "string (optional)"
      }
    ]
  }
}
```

## Graceful Degradation Rules

When optional fields are missing or invalid, the template MUST NOT break. Instead:

| Condition | Behavior |
|-----------|----------|
| `services` array is empty | Services section renders empty message |
| `testimonials` array is empty | Testimonials section is hidden |
| `faqs` array is empty | FAQ section is hidden, no FAQPage schema injected |
| `payment.razorpay_key_id` missing/placeholder | Payment falls back to WhatsApp-only booking |
| `clinic.google_maps_embed` missing | Map area shows placeholder with instructions |
| `social.*` fields missing | Footer social links section hidden |
| `seo.google_analytics_id` placeholder | GA script not loaded |
| `clinic.website` missing | Schema.org uses `window.location.origin` |
| `clinic.area_served` missing | Schema omits `areaServed` safely (with warning in console) |
| `media.videos` present | Ignored in v1 template (reserved for future enhancement) |
| Config fetch fails entirely | Full-page friendly error message displayed |

## Breaking Change Policy

Any change to **required** field names, nesting structure, or data types constitutes a breaking change and requires:
1. Major version bump in `package.json`
2. Migration instructions in CONFIG-GUIDE.md
3. Backward-compatible fallback in app.js during transition period

## WhatsApp Message Contract

### Floating Button Message

```
Hello {doctor.name}, I would like to book an appointment.
```

### Appointment Booking Message

```
🏥 *New Appointment Request*
━━━━━━━━━━━━━━━━━━━━
👤 Patient : {form.name}
📞 Phone   : {form.phone}
🦷 Service : {form.service}
📅 Date    : {form.date (formatted)}
🕐 Time    : {form.time}
💳 Payment : {razorpay_payment_id | "Pending"}
💬 Message : {form.message (if provided)}
━━━━━━━━━━━━━━━━━━━━
Sent via {clinic.name} website
```

## Schema.org JSON-LD Contract

### Business Entity

```json
{
  "@context": "https://schema.org",
  "@type": "{seo.schema_type}",
  "identifier": "{site_id}",
  "name": "{clinic.name}",
  "description": "{doctor.specialization}",
  "url": "{clinic.website || window.location.origin}",
  "telephone": "{clinic.phone}",
  "email": "{clinic.email}",
  "image": "{absolute_url(doctor.photo)}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{clinic.address}",
    "addressLocality": "{clinic.city}",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "{clinic.geo.latitude}",
    "longitude": "{clinic.geo.longitude}"
  },
  "areaServed": ["...from clinic.area_served[]..."],
  "openingHoursSpecification": ["...derived from clinic.timing..."],
  "priceRange": "₹₹",
  "medicalSpecialty": "Oral Surgery",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "{testimonials.length * 25}"
  }
}
```

## Config Endpoint Access Contract (FR-028)

- Public read endpoint: `/config/doctor-profile.json`
- Allowed method: `GET` only
- Disallowed methods: `POST`, `PUT`, `PATCH`, `DELETE`
- CORS: `Access-Control-Allow-Origin` restricted to admin dashboard domain only
- Write path: SSH/rsync deployment only (no HTTP write API)

## Data Collection Guidance Contract

- Doctor bio: 120-300 words, 2-4 short paragraphs, patient-friendly tone.
- Doctor photo: JPG/PNG/WebP, clear face, minimum 1200px longer side.
- Services count: recommend 6-12 entries; `price_range` can be exact, range, or `On Consultation`.
- Testimonials: recommend at least 5 recent entries with consent.
- FAQ: recommend 6-10 practical questions.
- `local_keywords`: recommend 10-20 entries in `<service> <locality>` format.
- `meta_title` pattern: `Dr. Name | Specialty | City`.
- `site_id`: owner-generated, slug or UUID, immutable per deployed site.
- Multiple branches: v1 shows primary branch only; include additional branch info in `branches_note`.
- Appointment-only clinic: set `appointment_only: true` and use explicit timing labels.
- Not applicable vs optional:
  - omit optional fields when unknown,
  - use `Closed` for timing slots,
  - avoid `N/A` in SEO fields.

### FAQ Page (only if `faqs` array is non-empty)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{faq.question}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{faq.answer}"
      }
    }
  ]
}
```
