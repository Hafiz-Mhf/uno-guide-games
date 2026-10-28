# Round 2 "Second Chance" Wildcard System & Test Round Schedule Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Round 2 "Second Chance" Wildcard seating system to guarantee at least 4 players per physical table for 16-to-34 player events, and formalize the 6-stage event schedule with a zero-stakes Test Round (warm-up).

**Architecture:** Extend `tournament-engine.js` with `secondChance` table mapping and helper methods (`addSecondChancePlayer`, `removeSecondChancePlayer`, `getEligibleSecondChancePlayers`). Update `computeRound2Heats` to merge direct qualifiers with second chance players and enforce a minimum 4-seat visual capacity per table. Enhance `app.js` with desk table pickers, crown winner actions, public view badges, bilingual dictionaries, and room generator test room links.

**Tech Stack:** Vanilla JavaScript (ES modules), HTML5, Vanilla CSS, Supabase Real-time Cloud Sync, Node.js test runner.

## Global Constraints
- Target Event: Wednesday, 28 October 2026 • 3:00 PM – 4:30 PM (90 Mins).
- Bilingual support: All new labels, badges, and toasts must exist in English and Bahasa Melayu.
- Zero regressions: All 11 existing test suites must continue to pass cleanly.
- Strict mobile isolation: Mobile attendees must remain strictly in Guest Mode (`#matchupsView`) without desk controls.

---

### Task 1: Tournament Engine Second Chance State & Methods

**Files:**
- Modify: `tournament-engine.js:20-65, 220-275`
- Test: `tests/verify-tournament-engine.js`

**Interfaces:**
- Consumes: `state.roster`, `state.round1`, `state.round2`
- Produces:
  - `addSecondChancePlayer(state, tableId, playerId)`: returns updated state with player in `state.round2.secondChance[tableId]`
  - `removeSecondChancePlayer(state, tableId, playerId)`: returns updated state with player removed from table and uncrowns winner if applicable
  - `getEligibleSecondChancePlayers(state)`: returns array of `{ id, name, dept }` for non-qualifying checked-in attendees
  - `computeRound2Heats(byePlayer, matches, numTables, secondChance)`: merges qualifiers with second chance wildcards, sets `targetTableCap = Math.max(seatedCount, 4)`

- [ ] **Step 1: Write unit tests for Second Chance engine methods in `tests/verify-tournament-engine.js`**

Add tests covering:
```javascript
// Test Second Chance methods
console.log('Testing Second Chance Wildcard System...');
let testState = createDefaultTournamentState();
const eligible = getEligibleSecondChancePlayers(testState);
if (!Array.isArray(eligible) || eligible.length !== 34) {
  console.error('FAIL: Expected 34 eligible players initially');
  process.exit(1);
}

// Add player to Table Alpha
testState = addSecondChancePlayer(testState, 'alpha', testState.roster[0].id);
if (!testState.round2.secondChance.alpha.includes(testState.roster[0].id)) {
  console.error('FAIL: addSecondChancePlayer did not add player to Table Alpha');
  process.exit(1);
}

// Ensure player is no longer eligible for other tables
const eligibleAfter = getEligibleSecondChancePlayers(testState);
if (eligibleAfter.some(p => p.id === testState.roster[0].id)) {
  console.error('FAIL: Player added to second chance must not remain eligible');
  process.exit(1);
}

// Test computeRound2Heats includes second chance player
const heats = computeRound2Heats(null, [], 3, testState.round2.secondChance);
if (heats.tableAlpha.length !== 1 || !heats.tableAlpha[0].isSecondChance) {
  console.error('FAIL: computeRound2Heats failed to merge second chance player');
  process.exit(1);
}

// Remove player
testState = removeSecondChancePlayer(testState, 'alpha', testState.roster[0].id);
if (testState.round2.secondChance.alpha.includes(testState.roster[0].id)) {
  console.error('FAIL: removeSecondChancePlayer failed to remove player');
  process.exit(1);
}
console.log('PASS: Second Chance engine methods passed.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-tournament-engine.js`
Expected: FAIL with `getEligibleSecondChancePlayers is not a function`

- [ ] **Step 3: Implement Second Chance state & methods in `tournament-engine.js`**

Add `secondChance: { alpha: [], beta: [], gamma: [], delta: [] }` in `createDefaultTournamentState()`, `loadTournamentState()`, and `resetGrandFinal()`. Implement `addSecondChancePlayer`, `removeSecondChancePlayer`, `getEligibleSecondChancePlayers`, and update `computeRound2Heats`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-tournament-engine.js`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add tournament-engine.js tests/verify-tournament-engine.js
git commit -m "feat(engine): add Round 2 second chance wildcard methods and tests"
```

---

### Task 2: Tournament Desk & Public Matchups UI Implementation

**Files:**
- Modify: `app.js:2305-2364, 2765-2820, 3110-3165`
- Modify: `styles.css`
- Test: `tests/verify-tournament-desk-dom.js`

**Interfaces:**
- Consumes: `computeRound2Heats`, `addSecondChancePlayer`, `removeSecondChancePlayer`, `getEligibleSecondChancePlayers`
- Produces:
  - Interactive table cards with `+ Add Second Chance` dropdown
  - Purple `🃏 Second Chance` badge on wildcard players
  - Remove `✕` button on wildcard players
  - Crown Winner works for all seated players
  - Real-time cloud sync (`persistTournamentState`)

- [ ] **Step 1: Write DOM verification test in `tests/verify-tournament-desk-dom.js`**

Check for second chance translation keys and styles:
```javascript
if (!TRANSLATIONS.en.tournamentDesk.round2?.secondChanceBtn || !TRANSLATIONS.bm.tournamentDesk.round2?.secondChanceBtn) {
  console.error('FAIL: Missing secondChanceBtn in translations');
  process.exit(1);
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-tournament-desk-dom.js`
Expected: FAIL with missing translation keys

- [ ] **Step 3: Implement translations, styling, and DOM rendering in `app.js` and `styles.css`**

1. Add bilingual translations for:
   - `secondChanceBtn`: `"+ Add Second Chance"` / `"+ Tambah Peluang Kedua"`
   - `secondChanceBadge`: `"🃏 Second Chance"` / `"🃏 Peluang Kedua"`
   - `secondChanceSelectPrompt`: `"Select attendee for Second Chance..."` / `"Pilih peserta untuk Peluang Kedua..."`
   - `secondChanceEmptySlot`: `"Empty (Add player to reach 4 pax)"` / `"Kosong (Tambah pemain untuk cukupkan 4)"`
   - `secondChanceAddedToast`: `"Player added to Table as Second Chance!"` / `"Peserta ditambah ke meja sebagai Peluang Kedua!"`
2. Update Round 2 table card rendering in `renderTournamentDesk`:
   - Enforce `targetTableCap = Math.max(t.list.length, 4)`
   - Tag wildcard players with `.second-chance-seat` and `.second-chance-chip`
   - Render inline select dropdown + button at bottom of each card
   - Add click handlers for `add-second-chance` and `remove-second-chance`
3. Update `renderPublicMatchups` to display `🃏 Second Chance` pill on attendee phones.
4. Add CSS styles in `styles.css` for `.second-chance-chip`, `.second-chance-select-wrap`, `.btn-add-second-chance`, and `.btn-remove-second-chance`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-tournament-desk-dom.js`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add app.js styles.css tests/verify-tournament-desk-dom.js
git commit -m "feat(ui): implement Round 2 second chance picker and minimum 4-seat display"
```

---

### Task 3: Schedule & Room Generator Test Round Updates

**Files:**
- Modify: `app.js`
- Modify: `index.html`
- Modify: `tournament.md`
- Test: `tests/verify-app.js`

**Interfaces:**
- Consumes: `TRANSLATIONS`
- Produces:
  - 6-stage timeline in `#scheduleView`
  - Quick launcher button for Test Round rooms in `#roomGeneratorWidget`
  - Updated documentation in `tournament.md`

- [ ] **Step 1: Write test in `tests/verify-app.js`**

Assert presence of `testRound` in `scheduleTab` translations and `launchTestRoomBtn` in `index.html`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-app.js`
Expected: FAIL

- [ ] **Step 3: Implement Test Round schedule and Room Generator launcher**

1. In `app.js`: Update `TRANSLATIONS.en.scheduleTab` and `TRANSLATIONS.bm.scheduleTab` to 6 stages:
   - Stage 1: Check-In (3:00 PM – 3:12 PM)
   - Stage 2: 🧪 Test Round / Warm-Up (3:12 PM – 3:25 PM)
   - Stage 3: Round 1 Digital 1v1s (3:25 PM – 3:45 PM)
   - Stage 4: Round 2 Physical Heats (3:45 PM – 4:05 PM)
   - Stage 5: Round 3 Grand Finale (4:05 PM – 4:20 PM)
   - Stage 6: Awards Ceremony (4:20 PM – 4:30 PM)
2. In `index.html`: Update schedule cards and add `#testRoomBtn` in `#roomGeneratorWidget`.
3. In `app.js`: Wire `#testRoomBtn` click handler to generate `HR-Test-01` to `HR-Test-17`.
4. In `tournament.md`: Document the 6-stage flow and 16-player minimum contingency.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-app.js`
Expected: PASS

- [ ] **Step 5: Commit changes**

```bash
git add app.js index.html tournament.md tests/verify-app.js
git commit -m "feat(schedule): add Test Round stage and quick test room launcher"
```

---

### Task 4: End-to-End Simulation & Full Verification

**Files:**
- Modify: `tests/e2e-simulation.js`
- Modify: `current_context.md`

**Interfaces:**
- Consumes: All engine and UI modules
- Produces: Clean pass across all 11 test suites

- [ ] **Step 1: Update `tests/e2e-simulation.js` to simulate 16-player minimum scenario**

Simulate:
1. 16 players checked in → generate 8 digital matches (0 BYEs).
2. Record 8 match winners.
3. Add 4 Second Chance players (1 to Alpha, 1 to Beta, 2 to Gamma) → exactly 4 players per table.
4. Crown 1 winner per table (Alpha, Beta, Gamma) → 3 Grand Finalists.
5. Award 1st, 2nd, and 3rd place podium spots.
6. Verify championship standings and podium state.

- [ ] **Step 2: Run all test suites**

Run: `npm test`
Expected: 11 / 11 test suites pass with 0 errors.

- [ ] **Step 3: Update `current_context.md`**

Document the new Second Chance Wildcard System and 6-stage Run of Show.

- [ ] **Step 4: Commit and push to origin/master**

```bash
git add tests/e2e-simulation.js current_context.md
git commit -m "test(e2e): verify 16-player minimum scenario with Second Chance wildcards"
git push origin master
```
