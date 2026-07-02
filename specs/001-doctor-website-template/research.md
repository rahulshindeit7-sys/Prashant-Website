# Research: Doctor Website Template

**Feature**: `001-doctor-website-template` | **Date**: 2026-06-29

## 1. Schema.org Markup for Healthcare Providers

**Decision**: Use `@type: "Dentist"` (or configurable via `seo.schema_type`) with `FAQPage` as separate schema block.

**Rationale**: Google explicitly supports `Dentist` as a subtype of `MedicalBusiness` → `LocalBusiness`. This enables rich results including business hours, ratings, and address in SERP. FAQPage schema enables FAQ rich snippets (expandable Q&A below the search result).

**Alternatives considered**:
- `Physician` type — valid but less specific for dental professionals
- `MedicalClinic` — used for multi-doctor clinics, less appropriate for single-practitioner template
- Combined single schema — separate schemas are cleaner and validate independently

**Implementation notes**:
- Schema type is configurable in `seo.schema_type` field of doctor-profile.json
- Two JSON-LD blocks injected: business entity + FAQPage
- `aggregateRating` computed from testimonials count (synthetic: count × 25 as review proxy)

## 2. Razorpay Client-Side Integration Pattern

**Decision**: Use Razorpay Standard Checkout (client-side only) with `checkout.js` SDK loaded from CDN.

**Rationale**: For a static site without a backend, Razorpay Standard Checkout is the only option. It handles payment UI entirely client-side. The consultation fee is a known fixed amount (no server-side order creation needed for simple payments under ₹50,000).

**Alternatives considered**:
- Razorpay Payment Links — simpler but loses the embedded experience (redirects away)
- Razorpay Payment Button — pre-built but not customizable for dynamic form data
- Server-side order creation — requires a backend (violates Zero-Framework Simplicity)

**Implementation notes**:
- Script loaded: `https://checkout.razorpay.com/v1/checkout.js`
- `key` from config (`payment.razorpay_key_id`) — public key only, safe for client-side
- Amount: `payment.consultation_fee × 100` (Razorpay uses paise)
- Handler: on success → trigger WhatsApp message + show confirmation modal
- Fallback: if Razorpay SDK fails to load or key is placeholder → WhatsApp-only flow
- **Security note**: No server-side verification possible without backend. This is acceptable for consultation fee collection where the doctor manually confirms via WhatsApp anyway.

## 3. WhatsApp Click-to-Chat API

**Decision**: Use `https://wa.me/{number}?text={encoded_message}` URL scheme.

**Rationale**: This is WhatsApp's official Click-to-Chat URL format. Works on both mobile (opens WhatsApp app) and desktop (opens WhatsApp Web). No API key needed. No rate limiting.

**Alternatives considered**:
- WhatsApp Business API — requires approved business number, server setup, monthly fees
- WhatsApp Cloud API — needs Meta developer account and server (overkill for static site)
- Simple `tel:` link — doesn't pre-fill message, loses context

**Implementation notes**:
- Phone number format: strip all non-digits, include country code (e.g., `919876543210`)
- Message template for appointments: multi-line with patient name, phone, service, date, time
- Message template for floating button: simple greeting with doctor name
- URL must be `encodeURIComponent()` encoded for the `text` parameter

## 4. Google Fonts Loading Strategy

**Decision**: Use `<link rel="preconnect">` + standard `<link>` stylesheet with `display=swap`.

**Rationale**: Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com` saves ~100ms on DNS+TLS. `display=swap` ensures text remains visible during font load (FOUT preferred over FOIT for performance). This is Google's recommended approach.

**Alternatives considered**:
- Self-hosting fonts — faster after first load but larger file size, maintenance burden
- `font-display: optional` — prevents layout shift but shows system font if slow connection (bad for branding)
- Async font loading via JS — adds complexity, marginal gains

**Implementation notes**:
- Fonts: Playfair Display (display headings) + Inter (body text)
- Weights: Playfair 400/600/700, Inter 300/400/500/600
- Two `<link rel="preconnect">` before the font stylesheet
- Single combined Google Fonts URL for both families

## 5. Image Lazy Loading Strategy

**Decision**: Use native `loading="lazy"` HTML attribute for all images except hero/above-fold.

**Rationale**: Native lazy loading is supported in all modern target browsers (Chrome 77+, Firefox 75+, Safari 15.4+, Edge 79+). Zero JavaScript required. Works with the Zero-Framework Simplicity principle.

**Alternatives considered**:
- IntersectionObserver-based JS lazy loading — more control but adds complexity
- Third-party lazy loading library — adds dependency (violates constitution)
- No lazy loading — hurts performance on image-heavy pages

**Implementation notes**:
- Hero image: `loading="eager"` (above fold, must load immediately)
- All other images: `loading="lazy"` (about section, services icons if image-based)
- Width/height attributes set on `<img>` to prevent layout shift (CLS)

## 6. CSS Custom Properties Architecture

**Decision**: All design tokens defined as CSS variables in `:root`. Mobile-first breakpoints at 480px, 768px, 1024px.

**Rationale**: CSS custom properties enable theming by changing ~10 lines in `:root`. Combined with mobile-first media queries, this creates a maintainable, rebrandable design system with no build tools.

**Alternatives considered**:
- Sass/LESS variables — requires build step (violates constitution)
- CSS-in-JS — requires JavaScript framework (violates constitution)
- Utility classes (Tailwind-style) — too much markup coupling, requires build

**Implementation notes**:
- Color tokens: `--primary`, `--primary-light`, `--accent`, `--accent-dark`, `--danger`, `--whatsapp`, `--neutral-dark`, `--neutral-light`, `--text`, `--text-light`
- Typography: `--font-display`, `--font-body`
- Spacing: `--radius`, `--radius-lg`, `--container`, `--shadow`, `--shadow-hover`
- Transition: `--transition` (single timing value reused everywhere)

## 7. Nginx Security Headers & CSP Policy

**Decision**: Full security header suite with Content-Security-Policy tailored to Google Fonts + Razorpay CDN.

**Rationale**: Healthcare websites handle patient trust. Proper security headers prevent XSS, clickjacking, MIME sniffing, and other attacks without requiring application-level changes.

**Alternatives considered**:
- Minimal headers (just X-Frame-Options) — insufficient for production healthcare site
- Overly strict CSP blocking all inline styles — breaks Google Fonts rendering
- Cloudflare proxy — adds complexity and cost, better suited for high-traffic sites

**Implementation notes**:
- CSP allows: `self`, Google Fonts (style-src + font-src), Razorpay (script-src + frame-src), Google Analytics (connect-src), inline styles (required for Google Fonts FOUC prevention)
- HSTS: `max-age=31536000; includeSubDomains`
- X-Frame-Options: SAMEORIGIN (prevents embedding in iframes)
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: deny geolocation and microphone

## 8. Deployment Strategy (Hostinger VPS)

**Decision**: `rsync` over SSH with pre-flight Nginx config test, followed by graceful reload.

**Rationale**: For a static site with <10 files, rsync is the simplest and most reliable deployment. It handles incremental updates, preserves permissions, and works over any SSH connection. No Docker, no CI/CD pipeline needed.

**Alternatives considered**:
- GitHub Actions + SSH deploy — good for automation but adds CI dependency
- Docker container — massive overkill for 5 static files
- FTP/SFTP upload — less reliable than rsync (no delta sync, no checksum verification)
- Git pull on server — requires git on server, potential merge conflicts

**Implementation notes**:
- `deploy.sh` script using `rsync -avz --delete`
- Excludes: `.git/`, `node_modules/`, `deploy.sh`, `*.md`, `nginx.conf`
- Remote tasks: `chown www-data`, `chmod 644/755`, `nginx -t`, `systemctl reload nginx`
- First-time setup comments included for Certbot SSL + Nginx config installation
