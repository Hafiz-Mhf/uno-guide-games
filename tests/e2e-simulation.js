// tests/e2e-simulation.js
import fs from 'fs';
import { PLAYERS, searchPlayers } from '../tournament-data.js';
import { TRANSLATIONS, getNestedValue } from '../app.js';
import { isPlayable, SCENARIOS } from '../card-engine.js';
import {
  createDefaultTournamentState,
  togglePlayerCheckIn,
  addPlayer,
  generateRound1Pairings,
  recordMatchWinner,
  computeRound2Heats
} from '../tournament-engine.js';

console.log('Running End-to-End Simulation Check...');

// 1. Read index.html and extract data-i18n keys
const html = fs.readFileSync('index.html', 'utf-8');
const keyRegex = /data-i18n="([^"]+)"/g;
let match;
const foundKeys = new Set();
while ((match = keyRegex.exec(html)) !== null) {
  foundKeys.add(match[1]);
}

console.log(`Found ${foundKeys.size} distinct i18n keys in index.html.`);

let missingKeys = 0;
for (const key of foundKeys) {
  const enVal = getNestedValue(TRANSLATIONS.en, key);
  const bmVal = getNestedValue(TRANSLATIONS.bm, key);
  if (!enVal) {
    console.error(`Missing EN translation for key: "${key}"`);
    missingKeys++;
  }
  if (!bmVal) {
    console.error(`Missing BM translation for key: "${key}"`);
    missingKeys++;
  }
}

if (missingKeys > 0) {
  console.error(`FAIL: ${missingKeys} missing translation keys.`);
  process.exit(1);
}

// 2. Validate all 30 players searchability
for (const p of PLAYERS) {
  const res = searchPlayers(p.name);
  if (!res.some(item => item.id === p.id)) {
    console.error(`FAIL: Player search failed for ${p.name}`);
    process.exit(1);
  }
}

// 3. Verify CSS file exists and has essential color tokens & playground classes
const css = fs.readFileSync('styles.css', 'utf-8');
const requiredTokens = ['--uno-red', '--uno-yellow', '--uno-green', '--uno-blue', '--uno-dark'];
for (const token of requiredTokens) {
  if (!css.includes(token)) {
    console.error(`FAIL: Missing CSS token ${token}`);
    process.exit(1);
  }
}

const requiredClasses = ['uno-card', 'card-center-oval', 'table-mat', 'wild-stack-visual', 'wild-quad-pip', 'color-picker-modal'];
for (const cls of requiredClasses) {
  if (!css.includes(cls)) {
    console.error(`FAIL: Missing CSS class ${cls}`);
    process.exit(1);
  }
}

// 4. Verify playground elements in index.html
const requiredIds = ['playgroundTable', 'activeDiscardPile', 'playerHandDock', 'drawDeckBtn', 'playFeedbackBanner', 'colorPickerOverlay'];
for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) {
    console.error(`FAIL: Missing element ID in index.html: ${id}`);
    process.exit(1);
  }
}

// 5. Verify Card Engine scenarios
if (!SCENARIOS || SCENARIOS.length < 3) {
  console.error('FAIL: Expected at least 3 scenarios in card engine');
  process.exit(1);
}

// 6. Simulate Full Tournament Desk Workflow
console.log('Simulating Tournament Desk Workflow...');
let state = createDefaultTournamentState();
if (state.roster.length !== 34) {
  console.error('FAIL: Initial roster size must be 34');
  process.exit(1);
}

// Simulate 2 no-shows
state = togglePlayerCheckIn(state, state.roster[0].id, false);
state = togglePlayerCheckIn(state, state.roster[1].id, false);

// Simulate 1 replacement added
state = addPlayer(state, 'Nur Aisyah', 'HR Operations');

// Checked in count should be 33 (34 - 2 + 1)
const checkedIn = state.roster.filter(p => p.checkedIn);
if (checkedIn.length !== 33) {
  console.error(`FAIL: Expected 33 checked-in players, got ${checkedIn.length}`);
  process.exit(1);
}

// Generate pairings
const pairings = generateRound1Pairings(checkedIn);
if (pairings.matches.length !== 16 || !pairings.byePlayer) {
  console.error('FAIL: Expected 16 matches and 1 BYE player for 33 attendees');
  process.exit(1);
}

state.round1 = pairings;
// Record all winners
pairings.matches.forEach(m => {
  state = recordMatchWinner(state, m.matchId, m.player1.id);
});

// Compute Round 2
const round2 = computeRound2Heats(state.round1.byePlayer, state.round1.matches);
if (round2.totalQualifiers !== 17 || round2.tableAlpha.length !== 6 || round2.tableBeta.length !== 6 || round2.tableGamma.length !== 5) {
  console.error(`FAIL: Round 2 qualification failed: ${JSON.stringify(round2)}`);
  process.exit(1);
}

console.log('PASS: All End-to-End simulation checks succeeded!');
