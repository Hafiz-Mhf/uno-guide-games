// tests/verify-public-matchups-view.js
import fs from 'fs';
import {
  TRANSLATIONS,
  renderPublicMatchups,
  isDeskOrganizerUnlocked,
  ensureOrganizerUnlocked
} from '../app.js';

console.log('Testing Participant-Facing Live Matchups Tab & Organizer Lock...');

const html = fs.readFileSync('index.html', 'utf-8');

// 1. Verify index.html contains the new matchups tab and view container
if (!html.includes('data-tab="matchups"')) {
  console.error('FAIL: index.html missing data-tab="matchups" nav button');
  process.exit(1);
}

if (!html.includes('id="matchupsView"')) {
  console.error('FAIL: index.html missing id="matchupsView" section');
  process.exit(1);
}

if (!html.includes('data-switch-tab="matchups"')) {
  console.error('FAIL: index.html missing data-switch-tab="matchups" quick nav pill');
  process.exit(1);
}

// 2. Verify required public view DOM element IDs
const publicIds = [
  'publicMatchesGrid',
  'publicRound2Grid',
  'publicMatchupsSearch',
  'copyMatchupsShareBtn',
  'publicByeNotice',
  'publicQualifiersCount',
  'deskLockBar',
  'deskLockToggleBtn'
];

for (const id of publicIds) {
  if (!html.includes(`id="${id}"`)) {
    console.error(`FAIL: index.html missing required element id="${id}"`);
    process.exit(1);
  }
}

// 3. Verify translation dictionaries have publicMatchups and lockBar
if (!TRANSLATIONS.en.publicMatchups || !TRANSLATIONS.bm.publicMatchups) {
  console.error('FAIL: Missing publicMatchups translation dictionary in app.js');
  process.exit(1);
}

if (!TRANSLATIONS.en.tournamentDesk.lockBar || !TRANSLATIONS.bm.tournamentDesk.lockBar) {
  console.error('FAIL: Missing lockBar translation dictionary in app.js');
  process.exit(1);
}

// 4. Verify function exports
if (typeof renderPublicMatchups !== 'function') {
  console.error('FAIL: renderPublicMatchups is not a function');
  process.exit(1);
}

if (typeof ensureOrganizerUnlocked !== 'function') {
  console.error('FAIL: ensureOrganizerUnlocked is not a function');
  process.exit(1);
}

// 5. Verify default state is locked
if (isDeskOrganizerUnlocked !== false) {
  console.error('FAIL: isDeskOrganizerUnlocked must default to false (locked for protection)');
  process.exit(1);
}

console.log('PASS: All Live Matchups Tab & Organizer Lock assertions passed successfully!');
