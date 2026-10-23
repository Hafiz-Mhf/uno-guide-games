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
      tableGamma: [],
      tableDelta: [],
      numTables: 3
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

export function generateRound1Pairings(checkedInPlayers, randomFn = Math.random) {
  if (!checkedInPlayers || checkedInPlayers.length < 2) {
    throw new Error('At least 2 checked-in players required to generate pairings.');
  }

  // Fisher-Yates uniform shuffle
  const pool = [...checkedInPlayers];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  let byePlayer = null;
  if (pool.length % 2 !== 0) {
    byePlayer = pool.pop();
  }

  const matches = [];
  const totalMatches = pool.length / 2;

  for (let i = 0; i < totalMatches; i++) {
    const p1 = pool[i * 2];
    const p2 = pool[i * 2 + 1];
    const matchNum = i + 1;
    const matchId = `HR-Match-${String(matchNum).padStart(2, '0')}`;

    matches.push({
      matchId,
      tableNum: matchNum,
      player1: { id: p1.id, name: p1.name, dept: p1.dept || 'General' },
      player2: { id: p2.id, name: p2.name, dept: p2.dept || 'General' },
      winnerId: null
    });
  }

  return { byePlayer, matches, generatedAt: new Date().toISOString() };
}

export function recordMatchWinner(state, matchId, winnerId) {
  const matches = state.round1.matches.map(m => {
    if (m.matchId !== matchId) return m;
    return {
      ...m,
      winnerId: m.winnerId === winnerId ? null : winnerId
    };
  });
  return {
    ...state,
    round1: {
      ...state.round1,
      matches
    }
  };
}

export function setRound2TableCount(state, numTables) {
  const count = numTables === 4 ? 4 : 3;
  return {
    ...state,
    round2: {
      ...(state.round2 || {}),
      numTables: count
    }
  };
}

export function computeRound2Heats(byePlayer, matches, numTables = 3) {
  const qualifiers = [];
  if (byePlayer) {
    qualifiers.push(byePlayer);
  }
  if (Array.isArray(matches)) {
    matches.forEach(m => {
      if (m.winnerId === m.player1.id) qualifiers.push(m.player1);
      else if (m.winnerId === m.player2.id) qualifiers.push(m.player2);
    });
  }

  const k = numTables === 4 ? 4 : 3;
  const n = qualifiers.length;
  const base = Math.floor(n / k);
  const remainder = n % k;

  const tableBuckets = Array.from({ length: k }, () => []);
  let currentIdx = 0;
  for (let i = 0; i < k; i++) {
    const tableSize = base + (i < remainder ? 1 : 0);
    tableBuckets[i] = qualifiers.slice(currentIdx, currentIdx + tableSize);
    currentIdx += tableSize;
  }

  const tableAlpha = tableBuckets[0] || [];
  const tableBeta = tableBuckets[1] || [];
  const tableGamma = tableBuckets[2] || [];
  const tableDelta = tableBuckets[3] || [];

  const expectedTotal = (Array.isArray(matches) ? matches.length : 0) + (byePlayer ? 1 : 0);

  return {
    tableAlpha,
    tableBeta,
    tableGamma,
    tableDelta,
    tableBuckets,
    numTables: k,
    totalQualifiers: qualifiers.length,
    expectedQualifiers: expectedTotal,
    remainingToAdvance: Math.max(0, expectedTotal - qualifiers.length)
  };
}

export function formatMatchupsClipboard(round1State) {
  if (!round1State || !Array.isArray(round1State.matches)) return '';
  const lines = [
    '🎮 HR & Admin UNO Championship 2026',
    '🏆 Round 1 Digital 1v1 Matchups:',
    ''
  ];

  round1State.matches.forEach(m => {
    lines.push(`• Table ${m.tableNum} (${m.matchId}): ${m.player1.name} vs ${m.player2.name}`);
  });

  if (round1State.byePlayer) {
    lines.push('');
    lines.push(`🎁 [BYE Pass]: ${round1State.byePlayer.name} (${round1State.byePlayer.dept}) advances directly to Round 2!`);
  }

  lines.push('');
  lines.push('🎮 Digital Game Room: https://buddyboardgames.com/uno');
  return lines.join('\n');
}
