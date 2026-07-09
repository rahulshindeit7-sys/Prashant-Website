#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const inputPath = path.join(ROOT, 'NEW-DOCTOR-ONBOARDING-STEPS.md');
const outputPath = path.join(ROOT, 'NEW-DOCTOR-ONBOARDING-STEPS.pdf');

function escapePdfText(text) {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function stripMarkdown(line) {
  return String(line || '')
    .replace(/^#{1,6}\s*/g, '')
    .replace(/^[-*]\s+/g, '- ')
    .replace(/^\d+\.\s+/g, function (m) { return m; })
    .replace(/`/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)')
    .trimEnd();
}

function wrapLine(line, maxChars) {
  if (line.length <= maxChars) return [line];
  const words = line.split(/\s+/);
  const out = [];
  let current = '';

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars) {
      if (current) out.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) out.push(current);
  return out.length ? out : [''];
}

function buildPdf(pages) {
  const objects = [];

  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';

  const pageObjectIds = [];
  let objId = 4;

  pages.forEach((pageLines) => {
    const pageId = objId;
    const contentId = objId + 1;
    objId += 2;

    const streamLines = [];
    streamLines.push('BT');
    streamLines.push('/F1 11 Tf');
    streamLines.push('50 792 Td');
    streamLines.push('14 TL');

    pageLines.forEach((line, idx) => {
      const safe = escapePdfText(line);
      if (idx === 0) {
        streamLines.push(`(${safe}) Tj`);
      } else {
        streamLines.push('T*');
        streamLines.push(`(${safe}) Tj`);
      }
    });

    streamLines.push('ET');

    const stream = streamLines.join('\n');
    const streamObj = `<< /Length ${Buffer.byteLength(stream, 'utf8')} >>\nstream\n${stream}\nendstream`;

    objects[contentId] = streamObj;
    objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`;
    pageObjectIds.push(pageId);
  });

  const kids = pageObjectIds.map((id) => `${id} 0 R`).join(' ');
  objects[2] = `<< /Type /Pages /Kids [ ${kids} ] /Count ${pageObjectIds.length} >>`;

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  for (let i = 1; i < objects.length; i += 1) {
    if (!objects[i]) continue;
    offsets[i] = Buffer.byteLength(pdf, 'utf8');
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = Buffer.byteLength(pdf, 'utf8');
  const size = objects.length;
  pdf += `xref\n0 ${size}\n`;
  pdf += '0000000000 65535 f \n';

  for (let i = 1; i < size; i += 1) {
    const off = offsets[i] || 0;
    const line = `${String(off).padStart(10, '0')} 00000 n \n`;
    pdf += line;
  }

  pdf += `trailer\n<< /Size ${size} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  return pdf;
}

function main() {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input not found: ${inputPath}`);
  }

  const source = fs.readFileSync(inputPath, 'utf8');
  const rawLines = source.split(/\r?\n/).map(stripMarkdown);

  const normalized = [];
  rawLines.forEach((line) => {
    if (line.trim() === '') {
      normalized.push('');
      return;
    }
    wrapLine(line, 90).forEach((wrapped) => normalized.push(wrapped));
  });

  const linesPerPage = 50;
  const pages = [];
  for (let i = 0; i < normalized.length; i += linesPerPage) {
    pages.push(normalized.slice(i, i + linesPerPage));
  }

  const pdf = buildPdf(pages.length ? pages : [['New Doctor Onboarding Steps']]);
  fs.writeFileSync(outputPath, pdf, 'binary');

  console.log(`PDF generated: ${outputPath}`);
  console.log(`Pages: ${pages.length || 1}`);
}

try {
  main();
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}
