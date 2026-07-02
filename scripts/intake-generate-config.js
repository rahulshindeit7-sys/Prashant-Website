#!/usr/bin/env node
/*
  Intake wizard for non-technical team members.
  It asks guided questions and generates config/doctor-profile.json.
*/

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, 'config', 'doctor-profile.json');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function summaryLine(label, value) {
  return `${label}: ${value || ''}`;
}

function makeSummaryText(data) {
  const lines = [];
  lines.push('Doctor Website Intake Summary');
  lines.push('============================');
  lines.push(`Generated At: ${new Date().toISOString()}`);
  lines.push('');

  lines.push('[Site Identity]');
  lines.push(summaryLine('site_id', data.site_id));
  lines.push(summaryLine('Clinic Name', data.clinic.name));
  lines.push(summaryLine('City', data.clinic.city));
  lines.push('');

  lines.push('[Doctor]');
  lines.push(summaryLine('Name', data.doctor.name));
  lines.push(summaryLine('Degree', data.doctor.degree));
  lines.push(summaryLine('Specialization', data.doctor.specialization));
  lines.push(summaryLine('Experience Years', String(data.doctor.experience_years)));
  lines.push(summaryLine('Languages', (data.doctor.languages || []).join(', ')));
  lines.push(summaryLine('Registration Number', data.doctor.registration_number));
  lines.push(summaryLine('Tagline', data.doctor.tagline));
  lines.push('');

  lines.push('[Clinic Contact]');
  lines.push(summaryLine('Address', data.clinic.address));
  lines.push(summaryLine('Phone', data.clinic.phone));
  lines.push(summaryLine('WhatsApp', data.clinic.whatsapp));
  lines.push(summaryLine('Email', data.clinic.email));
  lines.push(summaryLine('Website', data.clinic.website));
  lines.push(summaryLine('Google Maps Embed', data.clinic.google_maps_embed));
  lines.push(summaryLine('Geo', `${data.clinic.geo.latitude}, ${data.clinic.geo.longitude}`));
  lines.push(summaryLine('Area Served', (data.clinic.area_served || []).join(', ')));
  lines.push('');

  lines.push('[Timings]');
  lines.push(summaryLine('Show Timings on Website', String(data.clinic.show_timing !== false)));
  lines.push(summaryLine('Weekdays', data.clinic.timing.weekdays));
  lines.push(summaryLine('Saturday', data.clinic.timing.saturday));
  lines.push(summaryLine('Sunday', data.clinic.timing.sunday));
  lines.push(summaryLine('Appointment Only', String(!!data.clinic.appointment_only)));
  lines.push('');

  lines.push('[SEO]');
  lines.push(summaryLine('Meta Title', data.seo.meta_title));
  lines.push(summaryLine('Meta Description', data.seo.meta_description));
  lines.push(summaryLine('Schema Type', data.seo.schema_type));
  lines.push(summaryLine('OG Image', data.seo.og_image));
  lines.push(summaryLine('GA ID', data.seo.google_analytics_id));
  lines.push(summaryLine('Keywords Count', String((data.seo.keywords || []).length)));
  lines.push(summaryLine('Local Keywords Count', String((data.seo.local_keywords || []).length)));
  lines.push('');

  lines.push('[Commercial]');
  lines.push(summaryLine('Consultation Fee', `${data.payment.consultation_fee} ${data.payment.currency}`));
  lines.push(summaryLine('Razorpay Key Set', data.payment.razorpay_key_id ? 'Yes' : 'No'));
  lines.push('');

  lines.push('[Counts]');
  lines.push(summaryLine('Services', String((data.services || []).length)));
  lines.push(summaryLine('Expertise Items', String((data.expertise_items || []).length)));
  lines.push(summaryLine('Expertise Section Title', (data.expertise_section || {}).title || ''));
  lines.push(summaryLine('Testimonials', String((data.testimonials || []).length)));
  lines.push(summaryLine('FAQs', String((data.faqs || []).length)));
  lines.push('');

  lines.push('[Social]');
  lines.push(summaryLine('Google Business', data.social.google_business));
  lines.push(summaryLine('Instagram', data.social.instagram));
  lines.push(summaryLine('Facebook', data.social.facebook));
  lines.push('');

  lines.push('Approval Checklist');
  lines.push('- Confirm doctor details');
  lines.push('- Confirm clinic address and contact numbers');
  lines.push('- Confirm timings and consultation fee');
  lines.push('- Confirm SEO title/description');
  lines.push('- Confirm testimonials and FAQs have publication consent');

  return lines.join('\n') + '\n';
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve((answer || '').trim()));
  });
}

function toSlug(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function parseList(input) {
  return String(input || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

function asNumber(input, fallback = 0) {
  const n = Number(input);
  return Number.isFinite(n) ? n : fallback;
}

async function askRequired(label, hint) {
  while (true) {
    const msg = hint ? `${label} (${hint}): ` : `${label}: `;
    const val = await ask(msg);
    if (val) return val;
    console.log('This field is required. Please enter a value.');
  }
}

async function askOptional(label, hint) {
  const msg = hint ? `${label} (${hint}, optional): ` : `${label} (optional): `;
  return ask(msg);
}

async function askYesNo(label, defaultYes = false) {
  const suffix = defaultYes ? ' [Y/n]: ' : ' [y/N]: ';
  while (true) {
    const val = (await ask(label + suffix)).toLowerCase();
    if (!val) return defaultYes;
    if (val === 'y' || val === 'yes') return true;
    if (val === 'n' || val === 'no') return false;
    console.log('Please answer y or n.');
  }
}

async function askCount(label, min, max, suggested) {
  while (true) {
    const val = await ask(`${label} (recommended ${suggested}, min ${min}, max ${max}): `);
    const n = Number(val);
    if (Number.isInteger(n) && n >= min && n <= max) return n;
    console.log(`Please enter a number between ${min} and ${max}.`);
  }
}

async function collectServices() {
  const count = await askCount('How many services do you want to add?', 1, 20, '6-12');
  const services = [];
  for (let i = 0; i < count; i += 1) {
    console.log(`\nService ${i + 1}`);
    const name = await askRequired('- Service name', 'for example: Oral Cancer Surgery');
    const icon = (await askOptional('- Icon', 'emoji or text, default: *')) || '*';
    const description = await askRequired('- Description', '1-2 lines');
    const priceRange = await askRequired('- Price range', 'example: INR 500 - INR 1500 or On Consultation');
    services.push({
      name,
      icon,
      description,
      price_range: priceRange,
    });
  }
  return services;
}

async function collectTestimonials() {
  const add = await askYesNo('Do you want to add testimonials now?', true);
  if (!add) return [];

  const count = await askCount('How many testimonials?', 1, 20, '5+');
  const testimonials = [];
  for (let i = 0; i < count; i += 1) {
    console.log(`\nTestimonial ${i + 1}`);
    const name = await askRequired('- Patient name', 'can be short if privacy required');
    const location = await askRequired('- Location', 'example: Pune');
    const ratingRaw = await askRequired('- Rating', '1 to 5');
    const text = await askRequired('- Review text', 'short paragraph');
    const date = await askRequired('- Date', 'YYYY-MM');
    testimonials.push({
      name,
      location,
      rating: Math.min(5, Math.max(1, asNumber(ratingRaw, 5))),
      text,
      date,
    });
  }
  return testimonials;
}

async function collectExpertiseItems() {
  const add = await askYesNo('Do you want to add separate expertise items?', true);
  if (!add) return [];

  const count = await askCount('How many expertise items?', 1, 20, '4-8');
  const items = [];
  for (let i = 0; i < count; i += 1) {
    console.log(`\nExpertise Item ${i + 1}`);
    const title = await askRequired('- Title', 'example: Head and Neck Oncosurgery');
    const description = await askRequired('- Description', '1-2 lines');
    const readMoreUrl = await askOptional('- Read more URL', 'https://...');
    items.push({
      title,
      description,
      read_more_url: readMoreUrl,
    });
  }
  return items;
}

async function collectFaqs() {
  const add = await askYesNo('Do you want to add FAQs now?', true);
  if (!add) return [];

  const count = await askCount('How many FAQs?', 1, 20, '6-10');
  const faqs = [];
  for (let i = 0; i < count; i += 1) {
    console.log(`\nFAQ ${i + 1}`);
    const question = await askRequired('- Question', 'common patient question');
    const answer = await askRequired('- Answer', 'short clear answer');
    faqs.push({ question, answer });
  }
  return faqs;
}

async function run() {
  try {
    console.log('\nDoctor Website Intake Wizard');
    console.log('This will generate config/doctor-profile.json\n');

    const doctorName = await askRequired('Doctor full name', 'example: Dr. A B C');
    const specialization = await askRequired('Primary specialization', 'example: Oral and Maxillofacial Surgeon');
    const city = await askRequired('City, State', 'example: Pune, Maharashtra');
    const clinicName = await askRequired('Clinic name', 'display name on website');

    let siteId = await askOptional('site_id', 'leave empty to auto-generate');
    if (!siteId) {
      siteId = toSlug(`${doctorName} ${city}`);
      if (!siteId) siteId = `doctor-site-${Date.now()}`;
      console.log(`Auto-generated site_id: ${siteId}`);
    }

    console.log('\nDoctor details');
    const degree = await askRequired('Degrees', 'example: BDS, MDS');
    const experienceYears = asNumber(await askRequired('Experience years', 'number only'), 1);
    const tagline = await askRequired('Tagline', 'one line value statement');
    const languages = parseList(await askRequired('Languages', 'comma separated, example: Marathi, Hindi, English'));
    const about = await askRequired('About doctor', '120-300 words');
    const registrationNumber = await askOptional('Registration number', 'if available');
    const certifications = parseList(await askOptional('Certifications', 'comma separated'));
    const awards = parseList(await askOptional('Awards', 'comma separated'));
    const secondarySpecializations = parseList(await askOptional('Secondary specializations', 'comma separated'));

    console.log('\nClinic details');
    const address = await askRequired('Full address', 'include landmark/locality');
    const pincode = await askOptional('Pincode', 'digits only if possible');
    const phone = await askRequired('Phone', 'display number, example: +91 9876543210');
    const whatsapp = await askRequired('WhatsApp', 'with country code, example: +919876543210');
    const email = await askRequired('Email', 'example: clinic@example.com');
    const website = await askOptional('Website URL', 'https://...');
    const googleMapsEmbed = await askOptional('Google Maps embed URL', 'https://www.google.com/maps/embed...');
    const latitude = asNumber(await askRequired('Latitude', 'example: 18.5204'), 0);
    const longitude = asNumber(await askRequired('Longitude', 'example: 73.8567'), 0);
    const areaServed = parseList(await askRequired('Area served localities', 'comma separated, 5-10 recommended'));
    const appointmentOnly = await askYesNo('Appointment-only clinic?', false);
    const branchesNote = await askOptional('Branches note', 'if multiple locations');

    console.log('\nTimings');
    const showTiming = await askYesNo('Show clinic timings on website?', true);
    const weekdays = await askRequired('Weekdays timing', 'example: 10:00 AM - 2:00 PM, 5:00 PM - 8:00 PM');
    const saturday = await askRequired('Saturday timing', 'or Closed');
    const sunday = await askRequired('Sunday timing', 'or Closed');

    console.log('\nMedia and SEO');
    const doctorPhoto = (await askOptional('Doctor photo path', 'default: assets/images/doctor-placeholder.svg')) || 'assets/images/doctor-placeholder.svg';
    const clinicPhotos = parseList(await askOptional('Clinic photo paths', 'comma separated'));
    const ogImage = (await askOptional('OG image path', 'default: assets/images/og-image.jpg')) || 'assets/images/og-image.jpg';
    const metaTitle = await askRequired('Meta title', 'example: Dr Name | Specialty | City');
    const metaDescription = await askRequired('Meta description', 'max around 160 characters');
    const keywords = parseList(await askRequired('SEO keywords', 'comma separated'));
    const localKeywords = parseList(await askRequired('Local keywords', 'comma separated, service + locality terms'));
    const schemaType = (await askOptional('Schema type', 'default: Physician')) || 'Physician';
    const gaId = await askOptional('Google Analytics ID', 'example: G-XXXXXXXXXX');

    console.log('\nSocial links');
    const googleBusiness = await askOptional('Google Business URL', 'https://...');
    const instagram = await askOptional('Instagram URL', 'https://...');
    const facebook = await askOptional('Facebook URL', 'https://...');

    console.log('\nPayment');
    const razorpayKey = await askOptional('Razorpay key id', 'rzp_live_... or rzp_test_...');
    const consultationFee = asNumber(await askRequired('Consultation fee', 'number only, INR'), 500);
    const currency = (await askOptional('Currency', 'default: INR')) || 'INR';

    const services = await collectServices();
    console.log('\nExpertise section heading');
    const expertiseLabel = (await askOptional('Expertise section label', 'default: Special Focus')) || 'Special Focus';
    const expertiseTitle = (await askOptional('Expertise section title', 'default: Complete Expertise in Head and Neck Cancer Treatment')) || 'Complete Expertise in Head and Neck Cancer Treatment';
    const expertiseSubtitle = await askOptional('Expertise section subtitle', 'optional short line below title');
    const expertiseItems = await collectExpertiseItems();
    const testimonials = await collectTestimonials();
    const faqs = await collectFaqs();

    const output = {
      _instructions: {
        HOW_TO_USE: 'Edit ONLY this file to customize the website. No coding needed.',
        STEPS: [
          '1. Replace placeholder values with final clinic data',
          '2. Add doctor photo to assets/images/',
          '3. Add OG image to assets/images/og-image.jpg (1200x630)',
          '4. Update clinic.google_maps_embed from Google Maps',
          '5. Replace Razorpay key in payment.razorpay_key_id',
          '6. Refresh browser after saving this file',
        ],
      },
      site_id: siteId,
      doctor: {
        name: doctorName,
        degree,
        specialization,
        secondary_specializations: secondarySpecializations,
        experience_years: experienceYears,
        registration_number: registrationNumber,
        certifications,
        awards,
        tagline,
        languages,
        photo: doctorPhoto,
        about,
      },
      clinic: {
        name: clinicName,
        address,
        city,
        pincode,
        phone,
        whatsapp,
        email,
        website,
        show_timing: showTiming,
        timing: {
          weekdays,
          saturday,
          sunday,
        },
        google_maps_embed: googleMapsEmbed,
        geo: {
          latitude,
          longitude,
        },
        area_served: areaServed,
        appointment_only: appointmentOnly,
        branches_note: branchesNote,
        photos: clinicPhotos,
      },
      services,
      expertise_section: {
        label: expertiseLabel,
        title: expertiseTitle,
        subtitle: expertiseSubtitle,
      },
      expertise_items: expertiseItems,
      testimonials,
      faqs,
      payment: {
        razorpay_key_id: razorpayKey,
        consultation_fee: consultationFee,
        currency,
      },
      seo: {
        meta_title: metaTitle,
        meta_description: metaDescription,
        keywords,
        local_keywords: localKeywords,
        og_image: ogImage,
        schema_type: schemaType,
        google_analytics_id: gaId,
      },
      social: {
        google_business: googleBusiness,
        instagram,
        facebook,
      },
      media: {
        videos: [],
      },
    };

    if (fs.existsSync(CONFIG_PATH)) {
      const backupPath = path.join(ROOT, 'config', `doctor-profile.backup-${Date.now()}.json`);
      fs.copyFileSync(CONFIG_PATH, backupPath);
      console.log(`\nExisting config backed up to: ${backupPath}`);
    }

    ensureDir(path.join(ROOT, 'config'));
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(output, null, 2) + '\n', 'utf8');

    const summaryPath = path.join(ROOT, 'config', `intake-summary-${siteId}-${Date.now()}.txt`);
    fs.writeFileSync(summaryPath, makeSummaryText(output), 'utf8');

    console.log(`\nGenerated: ${CONFIG_PATH}`);
    console.log(`Summary: ${summaryPath}`);
    console.log('Next steps:');
    console.log('1) Review file once');
    console.log('2) Share summary with client for approval');
    console.log('3) Run: npm run check:config');
    console.log('4) Start site: npm run start');
  } catch (err) {
    console.error('Failed to generate config:', err.message);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
}

run();
