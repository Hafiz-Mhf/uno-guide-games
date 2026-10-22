// tests/verify-tournament-engine.js
import {
  createDefaultTournamentState,
  loadTournamentState,
  saveTournamentState,
  resetTournamentState,
  togglePlayerCheckIn,
  addPlayer,
  removePlayer,
  bulkImportRoster,
  setAllCheckInStatus
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

console.log('PASS: Task 2 tests passed.');
