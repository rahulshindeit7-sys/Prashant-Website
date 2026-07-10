const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function optimize() {
  const iconsDir = 'assets/icons';
  const imagesDir = 'assets/images';

  // 1. Convert service icons to WebP (160x160 max, under 30KB)
  const icons = [
    'oral cancel.png',
    'Thyroid.png',
    'Reconstruction.png',
    'Salivary Gland.png',
    'Skull_base.png',
    'Laryngel.png'
  ];

  for (const icon of icons) {
    const src = path.join(iconsDir, icon);
    if (!fs.existsSync(src)) { console.log('SKIP:', icon); continue; }
    const webpName = icon.replace(/\.png$/i, '.webp').toLowerCase().replace(/\s+/g, '-');
    const dest = path.join(iconsDir, webpName);
    await sharp(src)
      .resize(160, 160, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(dest);
    const size = fs.statSync(dest).size;
    console.log(`ICON: ${icon} -> ${webpName} (${Math.round(size/1024)}KB)`);
  }

  // 2. Convert Dr Prashant 2.png to WebP (500px wide, under 120KB)
  const aboutSrc = path.join(imagesDir, 'Dr Prashant 2.png');
  if (fs.existsSync(aboutSrc)) {
    const aboutDest = path.join(imagesDir, 'dr-prashant-about.webp');
    await sharp(aboutSrc)
      .resize(500, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(aboutDest);
    const size = fs.statSync(aboutDest).size;
    console.log(`ABOUT: Dr Prashant 2.png -> dr-prashant-about.webp (${Math.round(size/1024)}KB)`);
  }

  // 3. Convert hero image to WebP (800px wide)
  const heroSrc = path.join(imagesDir, 'dr-prashant-hero-clean.png');
  if (fs.existsSync(heroSrc)) {
    const heroDest = path.join(imagesDir, 'dr-prashant-hero-clean.webp');
    await sharp(heroSrc)
      .resize(800, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(heroDest);
    const size = fs.statSync(heroDest).size;
    console.log(`HERO: dr-prashant-hero-clean.png -> .webp (${Math.round(size/1024)}KB)`);
  }

  // 4. Convert logo to WebP (200px wide)
  const logoSrc = path.join(imagesDir, 'Dr Prashant Logo.png');
  if (fs.existsSync(logoSrc)) {
    const logoDest = path.join(imagesDir, 'dr-prashant-logo.webp');
    await sharp(logoSrc)
      .resize(200, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(logoDest);
    const size = fs.statSync(logoDest).size;
    console.log(`LOGO: Dr Prashant Logo.png -> dr-prashant-logo.webp (${Math.round(size/1024)}KB)`);
  }

  console.log('\nDONE - All images optimized locally');
}

optimize().catch(err => { console.error(err); process.exit(1); });
