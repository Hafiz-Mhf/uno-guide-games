// tournament-engine.js
import { PLAYERS } from './tournament-data.js';

export const STORAGE_KEY = 'uno_tournament_state_v1';

export function createDefaultTournamentState() {
  const roster = PLAYERS.map(p => ({
    id: `p-${String(p.id).padStart(2, '0')}`,
    name: p.name,
    dept: p.department,
    checkedIn: true
  }));

  return {
    version: 1,
    roster,
    round1: {
      generatedAt: null,
      byePlayer: null,
      matches: []
    },
    round2: {
      tableAlpha: [],
      tableBeta: [],
      tableGamma: []
    }
  };
}

export function loadTournamentState(storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
  if (!storage) return createDefaultTournamentState();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultTournamentState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.roster)) return createDefaultTournamentState();
    return parsed;
  } catch (err) {
    return createDefaultTournamentState();
  }
}

export function saveTournamentState(storage = (typeof localStorage !== 'undefined' ? localStorage : null), state) {
  if (!storage || !state) return;
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetTournamentState(storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
  const fresh = createDefaultTournamentState();
  saveTournamentState(storage, fresh);
  return fresh;
}

export function togglePlayerCheckIn(state, playerId, checkedIn) {
  const roster = state.roster.map(p =>
    p.id === playerId ? { ...p, checkedIn: typeof checkedIn === 'boolean' ? checkedIn : !p.checkedIn } : p
  );
  return { ...state, roster };
}

export function addPlayer(state, name, dept = 'General') {
  const cleanName = (name || '').trim();
  if (!cleanName) return state;
  const newPlayer = {
    id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: cleanName,
    dept: (dept || '').trim() || 'General',
    checkedIn: true
  };
  return { ...state, roster: [...state.roster, newPlayer] };
}

export function removePlayer(state, playerId) {
  const roster = state.roster.filter(p => p.id !== playerId);
  return { ...state, roster };
}

export function setAllCheckInStatus(state, checkedIn) {
  const roster = state.roster.map(p => ({ ...p, checkedIn: !!checkedIn }));
  return { ...state, roster };
}

export function bulkImportRoster(state, rawText) {
  if (!rawText || !rawText.trim()) return state;
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const newPlayers = [];

  for (const line of lines) {
    let name = line;
    let dept = 'General';
    if (line.includes('|')) {
      const parts = line.split('|');
      name = parts[0].trim();
      dept = parts[1].trim() || 'General';
    } else if (line.includes(',')) {
      const parts = line.split(',');
      name = parts[0].trim();
      dept = parts[1].trim() || 'General';
    }
    if (name) {
      newPlayers.push({
        id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}-${newPlayers.length}`,
        name,
        dept,
        checkedIn: true
      });
    }
  }

  return { ...state, roster: [...state.roster, ...newPlayers] };
}
