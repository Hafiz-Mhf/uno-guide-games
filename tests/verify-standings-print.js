import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(rootDir, 'styles.css'), 'utf8');
const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');

console.log('Testing Standings & Championship Podium Print Engine...');

// 1. Verify DOM Elements in index.html
if (!indexHtml.includes('id="printStandingsBtn"')) {
  throw new Error('FAIL: index.html missing #printStandingsBtn in public grand final section');
}
if (!indexHtml.includes('id="deskPrintStandingsBtn"')) {
  throw new Error('FAIL: index.html missing #deskPrintStandingsBtn in tournament desk grand final card');
}
if (!indexHtml.includes('class="print-standings-header"')) {
  throw new Error('FAIL: index.html missing .print-standings-header element');
}
if (!indexHtml.includes('class="print-standings-footer"')) {
  throw new Error('FAIL: index.html missing .print-standings-footer element');
}
if (!indexHtml.includes('id="printStandingsContainer"')) {
  throw new Error('FAIL: index.html missing #printStandingsContainer element');
}
if (!indexHtml.includes('id="printPodiumBoard"')) {
  throw new Error('FAIL: index.html missing #printPodiumBoard element');
}
if (!indexHtml.includes('id="printStandingsTable"')) {
  throw new Error('FAIL: index.html missing #printStandingsTable element');
}

// 2. Verify Print CSS Rules in styles.css
if (!stylesCss.includes('print-color-adjust: exact')) {
  throw new Error('FAIL: styles.css missing print-color-adjust: exact');
}
if (!stylesCss.includes('-webkit-print-color-adjust: exact')) {
  throw new Error('FAIL: styles.css missing -webkit-print-color-adjust: exact');
}
if (!stylesCss.includes('.print-mode-standings')) {
  throw new Error('FAIL: styles.css missing .print-mode-standings rules in @media print');
}

// 3. Verify i18n Translation Keys in app.js
const requiredKeys = [
  'printStandingsBtn',
  'standingsTitle',
  'subtitle',
  'venueDate',
  'footerNote'
];

for (const key of requiredKeys) {
  if (!appJs.includes(key)) {
    throw new Error(`FAIL: app.js missing translation key or reference: ${key}`);
  }
}

// 4. Verify JS Handlers in app.js
if (!appJs.includes('print-mode-standings')) {
  throw new Error('FAIL: app.js missing print-mode-standings class manipulation');
}
if (!appJs.includes('printStandingsBtn')) {
  throw new Error('FAIL: app.js missing printStandingsBtn listener');
}
if (!appJs.includes('updatePrintStandingsBoard')) {
  throw new Error('FAIL: app.js missing updatePrintStandingsBoard function');
}

console.log('PASS: All Standings & Championship Podium Print Engine assertions passed successfully!');
