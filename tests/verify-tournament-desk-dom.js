// tests/verify-tournament-desk-dom.js
import fs from 'fs';
import { TRANSLATIONS } from '../app.js';

console.log('Testing Tournament Desk DOM and translations...');

const html = fs.readFileSync('index.html', 'utf-8');

// Check navigation tab
if (!html.includes('data-tab="desk"')) {
  console.error('FAIL: index.html missing data-tab="desk" nav button');
  process.exit(1);
}

// Check deskView section
if (!html.includes('id="deskView"')) {
  console.error('FAIL: index.html missing id="deskView" section');
  process.exit(1);
}

// Check key IDs
const requiredIds = [
  'deskRosterCount',
  'deskCheckedInCount',
  'deskAbsentCount',
  'deskStatusPill',
  'deskRosterList',
  'deskAddPlayerBtn',
  'deskPlayerNameInput',
  'deskBulkImportBtn',
  'deskRandomizeBtn',
  'deskCopyMatchupsBtn',
  'deskResetBtn',
  'deskRemoveAllBtn',
  'deskMatchesGrid',
  'deskByeNotice',
  'deskRound2HeatsGrid',
  'deskGrandFinalCard',
  'deskResetFinaleBtn',
  'deskGrandFinalRoster',
  'deskPodiumPreview'
];

for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) {
    console.error(`FAIL: index.html missing required element id: ${id}`);
    process.exit(1);
  }
}

// Verify EN and BM translations
if (!TRANSLATIONS.en.tournamentDesk?.grandFinal || !TRANSLATIONS.bm.tournamentDesk?.grandFinal) {
  console.error('FAIL: app.js missing tournamentDesk.grandFinal translations');
  process.exit(1);
}

console.log('PASS: Task 4 DOM and translation assertions passed.');
