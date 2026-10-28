# Round 2 "Second Chance" Wildcard System & Test Round Schedule Specification

> **Event:** HR Division October Engagement Session  
> **Date:** Wednesday, 28 October 2026 • 3:00 PM – 4:30 PM  
> **Venue:** Common Area, Level 2, Hive 5, MRANTI Building  
> **Status:** Approved Spec  

---

## 1. Executive Summary & Problem Statement

In the hybrid tournament architecture, Round 1 consists of digital 1v1 matches on BuddyBoardGames. If attendance is at the planned 16-player minimum (or fewer than 34 attendees), Round 1 generates 8 winners. Distributing 8 qualifiers across the 3 physical tables results in:
- Table Alpha: 3 players
- Table Beta: 3 players
- Table Gamma: 2 players

A physical UNO game with only 2 or 3 players is less dynamic and less enjoyable than a full table, because Action Cards (Skip, Reverse, Draw 2, Wild Draw 4) do not circulate across a full group.

To ensure **at least 4 players per table** regardless of attendance, the tournament system introduces:
1. **The Round 2 "Second Chance / Wildcard" System:** Allows tournament organizers to manually assign non-qualifying attendees (Round 1 losers or other checked-in participants) to Table Alpha, Beta, or Gamma until each table reaches at least 4 players.
2. **Equal Championship Opportunity:** Second Chance players are full physical participants. If they win their heat, they advance to Round 3 (Grand Finale) and can win 1st, 2nd, or 3rd place on the podium.
3. **Dedicated Test Round Run-of-Show:** Formalizes the 6-stage schedule including a zero-stakes warm-up Test Round (3:12 PM – 3:25 PM) with dedicated practice room links.

---

## 2. Tournament Progression Architecture

```
[Attendance: 16 to 34 Registered Attendees]
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ 🧪 TEST ROUND (3:12 PM – 3:25 PM, 13 Mins)                      │
│ - Friendly, unranked practice on BuddyBoardGames                │
│ - Device & Wi-Fi check, room testing, rules clarification       │
└─────────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ ROUND 1: Digital 1v1s (3:25 PM – 3:45 PM, 20 Mins)              │
│ - 16 players = 8 matches (Tables 1 to 8) → 8 direct winners    │
│ - 34 players = 17 matches (Tables 1 to 17) → 17 direct winners │
└─────────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ ROUND 2: Physical Heats (3:45 PM – 4:05 PM, 20 Mins)            │
│ - Exactly 3 Physical Tables: Table Alpha, Beta, Gamma           │
│ - Direct Round 1 qualifiers fill tables automatically            │
│ - Organizers manually add "Second Chance" players to ensure     │
│   each table has AT LEAST 4 PLAYERS (e.g. 8 direct + 4 wildcards│
│   = 12 players across 3 tables of 4 pax each)                   │
│ - 1 Winner per table qualifies for the Grand Finale             │
└─────────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ ROUND 3: Grand Finale Showcase (4:05 PM – 4:20 PM, 15 Mins)     │
│ - The 3 heat champions face off at the central showcase table   │
│ - Decides the Top 3 Champions:                                  │
│   🥇 1st Place: Grand Champion                                  │
│   🥈 2nd Place: Runner-Up                                       │
│   🥉 3rd Place: 2nd Runner-Up                                   │
└─────────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ AWARDS & PHOTO (4:20 PM – 4:30 PM, 10 Mins)                     │
│ - Trophy & prize presentation for Top 3, refreshments           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Data Model & Engine Specifications

### 3.1 State Schema Updates (`tournament-engine.js`)

In `createDefaultTournamentState()`:
```javascript
round2: {
  numTables: 3,
  // Table-keyed arrays of player IDs added as Second Chance wildcards
  secondChance: {
    alpha: [],
    beta: [],
    gamma: [],
    delta: []
  },
  winners: {
    alpha: null,
    beta: null,
    gamma: null,
    delta: null
  }
}
```

In `loadTournamentState()`:
Safely backfill `state.round2.secondChance = { alpha: [], beta: [], gamma: [], delta: [] }` if missing from legacy records.

### 3.2 Engine Methods

1. **`addSecondChancePlayer(state, tableId, playerId)`**:
   - Validates that `playerId` exists in `state.roster` and is checked-in.
   - Validates that `playerId` is not already qualified from Round 1 or already seated in any Round 2 table.
   - Appends `playerId` to `state.round2.secondChance[tableId]`.
   - Returns immutable updated `state`.

2. **`removeSecondChancePlayer(state, tableId, playerId)`**:
   - Removes `playerId` from `state.round2.secondChance[tableId]`.
   - If that player was currently crowned as heat winner in `state.round2.winners[tableId]`, clears that winner.
   - Returns immutable updated `state`.

3. **`getEligibleSecondChancePlayers(state)`**:
   - Retrieves all checked-in players from `state.roster`.
   - Excludes any player who won their Round 1 match (or bye player).
   - Excludes any player already assigned to any table in `state.round2.secondChance`.
   - Returns array of eligible player objects: `{ id, name, dept }`.

4. **`computeRound2Heats(byePlayer, matches, numTables, secondChance = {})`**:
   - First distributes direct qualifiers (Round 1 winners + BYE player) across `numTables` (default: 3).
   - Next, for each table (`alpha`, `beta`, `gamma`, `delta`), looks up player records for IDs in `secondChance[tableId]`.
   - Marks each wildcard player with `isSecondChance: true`.
   - Appends them to that table's player list.
   - Guarantees each table renders with `targetTableCap = Math.max(seatedCount, 4)` so that at least 4 seats are always visualised.

5. **`resetGrandFinal(state)` & `resetTournamentState()`**:
   - Resets `round2.secondChance` to `{ alpha: [], beta: [], gamma: [], delta: [] }`.

---

## 4. User Interface & Interaction Design

### 4.1 Tournament Desk (`#deskView`)

Each table card (**Table Alpha**, **Table Beta**, **Table Gamma**):
- **Header:** Table Name (e.g., `Table Alpha (Heat 1)`) and Occupancy: `4 / 4 Pax (Min 4 Pax Active)`.
- **Seat List:**
  - Standard Qualifiers: Number pip, Name, Department, and `👑 Crown Winner` button.
  - Second Chance Players: Number pip, Name, Purple **`🃏 Second Chance`** badge, `✕` remove button, and `👑 Crown Winner` button.
  - Empty Slots (when table has fewer than 4 players):
    - Displays `Slot 4: Empty (Add Second Chance player to reach 4 pax)`.
- **Inline Second Chance Toolbar:**
  - An inline select dropdown: `<select class="desk-second-chance-select">` pre-populated with eligible non-qualifying attendees.
  - Button: `+ Add Second Chance`.
  - Selecting a player immediately seats them at the table and persists state.

### 4.2 Participant Live Matchups (`#matchupsView`)

- In the **Round 2 Physical Heats** panel:
  - Tables display all seated players.
  - Second Chance players feature a sleek badge: `🃏 Second Chance` (*"Peluang Kedua"* in BM).
  - Synchronizes in real time via Supabase websocket without requiring participant phone refreshes.

### 4.3 Event Schedule & Technical Setup (`#scheduleView`)

- Updated Run of Show cards in both English & Bahasa Melayu:
  1. 3:00 PM – 3:12 PM: Check-In & Onboarding
  2. 3:12 PM – 3:25 PM: **🧪 Test Round (Warm-Up & Device Check)**
  3. 3:25 PM – 3:45 PM: Round 1 — Digital 1v1 Elimination
  4. 3:45 PM – 4:05 PM: Round 2 — Physical Card Heats (Min 4 Pax per Table)
  5. 4:05 PM – 4:20 PM: Round 3 — Grand Finale Showcase (3 Table Winners)
  6. 4:20 PM – 4:30 PM: Awards Ceremony (Top 3 Champions)
- **Room Generator Tool (`#roomGeneratorWidget`):**
  - Added quick launcher button: **`🧪 Generate Test Room`** (creates pre-filled BuddyBoardGames links for `HR-Test-01` through `HR-Test-17`).

---

## 5. Security & Mobile Safe Mode

- **Organizer Gate:** `addSecondChancePlayer` and `removeSecondChancePlayer` require `ensureOrganizerUnlocked()`.
- **Mobile Read-Only:** Mobile view remains strictly read-only in Guest Mode (`#matchupsView`), preventing attendees from altering table rosters while allowing them to view their assignments in real time.

---

## 6. Verification & Test Plan

1. **Unit Tests (`tests/verify-tournament-engine.js`):**
   - Test adding a second chance player to Table Alpha, Beta, Gamma.
   - Test preventing duplicate seating across tables.
   - Test removing second chance player and clearing associated winner crown.
   - Test that `computeRound2Heats` merges qualifiers and second chance players with minimum 4 seats per table.
2. **DOM & Integration Tests (`tests/verify-tournament-desk-dom.js`):**
   - Test presence of second chance controls and translation dictionaries.
3. **End-to-End Simulation (`tests/e2e-simulation.js`):**
   - Simulate 16-player tournament: 8 Round 1 winners → add 4 Second Chance players → 3 tables of 4 pax → 3 heat champions → 3-player Grand Finale → Top 3 podium.
