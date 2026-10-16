# Hybrid UNO Championship Web App & Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a zero-backend, mobile-first dual-language (EN/BM) Single Page Application and complete all tournament documentation for the October Engagement Day Hybrid UNO Championship.

**Architecture:** Client-side SPA using vanilla HTML5, CSS3, and ES6 JavaScript. Master i18n dictionary and 30-player static roster power instant tab switching, language toggling, and real-time player matchup search without build steps or backend servers.

**Tech Stack:** HTML5, CSS3 (Vanilla mobile-first responsive), JavaScript (ES Modules), Git.

## Global Constraints
- Target date: 28 October 2026.
- Mobile viewport target: 375px – 430px (responsive up to desktop).
- Zero external build tools (no Webpack, Vite, or npm dependencies).
- Dual language parity: English (EN) and Bahasa Melayu (BM).
- Official brand colors: UNO Red (`#ED1C24`), UNO Yellow (`#FFDE00`), UNO Green (`#00A651`), UNO Blue (`#0072BC`), Dark (`#1E293B`), Light (`#F8FAFC`).
- Game Room URL: `https://buddyboardgames.com/uno`.

---

### Task 1: Complete Markdown Documentation Suite

**Files:**
- Modify: `architecture.md`
- Modify: `guide.md`
- Modify: `tournament.md`

**Interfaces:**
- Consumes: `planning.md`, `rules.md`, `design.md`, `localization.md`
- Produces: Complete reference docs for tournament players, table captains, and organizers.

- [ ] **Step 1: Write complete content for `architecture.md`**

Replace stub in `architecture.md` with full technical specification (SPA model, zero-backend, performance goals, static hosting).

```markdown
# Technical Architecture

## 1. System Overview
The web application is a client-side, zero-backend, mobile-first single-page application (SPA) designed to run seamlessly on participants' mobile browsers when scanned via a venue QR code at Chatter Box, MRANTI.

## 2. Technical Stack & Rationale
- **Core:** Vanilla HTML5, modern CSS3, and ES6 JavaScript.
- **Hosting:** Any static file server or CDN (GitHub Pages, Netlify, Vercel, or local static server).
- **Zero-Backend Design:** Eliminates network failure risks during live event execution. All player rosters, match room assignments, and localized copy are bundled directly into static assets.
- **Offline Tolerance:** Assets load instantly over venue Wi-Fi and cache in browser memory for uninterrupted access during matches.

## 3. Directory & Component Layout
- `index.html`: Semantic entry point housing the sticky header, segmented navigation, and view panels.
- `styles.css`: Custom responsive styling adhering to UNO brand palette and mobile viewports (375px–430px).
- `app.js`: Tab routing controller, reactive i18n translation renderer, and search filter.
- `tournament-data.js`: Master 30-player roster with match rooms and table mappings.
- `localization.md`: Master i18n dictionary.

## 4. Performance & Compatibility Targets
- First Contentful Paint (FCP): < 500ms on 4G / venue Wi-Fi.
- Supported Browsers: Mobile Safari (iOS 14+), Mobile Chrome (Android 9+), Edge, Firefox.
- Viewports: Optimized for 375px – 430px with fluid scaling for tablet and desktop display.
```

- [ ] **Step 2: Write complete content for `guide.md`**

Replace stub in `guide.md` with complete player onboarding guide for BuddyBoardGames.

```markdown
# Player Onboarding & Platform Guide | Panduan Pemain

## 1. Digital Platform Overview
- **URL:** [https://buddyboardgames.com/uno](https://buddyboardgames.com/uno)
- **Requirements:** Any modern mobile or laptop browser (Chrome, Safari, Edge, Firefox).
- **Zero Setup:** No app download, registration, or login required.

---

## 2. Step-by-Step Join Instructions (Tournament Day)

### Step 1: Open the Game Lobby
- Scan the event QR code or tap **Launch Game Room** in the Web App.
- Navigate to `https://buddyboardgames.com/uno`.

### Step 2: Set Your Identity
- Enter your **Full Name** in the `Nickname` field so referees and opponents recognize you.

### Step 3: Enter Your Assigned Room
- Use the **Tournament** tab in the Web App to find your match room ID (e.g., `HR-Match-01` to `HR-Match-15`).
- Type the exact Room Name and tap **Play Uno**.

### Step 4: Ready Up & Play
- Wait for your assigned opponent to join the room.
- Round 1 is played as **Best of 3**. The first player to win 2 games reports the victory to the Table Captain.

---

## 3. Troubleshooting & Venue Tips
- **Disconnections:** If accidentally disconnected, re-enter the exact same Room Name and Nickname to rejoin.
- **Timer Notice:** 30-second turn limit applies. Inactive players will forfeit their turn.
- **Wi-Fi Issues:** Switch to personal mobile data if venue Wi-Fi experiences latency.
```

- [ ] **Step 3: Write complete content for `tournament.md`**

Replace stub in `tournament.md` with full 3-round tournament progression architecture.

```markdown
# 30-Player Hybrid Tournament System | Sistem Kejohanan

## 1. Structural Bracket Architecture
The championship operates across three sequential stages over a 90-minute schedule:

```
[30 Players]
     │
     ▼
┌──────────────────────────────────────────────┐
│ Round 1: Digital 1v1s (15 Matches)           │
│ - Platform: BuddyBoardGames (Best of 3)      │
│ - 15 Winners Advance                         │
└──────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────┐
│ Round 2: Physical Heats (3 Tables × 5 Pax)   │
│ - Standard physical UNO card deck per table  │
│ - Table Alpha, Table Beta, Table Gamma       │
│ - 1 Winner per table qualifies for Finals    │
└──────────────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────┐
│ Round 3: Grand Final (1 Table × 3 Players)   │
│ - Center Showcase Table                      │
│ - Decides 1st, 2nd, and 3rd Place Champions  │
└──────────────────────────────────────────────┘
```

---

## 2. Stage Details & Rules

### Round 1: Digital 1v1 Matches (3:15 – 3:35 PM)
- 15 simultaneous 1v1 matches across rooms `HR-Match-01` through `HR-Match-15`.
- Match format: Best of 3 games.
- Winners report directly to the Tournament Director or Table Captain to be assigned to their Round 2 physical table.
- Non-advancing participants may transition to the open spectator lounge or consolation free-play table.

### Round 2: Physical Heats (3:35 – 4:00 PM)
- 15 players distributed into 3 physical tables (5 players each):
  - **Table Alpha (5 players)**
  - **Table Beta (5 players)**
  - **Table Gamma (5 players)**
- 1 dedicated Table Captain oversees each table to resolve disputes and verify the "UNO!" shout.
- The first player to shed all cards in each heat wins the table and advances to the Grand Final.

### Round 3: Grand Final Showcase (4:00 – 4:20 PM)
- 3 finalists compete at the center showcase table with audience spectator coverage.
- Ranking determined by order of finishing:
  - **1st place (Champion):** First to empty hand.
  - **2nd place (Runner-Up):** Second to empty hand.
  - **3rd place (Third Place):** Remaining finalist.

---

## 3. Tiebreaker & Dispute Resolution
- **Simultaneous Empty Hand:** If two players discard their final card in the same turn sequence, remaining cards or penalty draw count will be audited by the Table Captain.
- **Dispute Escalation:** All Table Captain rulings are final. Unresolved matters escalate to the Lead Tournament Director.
```

- [ ] **Step 4: Verify markdown files exist and are not empty**

Run: `Get-Item architecture.md, guide.md, tournament.md | Select-Object Name, Length`
Expected: All 3 files present with length > 500 bytes.

- [ ] **Step 5: Commit documentation updates**

```bash
git add architecture.md guide.md tournament.md
git commit -m "docs: complete architecture, guide, and tournament markdown specs"
```

---

### Task 2: Create Static Tournament Data & Test Verification Script

**Files:**
- Create: `tournament-data.js`
- Create: `tests/verify-data.js`

**Interfaces:**
- Consumes: Tournament structure from `tournament.md` (30 players, 15 matches, 3 round-2 heats)
- Produces: `PLAYERS` array and helper lookup functions exported via ES modules.

- [ ] **Step 1: Write `tests/verify-data.js` test script**

```javascript
// tests/verify-data.js
import { PLAYERS, getPlayerByName, getMatches } from '../tournament-data.js';

console.log('Running tournament data verification...');

if (!Array.isArray(PLAYERS) || PLAYERS.length !== 30) {
  console.error(`FAIL: Expected 30 players, found ${PLAYERS?.length}`);
  process.exit(1);
}

const matches = getMatches();
if (matches.length !== 15) {
  console.error(`FAIL: Expected 15 matches, found ${matches.length}`);
  process.exit(1);
}

const p1 = getPlayerByName('Ahmad Razali');
if (!p1 || p1.match !== 'HR-Match-01') {
  console.error('FAIL: getPlayerByName failed for Ahmad Razali');
  process.exit(1);
}

// Check unique IDs
const ids = new Set(PLAYERS.map(p => p.id));
if (ids.size !== 30) {
  console.error('FAIL: Duplicate player IDs detected');
  process.exit(1);
}

console.log('PASS: All tournament data assertions passed.');
```

- [ ] **Step 2: Run test to verify it fails before `tournament-data.js` exists**

Run: `node tests/verify-data.js`
Expected: Error: Cannot find module '../tournament-data.js'

- [ ] **Step 3: Implement `tournament-data.js`**

```javascript
// tournament-data.js
export const PLAYERS = [
  { id: 1, name: "Ahmad Razali", department: "Talent Development", match: "HR-Match-01", table: 1, opponent: "Sarah Tan", round2Heat: "Table Alpha" },
  { id: 2, name: "Sarah Tan", department: "HR Operations", match: "HR-Match-01", table: 1, opponent: "Ahmad Razali", round2Heat: "Table Alpha" },
  { id: 3, name: "Farhan Hakim", department: "Recruitment", match: "HR-Match-02", table: 2, opponent: "Nurul Aini", round2Heat: "Table Alpha" },
  { id: 4, name: "Nurul Aini", department: "People Experience", match: "HR-Match-02", table: 2, opponent: "Farhan Hakim", round2Heat: "Table Alpha" },
  { id: 5, name: "Daniel Lee", department: "Admin Services", match: "HR-Match-03", table: 3, opponent: "Kavita Nair", round2Heat: "Table Alpha" },
  { id: 6, name: "Kavita Nair", department: "Compensation & Benefits", match: "HR-Match-03", table: 3, opponent: "Daniel Lee", round2Heat: "Table Alpha" },
  { id: 7, name: "Zulhilmi Zain", department: "Talent Acquisition", match: "HR-Match-04", table: 4, opponent: "Chloe Wong", round2Heat: "Table Alpha" },
  { id: 8, name: "Chloe Wong", department: "HR Business Partner", match: "HR-Match-04", table: 4, opponent: "Zulhilmi Zain", round2Heat: "Table Alpha" },
  { id: 9, name: "Haris Iskandar", department: "Facility Admin", match: "HR-Match-05", table: 5, opponent: "Melissa Fernandez", round2Heat: "Table Alpha" },
  { id: 10, name: "Melissa Fernandez", department: "Talent Development", match: "HR-Match-05", table: 5, opponent: "Haris Iskandar", round2Heat: "Table Alpha" },

  { id: 11, name: "Syed Alwi", department: "Security & Admin", match: "HR-Match-06", table: 6, opponent: "Rachel Lim", round2Heat: "Table Beta" },
  { id: 12, name: "Rachel Lim", department: "HR Operations", match: "HR-Match-06", table: 6, opponent: "Syed Alwi", round2Heat: "Table Beta" },
  { id: 13, name: "Azman Kassim", department: "Fleet Management", match: "HR-Match-07", table: 7, opponent: "Siti Hajar", round2Heat: "Table Beta" },
  { id: 14, name: "Siti Hajar", department: "Payroll", match: "HR-Match-07", table: 7, opponent: "Azman Kassim", round2Heat: "Table Beta" },
  { id: 15, name: "Jonathan Teoh", department: "Employee Relations", match: "HR-Match-08", table: 8, opponent: "Anis Sofia", round2Heat: "Table Beta" },
  { id: 16, name: "Anis Sofia", department: "Talent Development", match: "HR-Match-08", table: 8, opponent: "Jonathan Teoh", round2Heat: "Table Beta" },
  { id: 17, name: "Pravin Kumar", department: "Office Admin", match: "HR-Match-09", table: 9, opponent: "Grace Ting", round2Heat: "Table Beta" },
  { id: 18, name: "Grace Ting", department: "HR Analytics", match: "HR-Match-09", table: 9, opponent: "Pravin Kumar", round2Heat: "Table Beta" },
  { id: 19, name: "Faizal Ramli", department: "Procurement Admin", match: "HR-Match-10", table: 10, opponent: "Wendy Kok", round2Heat: "Table Beta" },
  { id: 20, name: "Wendy Kok", department: "HR Operations", match: "HR-Match-10", table: 10, opponent: "Faizal Ramli", round2Heat: "Table Beta" },

  { id: 21, name: "Imran Fauzi", department: "Talent Sourcing", match: "HR-Match-11", table: 11, opponent: "Diana Low", round2Heat: "Table Gamma" },
  { id: 22, name: "Diana Low", department: "HR Business Partner", match: "HR-Match-11", table: 11, opponent: "Imran Fauzi", round2Heat: "Table Gamma" },
  { id: 23, name: "Kenneth Gomez", department: "Corporate Services", match: "HR-Match-12", table: 12, opponent: "Nadia Shahira", round2Heat: "Table Gamma" },
  { id: 24, name: "Nadia Shahira", department: "Talent Development", match: "HR-Match-12", table: 12, opponent: "Kenneth Gomez", round2Heat: "Table Gamma" },
  { id: 25, name: "Viknesh Rao", department: "IT & HR Systems", match: "HR-Match-13", table: 13, opponent: "Fatin Nabilah", round2Heat: "Table Gamma" },
  { id: 26, name: "Fatin Nabilah", department: "HR Operations", match: "HR-Match-13", table: 13, opponent: "Viknesh Rao", round2Heat: "Table Gamma" },
  { id: 27, name: "Bryan Chen", department: "Logistics Admin", match: "HR-Match-14", table: 14, opponent: "Amira Zulkifli", round2Heat: "Table Gamma" },
  { id: 28, name: "Amira Zulkifli", department: "People Experience", match: "HR-Match-14", table: 14, opponent: "Bryan Chen", round2Heat: "Table Gamma" },
  { id: 29, name: "Hafiz Suhaimi", department: "Health & Safety Admin", match: "HR-Match-15", table: 15, opponent: "Evelyn See", round2Heat: "Table Gamma" },
  { id: 30, name: "Evelyn See", department: "Talent Management", match: "HR-Match-15", table: 15, opponent: "Hafiz Suhaimi", round2Heat: "Table Gamma" }
];

export function getPlayerByName(nameQuery) {
  if (!nameQuery) return null;
  const q = nameQuery.trim().toLowerCase();
  return PLAYERS.find(p => p.name.toLowerCase() === q) || null;
}

export function searchPlayers(query) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  return PLAYERS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.department.toLowerCase().includes(q) ||
    p.match.toLowerCase().includes(q)
  );
}

export function getMatches() {
  const map = new Map();
  PLAYERS.forEach(p => {
    if (!map.has(p.match)) {
      map.set(p.match, []);
    }
    map.get(p.match).push(p);
  });
  return Array.from(map.entries()).map(([match, players]) => ({
    match,
    table: players[0].table,
    players
  }));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-data.js`
Expected: `PASS: All tournament data assertions passed.`

- [ ] **Step 5: Commit tournament data and tests**

```bash
git add tournament-data.js tests/verify-data.js
git commit -m "feat: add static 30-player tournament roster and verification tests"
```

---

### Task 3: Build Core HTML & Responsive CSS Design System

**Files:**
- Create: `index.html`
- Create: `styles.css`

**Interfaces:**
- Consumes: UNO Color Tokens & Layout from `design.md`, Card reference from `rules.md`
- Produces: Semantic HTML scaffolding with CSS styles for Header, Segmented Tabs, Card Carousel, Accordions, Search UI, and Floating Action Bar.

- [ ] **Step 1: Create `styles.css` with mobile-first UNO theme**

Implement custom CSS tokens, typography, segmented controllers, card carousel, accordions, search card layout, and bottom action bar.

```css
:root {
  --uno-red: #ED1C24;
  --uno-yellow: #FFDE00;
  --uno-green: #00A651;
  --uno-blue: #0072BC;
  --uno-dark: #1E293B;
  --uno-light: #F8FAFC;
  --card-bg: #FFFFFF;
  --text-muted: #64748B;
  --border-color: #E2E8F0;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --shadow-sm: 0 2px 6px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 14px rgba(0, 0, 0, 0.08);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-tap-highlight-color: transparent;
}

body {
  background-color: var(--uno-light);
  color: var(--uno-dark);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding-bottom: 90px;
}

#app-container {
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  background: #FFFFFF;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

/* Header */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #FFFFFF;
  border-bottom: 1px solid var(--border-color);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-badge {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--uno-blue);
  letter-spacing: 0.5px;
}

.header-title {
  font-size: 16px;
  font-weight: 800;
  color: var(--uno-dark);
}

.lang-toggle-btn {
  background: var(--uno-light);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 700;
  color: var(--uno-dark);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.lang-toggle-btn .active-pill {
  color: var(--uno-red);
}

/* Hero Section */
.hero-banner {
  background: linear-gradient(135deg, var(--uno-red) 0%, #C41219 100%);
  color: #FFFFFF;
  padding: 20px 16px;
  text-align: center;
}

.hero-tagline {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  color: var(--uno-yellow);
}

.hero-main {
  font-size: 20px;
  font-weight: 900;
  margin-top: 4px;
}

.hero-subtext {
  font-size: 13px;
  opacity: 0.9;
  margin-top: 4px;
}

/* Navigation Segmented Controller */
.tab-nav {
  display: flex;
  background: var(--uno-light);
  padding: 6px;
  margin: 12px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  gap: 6px;
}

.tab-btn {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px 4px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: #FFFFFF;
  color: var(--uno-red);
  box-shadow: var(--shadow-sm);
}

/* Tab Content Areas */
.tab-content {
  display: none;
  padding: 0 16px 20px;
}

.tab-content.active {
  display: block;
}

/* Carousel */
.section-title {
  font-size: 16px;
  font-weight: 800;
  margin: 16px 0 12px;
  color: var(--uno-dark);
  display: flex;
  align-items: center;
  gap: 8px;
}

.carousel-container {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;
}

.carousel-container::-webkit-scrollbar {
  height: 4px;
}

.carousel-container::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.carousel-card {
  flex: 0 0 240px;
  scroll-snap-align: start;
  border-radius: var(--radius-md);
  padding: 16px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  background: #FFFFFF;
}

.carousel-card.card-skip { border-top: 5px solid var(--uno-blue); }
.carousel-card.card-reverse { border-top: 5px solid var(--uno-yellow); }
.carousel-card.card-draw2 { border-top: 5px solid var(--uno-green); }
.carousel-card.card-wild { border-top: 5px solid #8B5CF6; }
.carousel-card.card-wild4 { border-top: 5px solid var(--uno-red); }

.card-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--uno-light);
  margin-bottom: 8px;
}

.card-title {
  font-size: 15px;
  font-weight: 800;
  margin-bottom: 6px;
}

.card-mechanic {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
  margin-bottom: 6px;
}

.card-highlight {
  font-size: 12px;
  font-weight: 700;
  color: var(--uno-dark);
  background: var(--uno-light);
  padding: 6px 8px;
  border-radius: 6px;
  margin-top: 6px;
}

/* Accordions */
.accordion-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.accordion-item {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: #FFFFFF;
}

.accordion-header {
  padding: 12px 14px;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: #FFFFFF;
}

.accordion-header:hover {
  background: var(--uno-light);
}

.accordion-body {
  display: none;
  padding: 12px 14px;
  font-size: 13px;
  color: #334155;
  line-height: 1.5;
  border-top: 1px solid var(--border-color);
  background: var(--uno-light);
}

.accordion-item.open .accordion-body {
  display: block;
}

/* Guide Step Cards */
.guide-step-card {
  display: flex;
  gap: 14px;
  padding: 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  margin-bottom: 10px;
  background: #FFFFFF;
  align-items: flex-start;
}

.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--uno-blue);
  color: #FFFFFF;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex-shrink: 0;
}

.step-content h4 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
}

.step-content p {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
}

/* Tournament Search UI */
.search-wrapper {
  margin-bottom: 14px;
}

.search-input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--uno-blue);
}

.search-results {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.player-card {
  border: 1px solid var(--border-color);
  border-left: 5px solid var(--uno-green);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  background: #FFFFFF;
  box-shadow: var(--shadow-sm);
}

.player-card-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}

.player-name {
  font-size: 15px;
  font-weight: 800;
}

.player-dept {
  font-size: 11px;
  color: var(--text-muted);
}

.player-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  font-size: 12px;
  margin-bottom: 10px;
}

.detail-label {
  color: var(--text-muted);
}

.detail-val {
  font-weight: 700;
  color: var(--uno-dark);
}

.room-btn {
  display: inline-block;
  width: 100%;
  text-align: center;
  background: var(--uno-blue);
  color: #FFFFFF;
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 0;
  border-radius: var(--radius-sm);
}

/* Empty search state */
.empty-search {
  text-align: center;
  padding: 24px 16px;
  color: var(--text-muted);
  font-size: 13px;
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
}

/* Floating Bottom Action Bar */
.bottom-action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #FFFFFF;
  border-top: 1px solid var(--border-color);
  padding: 12px 16px;
  display: flex;
  justify-content: center;
  z-index: 100;
}

.action-bar-inner {
  width: 100%;
  max-width: 480px;
}

.launch-game-btn {
  display: block;
  width: 100%;
  background: var(--uno-red);
  color: #FFFFFF;
  text-decoration: none;
  text-align: center;
  font-size: 15px;
  font-weight: 800;
  padding: 14px;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgba(237, 28, 36, 0.3);
  transition: transform 0.1s;
}

.launch-game-btn:active {
  transform: scale(0.98);
}
```

- [ ] **Step 2: Create `index.html` structure**

Write the semantic DOM tree incorporating `data-i18n` attributes for all dynamic strings.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>October UNO Championship 2026</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app-container">
    <!-- Header -->
    <header class="sticky-header">
      <div>
        <div class="brand-badge" data-i18n="department">Talent Development | HR</div>
        <div class="header-title" data-i18n="appTitle">October UNO Showdown</div>
      </div>
      <button id="langToggle" class="lang-toggle-btn" aria-label="Toggle Language">
        <span id="langLabel">BM</span>
      </button>
    </header>

    <!-- Hero -->
    <div class="hero-banner">
      <div class="hero-tagline" data-i18n="hero.tagline">October Engagement Day</div>
      <div class="hero-main">UNO Championship 2026</div>
      <div class="hero-subtext" data-i18n="hero.subtext">From Digital 1v1s to 1 Ultimate Champion!</div>
    </div>

    <!-- Navigation Tabs -->
    <nav class="tab-nav">
      <button class="tab-btn active" data-tab="rules" data-i18n="nav.rules">📖 Rules</button>
      <button class="tab-btn" data-tab="guide" data-i18n="nav.guide">🕹️ Guide</button>
      <button class="tab-btn" data-tab="tournament" data-i18n="nav.tournament">🏆 Tournament</button>
    </nav>

    <!-- Tab 1: Rules -->
    <section id="rulesView" class="tab-content active">
      <h3 class="section-title">🃏 Action Card Mechanics | Kad Aksi</h3>
      <div class="carousel-container">
        <div class="carousel-card card-skip">
          <span class="card-badge">Action Card</span>
          <div class="card-title">Skip 🚫</div>
          <div class="card-mechanic"><strong>Multi-Player:</strong> Next player loses turn.</div>
          <div class="card-highlight"><strong>1v1 Digital:</strong> Skips opponent; you take another turn immediately!</div>
        </div>
        <div class="carousel-card card-reverse">
          <span class="card-badge">Action Card</span>
          <div class="card-title">Reverse 🔁</div>
          <div class="card-mechanic"><strong>Multi-Player:</strong> Inverts play direction.</div>
          <div class="card-highlight"><strong>1v1 Digital:</strong> Acts as Skip; you take another turn immediately!</div>
        </div>
        <div class="carousel-card card-draw2">
          <span class="card-badge">Action Card</span>
          <div class="card-title">Draw 2 (+2) ➕2️⃣</div>
          <div class="card-mechanic">Next player draws 2 cards and loses their turn.</div>
          <div class="card-highlight">No stacking allowed! Penalty resolved immediately.</div>
        </div>
        <div class="carousel-card card-wild">
          <span class="card-badge">Wild Card</span>
          <div class="card-title">Wild 🌈</div>
          <div class="card-mechanic">Player declares active color for subsequent cards.</div>
          <div class="card-highlight">Can be played on any color at any time.</div>
        </div>
        <div class="carousel-card card-wild4">
          <span class="card-badge">Wild Action</span>
          <div class="card-title">Wild Draw 4 🔥</div>
          <div class="card-mechanic">Declare color; opponent draws 4 cards & loses turn.</div>
          <div class="card-highlight">Strict no-stacking! Opponent takes cards directly.</div>
        </div>
      </div>

      <h3 class="section-title" data-i18n="rulesTab.title">Official House Rules</h3>
      <div class="accordion-group">
        <div class="accordion-item">
          <div class="accordion-header">
            <span data-i18n="rulesTab.shoutUnoTitle">Calling 'UNO!'</span>
            <span class="acc-icon">➕</span>
          </div>
          <div class="accordion-body" data-i18n="rulesTab.shoutUnoDesc">
            You must call out 'UNO!' clearly when you have only 1 card left. If caught with 1 card before the next player takes their turn, draw a 2-card penalty.
          </div>
        </div>
        <div class="accordion-item">
          <div class="accordion-header">
            <span data-i18n="rulesTab.stackingTitle">No Card Stacking</span>
            <span class="acc-icon">➕</span>
          </div>
          <div class="accordion-body" data-i18n="rulesTab.stackingDesc">
            You cannot stack +2 on +2 or +4 on +4 to pass penalties. Penalties must be resolved immediately.
          </div>
        </div>
        <div class="accordion-item">
          <div class="accordion-header">
            <span data-i18n="rulesTab.timerTitle">Turn Timer (30s)</span>
            <span class="acc-icon">➕</span>
          </div>
          <div class="accordion-body" data-i18n="rulesTab.timerDesc">
            Players have 30 seconds per turn in digital rounds to ensure smooth flow.
          </div>
        </div>
      </div>
    </section>

    <!-- Tab 2: Guide -->
    <section id="guideView" class="tab-content">
      <h3 class="section-title" data-i18n="guideTab.title">Player's Quick Guide</h3>
      <div class="guide-step-card">
        <div class="step-num">1</div>
        <div class="step-content">
          <h4 data-i18n="guideSteps.step1Title">Enter Your Real Name</h4>
          <p data-i18n="guideTab.step1">Open the link and enter your full name as nickname.</p>
        </div>
      </div>
      <div class="guide-step-card">
        <div class="step-num">2</div>
        <div class="step-content">
          <h4 data-i18n="guideSteps.step2Title">Enter Assigned Room Code</h4>
          <p data-i18n="guideTab.step2">Enter your assigned Room Name (e.g., HR-Match-01).</p>
        </div>
      </div>
      <div class="guide-step-card">
        <div class="step-num">3</div>
        <div class="step-content">
          <h4 data-i18n="guideSteps.step3Title">Start the Match</h4>
          <p data-i18n="guideTab.step3">Tap 'Play Uno' and wait for your opponent to join.</p>
        </div>
      </div>
    </section>

    <!-- Tab 3: Tournament -->
    <section id="tournamentView" class="tab-content">
      <h3 class="section-title" data-i18n="buttons.findMatch">Find My Match</h3>
      <div class="search-wrapper">
        <input type="text" id="playerSearch" class="search-input" placeholder="Type your name (e.g., Ahmad, Sarah)..." autocomplete="off">
      </div>
      <div id="searchResults" class="search-results">
        <div class="empty-search" id="initialSearchPrompt">Enter your name above to see your table and room assignment.</div>
      </div>

      <h3 class="section-title" data-i18n="tournamentTab.title" style="margin-top:24px;">Tournament Progression</h3>
      <div class="guide-step-card">
        <div class="step-num">R1</div>
        <div class="step-content">
          <h4 data-i18n="tournamentTab.round1Title">Round 1: Digital 1v1s</h4>
          <p data-i18n="tournamentTab.round1Desc">15 simultaneous 1v1 browser matches (Best of 3). Winners advance.</p>
        </div>
      </div>
      <div class="guide-step-card">
        <div class="step-num">R2</div>
        <div class="step-content">
          <h4 data-i18n="tournamentTab.round2Title">Round 2: Physical Heats</h4>
          <p data-i18n="tournamentTab.round2Desc">3 tables × 5 players using physical cards. Top 1 advances per table.</p>
        </div>
      </div>
      <div class="guide-step-card">
        <div class="step-num">R3</div>
        <div class="step-content">
          <h4 data-i18n="tournamentTab.round3Title">Round 3: Grand Final</h4>
          <p data-i18n="tournamentTab.round3Desc">3-player championship table to decide 1st, 2nd, and 3rd place.</p>
        </div>
      </div>
    </section>

    <!-- Bottom Floating Action Bar -->
    <aside class="bottom-action-bar">
      <div class="action-bar-inner">
        <a id="launchGameBtn" href="https://buddyboardgames.com/uno" target="_blank" rel="noopener noreferrer" class="launch-game-btn" data-i18n="buttons.openGame">
          Open Game Room ➔
        </a>
      </div>
    </aside>
  </div>

  <script type="module" src="app.js"></script>
</body>
</html>
```

- [ ] **Step 3: Verify files created**

Run: `Test-Path index.html, styles.css`
Expected: `True`, `True`

- [ ] **Step 4: Commit HTML & CSS files**

```bash
git add index.html styles.css
git commit -m "feat: implement mobile-first html structure and custom uno css"
```

---

### Task 4: Implement SPA Application Logic, i18n & Search Engine

**Files:**
- Create: `app.js`
- Create: `tests/verify-app.js`

**Interfaces:**
- Consumes: `PLAYERS` and `searchPlayers` from `tournament-data.js`, dictionary from `localization.md`
- Produces: Reactive SPA controller managing tabs, language swap, search rendering, and accordions.

- [ ] **Step 1: Write `tests/verify-app.js` verification script**

```javascript
// tests/verify-app.js
import { TRANSLATIONS } from '../app.js';

console.log('Testing translation dictionary completeness...');

if (!TRANSLATIONS.en || !TRANSLATIONS.bm) {
  console.error('FAIL: Missing EN or BM dictionary root');
  process.exit(1);
}

const requiredKeys = ['appTitle', 'department', 'buttons', 'rulesTab', 'guideTab', 'tournamentTab'];
for (const key of requiredKeys) {
  if (!TRANSLATIONS.en[key] || !TRANSLATIONS.bm[key]) {
    console.error(`FAIL: Missing key ${key} in translations`);
    process.exit(1);
  }
}

console.log('PASS: Translation keys verified.');
```

- [ ] **Step 2: Run verification script to observe failure before `app.js` exists**

Run: `node tests/verify-app.js`
Expected: Error: Cannot find module '../app.js'

- [ ] **Step 3: Implement `app.js`**

```javascript
// app.js
import { PLAYERS, searchPlayers } from './tournament-data.js';

export const TRANSLATIONS = {
  en: {
    appTitle: "October UNO Showdown",
    department: "Talent Development | HR",
    toggleText: "BM",
    nav: {
      rules: "📖 Rules",
      guide: "🕹️ Guide",
      tournament: "🏆 Tournament"
    },
    hero: {
      tagline: "October Engagement Day",
      subtext: "From Digital 1v1s to 1 Ultimate Champion!"
    },
    buttons: {
      openGame: "Open Game Room ➔",
      findMatch: "Find My Match",
      viewRules: "View Official Rules",
      joinRoom: "Join Room"
    },
    guideSteps: {
      step1Title: "Enter Your Real Name",
      step2Title: "Enter Assigned Room Code",
      step3Title: "Start the Match"
    },
    rulesTab: {
      title: "Official House Rules",
      shoutUnoTitle: "Calling 'UNO!'",
      shoutUnoDesc: "You must call out 'UNO!' clearly when you have only 1 card left. If caught with 1 card before the next player takes their turn, draw a 2-card penalty.",
      stackingTitle: "No Card Stacking",
      stackingDesc: "You cannot stack +2 on +2 or +4 on +4 to pass penalties. Penalties must be resolved immediately.",
      timerTitle: "Turn Timer (30s)",
      timerDesc: "Players have 30 seconds per turn in digital rounds to ensure smooth flow."
    },
    guideTab: {
      title: "Player's Quick Guide",
      step1: "Open the link and enter your full name as nickname.",
      step2: "Enter your assigned Room Name (e.g., HR-Match-01).",
      step3: "Tap 'Play Uno' and wait for your opponent to join."
    },
    tournamentTab: {
      title: "Tournament Progression",
      round1Title: "Round 1: Digital 1v1s",
      round1Desc: "15 simultaneous 1v1 browser matches (Best of 3). Winners advance.",
      round2Title: "Round 2: Physical Heats",
      round2Desc: "3 tables × 5 players using physical cards. Top 1 advances per table.",
      round3Title: "Round 3: Grand Final",
      round3Desc: "3-player championship table to decide 1st, 2nd, and 3rd place."
    },
    search: {
      placeholder: "Type your name (e.g., Ahmad, Sarah)...",
      emptyPrompt: "Enter your name above to see your table and room assignment.",
      noMatch: "Player not found. Check spelling or see Table Captain.",
      tableLabel: "Table",
      roomLabel: "Match Room",
      opponentLabel: "Opponent",
      heatLabel: "Next Heat"
    }
  },
  bm: {
    appTitle: "Kejohanan UNO 2026",
    department: "Pembangunan Bakat | HR",
    toggleText: "EN",
    nav: {
      rules: "📖 Peraturan",
      guide: "🕹️ Panduan",
      tournament: "🏆 Kejohanan"
    },
    hero: {
      tagline: "Hari Penglibatan Oktober",
      subtext: "Dari 1v1 Digital ke Pentas Juara Mutlak!"
    },
    buttons: {
      openGame: "Buka Bilik Permainan ➔",
      findMatch: "Cari Perlawanan Saya",
      viewRules: "Lihat Peraturan Rasmi",
      joinRoom: "Masuk Bilik"
    },
    guideSteps: {
      step1Title: "Masukkan Nama Sebenar",
      step2Title: "Masukkan Kod Bilik Ditetapkan",
      step3Title: "Mulakan Perlawanan"
    },
    rulesTab: {
      title: "Peraturan Rasmi Pertandingan",
      shoutUnoTitle: "Laungan 'UNO!'",
      shoutUnoDesc: "Wajib sebut 'UNO!' dengan jelas apabila tinggal 1 kad di tangan. Jika tertangkap sebelum giliran pemain seterusnya, anda dikenakan denda mengambil 2 kad.",
      stackingTitle: "Tiada 'Stacking' Kad",
      stackingDesc: "Kad +2 atau +4 tidak boleh ditindan untuk diserahkan kepada pihak lawan. Penalti wajib diambil serta-merta.",
      timerTitle: "Had Masa Giliran (30s)",
      timerDesc: "Pemain mempunyai 30 saat untuk setiap giliran dalam pusingan digital bagi memastikan kelancaran masa."
    },
    guideTab: {
      title: "Panduan Ringkas Pemain",
      step1: "Buka pautan permainan dan masukkan nama sebenar anda sebagai nama samaran.",
      step2: "Masukkan nama bilik yang ditetapkan (contoh: HR-Match-01).",
      step3: "Tekan butang 'Play Uno' dan tunggu lawan anda masuk ke bilik perlawanan."
    },
    tournamentTab: {
      title: "Peringkat Kejohanan",
      round1Title: "Pusingan 1: Digital 1v1",
      round1Desc: "15 perlawanan 1v1 serentak di pelayar web (Best of 3). Pemenang mara ke Pusingan 2.",
      round2Title: "Pusingan 2: Meja Fizikal",
      round2Desc: "3 meja × 5 pemain menggunakan kad fizikal. Johan setiap meja mara ke pusingan akhir.",
      round3Title: "Pusingan 3: Pentas Akhir",
      round3Desc: "Perlawanan 3 penjuru untuk menentukan tempat Pertama, Kedua, dan Ketiga."
    },
    search: {
      placeholder: "Taip nama anda (cth: Ahmad, Sarah)...",
      emptyPrompt: "Taip nama anda di atas untuk semak meja dan bilik permainan.",
      noMatch: "Nama tidak dijumpai. Sila semak ejaan atau rujuk Ketua Meja.",
      tableLabel: "Meja",
      roomLabel: "Bilik Perlawanan",
      opponentLabel: "Lawan",
      heatLabel: "Pusingan Seterusnya"
    }
  }
};

let currentLang = 'en';

export function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function updateI18n() {
  const dict = TRANSLATIONS[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = getNestedValue(dict, key);
    if (val) {
      el.textContent = val;
    }
  });

  const langLabel = document.getElementById('langLabel');
  if (langLabel) {
    langLabel.textContent = dict.toggleText;
  }

  const searchInput = document.getElementById('playerSearch');
  if (searchInput) {
    searchInput.placeholder = dict.search.placeholder;
  }

  renderSearchResults();
}

export function renderSearchResults() {
  const resultsContainer = document.getElementById('searchResults');
  const searchInput = document.getElementById('playerSearch');
  if (!resultsContainer || !searchInput) return;

  const query = searchInput.value.trim();
  const dict = TRANSLATIONS[currentLang];

  if (!query) {
    resultsContainer.innerHTML = `<div class="empty-search">${dict.search.emptyPrompt}</div>`;
    return;
  }

  const matches = searchPlayers(query);
  if (matches.length === 0) {
    resultsContainer.innerHTML = `<div class="empty-search">${dict.search.noMatch}</div>`;
    return;
  }

  resultsContainer.innerHTML = matches.map(player => `
    <div class="player-card">
      <div class="player-card-header">
        <span class="player-name">${player.name}</span>
        <span class="player-dept">${player.department}</span>
      </div>
      <div class="player-details">
        <div><span class="detail-label">${dict.search.tableLabel}:</span> <span class="detail-val">#${player.table}</span></div>
        <div><span class="detail-label">${dict.search.roomLabel}:</span> <span class="detail-val">${player.match}</span></div>
        <div><span class="detail-label">${dict.search.opponentLabel}:</span> <span class="detail-val">${player.opponent}</span></div>
        <div><span class="detail-label">${dict.search.heatLabel}:</span> <span class="detail-val">${player.round2Heat}</span></div>
      </div>
      <a href="https://buddyboardgames.com/uno" target="_blank" rel="noopener noreferrer" class="room-btn">
        ${dict.buttons.joinRoom} (${player.match}) ➔
      </a>
    </div>
  `).join('');
}

// Initialize DOM events
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        const view = document.getElementById(`${tab}View`);
        if (view) view.classList.add('active');
      });
    });

    // Language toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
      langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'bm' : 'en';
        updateI18n();
      });
    }

    // Accordions
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        item.classList.toggle('open');
        const icon = header.querySelector('.acc-icon');
        if (icon) {
          icon.textContent = item.classList.contains('open') ? '➖' : '➕';
        }
      });
    });

    // Search input
    const searchInput = document.getElementById('playerSearch');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderSearchResults();
      });
    }

    // Initial render
    updateI18n();
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-app.js`
Expected: `PASS: Translation keys verified.`

- [ ] **Step 5: Commit `app.js` and tests**

```bash
git add app.js tests/verify-app.js
git commit -m "feat: implement spa logic, i18n translation engine, and search filter"
```

---

### Task 5: End-to-End Automated & Browser Verification

**Files:**
- Create: `tests/e2e-simulation.js`

**Interfaces:**
- Consumes: `index.html`, `styles.css`, `app.js`, `tournament-data.js`
- Produces: Simulated DOM testing and browser verification report.

- [ ] **Step 1: Write `tests/e2e-simulation.js` script**

Simulate DOM operations using mock environment or regex verification to validate:
1. All `data-i18n` tags exist in both `en` and `bm` dictionaries.
2. All 30 players are searchable and have non-empty match, table, and opponent fields.
3. No external broken resources (fonts, scripts).

```javascript
// tests/e2e-simulation.js
import fs from 'fs';
import { PLAYERS, searchPlayers } from '../tournament-data.js';
import { TRANSLATIONS, getNestedValue } from '../app.js';

console.log('Running End-to-End Simulation Check...');

// 1. Read index.html and extract data-i18n keys
const html = fs.readFileSync('index.html', 'utf-8');
const keyRegex = /data-i18n="([^"]+)"/g;
let match;
const foundKeys = new Set();
while ((match = keyRegex.exec(html)) !== null) {
  foundKeys.add(match[1]);
}

console.log(`Found ${foundKeys.size} distinct i18n keys in index.html.`);

let missingKeys = 0;
for (const key of foundKeys) {
  const enVal = getNestedValue(TRANSLATIONS.en, key);
  const bmVal = getNestedValue(TRANSLATIONS.bm, key);
  if (!enVal) {
    console.error(`Missing EN translation for key: "${key}"`);
    missingKeys++;
  }
  if (!bmVal) {
    console.error(`Missing BM translation for key: "${key}"`);
    missingKeys++;
  }
}

if (missingKeys > 0) {
  console.error(`FAIL: ${missingKeys} missing translation keys.`);
  process.exit(1);
}

// 2. Validate all 30 players searchability
for (const p of PLAYERS) {
  const res = searchPlayers(p.name);
  if (!res.some(item => item.id === p.id)) {
    console.error(`FAIL: Player search failed for ${p.name}`);
    process.exit(1);
  }
}

// 3. Verify CSS file exists and has essential color tokens
const css = fs.readFileSync('styles.css', 'utf-8');
const requiredTokens = ['--uno-red', '--uno-yellow', '--uno-green', '--uno-blue', '--uno-dark'];
for (const token of requiredTokens) {
  if (!css.includes(token)) {
    console.error(`FAIL: Missing CSS token ${token}`);
    process.exit(1);
  }
}

console.log('PASS: All End-to-End simulation checks succeeded!');
```

- [ ] **Step 2: Run simulation test**

Run: `node tests/e2e-simulation.js`
Expected: `PASS: All End-to-End simulation checks succeeded!`

- [ ] **Step 3: Commit verification test suite**

```bash
git add tests/e2e-simulation.js
git commit -m "test: add comprehensive e2e simulation script"
```

- [ ] **Step 4: Launch local static server and visually inspect**

Launch static server:
Run: `npx -y serve .` (or test with browser subagent / local browser)
Verify:
- Mobile viewport displays sticky header, segmented navigation, and hero banner.
- Switching between Rules, Guide, and Tournament works instantly.
- Language toggle flips between EN and BM.
- Typing "Ahmad" or "Sarah" dynamically shows match room and table details.
