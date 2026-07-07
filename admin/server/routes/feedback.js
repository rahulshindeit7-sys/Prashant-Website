const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();
const SUBMISSIONS_PATH = path.join(__dirname, '..', 'data', 'feedback-submissions.json');
const PUBLIC_RATING_THRESHOLD = 4;

function readSubmissions() {
  if (!fs.existsSync(SUBMISSIONS_PATH)) {
    return [];
  }

  const data = fs.readFileSync(SUBMISSIONS_PATH, 'utf-8');
  return data.trim() ? JSON.parse(data) : [];
}

function saveSubmissions(submissions) {
  fs.writeFileSync(SUBMISSIONS_PATH, JSON.stringify(submissions, null, 2), 'utf-8');
}

function cleanString(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\x00-\x1f\x7f]/g, '').trim();
}

function validateFeedback(body) {
  const errors = [];
  const payload = {
    site_id: cleanString(body.site_id),
    patient_name: cleanString(body.patient_name),
    rating: Number.parseInt(body.rating, 10),
    text: cleanString(body.text),
    service: cleanString(body.service),
    submitted_at: cleanString(body.submitted_at)
  };

  if (!payload.site_id) errors.push('site_id is required');
  if (!payload.patient_name) errors.push('patient_name is required');
  if (payload.patient_name.length > 100) errors.push('patient_name must be 100 characters or less');
  if (!Number.isInteger(payload.rating) || payload.rating < 1 || payload.rating > 5) {
    errors.push('rating must be between 1 and 5');
  }
  if (!payload.text) errors.push('text is required');
  if (payload.text.length > 500) errors.push('text must be 500 characters or less');
  if (!payload.service) errors.push('service is required');
  if (!payload.submitted_at || Number.isNaN(Date.parse(payload.submitted_at))) {
    errors.push('submitted_at must be a valid ISO date');
  }

  return { payload, errors };
}

// POST /api/feedback/submit - Receive patient feedback from public doctor sites
router.post('/submit', (req, res) => {
  try {
    const { payload, errors } = validateFeedback(req.body || {});
    if (errors.length) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    const published = payload.rating >= PUBLIC_RATING_THRESHOLD;
    const submission = {
      id: crypto.randomUUID(),
      ...payload,
      status: published ? 'pending_publication' : 'doctor_review',
      published,
      received_at: new Date().toISOString()
    };

    const submissions = readSubmissions();
    submissions.unshift(submission);
    saveSubmissions(submissions);

    res.status(201).json({
      status: 'received',
      message: 'Thank you for your feedback!',
      published
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message || 'Service unavailable'
    });
  }
});

module.exports = router;