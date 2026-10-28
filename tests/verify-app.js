// tests/verify-app.js
import { TRANSLATIONS } from '../app.js';

console.log('Testing translation dictionary completeness...');

if (!TRANSLATIONS.en || !TRANSLATIONS.bm) {
  console.error('FAIL: Missing EN or BM dictionary root');
  process.exit(1);
}

const requiredKeys = ['appTitle', 'department', 'buttons', 'rulesTab', 'cardEffects', 'scheduleTab', 'technicalSetup', 'beginnerGuide', 'playground', 'roomGenerator'];
for (const key of requiredKeys) {
  if (!TRANSLATIONS.en[key] || !TRANSLATIONS.bm[key]) {
    console.error(`FAIL: Missing key ${key} in translations`);
    process.exit(1);
  }
}

import fs from 'fs';

const html = fs.readFileSync('index.html', 'utf-8');
if (!html.includes('id="testRoomBtn"')) {
  console.error('FAIL: index.html missing id="testRoomBtn"');
  process.exit(1);
}

if (!TRANSLATIONS.en.scheduleTab?.testRoundStage || !TRANSLATIONS.bm.scheduleTab?.testRoundStage) {
  console.error('FAIL: Missing testRoundStage in scheduleTab translations');
  process.exit(1);
}

console.log('PASS: Translation keys verified.');

