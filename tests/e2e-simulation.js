// tests/e2e-simulation.js
import fs from 'fs';
import { PLAYERS, searchPlayers } from '../tournament-data.js';
import { TRANSLATIONS, getNestedValue } from '../app.js';
import { isPlayable, SCENARIOS } from '../card-engine.js';

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

const requiredClasses = ['uno-card', 'card-center-oval', 'table-mat', 'shakeCard'];
for (const cls of requiredClasses) {
  if (!css.includes(cls)) {
    console.error(`FAIL: Missing CSS class ${cls}`);
    process.exit(1);
  }
}

// 4. Verify playground elements in index.html
const requiredIds = ['playgroundTable', 'activeDiscardPile', 'playerHandDock', 'drawDeckBtn', 'playFeedbackBanner'];
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

console.log('PASS: All End-to-End simulation checks succeeded!');
