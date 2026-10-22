# Round 1 Roster Automation & Tournament Desk Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an automated Tournament Desk for Round 1 that allows organizers to manage a ~30-player roster, mark attendance/no-shows, randomize 1v1 pairings with automatic BYE assignment for odd counts, launch pre-filled BuddyBoardGames rooms, copy matchups for WhatsApp/Teams, and record winners to auto-populate Round 2 physical tables (Alpha, Beta, Gamma).

**Architecture:** Pure vanilla JavaScript architecture adhering to zero-backend serverless setup. Domain logic isolated in `tournament-engine.js` with full unit test coverage. UI rendered dynamically via `app.js` into a dedicated 4th tab in `index.html`. State persisted cleanly in browser `localStorage` (`uno_tournament_state_v1`).

**Tech Stack:** Vanilla JavaScript (ES Modules), HTML5, CSS3, Node.js test runner (`node tests/...`).

## Global Constraints
- Target 30 players default, seeded from `tournament-data.js` PLAYERS roster.
- Zero external build dependencies (must run with existing `npx -y serve -p 3000 .`).
- All interactive actions must be bilingual (EN & BM) in `TRANSLATIONS`.
- Preserve exact BuddyBoardGames URL format with base64 encoding (`buildBuddyBoardGamesUrl`).
- State must survive page reload via `localStorage`.
- All tests must pass with `npm test`.

---

### Task 1: Tournament Engine Core Roster & Persistence

**Files:**
- Create: `tournament-engine.js`
- Create: `tests/verify-tournament-engine.js`

**Interfaces:**
- Consumes: `PLAYERS` from `tournament-data.js`
- Produces: `createDefaultTournamentState()`, `loadTournamentState(storage)`, `saveTournamentState(storage, state)`, `resetTournamentState(storage)`

- [ ] **Step 1: Write the failing test for initial state creation & persistence**

```javascript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-tournament-engine.js`  
Expected: FAIL with `Cannot find module '../tournament-engine.js'`

- [ ] **Step 3: Write minimal implementation in `tournament-engine.js`**

```javascript
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-tournament-engine.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tournament-engine.js tests/verify-tournament-engine.js
git commit -m "feat: add tournament engine core state and persistence"
```

---

### Task 2: Roster Management Functions (CRUD, Attendance, Bulk Import)

**Files:**
- Modify: `tournament-engine.js`
- Modify: `tests/verify-tournament-engine.js`

**Interfaces:**
- Consumes: `state` from Task 1
- Produces: `togglePlayerCheckIn(state, playerId, checkedIn)`, `addPlayer(state, name, dept)`, `removePlayer(state, playerId)`, `bulkImportRoster(state, rawText)`, `setAllCheckInStatus(state, checkedIn)`

- [ ] **Step 1: Write failing tests for roster management**

Append to `tests/verify-tournament-engine.js`:

```javascript
import {
  togglePlayerCheckIn,
  addPlayer,
  removePlayer,
  bulkImportRoster,
  setAllCheckInStatus
} from '../tournament-engine.js';

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-tournament-engine.js`  
Expected: FAIL with `togglePlayerCheckIn is not a function`

- [ ] **Step 3: Implement roster CRUD in `tournament-engine.js`**

```javascript
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-tournament-engine.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tournament-engine.js tests/verify-tournament-engine.js
git commit -m "feat: add roster management and bulk import to tournament engine"
```

---

### Task 3: Pairing Algorithm, BYE Logic, Round 2 Heats & Clipboard Export

**Files:**
- Modify: `tournament-engine.js`
- Modify: `tests/verify-tournament-engine.js`

**Interfaces:**
- Consumes: checked-in players from roster
- Produces: `generateRound1Pairings(checkedInPlayers, randomFn)`, `recordMatchWinner(state, matchId, winnerId)`, `computeRound2Heats(byePlayer, matches)`, `formatMatchupsClipboard(round1State)`

- [ ] **Step 1: Write failing tests for pairings, BYE, and Round 2 table calculation**

Append to `tests/verify-tournament-engine.js`:

```javascript
import {
  generateRound1Pairings,
  recordMatchWinner,
  computeRound2Heats,
  formatMatchupsClipboard
} from '../tournament-engine.js';

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

console.log('PASS: Task 3 tests passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-tournament-engine.js`  
Expected: FAIL with `generateRound1Pairings is not a function`

- [ ] **Step 3: Implement pairing, BYE, and Round 2 heats in `tournament-engine.js`**

```javascript
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

export function computeRound2Heats(byePlayer, matches) {
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

  return {
    tableAlpha: qualifiers.slice(0, 5),
    tableBeta: qualifiers.slice(5, 10),
    tableGamma: qualifiers.slice(10, 15),
    totalQualifiers: qualifiers.length,
    remainingToAdvance: Math.max(0, 15 - qualifiers.length)
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-tournament-engine.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tournament-engine.js tests/verify-tournament-engine.js
git commit -m "feat: add pairing randomizer, BYE logic, Round 2 heats, and clipboard exporter"
```

---

### Task 4: UI Markup & Bilingual Localization (EN/BM)

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Create: `tests/verify-tournament-desk-dom.js`

**Interfaces:**
- Consumes: `TRANSLATIONS` from `app.js`, HTML templates in `index.html`
- Produces: Tab button `[data-tab="desk"]`, Section `#deskView` with attendance banner, roster panel, match grid, Round 2 heats.

- [ ] **Step 1: Write test to verify DOM ids & i18n keys for Tournament Desk**

```javascript
// tests/verify-tournament-desk-dom.js
import fs from 'fs';
import { TRANSLATIONS } from '../app.js';

console.log('Testing Tournament Desk DOM and translations...');

const html = fs.readFileSync('index.html', 'utf-8');

// Check navigation tab
if (!html.includes('data-tab="desk"')) {
  console.error('FAIL: index.html missing data-tab="desk" nav button');
  process.exit(1);
}

// Check deskView section
if (!html.includes('id="deskView"')) {
  console.error('FAIL: index.html missing id="deskView" section');
  process.exit(1);
}

// Check key IDs
const requiredIds = [
  'deskRosterCount',
  'deskCheckedInCount',
  'deskAbsentCount',
  'deskStatusPill',
  'deskRosterList',
  'deskAddPlayerBtn',
  'deskPlayerNameInput',
  'deskPlayerDeptInput',
  'deskBulkImportBtn',
  'deskRandomizeBtn',
  'deskCopyMatchupsBtn',
  'deskResetBtn',
  'deskMatchesGrid',
  'deskByeNotice',
  'deskRound2HeatsGrid'
];

for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) {
    console.error(`FAIL: index.html missing required element id: ${id}`);
    process.exit(1);
  }
}

// Verify EN and BM translations
if (!TRANSLATIONS.en.tournamentDesk || !TRANSLATIONS.bm.tournamentDesk) {
  console.error('FAIL: app.js missing tournamentDesk translations');
  process.exit(1);
}

console.log('PASS: Task 4 DOM and translation assertions passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-tournament-desk-dom.js`  
Expected: FAIL

- [ ] **Step 3: Update `index.html` and `app.js` with Tournament Desk HTML and dictionary keys**

In `index.html`:
1. Add tab button to `<nav class="tab-nav">`:
   ```html
   <button class="tab-btn" data-tab="desk" data-i18n="nav.tournamentDesk">🏆 Tournament Desk</button>
   ```
2. Add quick nav pill in header or sync.
3. Add `<section id="deskView" class="tab-content">` containing:
   - Attendance status banner (`deskRosterCount`, `deskCheckedInCount`, `deskAbsentCount`, `deskStatusPill`)
   - Roster Management Toolbar (`deskPlayerNameInput`, `deskPlayerDeptInput`, `deskAddPlayerBtn`, `deskBulkToggleBtn`, `deskBulkContainer`, `deskBulkTextarea`, `deskBulkImportBtn`, `deskCheckAllBtn`, `deskUncheckAllBtn`, `deskResetBtn`)
   - Search filter input (`deskRosterSearch`)
   - Scrollable Roster Grid (`deskRosterList`)
   - Randomize Action Bar (`deskRandomizeBtn`, `deskCopyMatchupsBtn`, `deskPrintBtn`)
   - BYE Notice Banner (`deskByeNotice`)
   - Round 1 Matches Grid (`deskMatchesGrid`)
   - Round 2 Physical Heats Showcase (`deskRound2HeatsGrid`, `deskQualifiersCount`)

In `app.js`:
Add full `tournamentDesk` bilingual keys to `TRANSLATIONS.en` and `TRANSLATIONS.bm` (title, badge, stats, buttons, prompts, placeholders, toast notifications).

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-tournament-desk-dom.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add index.html app.js tests/verify-tournament-desk-dom.js
git commit -m "feat: add Tournament Desk markup and bilingual translations"
```

---

### Task 5: App Controller & Event Wireup in `app.js`

**Files:**
- Modify: `app.js`
- Modify: `tests/e2e-simulation.js`

**Interfaces:**
- Consumes: `tournament-engine.js` functions, `index.html` elements
- Produces: `renderTournamentDesk()`, `setupTournamentDeskEvents()`, `initApp()` integration

- [ ] **Step 1: Write integration check in `tests/e2e-simulation.js`**

Add assertions in `tests/e2e-simulation.js` that check:
1. `tournament-engine.js` integrates with `app.js`.
2. Initial render loads default state without errors.
3. Randomize creates matches and updates DOM elements.

- [ ] **Step 2: Run test to verify it fails or needs updates**

Run: `node tests/e2e-simulation.js`  
Expected: Runs or checks existing baseline.

- [ ] **Step 3: Implement controller functions in `app.js`**

1. Import from `./tournament-engine.js`:
   `loadTournamentState, saveTournamentState, resetTournamentState, togglePlayerCheckIn, addPlayer, removePlayer, bulkImportRoster, setAllCheckInStatus, generateRound1Pairings, recordMatchWinner, computeRound2Heats, formatMatchupsClipboard`.
2. Define reactive state variable:
   `let tournamentState = loadTournamentState();`
3. Implement `renderTournamentDesk()`:
   - Render metrics numbers.
   - Render roster cards with presence checkbox, name, department, delete button.
   - Render BYE card if `tournamentState.round1.byePlayer` exists.
   - Render Match Cards with Player 1 vs Player 2, BuddyBoardGames direct link, and Winner Toggle buttons.
   - Render Round 2 Table Alpha, Beta, Gamma lists with current qualifiers.
4. Bind events in `setupTournamentDeskEvents()`:
   - Checkbox click -> `togglePlayerCheckIn()` -> save -> re-render.
   - Add Player form submit -> `addPlayer()` -> save -> re-render.
   - Delete Player button -> `removePlayer()` -> save -> re-render.
   - Bulk Import click -> `bulkImportRoster()` -> save -> re-render.
   - Check All / Clear All -> `setAllCheckInStatus()` -> save -> re-render.
   - Randomize button click -> prompt if already generated -> `generateRound1Pairings()` -> save -> re-render.
   - Winner button click -> `recordMatchWinner()` -> save -> re-render.
   - Copy Matchups button click -> `formatMatchupsClipboard()` -> `navigator.clipboard.writeText()` -> toast.
   - Reset button click -> confirm dialog -> `resetTournamentState()` -> re-render.
   - Search filter input -> filters roster list in real time.
5. Hook into `initApp()` and `updateI18n()`.

- [ ] **Step 4: Run tests to verify all tests pass**

Run: `node tests/verify-tournament-desk-dom.js && node tests/verify-tournament-engine.js && node tests/e2e-simulation.js`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add app.js tests/e2e-simulation.js
git commit -m "feat: wire up Tournament Desk events, state updates, and dynamic rendering"
```

---

### Task 6: Styling & Print Stylesheet in `styles.css`

**Files:**
- Modify: `styles.css`

**Interfaces:**
- Consumes: classes and layout IDs created in Tasks 4 & 5
- Produces: Responsive styling for Tournament Desk, dark mode card aesthetic, mobile layout, `@media print` rules.

- [ ] **Step 1: Write print and visual styles in `styles.css`**

Add CSS rules for:
1. `.desk-metrics-bar`: Gradient grid showing 4 metric cards with glowing numbers.
2. `.desk-roster-section`: Toolbar, compact search input, scrollable card grid with hover transitions.
3. `.player-roster-card`: Check-in toggle pill, badge, department subtitle, delete icon button.
4. `.desk-randomize-bar`: Neon action button for randomize with dice animation, copy button with clipboard feedback.
5. `.bye-notice-card`: Gold-amber highlighted card with celebration badge.
6. `.round1-match-card`: Glassmorphic card, VS badge, direct game link, winner toggle buttons with gold active border.
7. `.round2-heats-grid`: 3 physical table cards (Alpha, Beta, Gamma) with numbered seat tags.
8. `@media print`: Clean high-contrast black/white layout hiding controls, displaying clean match tables for tournament referees.

- [ ] **Step 2: Verify styling in browser / test command**

Run: `npm test`  
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "style: add responsive styles and print stylesheet for Tournament Desk"
```

---

### Task 7: Full Test Suite Verification & Package.json Update

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Update `package.json` test script to include new verification scripts**

```json
"test": "node tests/verify-data.js && node tests/verify-tournament-engine.js && node tests/verify-tournament-desk-dom.js && node tests/verify-app.js && node tests/verify-card-engine.js && node tests/e2e-simulation.js"
```

- [ ] **Step 2: Run complete test suite**

Run: `npm test`  
Expected: All 6 test suites execute and report `PASS`.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "test: register tournament engine and desk DOM tests in npm test"
```
