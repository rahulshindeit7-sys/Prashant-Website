#!/usr/bin/env node
/*
  Non-interactive CSV batch intake.
  Generates doctor-profile.json + intake summary for each row.
*/

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DEFAULT_INPUT = path.join(ROOT, 'config', 'intake-batch.csv');
const OUT_ROOT = path.join(ROOT, 'generated');

function parseArgs(argv) {
  const args = { file: DEFAULT_INPUT };
  for (let i = 2; i < argv.length; i += 1) {
    const cur = argv[i];
    if (cur === '--file' && argv[i + 1]) {
      args.file = path.resolve(ROOT, argv[i + 1]);
      i += 1;
    }
  }
  return args;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function toSlug(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function asNumber(input, fallback = 0) {
  const n = Number(input);
  return Number.isFinite(n) ? n : fallback;
}

function toBool(input) {
  const v = String(input || '').trim().toLowerCase();
  return v === 'true' || v === 'yes' || v === 'y' || v === '1';
}

function splitPipe(input) {
  return String(input || '')
    .split('|')
    .map((x) => x.trim())
    .filter(Boolean);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && next === '\n') i += 1;
      row.push(cell);
      const hasData = row.some((c) => String(c).trim().length > 0);
      if (hasData) rows.push(row);
      row = [];
      cell = '';
      continue;
    }

    cell += ch;
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    const hasData = row.some((c) => String(c).trim().length > 0);
    if (hasData) rows.push(row);
  }

  if (!rows.length) return [];
  const headers = rows[0].map((h) => String(h || '').trim());
  return rows.slice(1).map((r) => {
    const out = {};
    headers.forEach((h, idx) => {
      out[h] = String(r[idx] || '').trim();
    });
    return out;
  });
}

function required(row, fieldName) {
  const value = String(row[fieldName] || '').trim();
  if (!value) {
    throw new Error(`Missing required field: ${fieldName}`);
  }
  return value;
}

function parseServices(raw) {
  // Format: name~icon~description~price | name~icon~description~price
  return splitPipe(raw).map((item) => {
    const parts = item.split('~').map((x) => x.trim());
    return {
      name: parts[0] || 'Service',
      icon: parts[1] || '*',
      description: parts[2] || '',
      price_range: parts[3] || 'On Consultation',
    };
  });
}

function parseTestimonials(raw) {
  // Format: name~location~rating~text~YYYY-MM | ...
  return splitPipe(raw).map((item) => {
    const parts = item.split('~').map((x) => x.trim());
    return {
      name: parts[0] || 'Patient',
      location: parts[1] || '',
      rating: Math.min(5, Math.max(1, asNumber(parts[2], 5))),
      text: parts[3] || '',
      date: parts[4] || '',
    };
  });
}

function parseFaqs(raw) {
  // Format: question~answer | question~answer
  return splitPipe(raw).map((item) => {
    const parts = item.split('~').map((x) => x.trim());
    return {
      question: parts[0] || '',
      answer: parts[1] || '',
    };
  }).filter((f) => f.question && f.answer);
}

function parseExpertiseItems(raw) {
  // Format: title~description~url | title~description~url
  return splitPipe(raw).map((item) => {
    const parts = item.split('~').map((x) => x.trim());
    return {
      title: parts[0] || 'Expertise Area',
      description: parts[1] || '',
      read_more_url: parts[2] || '',
    };
  }).filter((x) => x.title && x.description);
}

function makeSummaryText(data) {
  const lines = [];
  lines.push('Doctor Website Intake Summary');
  lines.push('============================');
  lines.push(`Generated At: ${new Date().toISOString()}`);
  lines.push('');
  lines.push(`site_id: ${data.site_id}`);
  lines.push(`Doctor: ${data.doctor.name}`);
  lines.push(`Specialization: ${data.doctor.specialization}`);
  lines.push(`Clinic: ${data.clinic.name}`);
  lines.push(`City: ${data.clinic.city}`);
  lines.push(`Phone: ${data.clinic.phone}`);
  lines.push(`WhatsApp: ${data.clinic.whatsapp}`);
  lines.push(`Show Timings on Website: ${data.clinic.show_timing !== false ? 'Yes' : 'No'}`);
  lines.push(`Consultation Fee: ${data.payment.consultation_fee} ${data.payment.currency}`);
  lines.push(`Services: ${(data.services || []).length}`);
  lines.push(`Expertise Items: ${(data.expertise_items || []).length}`);
  lines.push(`Expertise Section Title: ${(data.expertise_section || {}).title || ''}`);
  lines.push(`Testimonials: ${(data.testimonials || []).length}`);
  lines.push(`FAQs: ${(data.faqs || []).length}`);
  lines.push('');
  lines.push('Approval Checklist');
  lines.push('- Confirm doctor and clinic details');
  lines.push('- Confirm timing and contact numbers');
  lines.push('- Confirm pricing and payment setup');
  lines.push('- Confirm SEO title/description and local keywords');
  lines.push('');
  return lines.join('\n');
}

function rowToConfig(row) {
  const doctorName = required(row, 'doctor_name');
  const city = required(row, 'clinic_city');
  const siteIdRaw = String(row.site_id || '').trim();
  const siteId = siteIdRaw || toSlug(`${doctorName} ${city}`) || `doctor-site-${Date.now()}`;

  return {
    _instructions: {
      HOW_TO_USE: 'Generated from CSV intake batch utility.',
      STEPS: [
        '1. Review this file and summary',
        '2. Run npm run check:config after copying to active config path',
      ],
    },
    site_id: siteId,
    doctor: {
      name: doctorName,
      degree: required(row, 'doctor_degree'),
      specialization: required(row, 'doctor_specialization'),
      secondary_specializations: splitPipe(row.doctor_secondary_specializations),
      experience_years: asNumber(required(row, 'doctor_experience_years'), 1),
      registration_number: String(row.doctor_registration_number || '').trim(),
      certifications: splitPipe(row.doctor_certifications),
      awards: splitPipe(row.doctor_awards),
      tagline: required(row, 'doctor_tagline'),
      languages: splitPipe(required(row, 'doctor_languages')),
      photo: String(row.doctor_photo || '').trim() || 'assets/images/doctor-placeholder.svg',
      about: required(row, 'doctor_about'),
    },
    clinic: {
      name: required(row, 'clinic_name'),
      address: required(row, 'clinic_address'),
      city,
      pincode: String(row.clinic_pincode || '').trim(),
      phone: required(row, 'clinic_phone'),
      whatsapp: required(row, 'clinic_whatsapp'),
      email: required(row, 'clinic_email'),
      website: String(row.clinic_website || '').trim(),
      show_timing: row.clinic_show_timing === '' ? true : toBool(row.clinic_show_timing),
      timing: {
        weekdays: required(row, 'timing_weekdays'),
        saturday: required(row, 'timing_saturday'),
        sunday: required(row, 'timing_sunday'),
      },
      google_maps_embed: String(row.clinic_google_maps_embed || '').trim(),
      geo: {
        latitude: asNumber(required(row, 'clinic_geo_latitude'), 0),
        longitude: asNumber(required(row, 'clinic_geo_longitude'), 0),
      },
      area_served: splitPipe(required(row, 'clinic_area_served')),
      appointment_only: toBool(row.clinic_appointment_only),
      branches_note: String(row.clinic_branches_note || '').trim(),
      photos: splitPipe(row.clinic_photos),
    },
    services: parseServices(required(row, 'services')),
    expertise_section: {
      label: String(row.expertise_section_label || '').trim() || 'Special Focus',
      title: String(row.expertise_section_title || '').trim() || 'Complete Expertise in Head and Neck Cancer Treatment',
      subtitle: String(row.expertise_section_subtitle || '').trim(),
    },
    expertise_items: parseExpertiseItems(String(row.expertise_items || '').trim()),
    testimonials: parseTestimonials(String(row.testimonials || '').trim()),
    faqs: parseFaqs(String(row.faqs || '').trim()),
    payment: {
      razorpay_key_id: String(row.payment_razorpay_key_id || '').trim(),
      consultation_fee: asNumber(required(row, 'payment_consultation_fee'), 500),
      currency: String(row.payment_currency || '').trim() || 'INR',
    },
    seo: {
      meta_title: required(row, 'seo_meta_title'),
      meta_description: required(row, 'seo_meta_description'),
      keywords: splitPipe(required(row, 'seo_keywords')),
      local_keywords: splitPipe(required(row, 'seo_local_keywords')),
      og_image: String(row.seo_og_image || '').trim() || 'assets/images/og-image.jpg',
      schema_type: String(row.seo_schema_type || '').trim() || 'Physician',
      google_analytics_id: String(row.seo_google_analytics_id || '').trim(),
    },
    social: {
      google_business: String(row.social_google_business || '').trim(),
      instagram: String(row.social_instagram || '').trim(),
      facebook: String(row.social_facebook || '').trim(),
    },
    media: {
      videos: [],
    },
  };
}

function main() {
  const args = parseArgs(process.argv);
  if (!fs.existsSync(args.file)) {
    console.error(`CSV file not found: ${args.file}`);
    console.error('Create from template: config/intake-batch.template.csv');
    process.exit(1);
  }

  const raw = fs.readFileSync(args.file, 'utf8');
  const rows = parseCsv(raw);
  if (!rows.length) {
    console.error('No data rows found in CSV.');
    process.exit(1);
  }

  ensureDir(OUT_ROOT);
  const errors = [];
  let ok = 0;

  rows.forEach((row, idx) => {
    try {
      const cfg = rowToConfig(row);
      const siteDir = path.join(OUT_ROOT, cfg.site_id);
      ensureDir(siteDir);

      const jsonPath = path.join(siteDir, 'doctor-profile.json');
      const summaryPath = path.join(siteDir, `intake-summary-${cfg.site_id}.txt`);

      fs.writeFileSync(jsonPath, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
      fs.writeFileSync(summaryPath, makeSummaryText(cfg), 'utf8');
      ok += 1;
      console.log(`[OK] ${cfg.site_id} -> ${jsonPath}`);
    } catch (e) {
      errors.push(`Row ${idx + 2}: ${e.message}`);
    }
  });

  console.log(`\nBatch completed. Success: ${ok}, Failed: ${errors.length}`);
  if (errors.length) {
    console.log('Errors:');
    errors.forEach((e) => console.log(`- ${e}`));
    process.exitCode = 1;
  } else {
    console.log(`Output root: ${OUT_ROOT}`);
    console.log('Copy any generated doctor-profile.json to config/doctor-profile.json to preview a specific doctor.');
  }
}

main();
