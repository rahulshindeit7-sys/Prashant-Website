#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DOCTORS_LIST_PATH = path.join(ROOT, 'config', 'doctors-list.json');
const DEFAULT_TEMPLATE_PATH = path.join(ROOT, 'config', 'doctor-profile.json');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

function toSlug(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function ensureFileMissing(filePath, label) {
  if (fs.existsSync(filePath)) {
    throw new Error(`${label} already exists: ${filePath}`);
  }
}

function usage() {
  console.log('Usage:');
  console.log('  npm run onboard:doctor -- --id priyanka --name "Dr. Priyanka Patil" --username priyanka --specialty "Dermatology"');
  console.log('');
  console.log('Options:');
  console.log('  --id               Required. Unique doctor id (slug format recommended).');
  console.log('  --name             Required. Full doctor name shown on website.');
  console.log('  --username         Required. CMS username for this doctor.');
  console.log('  --specialty        Optional. Doctor specialty for quick bootstrap.');
  console.log('  --template         Optional. Config template path. Default: config/doctor-profile.json');
  console.log('  --password-hash    Optional. Existing bcrypt hash for CMS login bootstrap.');
  console.log('  --config-file      Optional. Relative config path override. Default: config/<id>-profile.json');
  console.log('');
}

function main() {
  const args = parseArgs(process.argv);

  if (args.help || args.h || !args.id || !args.name || !args.username) {
    usage();
    if (!args.id || !args.name || !args.username) {
      process.exitCode = 1;
    }
    return;
  }

  const doctorId = toSlug(args.id);
  if (!doctorId) {
    throw new Error('Invalid --id value.');
  }

  const name = String(args.name).trim();
  const username = toSlug(args.username);
  const specialty = String(args.specialty || '').trim();

  if (!name) throw new Error('Invalid --name value.');
  if (!username) throw new Error('Invalid --username value.');

  const templatePath = args.template
    ? path.resolve(ROOT, args.template)
    : DEFAULT_TEMPLATE_PATH;

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template config not found: ${templatePath}`);
  }

  const configRelative = args['config-file']
    ? String(args['config-file']).replace(/\\/g, '/')
    : `config/${doctorId}-profile.json`;
  const configPath = path.resolve(ROOT, configRelative);

  ensureFileMissing(configPath, 'Doctor config file');

  const doctorsList = readJson(DOCTORS_LIST_PATH);
  doctorsList.doctors = Array.isArray(doctorsList.doctors) ? doctorsList.doctors : [];

  const idExists = doctorsList.doctors.some((d) => String(d.id || '').toLowerCase() === doctorId);
  if (idExists) {
    throw new Error(`Doctor id already exists in doctors-list.json: ${doctorId}`);
  }

  const usernameExists = doctorsList.doctors.some((d) => String(d.username || '').toLowerCase() === username);
  if (usernameExists) {
    throw new Error(`Username already exists in doctors-list.json: ${username}`);
  }

  const templateConfig = readJson(templatePath);

  templateConfig.site_id = templateConfig.site_id || `dr-${doctorId}`;
  templateConfig.doctor = templateConfig.doctor || {};
  templateConfig.doctor.name = name;
  if (specialty) {
    templateConfig.doctor.specialization = specialty;
  }

  if (Array.isArray(templateConfig.expertise)) {
    templateConfig.expertise = templateConfig.expertise.map((item) => {
      const cloned = { ...item };
      if (!cloned.sections || typeof cloned.sections !== 'object') {
        cloned.sections = {
          overview: '',
          key_points: [],
          when_to_consult: [],
          treatment_options: [],
          faqs: []
        };
      }
      return cloned;
    });
  }

  writeJson(configPath, templateConfig);

  const defaultPasswordHash = '$2a$10$LT4W/OcmXLEgaNdRBFNYpeLC6dhD7fqOidlUNpIC3OZ73y6DMoHSm';

  doctorsList.doctors.push({
    id: doctorId,
    name,
    username,
    password_hash: String(args['password-hash'] || defaultPasswordHash),
    specialty: specialty || 'General Medicine',
    config_file: configRelative
  });

  writeJson(DOCTORS_LIST_PATH, doctorsList);

  console.log('Onboarding bootstrap completed.');
  console.log(`- Doctor ID: ${doctorId}`);
  console.log(`- Username: ${username}`);
  console.log(`- Config: ${configRelative}`);
  console.log('');
  console.log('Next steps:');
  console.log(`1) Fill doctor details in ${configRelative}`);
  console.log('2) Validate config: npm run check:config');
  console.log('3) Use NEW-DOCTOR-CHECKLIST.md for deployment and go-live.');
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
