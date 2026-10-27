// tests/verify-tournament-engine.js
import {
  createDefaultTournamentState,
  loadTournamentState,
  saveTournamentState,
  resetTournamentState,
  togglePlayerCheckIn,
  addPlayer,
  removePlayer,
  removeAllPlayers,
  bulkImportRoster,
  setAllCheckInStatus,
  generateRound1Pairings,
  recordMatchWinner,
  computeRound2Heats,
  formatMatchupsClipboard,
  setRound2TableCount
} from '../tournament-engine.js';

console.log('Testing tournament-engine state lifecycle...');

const state = createDefaultTournamentState();
if (!Array.isArray(state.roster) || state.roster.length !== 30) {
  console.error(`FAIL: Expected 30 default roster items, found ${state.roster?.length}`);
  process.exit(1);
}

if (!state.roster.every(p => p.id && p.name && p.checkedIn === true)) {
  console.error('FAIL: Roster items missing id, name, or checkedIn flag');
  process.exit(1);
}

// Mock storage
const mockStorage = {
  data: {},
  getItem(k) { return this.data[k] || null; },
  setItem(k, v) { this.data[k] = String(v); },
  removeItem(k) { delete this.data[k]; }
};

saveTournamentState(mockStorage, state);
const loaded = loadTournamentState(mockStorage);
if (loaded.roster.length !== 30) {
  console.error('FAIL: loadTournamentState failed to deserialize');
  process.exit(1);
}

resetTournamentState(mockStorage);
const resetState = loadTournamentState(mockStorage);
if (resetState.roster.length !== 30) {
  console.error('FAIL: resetTournamentState failed');
  process.exit(1);
}

console.log('PASS: Task 1 tests passed.');

console.log('Testing roster management methods...');

let s = createDefaultTournamentState();

// Toggle check-in
s = togglePlayerCheckIn(s, 'p-01', false);
if (s.roster.find(p => p.id === 'p-01').checkedIn !== false) {
  console.error('FAIL: togglePlayerCheckIn failed');
  process.exit(1);
}

// Add player
s = addPlayer(s, 'Zack Taylor', 'Marketing');
const newPlayer = s.roster.find(p => p.name === 'Zack Taylor');
if (!newPlayer || newPlayer.dept !== 'Marketing' || !newPlayer.checkedIn) {
  console.error('FAIL: addPlayer failed');
  process.exit(1);
}

// Remove player
const prevLen = s.roster.length;
s = removePlayer(s, newPlayer.id);
if (s.roster.length !== prevLen - 1) {
  console.error('FAIL: removePlayer failed');
  process.exit(1);
}

// Set all checkin
s = setAllCheckInStatus(s, false);
if (s.roster.some(p => p.checkedIn === true)) {
  console.error('FAIL: setAllCheckInStatus false failed');
  process.exit(1);
}
s = setAllCheckInStatus(s, true);
if (s.roster.some(p => p.checkedIn === false)) {
  console.error('FAIL: setAllCheckInStatus true failed');
  process.exit(1);
}

// Bulk import
const text = `
Alice Tan | HR
Bob Wong, IT
Charlie
`;
s = bulkImportRoster(s, text);
if (!s.roster.find(p => p.name === 'Alice Tan') || !s.roster.find(p => p.name === 'Bob Wong')) {
  console.error('FAIL: bulkImportRoster failed');
  process.exit(1);
}

// Remove all players
s = removeAllPlayers(s);
if (!Array.isArray(s.roster) || s.roster.length !== 0 || s.round1.matches.length !== 0) {
  console.error('FAIL: removeAllPlayers failed to clear roster and matches');
  process.exit(1);
}

console.log('PASS: Task 2 tests passed.');

console.log('Testing pairing generation, BYE handling, and Round 2 calculation...');

// Test 1: Even count (30 players) -> 15 matches, 0 BYE
const mock30 = Array.from({ length: 30 }, (_, i) => ({ id: `p${i+1}`, name: `Player ${i+1}`, dept: 'HR', checkedIn: true }));
const evenResult = generateRound1Pairings(mock30);
if (evenResult.matches.length !== 15 || evenResult.byePlayer !== null) {
  console.error(`FAIL: Expected 15 matches and null byePlayer, got matches: ${evenResult.matches.length}, bye: ${evenResult.byePlayer}`);
  process.exit(1);
}

// Test 2: Odd count (29 players) -> 14 matches, 1 BYE
const mock29 = Array.from({ length: 29 }, (_, i) => ({ id: `p${i+1}`, name: `Player ${i+1}`, dept: 'HR', checkedIn: true }));
const oddResult = generateRound1Pairings(mock29);
if (oddResult.matches.length !== 14 || !oddResult.byePlayer) {
  console.error(`FAIL: Expected 14 matches and valid byePlayer for 29 players`);
  process.exit(1);
}

// Test 3: Record winner
let stateWithMatches = {
  ...createDefaultTournamentState(),
  round1: {
    generatedAt: new Date().toISOString(),
    byePlayer: oddResult.byePlayer,
    matches: oddResult.matches
  }
};

const firstMatchId = stateWithMatches.round1.matches[0].matchId;
const winnerId = stateWithMatches.round1.matches[0].player1.id;
stateWithMatches = recordMatchWinner(stateWithMatches, firstMatchId, winnerId);
if (stateWithMatches.round1.matches[0].winnerId !== winnerId) {
  console.error('FAIL: recordMatchWinner failed to assign winnerId');
  process.exit(1);
}

// Test 4: Compute Round 2 heats
// Mark all 14 matches with winner
stateWithMatches.round1.matches.forEach(m => {
  m.winnerId = m.player1.id;
});
const heats = computeRound2Heats(stateWithMatches.round1.byePlayer, stateWithMatches.round1.matches);
if (heats.tableAlpha.length !== 5 || heats.tableBeta.length !== 5 || heats.tableGamma.length !== 5) {
  console.error(`FAIL: Heats must distribute 15 players across 3 tables (Alpha: ${heats.tableAlpha.length}, Beta: ${heats.tableBeta.length}, Gamma: ${heats.tableGamma.length})`);
  process.exit(1);
}

// Test 5: Clipboard formatting
const clipText = formatMatchupsClipboard(stateWithMatches.round1);
if (!clipText.includes('HR-Match-01') || !clipText.includes('[BYE Pass]')) {
  console.error('FAIL: formatMatchupsClipboard missing essential markers');
  process.exit(1);
}

// Test 6: Flexible Round 2 Heats with 33 players (16 matches + 1 BYE = 17 qualifiers)
const mock33 = Array.from({ length: 33 }, (_, i) => ({ id: `p${i+1}`, name: `Player ${i+1}`, dept: 'HQ', checkedIn: true }));
const pairings33 = generateRound1Pairings(mock33);
if (pairings33.matches.length !== 16 || !pairings33.byePlayer) {
  console.error('FAIL: Expected 16 matches and 1 BYE for 33 players');
  process.exit(1);
}
pairings33.matches.forEach(m => { m.winnerId = m.player1.id; });

// 3-Table distribution: 17 qualifiers -> 6, 6, 5 (Total 17, none dropped)
const heats33_3Tables = computeRound2Heats(pairings33.byePlayer, pairings33.matches, 3);
if (
  heats33_3Tables.totalQualifiers !== 17 ||
  heats33_3Tables.tableAlpha.length !== 6 ||
  heats33_3Tables.tableBeta.length !== 6 ||
  heats33_3Tables.tableGamma.length !== 5 ||
  heats33_3Tables.tableDelta.length !== 0
) {
  console.error(`FAIL: 33 players 3-table heat distribution failed: Alpha=${heats33_3Tables.tableAlpha.length}, Beta=${heats33_3Tables.tableBeta.length}, Gamma=${heats33_3Tables.tableGamma.length}, Total=${heats33_3Tables.totalQualifiers}`);
  process.exit(1);
}

// 4-Table distribution: 17 qualifiers -> 5, 4, 4, 4 (Total 17, none dropped)
const heats33_4Tables = computeRound2Heats(pairings33.byePlayer, pairings33.matches, 4);
if (
  heats33_4Tables.totalQualifiers !== 17 ||
  heats33_4Tables.tableAlpha.length !== 5 ||
  heats33_4Tables.tableBeta.length !== 4 ||
  heats33_4Tables.tableGamma.length !== 4 ||
  heats33_4Tables.tableDelta.length !== 4
) {
  console.error(`FAIL: 33 players 4-table heat distribution failed: Alpha=${heats33_4Tables.tableAlpha.length}, Beta=${heats33_4Tables.tableBeta.length}, Gamma=${heats33_4Tables.tableGamma.length}, Delta=${heats33_4Tables.tableDelta.length}`);
  process.exit(1);
}

// Test 7: 32 players (16 matches, 0 BYE = 16 qualifiers)
const mock32 = Array.from({ length: 32 }, (_, i) => ({ id: `p${i+1}`, name: `Player ${i+1}`, dept: 'HQ', checkedIn: true }));
const pairings32 = generateRound1Pairings(mock32);
pairings32.matches.forEach(m => { m.winnerId = m.player1.id; });

const heats32_3Tables = computeRound2Heats(pairings32.byePlayer, pairings32.matches, 3);
if (
  heats32_3Tables.totalQualifiers !== 16 ||
  heats32_3Tables.tableAlpha.length !== 6 ||
  heats32_3Tables.tableBeta.length !== 5 ||
  heats32_3Tables.tableGamma.length !== 5
) {
  console.error(`FAIL: 32 players 3-table heat distribution failed`);
  process.exit(1);
}

const heats32_4Tables = computeRound2Heats(pairings32.byePlayer, pairings32.matches, 4);
if (
  heats32_4Tables.totalQualifiers !== 16 ||
  heats32_4Tables.tableAlpha.length !== 4 ||
  heats32_4Tables.tableBeta.length !== 4 ||
  heats32_4Tables.tableGamma.length !== 4 ||
  heats32_4Tables.tableDelta.length !== 4
) {
  console.error(`FAIL: 32 players 4-table heat distribution failed`);
  process.exit(1);
}

// Test 8: setRound2TableCount state helper
let stateR2 = createDefaultTournamentState();
stateR2 = setRound2TableCount(stateR2, 4);
if (stateR2.round2.numTables !== 4) {
  console.error('FAIL: setRound2TableCount 4 failed');
  process.exit(1);
}
stateR2 = setRound2TableCount(stateR2, 3);
if (stateR2.round2.numTables !== 3) {
  console.error('FAIL: setRound2TableCount 3 failed');
  process.exit(1);
}

console.log('PASS: Task 3 tests & flexible heats tests passed.');
