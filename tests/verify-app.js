// tests/verify-app.js
import { TRANSLATIONS } from '../app.js';

console.log('Testing translation dictionary completeness...');

if (!TRANSLATIONS.en || !TRANSLATIONS.bm) {
  console.error('FAIL: Missing EN or BM dictionary root');
  process.exit(1);
}

const requiredKeys = ['appTitle', 'department', 'buttons', 'rulesTab', 'cardEffects', 'scheduleTab', 'technicalSetup', 'beginnerGuide', 'playground'];
for (const key of requiredKeys) {
  if (!TRANSLATIONS.en[key] || !TRANSLATIONS.bm[key]) {
    console.error(`FAIL: Missing key ${key} in translations`);
    process.exit(1);
  }
}

console.log('PASS: Translation keys verified.');
