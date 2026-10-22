# Round 1 Roster Automation & 1v1 Randomizer Design Spec

**Date:** 2026-10-23  
**Status:** Approved by User  
**Target Event:** HR & Admin UNO Engagement Day 2026 (28 October 2026)  
**Scope:** Automated Roster Management, Check-In/No-Show Handler, 1v1 Matchup Randomizer, and Round 2 Physical Table Progression.

---

## 1. Problem Statement & Goals

The tournament targets ~30 participants for Round 1 (1v1 digital matches on BuddyBoardGames). In actual live events:
- Some registered participants fail to show up or arrive late.
- Organizers need to easily mark attendance (check-in / no-show) and remove absent players.
- Pairings must be randomized fairly ("who fights who") without manual paper drawing.
- If no-shows leave an odd count (e.g., 29 players), the system must cleanly award a `BYE` pass.
- Organizers need 1-click room launch links, copy-pasteable match listings for WhatsApp/Teams, and a direct way to record match winners that flow into Round 2 physical tables (Alpha, Beta, Gamma).

---

## 2. System Architecture & State Model

The feature operates as a zero-backend client-side state machine embedded in `app.js`, persisted in browser `localStorage` (`uno_tournament_state_v1`).

### State Schema
```javascript
{
  version: 1,
  roster: [
    {
      id: "p-01",
      name: "Ahmad Razali",
      dept: "Talent Development",
      checkedIn: true
    }
    // ... up to 30+ players
  ],
  round1: {
    generatedAt: null, // ISO string when generated
    byePlayer: null,   // null or player object { id, name, dept }
    matches: [
      {
        matchId: "HR-Match-01",
        tableNum: 1,
        player1: { id: "p-01", name: "Ahmad Razali", dept: "Talent Development" },
        player2: { id: "p-02", name: "Sarah Tan", dept: "HR Operations" },
        winnerId: null // string ("p-01" or "p-02")
      }
    ]
  },
  round2: {
    tableAlpha: [], // up to 5 player objects
    tableBeta: [],  // up to 5 player objects
    tableGamma: []  // up to 5 player objects
  }
}
```

### Persistence & Boot Lifecycle
1. On app boot, read `localStorage.getItem('uno_tournament_state_v1')`.
2. If absent or invalid:
   - Seed `roster` with the 30 names from `tournament-data.js`.
   - Default all players to `checkedIn: true`.
3. Provide a safe "Reset to Default Roster" action with confirmation prompt.

---

## 3. UI Components & Layout

A 4th navigation tab is added across the application:
- EN: `🏆 Tournament Desk`
- BM: `🏆 Meja Kejohanan`

### 3.1 Attendance Bar
- **Metrics display:**
  - `Registered: N`
  - `Checked In: X`
  - `No-Show / Absent: Y`
  - `Round 1 Matches: Math.floor(X / 2)`
  - Status pill: `Even Pairings Ready` (Green) or `1 Player BYE Pass` (Amber) if odd.

### 3.2 Roster Management Panel
- **Search & Quick Actions:**
  - Live search input to filter roster cards.
  - `Add Player`: Inline text inputs for Name and Department.
  - `Bulk Import`: Modal or collapsible textarea accepting comma-separated or newline-separated names.
  - `Check In All` / `Clear Check-Ins` batch buttons.
- **Player Cards:**
  - Presence switch: Green toggle / checkmark (Checked In) vs Gray (Absent).
  - Name, Department badge.
  - Delete button (trash icon) to permanently remove player from roster.

### 3.3 Randomizer Control Bar
- **Primary CTA:** `🎲 Randomize Round 1 Pairings` (with re-shuffle confirmation if matches already underway).
- **Secondary Actions:**
  - `📋 Copy Matchups (WhatsApp/Teams)`: Copies clean formatted match list to system clipboard.
  - `🖨️ Print Match Sheet`: Triggers print stylesheet with table breakdown.

### 3.4 Round 1 Matches Grid
- Cards for each match (`HR-Match-01` to `HR-Match-N`):
  - **Room Header:** `HR-Match-01 • Table 1` with BuddyBoardGames direct link.
  - **Matchup Display:**
    - Player 1 details vs Player 2 details.
  - **Winner Selection:**
    - Clickable buttons for each player (`👑 Ahmad Razali Won` / `👑 Sarah Tan Won`).
    - Active winner highlighted in gold card outline.
    - Click again to toggle/clear winner.
- **BYE Showcase Banner:**
  - If odd players were checked in, an amber card highlights the BYE player:
    `🎁 [Player Name] received a BYE pass and advances directly to Round 2!`

### 3.5 Round 2 Physical Heats Panel
- Automatic compilation of:
  - Any player with a Round 1 `BYE`.
  - All confirmed Round 1 match winners.
- Distributed across 3 physical table cards (5 players max per table):
  - **Table Alpha**
  - **Table Beta**
  - **Table Gamma**
- Real-time qualifier tracker: `Qualifiers: X / 15`.

---

## 4. Pairing & BYE Algorithm

```javascript
export function generateRound1Pairings(checkedInPlayers) {
  if (checkedInPlayers.length < 2) {
    throw new Error('At least 2 checked-in players are required to generate matches.');
  }

  // Fisher-Yates cryptographically uniform shuffle
  const pool = [...checkedInPlayers];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
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
      player1: { id: p1.id, name: p1.name, dept: p1.dept || p1.department },
      player2: { id: p2.id, name: p2.name, dept: p2.dept || p2.department },
      winnerId: null
    });
  }

  return { byePlayer, matches };
}
```

---

## 5. Round 2 Table Distribution Logic

```javascript
export function computeRound2Tables(byePlayer, matches) {
  const qualifiers = [];
  if (byePlayer) {
    qualifiers.push(byePlayer);
  }
  matches.forEach(m => {
    if (m.winnerId === m.player1.id) qualifiers.push(m.player1);
    else if (m.winnerId === m.player2.id) qualifiers.push(m.player2);
  });

  return {
    tableAlpha: qualifiers.slice(0, 5),
    tableBeta: qualifiers.slice(5, 10),
    tableGamma: qualifiers.slice(10, 15),
    remainingCount: 15 - qualifiers.length
  };
}
```

---

## 6. Clipboard Export Format

```text
🎮 HR & Admin UNO Championship 2026
🏆 Round 1 Digital 1v1 Matchups:

• Table 1 (HR-Match-01): Ahmad Razali vs Sarah Tan
• Table 2 (HR-Match-02): Farhan Hakim vs Nurul Aini
• Table 3 (HR-Match-03): Daniel Lee vs Kavita Nair
...
[BYE Pass]: Imran Fauzi (Direct to Round 2)

🎮 Game Platform: https://buddyboardgames.com/uno
```

---

## 7. Localization (EN & BM)

All UI strings (tab header, check-in badges, actions, buttons, and toast messages) will be integrated into the `TRANSLATIONS.en` and `TRANSLATIONS.bm` dictionaries in `app.js`.

---

## 8. Verification & Test Plan

1. **Unit tests in `tests/`:**
   - Shuffling fairness and non-empty pairings.
   - Odd player BYE assignment logic.
   - Winner recording and Round 2 table partition (Table Alpha, Beta, Gamma).
   - localStorage serialization & deserialization.
2. **Interactive UI verification:**
   - Add, edit, check in/out, and delete player actions.
   - Randomize button updates UI cleanly without page reloads.
   - Click winner updates card styling and updates Round 2 table lists live.
   - Clipboard copy confirms correct text payload.
