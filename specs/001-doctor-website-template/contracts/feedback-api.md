# Contract: Feedback Submission API

**Type**: HTTP API (provided by Admin Dashboard — spec 002)
**Consumer**: Static template site (`assets/js/app.js`)
**Provider**: Admin Dashboard API

## Purpose

Defines the API contract that the doctor website template uses to submit patient feedback. The admin dashboard (spec 002) implements the server side; this contract specifies what the template expects.

## Endpoint

```
POST {feedback.api_endpoint}/submit
Content-Type: application/json
```

The base URL comes from `feedback.api_endpoint` in `doctor-profile.json`.

## Request Payload

```json
{
  "site_id": "prashant-dental-pune",
  "patient_name": "Rahul Sharma",
  "rating": 5,
  "text": "Excellent treatment and care. Highly recommend Dr. Prashant.",
  "service": "Oral Cancer Surgery",
  "submitted_at": "2026-07-06T10:30:00.000Z"
}
```

### Field Validation (client-side, before submission)

| Field | Type | Constraints |
|-------|------|-------------|
| `site_id` | string | From config `site_id`, non-empty |
| `patient_name` | string | Required, 1–100 characters, trimmed |
| `rating` | integer | Required, 1–5 |
| `text` | string | Required, 1–500 characters, trimmed |
| `service` | string | Required, must match a service name from config `services[]` |
| `submitted_at` | ISO 8601 string | Required, client-generated UTC timestamp |

## Response

### Success (201 Created)

```json
{
  "status": "received",
  "message": "Thank you for your feedback!",
  "published": true
}
```

- `published: true` — feedback met threshold and will appear on site after next config sync.
- `published: false` — feedback sent to doctor for review.

### Validation Error (400 Bad Request)

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": ["rating must be between 1 and 5"]
}
```

### Server Error (500 / 503)

```json
{
  "status": "error",
  "message": "Service unavailable"
}
```

## CORS Requirements

The admin dashboard API must include CORS headers allowing requests from the doctor site's domain:

```
Access-Control-Allow-Origin: https://doctor-domain.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Fallback Behavior (Template Side)

When the API is unreachable (network error, 5xx, or timeout > 10s):

1. Show user-friendly error: "Unable to submit feedback online."
2. Offer WhatsApp fallback: open `wa.me/{doctor_whatsapp}` with pre-filled message containing the feedback text.
3. Pattern mirrors existing Razorpay unavailable fallback (FR-012).

## Security Considerations

- No authentication required from patient (public form submission).
- Rate limiting is handled server-side by the admin dashboard (recommend: max 5 submissions per IP per hour).
- All text fields must be sanitized on both client (before submission) and server (before storage/display).
- `site_id` is validated server-side against registered sites.
