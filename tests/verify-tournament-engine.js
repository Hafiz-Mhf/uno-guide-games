// tests/verify-tournament-engine.js
import {
  createDefaultTournamentState,
  loadTournamentState,
  saveTournamentState,
  resetTournamentState
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
