# Research: Doctor Website Template

**Feature**: `001-doctor-website-template` | **Date**: 2026-07-03

## 1. Hybrid Information Architecture

**Decision**: Use hybrid navigation: keep homepage anchors unchanged and add dedicated route pages for Profile, Expertise, expertise detail, and Contact.

**Rationale**: This satisfies the explicit requirement to preserve the previously designed homepage while still matching the multi-page pattern of the reference site.

**Alternatives considered**:
- Full route-only navigation for every section: rejected because it would alter homepage behavior.
- Keep single-page only: rejected because it does not satisfy new scope.

## 2. Expertise Detail Page Strategy

**Decision**: Implement one reusable expertise detail template resolved by `slug` from config, with unique SEO-friendly URLs per expertise topic.

**Rationale**: Maintains config-first simplicity and avoids duplicated markup while still supporting crawlable, sharable expertise pages.

**Alternatives considered**:
- One physical HTML file per expertise topic: high maintenance and error-prone.
- No detail pages: rejected because requirement includes expertise detail pages.

## 3. Exclusion Policy for Removed Sections

**Decision**: Exclude Knowledgebase and Research & Publications from nav, routes, and generated page output.

**Rationale**: User explicitly requested copying pattern except those sections. Exclusion at contract level avoids accidental re-introduction in future edits.

**Alternatives considered**:
- Keep hidden placeholders: rejected due to SEO confusion and maintenance overhead.
- Keep routes but no nav links: rejected because pages must be absent, not discoverable.

## 4. Config Model Extension for Multi-Page Content

**Decision**: Extend `doctor-profile.json` with page-level and expertise-detail content groups while preserving all existing homepage keys.

**Rationale**: Config-first constitutional rule requires that new pages remain editable without template code changes.

**Alternatives considered**:
- Split config into multiple files: rejected to preserve single-file editing workflow.
- Hardcode static text on new pages: rejected by constitution.

## 5. SEO & Metadata for Route Pages

**Decision**: Add per-page metadata keys (title, description, canonical/slug) for Profile, Expertise listing, Expertise detail, and Contact.

**Rationale**: Prevents duplicate metadata and supports page-specific indexing quality for the expanded architecture.

**Alternatives considered**:
- Reuse homepage metadata globally: rejected due to duplicate titles/descriptions.
- Client-side metadata only after render with no canonical strategy: weaker crawl reliability.

## 6. Static Hosting Compatibility

**Decision**: Use explicit HTML page routes (`profile.html`, `expertise.html`, `expertise-detail.html`, `contact.html`) and query/slug resolution in vanilla JS.

**Rationale**: Works reliably on simple static hosting and Nginx without adding SPA rewrite complexity.

**Alternatives considered**:
- Full SPA history routing: rejected due to hosting rewrite requirements and avoidable complexity.
- Server-side templating: rejected by zero-framework and no-build constraints.

## 7. Patient Feedback Submission Architecture

**Decision**: On-page feedback form submits via `fetch()` POST to admin dashboard API endpoint. Admin dashboard handles classification, storage, approval flow, and config sync.

**Rationale**: The static template has no backend. The admin dashboard (spec 002) already has SSH write access to managed sites and handles config updates. Routing feedback through the admin dashboard avoids adding a backend to the template while maintaining config-first principle (approved feedback ultimately lives in `doctor-profile.json` testimonials array).

**Alternatives considered**:
- Template-hosted backend/API: rejected by zero-framework and static hosting constraints.
- Third-party form service (Google Forms, Typeform): rejected due to loss of control and poor UX integration.
- WhatsApp-only submission with manual config editing: rejected as too labor-intensive for doctors.
- Client-side localStorage + periodic sync: rejected due to data loss risk and no cross-device visibility.

## 8. Feedback Auto-Classification Strategy

**Decision**: Use star rating threshold (≥4 stars = positive/auto-publish, <4 stars = negative/doctor-review). Admin dashboard applies this rule server-side upon receiving feedback.

**Rationale**: Simple, objective, deterministic classification. No AI/NLP dependency. Patients implicitly understand that a high rating means public endorsement. Doctor retains control over negative feedback.

**Alternatives considered**:
- Full manual moderation queue (all feedback requires approval): rejected as too much friction for doctors with busy practices.
- NLP sentiment analysis: rejected due to added complexity, unreliable for short text, and framework dependency.
- Configurable threshold in doctor-profile.json: considered for future iteration, but fixed ≥4 threshold is sufficient for v1.

## 9. Approved Feedback Display Sync

**Decision**: Admin dashboard appends approved feedback (≥4 stars) to the `testimonials` array in `doctor-profile.json`, then triggers config deploy to VPS (same atomic symlink deploy used for manual config edits).

**Rationale**: Testimonials section already renders from config array. Approved feedback becomes indistinguishable from manually-added testimonials — unified social proof. No new runtime endpoint needed on the static site.

**Alternatives considered**:
- Separate live API endpoint for feedback (template fetches at runtime): rejected because it breaks config-first principle and adds runtime dependency.
- Separate JSON file for feedback (e.g., `feedback.json`): rejected to avoid config fragmentation and maintain single-file editing workflow.
- Real-time display without redeploy: rejected due to static hosting constraint.

## 10. Negative Feedback WhatsApp Notification

**Decision**: Admin dashboard sends WhatsApp notification to doctor using the WhatsApp Click-to-Chat URL API (wa.me) opened server-side or generates a notification that the admin operator can forward. For v1, admin dashboard logs negative feedback and the dashboard operator triggers the WhatsApp message.

**Rationale**: WhatsApp Business API requires business verification and costs money. For v1 with a small number of sites, the admin dashboard can surface negative feedback prominently and the operator sends a WhatsApp message. The static template itself opens wa.me URL as a fallback when admin dashboard is unavailable.

**Alternatives considered**:
- WhatsApp Business API (automated): considered for v2 but requires business account setup per doctor.
- Email notification: rejected because Indian doctors prefer WhatsApp over email.
- SMS notification: rejected due to cost and WhatsApp preference.
- Admin dashboard push notification only: insufficient urgency for negative feedback.

## 11. Feedback Form Fallback (Admin Dashboard Unavailable)

**Decision**: When the admin dashboard API is unreachable, the feedback form falls back to opening WhatsApp with pre-filled feedback details (same pattern as appointment booking Razorpay fallback).

**Rationale**: Graceful degradation is an established pattern in this template (FR-012). The patient's feedback is not lost — it reaches the doctor via WhatsApp for manual handling.

**Alternatives considered**:
- Silently drop feedback with error message only: rejected due to poor patient experience.
- Queue in localStorage and retry later: rejected due to data loss risk on device switch/clear.
