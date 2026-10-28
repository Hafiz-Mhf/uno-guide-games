// tests/verify-data.js
import { PLAYERS, getPlayerByName, getMatches } from '../tournament-data.js';

console.log('Running tournament data verification...');

if (!Array.isArray(PLAYERS) || PLAYERS.length !== 34) {
  console.error(`FAIL: Expected 34 players, found ${PLAYERS?.length}`);
  process.exit(1);
}

const matches = getMatches();
if (matches.length !== 17) {
  console.error(`FAIL: Expected 17 matches, found ${matches.length}`);
  process.exit(1);
}

const p1 = getPlayerByName('Zaharudin Bin Ismail');
if (!p1 || p1.match !== 'HR-Match-01') {
  console.error('FAIL: getPlayerByName failed for Zaharudin Bin Ismail');
  process.exit(1);
}

// Check unique IDs
const ids = new Set(PLAYERS.map(p => p.id));
if (ids.size !== 34) {
  console.error('FAIL: Duplicate player IDs detected');
  process.exit(1);
}

console.log('PASS: All tournament data assertions passed.');
