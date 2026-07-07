# Contract: doctor-profile.json Configuration Schema

**Type**: JSON Configuration File
**Location**: `config/doctor-profile.json`
**Consumer**: Static pages + `assets/js/app.js`

## Purpose

Single source of truth for homepage and additional route pages. Homepage behavior remains unchanged. New pages and expertise detail content are added through config only.

## Contract Additions for Hybrid Multi-Page Scope

```json
{
  "pages": {
    "home": {
      "anchors": [
        { "id": "about", "label": "About" },
        { "id": "services", "label": "Services" }
      ]
    },
    "profile": { "enabled": true, "path": "profile.html", "nav_label": "Profile" },
    "expertise": { "enabled": true, "path": "expertise.html", "nav_label": "Expertise" },
    "contact": { "enabled": true, "path": "contact.html", "nav_label": "Contact" }
  },
  "expertise": [
    {
      "slug": "oral-cancer-surgery",
      "title": "Oral Cancer Surgery",
      "summary": "Diagnosis and treatment planning for oral malignancies.",
      "hero_image": "assets/images/expertise/oral-cancer.jpg",
      "content_blocks": [
        {
          "type": "paragraph",
          "heading": "Overview",
          "body": "Config-driven detail content for the reusable expertise template."
        }
      ],
      "related_slugs": ["head-neck-reconstruction"]
    }
  ],
  "seo": {
    "pages": {
      "profile": {
        "meta_title": "Dr. Name Profile | Specialty | City",
        "meta_description": "Profile page description.",
        "canonical": "/profile"
      },
      "expertise": {
        "meta_title": "Expertise | Dr. Name",
        "meta_description": "Expertise listing page description.",
        "canonical": "/expertise"
      },
      "contact": {
        "meta_title": "Contact | Dr. Name",
        "meta_description": "Contact page description.",
        "canonical": "/contact"
      },
      "expertise_detail": {
        "meta_title_template": "{title} | Dr. Name",
        "meta_description_template": "{summary}",
        "canonical_template": "/expertise/{slug}"
      }
    }
  },
  "sections": {
    "knowledgebase": { "enabled": false },
    "research_publications": { "enabled": false }
  }
}
```

## Validation Rules

- Homepage anchor links must remain functional and unchanged in behavior.
- `pages.profile.enabled`, `pages.expertise.enabled`, and `pages.contact.enabled` are required booleans for this scope.
- `expertise[].slug` is required, unique, lowercase, and URL-safe.
- Expertise detail rendering must rely on one reusable template resolved by slug.
- `sections.knowledgebase.enabled` and `sections.research_publications.enabled` must remain `false`.
- `feedback.enabled` controls visibility of the feedback form section.
- `feedback.api_endpoint` is required when feedback is enabled.

## Contract Additions for Patient Feedback

```json
{
  "feedback": {
    "enabled": true,
    "form_title": "Share Your Experience",
    "api_endpoint": "https://admin.yourdomain.com/api/feedback",
    "rating_threshold": 4,
    "services_dropdown": true
  }
}
```

### Feedback Config Fields

| Field | Type | Required | Default | Description |
|-------|------|:--------:|---------|-------------|
| `feedback.enabled` | boolean | ✅ | `false` | Show/hide the feedback form section |
| `feedback.form_title` | string | ❌ | `"Share Your Experience"` | Section heading |
| `feedback.api_endpoint` | string | ✅ (if enabled) | — | Admin dashboard API URL |
| `feedback.rating_threshold` | number | ❌ | `4` | Minimum stars for auto-publish |
| `feedback.services_dropdown` | boolean | ❌ | `true` | Show service selector in form |

### Feedback Submission Behavior

- When `feedback.enabled` is `true`, the feedback form renders on the page.
- Form fields: patient name, star rating (1-5), feedback text, service received (dropdown from `services[]` array).
- On submit: POST to `feedback.api_endpoint` with payload including `site_id` from config.
- On success: show confirmation message to patient.
- On API failure: graceful fallback to WhatsApp with pre-filled feedback text (same pattern as Razorpay fallback in FR-012).
- When `feedback.enabled` is `false` or field is missing, the feedback form section is hidden.

## Exclusion Rules

The following must not be present in generated nav/routes/pages:

- Knowledgebase
- Research & Publications

## Breaking Change Policy

Any rename or nesting change for `pages`, `expertise`, `seo.pages`, or `sections` is a contract-breaking change and requires:

1. Migration notes in `CONFIG-GUIDE.md`
2. Backward-compatible parsing fallback in JS during transition
3. Semver major version bump
