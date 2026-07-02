# Data Collection Requirements Quality Checklist

**Purpose**: Validate that spec 001 requirements clearly define ALL information that must be collected from a doctor/clinic to populate their website via `doctor-profile.json`.
**Created**: 2026-06-29
**Feature**: [spec.md](../spec.md) | [data-model.md](../data-model.md)
**Domain**: Client onboarding — content & asset requirements

---

## Requirement Completeness — Personal & Professional

- [x] CHK001 - Are all required doctor credential fields explicitly listed (name, degrees, registrations, certifications)? [Completeness, Spec §Key Entities]
- [x] CHK002 - Is the format/length of the doctor biography specified (word count, paragraph count, tone guidance)? [Clarity, Gap]
- [x] CHK003 - Are photo requirements defined (dimensions, file format, minimum resolution, background requirements)? [Clarity, Gap]
- [x] CHK004 - Is a list of awards/achievements defined as a collectible data point in the config schema? [Completeness, Spec §FR-004]
- [x] CHK005 - Are spoken languages specified as a required collection item with format guidance? [Completeness, Spec §Key Entities]
- [x] CHK006 - Is "years of experience" defined as a derived field or a collected value (start year vs. number)? [Clarity, Data Model §Doctor]

## Requirement Completeness — Clinic & Location

- [x] CHK007 - Are full address components defined (street, area/locality, city, state, pincode) vs. a single freeform string? [Clarity, Data Model §Clinic]
- [x] CHK008 - Are geo-coordinates (latitude, longitude) specified with guidance on how the doctor obtains them? [Completeness, Spec §Clarifications]
- [x] CHK009 - Is the `areaServed` field defined with guidance on what constitutes a "locality" (neighborhood, PIN code area, suburb)? [Clarity, Spec §Clarifications]
- [x] CHK010 - Are clinic timing requirements defined for all 7 days (not just weekday/saturday/sunday grouping) for edge cases (different hours on specific days)? [Coverage, Data Model §Timing]
- [x] CHK011 - Is guidance provided for clinics with multiple branches or locations? [Coverage, Gap]
- [x] CHK012 - Is the Google Maps embed URL field documented with instructions on how to obtain it? [Clarity, Data Model §Clinic]

## Requirement Completeness — Services & Pricing

- [x] CHK013 - Is the minimum/maximum number of services defined or recommended? [Clarity, Gap]
- [x] CHK014 - Is the `price_range` format specified (currency symbol, separator, "Starting from" vs. range)? [Clarity, Data Model §Service]
- [x] CHK015 - Are icon/emoji selection requirements documented for non-technical users (list of recommended icons per specialty)? [Clarity, Gap]
- [x] CHK016 - Is guidance provided for services where pricing is "on consultation" or variable? [Coverage, Gap]

## Requirement Completeness — Media & Assets

- [x] CHK017 - Are OG image requirements specified (exact dimensions 1200×630px, content guidance)? [Completeness, Data Model §SEO]
- [x] CHK018 - Is fallback behavior defined when the doctor cannot provide a professional photo? [Edge Case, Gap]
- [x] CHK019 - Are video requirements specified if video content is supported (format, hosting, embedding)? [Coverage, Gap]
- [x] CHK020 - Is a clinic/interior photo requirement defined for the contact/about section? [Completeness, Gap]

## Requirement Completeness — SEO & Identity

- [x] CHK021 - Is guidance provided on how to select `schema_type` (Dentist vs. Physician vs. other specialties)? [Clarity, Data Model §SEO]
- [x] CHK022 - Are `local_keywords` defined with examples and guidance on how many to provide and how to format them? [Clarity, Spec §Clarifications]
- [x] CHK023 - Is the `meta_title` format/pattern recommended (e.g., "Dr. Name | Specialty | City")? [Clarity, Data Model §SEO]
- [x] CHK024 - Is Google Business Profile URL required or optional, with instructions on where to find it? [Clarity, Data Model §Social]
- [x] CHK025 - Is `site_id` generation documented — who creates it, what format (slug vs UUID), naming convention? [Clarity, Spec §Clarifications]

## Requirement Completeness — Social Proof & Reviews

- [x] CHK026 - Are testimonial collection requirements specified (minimum count, recency, consent)? [Completeness, Gap]
- [x] CHK027 - Is the format of patient testimonial dates defined with guidance (how does the doctor determine "month of review")? [Clarity, Data Model §Testimonial]
- [x] CHK028 - Are FAQ requirements documented with recommended count and example topics per specialty? [Completeness, Gap]

## Requirement Completeness — Payment & Communication

- [x] CHK029 - Is Razorpay account setup guidance documented as a prerequisite for data collection? [Completeness, Gap]
- [x] CHK030 - Is WhatsApp number format specified with clear distinction from display phone number? [Clarity, Data Model §Clinic]
- [x] CHK031 - Is the consultation fee amount guidance provided (what if doctor has multiple fee tiers for different services)? [Coverage, Gap]

## Scenario Coverage — Edge Cases

- [x] CHK032 - Are requirements defined for doctors who operate in multiple specializations? [Coverage, Gap]
- [x] CHK033 - Are requirements defined for clinics that are appointment-only (no walk-in hours)? [Coverage, Gap]
- [x] CHK034 - Is guidance provided for what to put when a field is "not applicable" vs. optional? [Clarity, Gap]

---

## Evaluation Notes (2026-07-01)

- Passed items are explicitly covered in `spec.md`, `data-model.md`, `contracts/config-schema.md`, or `research.md`.
- Remaining unchecked items are true coverage gaps in current onboarding/data-collection requirements and need explicit guidance before this checklist can pass fully.
