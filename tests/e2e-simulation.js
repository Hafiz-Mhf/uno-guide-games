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
  computeRound2Heats,
  addSecondChancePlayer,
  getEligibleSecondChancePlayers,
  recordHeatWinner,
  recordPodiumPlace,
  computeGrandFinalists,
  computeChampionshipStandings
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

// 7. Simulate 16-Player Minimum Contingency & Second Chance Wildcard Flow
console.log('Simulating 16-Player Minimum Contingency with Second Chance Wildcards...');
let state16 = createDefaultTournamentState();
// Check in only first 16 players
state16.roster.forEach((p, idx) => {
  p.checkedIn = idx < 16;
});

const checkedIn16 = state16.roster.filter(p => p.checkedIn);
if (checkedIn16.length !== 16) {
  console.error(`FAIL: Expected 16 checked-in players, got ${checkedIn16.length}`);
  process.exit(1);
}

// Generate pairings for 16 players
const pairings16 = generateRound1Pairings(checkedIn16);
if (pairings16.matches.length !== 8 || pairings16.byePlayer !== null) {
  console.error('FAIL: Expected exactly 8 matches and 0 BYEs for 16 players');
  process.exit(1);
}
state16.round1 = pairings16;

// Record 8 winners (player1 of each match)
pairings16.matches.forEach(m => {
  state16 = recordMatchWinner(state16, m.matchId, m.player1.id);
});

// Check eligible second chance players (should be the 8 losers)
const eligible16 = getEligibleSecondChancePlayers(state16);
if (eligible16.length !== 8) {
  console.error(`FAIL: Expected 8 eligible second-chance players from losers, got ${eligible16.length}`);
  process.exit(1);
}

// Organizers add 4 second chance wildcards:
// 1 to Alpha, 1 to Beta, 2 to Gamma -> exactly 4 players per table (3+1, 3+1, 2+2)
state16 = addSecondChancePlayer(state16, 'alpha', eligible16[0].id);
state16 = addSecondChancePlayer(state16, 'beta', eligible16[1].id);
state16 = addSecondChancePlayer(state16, 'gamma', eligible16[2].id);
state16 = addSecondChancePlayer(state16, 'gamma', eligible16[3].id);

const heats16 = computeRound2Heats(
  state16.round1.byePlayer,
  state16.round1.matches,
  3,
  state16.round2.secondChance,
  state16.roster
);

if (
  heats16.tableAlpha.length !== 4 ||
  heats16.tableBeta.length !== 4 ||
  heats16.tableGamma.length !== 4 ||
  heats16.totalSeated !== 12
) {
  console.error(`FAIL: Each table must have at least 4 seated players. Got Alpha=${heats16.tableAlpha.length}, Beta=${heats16.tableBeta.length}, Gamma=${heats16.tableGamma.length}`);
  process.exit(1);
}

// Verify that the second chance players have the isSecondChance flag
if (!heats16.tableAlpha.some(p => p.id === eligible16[0].id && p.isSecondChance)) {
  console.error('FAIL: Second chance player in Table Alpha missing isSecondChance flag');
  process.exit(1);
}

// Crown heat winners:
// Table Alpha: direct qualifier wins
const alphaWinner = heats16.tableAlpha[0];
state16 = recordHeatWinner(state16, 'alpha', alphaWinner.id);

// Table Beta: Second Chance player wins heat!
const betaWinner = heats16.tableBeta.find(p => p.isSecondChance);
state16 = recordHeatWinner(state16, 'beta', betaWinner.id);

// Table Gamma: direct qualifier wins
const gammaWinner = heats16.tableGamma[0];
state16 = recordHeatWinner(state16, 'gamma', gammaWinner.id);

// Compute Grand Finalists
const gf16 = computeGrandFinalists(state16);
if (gf16.finalists.length !== 3 || !gf16.isComplete) {
  console.error('FAIL: Expected 3 finalists from heats');
  process.exit(1);
}

// Award Podium Placements: Alpha = 1st (Grand Champion), Beta (Second Chance) = 2nd (Runner-Up), Gamma = 3rd (2nd Runner-Up)
state16 = recordPodiumPlace(state16, 'first', alphaWinner.id);
state16 = recordPodiumPlace(state16, 'second', betaWinner.id);
state16 = recordPodiumPlace(state16, 'third', gammaWinner.id);

const standings16 = computeChampionshipStandings(state16);
if (
  !standings16.isChampionCrowned ||
  standings16.podium.first.id !== alphaWinner.id ||
  standings16.podium.second.id !== betaWinner.id ||
  standings16.podium.third.id !== gammaWinner.id
) {
  console.error('FAIL: Championship podium standings did not match awarded places');
  process.exit(1);
}

console.log('PASS: 16-Player Minimum Contingency simulation succeeded!');
console.log('PASS: All End-to-End simulation checks succeeded!');

