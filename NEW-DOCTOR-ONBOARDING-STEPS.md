# New Doctor Website + CMS Onboarding Steps

Date: 2026-07-08

## Goal

This SOP helps you create a new doctor website using the same setup as Dr. Prashant and manage it via CMS.

## Step 1: Collect Intake Data

Collect and verify the following:

- Doctor full name, degree, specialty, years of experience
- Registration number, certifications, awards
- Clinic address, city, pincode, phone, WhatsApp, email
- Clinic timings (weekdays, Saturday, Sunday)
- About profile content
- Services list
- Expertise topics and detailed content
- Testimonials and FAQs
- SEO data (meta title, meta description, keywords)
- Domain and DNS access details

## Step 2: Create Doctor Bootstrap in Project

Run this command from project root:

npm run onboard:doctor -- --id <doctor-id> --name "Dr. Full Name" --username <cms-username> --specialty "Specialty"

Example:

npm run onboard:doctor -- --id amol --name "Dr. Amol Patil" --username amol --specialty "Cardiology"

This command does two things:

- Creates config/<doctor-id>-profile.json
- Adds doctor entry in config/doctors-list.json

## Step 3: Fill New Doctor Config

Open config/<doctor-id>-profile.json and replace all placeholders.

Mandatory checks:

- Correct doctor and clinic details
- Correct images and contact fields
- services populated
- expertise_items populated
- expertise detail data present and section-wise

## Step 4: Expertise Detail Content Rules

For every expertise topic, keep section-wise structured data:

- overview
- key_points
- when_to_consult
- treatment_options
- faqs

Also keep list and detail sync:

- expertise_items has card/list items
- expertise has full detail content

## Step 5: Local Validation

Run local checks:

- npm run check:config
- npm run start

Then verify pages:

- Home
- Profile
- Expertise list
- Expertise detail (Read More)
- Contact

No "Not Found" should appear for valid expertise slugs.

## Step 6: CMS Validation

In CMS dashboard:

- Login using doctor username
- Save draft
- Open preview
- Verify preview navigation keeps preview mode active
- Verify section-wise expertise rendering is correct
- Publish and re-check live content

## Step 7: Deploy on VPS

Deploy static site to:

/var/www/doctor-sites/<domain-or-site-id>

Verify CMS backend and services:

- PM2 process healthy
- API routes reachable
- Nginx domain mapping correct
- SSL active and HTTP redirects to HTTPS

## Step 8: Cache Bust After JS Changes

If frontend/CMS JS is updated, bump script version query so browser loads fresh file.

Example pattern:

assets/js/app.js?v=20260708d

## Step 9: Go-Live Checklist

Before final approval:

- Desktop and mobile layout check
- Call, WhatsApp, contact form check
- SEO title and meta description check
- No console errors on key pages
- Doctor approval received

## Step 10: Post Go-Live Monitoring (24-48 Hours)

- Check app and API logs
- Verify feedback submissions
- Check for 404 or broken links
- Keep backup of config and deployment notes

## Important Operational Notes

- Always verify correct running CMS path before editing on VPS.
- Preview issues usually come from token persistence, link propagation, or stale cache.
- Keep expertise_items and expertise synchronized to avoid Read More mismatch.
- Do not skip cache-busting when script changes are deployed.

## Quick One-Doctor Execution Flow

1. Run onboarding command.
2. Fill config/<doctor-id>-profile.json.
3. Validate locally.
4. Test draft and preview in CMS.
5. Publish and verify live.
6. Complete go-live checklist.
