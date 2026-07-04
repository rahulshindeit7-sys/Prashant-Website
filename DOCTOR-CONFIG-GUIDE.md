# Doctor Configuration Guide

**For**: Multi-Doctor CMS Deployment | **Created**: 2026-07-04

---

## Overview

Each doctor needs:
1. **Entry in `doctors-list.json`** — Credentials & registry
2. **Config file `{doctorId}-profile.json`** — Full website content
3. **Backup directory `backups/{doctorId}/`** — Automatic backups

---

## STEP 1: Prepare Doctor Information

Before creating accounts, gather this info for each doctor:

### Dr. Deepali Shinde

```
ID: deepali
Full Name: Dr. Deepali Shinde
Username: deepali
Password: [Choose a strong password]
Specialty: Dental Surgery
Email: [their email]
Phone: [their phone]
License #: [if applicable]
Qualifications: BDS, MDS
Clinic Address: [clinic address]
Website Bio: [their bio/intro text]
```

### Dr. Prashant Pawar

```
ID: prashant
Full Name: Dr. Prashant Pawar
Username: prashant
Password: [Choose a strong password]
Specialty: General Medicine
Email: [their email]
Phone: [their phone]
License #: [if applicable]
Qualifications: MBBS, MD
Clinic Address: [clinic address]
Website Bio: [their bio/intro text]
```

---

## STEP 2: Create doctors-list.json

**Location**: `/var/www/smzentrix.info/config/doctors-list.json`

### Structure

```json
{
  "doctors": [
    {
      "id": "deepali",
      "name": "Dr. Deepali Shinde",
      "username": "deepali",
      "password_hash": "$2a$10$...",
      "specialty": "Dental Surgery",
      "email": "deepali@clinic.com",
      "phone": "+91-98765-43210",
      "config_file": "config/deepali-profile.json"
    },
    {
      "id": "prashant",
      "name": "Dr. Prashant Pawar",
      "username": "prashant",
      "password_hash": "$2a$10$...",
      "specialty": "General Medicine",
      "email": "prashant@clinic.com",
      "phone": "+91-87654-32109",
      "config_file": "config/prashant-profile.json"
    }
  ]
}
```

### To Generate Password Hashes

On VPS or local machine with Node.js:

```bash
# For Dr. Deepali
node -e "require('bcryptjs').hash('deepali_password_here', 10, (e,h) => console.log(h))"

# For Dr. Prashant
node -e "require('bcryptjs').hash('prashant_password_here', 10, (e,h) => console.log(h))"

# For any new doctor
node -e "require('bcryptjs').hash('their_password_here', 10, (e,h) => console.log(h))"
```

Copy the output hash and paste into doctors-list.json.

---

## STEP 3: Create Doctor Config File

**Location**: `/var/www/smzentrix.info/config/{doctorId}-profile.json`

### Full Config Template

```json
{
  "doctor": {
    "id": "deepali",
    "name": "Dr. Deepali Shinde",
    "title": "Dental Surgeon",
    "specialty": "Dental Surgery",
    "email": "deepali@clinic.com",
    "phone": "+91-98765-43210",
    "website": "https://drdeepalishinde.smzentrix.info",
    "bio": "Dr. Deepali Shinde is a renowned dental surgeon with 10+ years of experience in cosmetic and restorative dentistry.",
    "image": "/uploads/deepali/profile-photo.jpg",
    "license": "DL-12345",
    "qualifications": [
      "BDS (Bachelor of Dental Surgery)",
      "MDS (Master of Dental Surgery) - Prosthodontics"
    ],
    "experience_years": 12,
    "languages": ["English", "Hindi", "Marathi"]
  },

  "clinic": {
    "name": "Dr. Deepali's Dental Clinic",
    "address": "123 Main Street, Mumbai, Maharashtra 400001",
    "phone": "+91-98765-43210",
    "email": "clinic@deepali.com",
    "website": "https://drdeepalishinde.smzentrix.info",
    "hours": {
      "monday": "10:00 AM - 6:00 PM",
      "tuesday": "10:00 AM - 6:00 PM",
      "wednesday": "10:00 AM - 6:00 PM",
      "thursday": "10:00 AM - 6:00 PM",
      "friday": "10:00 AM - 6:00 PM",
      "saturday": "10:00 AM - 2:00 PM",
      "sunday": "Closed"
    },
    "location": {
      "latitude": 19.0760,
      "longitude": 72.8777
    }
  },

  "services": [
    {
      "id": "root-canal",
      "name": "Root Canal Treatment",
      "description": "Pain-free root canal therapy using latest endodontic techniques",
      "icon": "tooth",
      "category": "restorative"
    },
    {
      "id": "cosmetic",
      "name": "Cosmetic Dentistry",
      "description": "Smile makeover with veneers, whitening, and alignment",
      "icon": "smile",
      "category": "cosmetic"
    },
    {
      "id": "implants",
      "name": "Dental Implants",
      "description": "Advanced dental implants with 99% success rate",
      "icon": "implant",
      "category": "prosthetics"
    },
    {
      "id": "cleaning",
      "name": "Professional Cleaning",
      "description": "Deep cleaning and plaque removal",
      "icon": "clean",
      "category": "preventive"
    }
  ],

  "expertise": [
    {
      "id": "exp1",
      "title": "Root Canal Specialist",
      "description": "Over 5,000 successful root canal treatments",
      "image": "/uploads/deepali/expertise-1.jpg"
    },
    {
      "id": "exp2",
      "title": "Smile Design Expert",
      "description": "Specialized in cosmetic smile transformations",
      "image": "/uploads/deepali/expertise-2.jpg"
    },
    {
      "id": "exp3",
      "title": "Implant Surgeon",
      "description": "Advanced implant placement and restoration",
      "image": "/uploads/deepali/expertise-3.jpg"
    }
  ],

  "testimonials": [
    {
      "id": "testi1",
      "name": "Rajesh Kumar",
      "rating": 5,
      "comment": "Dr. Deepali is incredibly skilled and caring. My smile is now perfect!",
      "image": "/uploads/deepali/testimonial-1.jpg"
    },
    {
      "id": "testi2",
      "name": "Priya Sharma",
      "rating": 5,
      "comment": "Best dental experience of my life. Highly recommended!",
      "image": "/uploads/deepali/testimonial-2.jpg"
    },
    {
      "id": "testi3",
      "name": "Amit Patel",
      "rating": 5,
      "comment": "Professional, friendly, and excellent treatment results.",
      "image": "/uploads/deepali/testimonial-3.jpg"
    }
  ],

  "gallery": [
    {
      "id": "gal1",
      "title": "Before & After - Smile Makeover",
      "image": "/uploads/deepali/gallery-1.jpg",
      "category": "cosmetic"
    },
    {
      "id": "gal2",
      "title": "Clinic Setup",
      "image": "/uploads/deepali/gallery-2.jpg",
      "category": "clinic"
    },
    {
      "id": "gal3",
      "title": "Advanced Equipment",
      "image": "/uploads/deepali/gallery-3.jpg",
      "category": "equipment"
    }
  ],

  "seo": {
    "title": "Dr. Deepali Shinde - Dental Surgeon | Cosmetic & Restorative Dentistry",
    "description": "Experienced dental surgeon offering root canal, cosmetic dentistry, implants. 10+ years experience. Schedule appointment today.",
    "keywords": ["dental surgeon", "cosmetic dentistry", "root canal", "dental implants"],
    "og_image": "/uploads/deepali/og-image.jpg"
  },

  "social_media": {
    "facebook": "https://facebook.com/drdeepalishinde",
    "instagram": "https://instagram.com/drdeepalishinde",
    "linkedin": "https://linkedin.com/in/drdeepalishinde",
    "youtube": "https://youtube.com/@drdeepalishinde"
  }
}
```

---

## STEP 4: Create Backup Directory

On VPS:

```bash
# For Dr. Deepali
mkdir -p /var/www/smzentrix.info/backups/deepali

# For Dr. Prashant
mkdir -p /var/www/smzentrix.info/backups/prashant

# Set permissions
chown -R www-data:www-data /var/www/smzentrix.info/backups
chmod -R 755 /var/www/smzentrix.info/backups
```

---

## STEP 5: What Gets Auto-Created

Once CMS runs, these files/directories are auto-created for each doctor:

```
config/
├── deepali-profile.json        ← You create this
└── prashant-profile.json       ← You create this

backups/
├── deepali/
│   └── content.draft.json      ← Auto-created on first edit
└── prashant/
    └── content.draft.json      ← Auto-created on first edit

uploads/
├── deepali/                    ← Auto-created on first upload
│   ├── {uuid}-image1.jpg
│   └── {uuid}-image2.png
└── prashant/                   ← Auto-created on first upload
    ├── {uuid}-photo1.jpg
    └── {uuid}-photo2.png
```

---

## Adding a New Doctor (After Deployment)

### 1. Prepare Info

```
ID: newdoctor
Full Name: Dr. New Doctor
Username: newdoctor
Password: [strong password]
Specialty: [their specialty]
Email: [their email]
```

### 2. Generate Hash

On VPS:
```bash
node -e "require('bcryptjs').hash('their_password_here', 10, (e,h) => console.log(h))"
```

### 3. Add to doctors-list.json

```bash
ssh root@YOUR_VPS_IP
cd /var/www/smzentrix.info/config
nano doctors-list.json

# Add this entry to "doctors" array:
{
  "id": "newdoctor",
  "name": "Dr. New Doctor",
  "username": "newdoctor",
  "password_hash": "PASTE_HASH_HERE",
  "specialty": "Their Specialty",
  "email": "newemail@clinic.com",
  "phone": "+91-98765-XXXXX",
  "config_file": "config/newdoctor-profile.json"
}
```

### 4. Create Config File

```bash
# Copy template
cp doctor-profile.json newdoctor-profile.json

# Edit with their info
nano newdoctor-profile.json
```

### 5. Create Backup Directory

```bash
mkdir -p /var/www/smzentrix.info/backups/newdoctor
```

### 6. Restart CMS

```bash
pm2 restart doctor-cms
```

### 7. Test Login

```bash
curl -X POST https://smzentrix.info/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"newdoctor","password":"their_password_here"}'
```

---

## Configuration Fields Explanation

| Field | Purpose | Example |
|-------|---------|---------|
| `doctor.id` | Unique identifier | "deepali", "prashant" |
| `doctor.name` | Full legal name | "Dr. Deepali Shinde" |
| `doctor.email` | Contact email | "deepali@clinic.com" |
| `doctor.phone` | Contact phone | "+91-98765-43210" |
| `doctor.bio` | Short biography | "10+ years experience..." |
| `services[]` | List of services offered | Root canal, implants, etc. |
| `expertise[]` | Areas of specialization | "Root Canal Specialist" |
| `testimonials[]` | Patient reviews | Patient name, rating, comment |
| `gallery[]` | Before/after & clinic photos | Before/after images |
| `seo.*` | Search engine optimization | Title, description, keywords |

---

## Important Notes

### Password Security

- Passwords are **bcrypt hashed** before storage (not plaintext)
- Hash takes ~100ms to verify (prevents brute force)
- Each doctor's password is unique and completely isolated

### File Isolation

- Dr. Deepali can **only** access `/deepali-profile.json`, `/backups/deepali/`, `/uploads/deepali/`
- Dr. Prashant can **only** access `/prashant-profile.json`, `/backups/prashant/`, `/uploads/prashant/`
- Session-based access control: `req.session.doctorId` is the source of truth

### Image Uploads

- Max file size: 5MB
- Allowed types: .jpg, .jpeg, .png, .webp
- Stored in: `/uploads/{doctorId}/{uuid}-filename`
- URL: `https://smzentrix.info/uploads/{doctorId}/{uuid}-filename`

---

## Testing Doctor Login

### Via Browser

1. Go to: `https://smzentrix.info/doctor-cms/admin/`
2. Enter username & password
3. Should see dashboard with their config

### Via Command Line

```bash
# Login test
curl -X POST https://smzentrix.info/doctor-cms/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"deepali","password":"password123"}'

# Response example:
# {
#   "ok": true,
#   "message": "Logged in successfully",
#   "doctor": {
#     "id": "deepali",
#     "name": "Dr. Deepali Shinde",
#     "specialty": "Dental Surgery"
#   }
# }
```

### Public API (Website Integration)

```bash
# Get doctor's config (no login needed)
curl https://smzentrix.info/doctor-cms/api/public/config/deepali

# Response: Full doctor config (deepali-profile.json)
```

---

## Troubleshooting

### Doctor Can't Login

1. Verify entry exists in `doctors-list.json`
2. Check password hash is correct: `bcrypt hash should start with $2a$10$`
3. Verify username is lowercase (no spaces)
4. Restart CMS: `pm2 restart doctor-cms`

### Images Not Showing

1. Check upload permissions: `chown -R www-data:www-data /var/www/smzentrix.info/uploads`
2. Verify image path in config: `/uploads/{doctorId}/{filename}`
3. Check image actually exists on disk

### Config Changes Not Appearing

1. Make sure you're editing the **live** config: `{doctorId}-profile.json`
   - Not `content.draft.json` (draft)
   - Not `doctor-profile.json` (template)
2. Restart CMS if needed: `pm2 restart doctor-cms`
3. Hard refresh browser (Ctrl+Shift+R)

---

## Summary Checklist

For each new doctor:

- [ ] Gather doctor info (name, email, phone, specialty, etc.)
- [ ] Generate bcrypt password hash
- [ ] Add entry to `doctors-list.json`
- [ ] Create `{doctorId}-profile.json` with their info
- [ ] Create `backups/{doctorId}/` directory
- [ ] Restart CMS: `pm2 restart doctor-cms`
- [ ] Test login with their credentials
- [ ] Test public API: `/api/public/config/{doctorId}`
- [ ] Integrate their website to fetch from public API

---

**Ready to add doctors? Follow the steps above!** 🎯
