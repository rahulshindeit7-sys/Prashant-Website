# Feature Specification: Doctor Website Template

**Feature Branch**: `001-doctor-website-template`

**Created**: 2026-06-28

**Status**: Draft

**Input**: User description: "Build a complete, production-ready, SEO-optimized doctor website template that is reusable and config-driven. Non-technical users (doctors/clinic staff) can easily update photos, videos, services, and all content by editing a single JSON config file. The website MUST rank high in local search results when someone searches for the doctor with relevant keywords."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Patient Finds Doctor via Google Search (Priority: P1)

A potential patient in Pune searches Google for "oral surgeon near me" or "best dentist in Pune". The doctor's website appears in top search results with rich snippets showing ratings, specialization, and clinic hours.

**Why this priority**: This is the #1 business value — if the site doesn't rank, nothing else matters. SEO is the core product value proposition.

**Independent Test**: Deploy site with sample config, run Google Lighthouse SEO audit (score ≥ 95), validate Schema.org with Google Rich Results Test, verify all meta tags render correctly in social sharing previews.

**Acceptance Scenarios**:

1. **Given** the website is deployed with complete doctor-profile.json, **When** Google crawls the page, **Then** it finds valid Schema.org JSON-LD (Dentist/Physician type), complete meta tags, FAQ schema, semantic HTML with proper heading hierarchy, and renders rich results in SERP.
2. **Given** a user shares the website URL on WhatsApp/Facebook, **When** the platform fetches OG metadata, **Then** it displays the doctor's name, specialization, and OG image correctly.
3. **Given** Google Lighthouse is run against the deployed site, **When** the SEO audit completes, **Then** the score is ≥ 95 with zero critical SEO issues.

---

### User Story 2 - Patient Books Appointment Online (Priority: P1)

A patient visits the doctor's website, views available services with pricing, fills out the appointment booking form, pays the consultation fee via Razorpay, and receives confirmation via WhatsApp.

**Why this priority**: Direct revenue generation. Appointment booking is the primary conversion action that justifies having a website.

**Independent Test**: Fill appointment form with valid data, submit, verify Razorpay modal opens with correct amount, complete payment, verify WhatsApp message opens with pre-filled appointment details and confirmation modal appears.

**Acceptance Scenarios**:

1. **Given** a patient is on the website, **When** they click "Book Appointment", **Then** the page scrolls smoothly to the booking form section.
2. **Given** the booking form is displayed, **When** the patient fills all required fields (name, phone, date, time, service) and submits, **Then** Razorpay payment modal opens with the consultation fee amount from config.
3. **Given** payment succeeds, **When** Razorpay returns a payment ID, **Then** WhatsApp opens with pre-filled appointment details AND a confirmation modal shows booking summary with payment receipt ID.
4. **Given** Razorpay is unavailable or key is not configured, **When** the patient submits the form, **Then** a fallback flow offers to send booking via WhatsApp only (graceful degradation).
5. **Given** the patient enters invalid data (empty name, bad phone number, past date), **When** they attempt to submit, **Then** inline validation errors appear next to each invalid field with clear error messages.

---

### User Story 3 - Doctor/Staff Updates Website Content (Priority: P1)

A clinic staff member (non-technical) needs to update the doctor's photo, add a new service, change clinic timings, or add a patient testimonial. They do this by editing only `config/doctor-profile.json`.

**Why this priority**: Reusability and long-term viability. If updates require a developer, the template fails its core promise.

**Independent Test**: Modify doctor-profile.json (change name, add service, update timing), refresh the page in browser, verify all changes reflect immediately without touching HTML/CSS/JS files.

**Acceptance Scenarios**:

1. **Given** a staff member changes `doctor.name` in the JSON config, **When** the page is reloaded, **Then** the doctor's name updates everywhere (hero, about, navbar, footer, meta tags).
2. **Given** a new service object is added to the `services` array in JSON, **When** the page reloads, **Then** the service appears in the services grid AND in the appointment form's service dropdown.
3. **Given** a new testimonial object is added to `testimonials` array, **When** the page reloads, **Then** it displays in the testimonials section with correct star rating, name, and text.
4. **Given** the `doctor.photo` path is changed to a new image filename, **When** the page reloads, **Then** the new photo appears in hero and about sections.
5. **Given** `clinic.timing.sunday` is changed from "Closed" to "10:00 AM – 1:00 PM", **When** the page reloads, **Then** the contact section and Schema.org data both reflect the new Sunday hours.

---

### User Story 4 - Patient Browses on Mobile Phone (Priority: P2)

A patient searches for the doctor on their mobile phone, views the website, reads about services, checks testimonials, and initiates a WhatsApp chat — all with a smooth, fast-loading mobile experience.

**Why this priority**: 70%+ of healthcare searches happen on mobile. Poor mobile UX directly loses patients.

**Independent Test**: Load site on a 375px viewport (or real mobile device), verify all sections are readable, navigation works, WhatsApp button is accessible, page loads in < 2 seconds on Fast 3G.

**Acceptance Scenarios**:

1. **Given** a patient opens the site on a mobile phone (375px width), **When** the page loads, **Then** all content is visible without horizontal scrolling, text is readable, and touch targets are ≥ 44px.
2. **Given** the mobile user taps the hamburger menu, **When** navigation opens, **Then** all links are easily tappable and tapping a link scrolls to the section and closes the menu.
3. **Given** the floating WhatsApp button is visible on mobile, **When** the patient taps it, **Then** WhatsApp opens with a pre-filled greeting message including the doctor's name.
4. **Given** Lighthouse is run in mobile mode, **When** the Performance audit completes, **Then** the score is ≥ 90 and First Contentful Paint is < 1.5 seconds.

---

### User Story 5 - New Doctor Clones Template for Their Practice (Priority: P2)

A developer clones the template repository, replaces `doctor-profile.json` with a new doctor's details, drops in the doctor's photo, and deploys to Hostinger VPS — resulting in a fully branded, unique website.

**Why this priority**: Template reusability is the business model. One template → many doctor websites.

**Independent Test**: Clone repo, replace JSON config with completely different doctor data (different specialization, city, services), deploy, verify the entire website reflects the new doctor with zero code changes.

**Acceptance Scenarios**:

1. **Given** a developer copies the template and creates a new `doctor-profile.json` for a cardiologist in Mumbai, **When** the site is loaded, **Then** all content, SEO tags, Schema.org, and branding reflect the new doctor with zero template code changes.
2. **Given** the developer changes CSS variables in `:root` (primary color, accent color), **When** the page reloads, **Then** the entire color scheme updates consistently across all sections.
3. **Given** deploy.sh is configured with the new VPS IP and domain, **When** `./deploy.sh` is executed, **Then** files sync to VPS, Nginx reloads, and the site is live on the new domain with HTTPS.

**Integration Note**: Multi-site management (SaaS dashboard for monitoring/editing multiple deployed sites) is scoped to a separate feature spec (`002-admin-dashboard`). This template MUST remain self-contained — each deployed site is a standalone copy with its own `doctor-profile.json`.

---

### User Story 6 - Patient Contacts via WhatsApp (Priority: P3)

A patient visiting the site wants to quickly message the doctor on WhatsApp without filling a full form. They click the floating WhatsApp button and are taken directly to a WhatsApp chat.

**Why this priority**: WhatsApp is the primary communication channel for Indian patients. Low-friction contact option increases conversions.

**Independent Test**: Click floating WhatsApp button, verify it opens wa.me link with correct phone number and pre-filled message.

**Acceptance Scenarios**:

1. **Given** the floating WhatsApp button is visible (bottom-right, green, pulsing), **When** the patient clicks it, **Then** WhatsApp opens with the doctor's number and a pre-filled greeting message.
2. **Given** the patient is on desktop, **When** they click the WhatsApp button, **Then** WhatsApp Web opens with the correct chat.

---

### Edge Cases

- What happens when `doctor-profile.json` is malformed or missing? → User-friendly error message displayed (not a blank page or console error).
- What happens when optional fields (social links, FAQ, testimonials) are empty or missing from config? → Those sections gracefully hide/skip without breaking layout.
- What happens when Razorpay key is invalid or not configured? → Payment gracefully falls back to WhatsApp-only booking.
- What happens when images referenced in config don't exist? → Placeholder/fallback behavior (no broken image icons).
- What happens when the page is accessed without a web server (file:// protocol)? → Clear error message explaining HTTP server is required.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST read ALL display content from `config/doctor-profile.json` at runtime via `fetch()`.
- **FR-002**: System MUST render a sticky navigation bar with logo (clinic name), section links, a click-to-call phone number (`tel:` link), and a "Book Appointment" CTA button.
- **FR-003**: System MUST render a hero section with doctor photo, name, specialization, experience badges, and triple CTAs (Book Appointment + click-to-call Phone + WhatsApp).
- **FR-004**: System MUST render an about section with doctor credentials, biography, awards, and spoken languages.
- **FR-005**: System MUST render a services grid with icon, name, description, and price range for each service defined in config.
- **FR-006**: System MUST render a "Why Choose Us" section with animated counters (patients treated, rating, years experience, transparency).
- **FR-007**: System MUST render an appointment booking form with fields: name, phone, date, time slot, service dropdown, and optional message.
- **FR-008**: System MUST validate all required form fields client-side with inline error messages before submission.
- **FR-009**: System MUST integrate Razorpay payment for consultation fee on form submission, opening the Razorpay modal with amount from config.
- **FR-010**: System MUST open WhatsApp with pre-filled appointment details (patient name, phone, service, date, time) after successful payment.
- **FR-011**: System MUST display a confirmation modal with booking summary and payment receipt ID after successful booking.
- **FR-012**: System MUST gracefully handle Razorpay failure (show error message with retry option) and missing Razorpay key (fallback to WhatsApp-only).
- **FR-013**: System MUST render patient testimonials with star ratings, review text, patient name, location from config, AND a prominent "Review us on Google" button linked to the doctor's Google Business Profile review page.
- **FR-014**: System MUST render an FAQ accordion that is Schema.org FAQPage-compliant for rich results in Google.
- **FR-015**: System MUST render Google Maps embed and contact information (address, phone, email, timings) from config.
- **FR-016**: System MUST render a footer with clinic branding, navigation links, and social media links from config.
- **FR-017**: System MUST display a floating WhatsApp button (fixed bottom-right) with pulse animation that opens WhatsApp with pre-filled message.
- **FR-018**: System MUST inject complete SEO meta tags (title, description, keywords including local_keywords, OG, Twitter Card, canonical) from config.
- **FR-019**: System MUST inject Schema.org JSON-LD (Dentist/Physician + FAQPage) generated from config data, including GeoCoordinates (lat/long) and areaServed (list of localities) for local "near me" search optimization.
- **FR-020**: System MUST be fully responsive with mobile-first CSS (breakpoints: 480px, 768px, 1024px).
- **FR-021**: System MUST lazy-load all images except the hero image using `loading="lazy"` attribute.
- **FR-022**: System MUST use CSS custom properties for all colors and fonts, enabling rebranding by changing only `:root` variables.
- **FR-023**: System MUST escape all config-derived content before DOM insertion to prevent XSS attacks.
- **FR-024**: System MUST use Google Fonts (Playfair Display + Inter) loaded via preconnect for optimal performance.
- **FR-025**: System MUST provide `deploy.sh` for automated deployment to Hostinger VPS via rsync+SSH.
- **FR-026**: System MUST include production Nginx config with SSL, Gzip, security headers, and cache policies.
- **FR-027**: System MUST track click-to-call and WhatsApp button clicks as GA4 custom events (event names: `phone_call_click`, `whatsapp_click`, `appointment_submit`) when Google Analytics is configured.
- **FR-028**: System MUST serve `doctor-profile.json` at a predictable URL path (`/config/doctor-profile.json`) on deployed sites to enable external tooling (admin dashboard) to read site configuration via HTTP. Nginx MUST restrict this path to GET requests only (no write access via HTTP) and include CORS headers allowing access only from the admin dashboard domain.
- **FR-029**: System MUST support a multi-page information architecture aligned to the reference pattern, with dedicated pages for Profile, Expertise listing, Expertise detail pages, and Contact.
- **FR-030**: System MUST preserve the existing homepage design and behavior as-is while adding the new pages.
- **FR-031**: System MUST exclude Knowledgebase and Research & Publications from navigation, routing, and page generation.
- **FR-032**: System MUST implement expertise detail content using one reusable detail page template resolved by expertise slug/ID from config, while preserving SEO-friendly unique URLs per expertise topic.
- **FR-033**: System MUST use hybrid navigation: retain existing anchor-based section navigation on Home, and add route-based navigation for Profile, Expertise listing/detail, and Contact pages.

### Key Entities

- **Doctor**: Name, degree, specialization, experience, tagline, languages, photo, about text
- **Clinic**: Name, address, city, phone, WhatsApp, email, website, timings, Google Maps embed, geo-coordinates (latitude, longitude), areaServed (list of 5-10 nearby localities)
- **Site Metadata**: site_id (UUID or slug — unique per deployed instance, used by admin dashboard for identification)
- **Service**: Name, icon, description, price range
- **Expertise**: slug (unique), title, summary, detail content blocks, hero image, related expertise links
- **Testimonial**: Patient name, location, rating (1-5), text, date
- **FAQ**: Question, answer (both used for display and Schema.org)
- **Appointment**: Patient name, phone, date, time, service, message, payment ID
- **Payment Config**: Razorpay key, consultation fee, currency
- **SEO Config**: Meta title, description, keywords, local_keywords (locality+service combos), OG image, Schema type, GA ID

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Google Lighthouse SEO score ≥ 95 on deployed site.
- **SC-002**: Google Lighthouse Performance score ≥ 90 (mobile mode, Fast 3G).
- **SC-003**: Total page weight < 500KB (excluding user-uploaded images).
- **SC-004**: First Contentful Paint < 1.5 seconds on Fast 3G throttled connection.
- **SC-005**: Google Rich Results Test passes for both LocalBusiness/Dentist schema (with GeoCoordinates + areaServed) AND FAQPage schema.
- **SC-006**: 100% of website content updates achievable by editing only `doctor-profile.json` (zero HTML/CSS/JS changes for content).
- **SC-007**: Appointment booking flow completable in under 2 minutes (from form fill to WhatsApp confirmation).
- **SC-008**: Site renders correctly without horizontal scrolling on viewports from 320px to 1920px.
- **SC-009**: All interactive elements accessible via keyboard navigation (Tab, Enter, Escape).
- **SC-010**: Template deployable to a new VPS in under 10 minutes using deploy.sh (excluding DNS propagation).

## Assumptions

- Target users (patients) have stable mobile internet (3G or above) and modern browsers (Chrome 90+, Firefox 88+, Safari 14+).
- Doctors operate in India; currency is INR, WhatsApp is the primary messaging channel.
- Razorpay is available for Indian merchants; the doctor has a Razorpay account with a valid key.
- Hosting is Hostinger VPS with Ubuntu + Nginx; SSH access is available for deployment.
- For SaaS operations in v1, multiple doctor sites may be hosted on a single VPS, with isolated per-doctor directories and domain/virtual-host routing.
- Standard v1 path convention for each site is `/var/www/doctor-sites/<site_id>/`, with config at `/var/www/doctor-sites/<site_id>/config/doctor-profile.json`.
- Standard v1 update strategy is versioned release folders per site with atomic symlink switch for deploys and rollbacks.
- Standard v1 admin write access model uses a single shared SSH key for all managed sites.
- Standard v1 failure policy is immediate automatic rollback to the previous release for the affected site.
- Multi-page design with explicit routing/navigation for homepage, Profile, Expertise listing, Expertise detail pages, and Contact.
- Google Fonts CDN is accessible to all target users (not blocked in India).
- Doctor/staff will follow a simple text guide (CONFIG-GUIDE.md) to edit JSON — no CLI or git knowledge assumed.
- Images are provided by the doctor in standard web formats (JPEG/PNG/WebP) and reasonable file sizes.

## Clarifications

### Session 2026-06-29

- Q: Should Schema.org include geo-coordinates (lat/long) and a list of served localities to rank for "near me" and area-specific searches? → A: Yes — add lat/long + areaServed (list of 5-10 nearby localities) as config fields in doctor-profile.json
- Q: How should phone call CTA be positioned to maximize calls/enquiries from patients in the area? → A: Phone in hero section + sticky navbar (click-to-call `tel:` link) + WhatsApp float stays as-is
- Q: Should the site include a 'Review us on Google' CTA to boost local search rankings? → A: Yes — prominent "Review us on Google" button in testimonials section + footer, linked to GBP review page
- Q: How should locality-specific keywords be structured in config for local area targeting? → A: Add separate `seo.local_keywords` array for locality+service combos (e.g., "dentist kothrud", "oral surgeon baner")
- Q: How should the site measure whether it's generating more calls/enquiries from local patients? → A: Track click-to-call as GA4 custom event (free, measures call intent) — event names: phone_call_click, whatsapp_click, appointment_submit
- Q: Should the multi-site admin dashboard be part of this spec or a separate feature? → A: Separate 002-admin-dashboard spec, with integration point documented in this spec (User Story 5)
- Q: How should the admin dashboard access each deployed site's config for reading/editing? → A: Config served at predictable URL `/config/doctor-profile.json` (dashboard reads via HTTP)
- Q: How should config updates from the admin dashboard be written back to deployed sites? → A: Nginx serves config read-only (GET only); dashboard writes via SSH/rsync (no write API on template)
- Q: How should each deployed template instance be uniquely identified for management? → A: Add `site_id` (UUID or slug) field to doctor-profile.json
- Q: Should the config endpoint have CORS headers to allow the admin dashboard to read it cross-origin? → A: CORS restricted to dashboard domain only (Nginx `Access-Control-Allow-Origin: dashboard.yourdomain.com`)

### Session 2026-07-01

- Q: For SaaS admin management, what hosting topology should be the official v1 standard? → A: Multiple doctor sites on one VPS, with separate domains and separate directories per doctor.
- Q: For multi-site on one VPS, how should each doctor site be isolated on disk and config path? → A: Use `/var/www/doctor-sites/<site_id>/` with config at `/var/www/doctor-sites/<site_id>/config/doctor-profile.json`.
- Q: For SaaS admin updates, what should be the official deployment/update strategy per doctor site? → A: Versioned release folders per site with symlink switch (atomic deploy + easy rollback).
- Q: For admin-to-server authentication in v1, what should be the required standard for write operations (deploy/config update)? → A: Single shared SSH key for all sites.
- Q: When a config/deploy update fails for one doctor site, what should the required v1 rollback policy be? → A: Immediate automatic rollback to previous release for that site.

### Session 2026-07-03

- Q: Which page scope should be followed for alignment with the reference website while preserving prior work? → A: Keep existing homepage unchanged; add Profile, Expertise listing, Expertise detail pages, and Contact; exclude Knowledgebase and Research & Publications.
- Q: How should expertise detail pages be implemented while keeping the template maintainable? → A: Use one reusable expertise detail template with slug-based routing/lookup from config.
- Q: Which navigation model should be used so homepage remains unchanged while adding new pages? → A: Hybrid navigation: keep homepage anchor links as-is and add route-based links for new pages.
- Q: What should happen when a user accesses the expertise detail page without specifying a slug? → A: Display a default/featured expertise topic ("Head and Neck Cancer") with a "Browse All Expertise" link to the expertise listing page, providing valuable default content while maintaining graceful fallback behavior.
- Q: What should happen when a patient clicks "Book Appointment" or "WhatsApp" buttons on non-homepage pages (expertise detail, profile, contact)? → A: Navigate to homepage and scroll to appointment form section for Book Appointment; WhatsApp button opens wa.me link from current page (same behavior as homepage). This ensures consistent appointment booking experience from a single configured form, avoiding duplicate forms and maintaining config-first principle.
