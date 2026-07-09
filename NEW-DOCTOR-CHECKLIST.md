# New Doctor Onboarding Checklist

Use this checklist for every new doctor website + CMS onboarding.

## 1. Intake and Assets

- Doctor full name, degree, specialization, years of experience
- Registration number, certifications, awards
- Clinic details: address, city, pincode, phone, WhatsApp, email
- Timings (weekdays, Saturday, Sunday, or appointment-only)
- Doctor profile photos and clinic images
- Services/treatments list
- Expertise list and details
- Testimonials and FAQs
- SEO details: meta title, meta description, keywords, local keywords
- Domain and DNS access

## 2. Create Config and Login Entry

- Run onboarding script from repo root:

```bash
npm run onboard:doctor -- --id <doctor-id> --name "Dr. Full Name" --username <cms-username> --specialty "Specialty"
```

- Confirm generated config exists at `config/<doctor-id>-profile.json`
- Confirm doctor entry is added in `config/doctors-list.json`

## 3. Fill Doctor Config

- Open `config/<doctor-id>-profile.json`
- Replace all placeholder data with final doctor/clinic/content data
- Ensure `expertise_items` and `expertise` are both present and aligned
- For each expertise detail include section-wise data:
  - overview
  - key_points
  - when_to_consult
  - treatment_options
  - faqs

## 4. Local Validation

- Validate JSON and run local preview
- Verify pages:
  - home
  - profile
  - expertise list
  - expertise detail read more pages
  - contact
- Verify no "Not Found" on expertise detail

## 5. CMS Flow Validation

- Login to CMS with created username
- Save draft changes
- Open preview and verify all sections render
- Ensure preview links maintain preview mode while navigating
- Publish and verify live rendering

## 6. VPS Deployment

- Deploy site files to `/var/www/doctor-sites/<domain-or-site-id>`
- Ensure CMS backend process is healthy (PM2)
- Ensure API routes are reachable
- Ensure Nginx vhost for domain is correct
- SSL setup and HTTPS redirect enabled

## 7. Go-Live Checks

- Desktop and mobile layout check
- Call/WhatsApp/contact form check
- SEO title/description/schema check
- No console errors on key pages
- Final doctor approval received

## 8. Post Go-Live (24-48h)

- Check error logs and API logs
- Verify feedback submissions
- Verify no broken links/404s
- Keep backup of config + deployment notes
