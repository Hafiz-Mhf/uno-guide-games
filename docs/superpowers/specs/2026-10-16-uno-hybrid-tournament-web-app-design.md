# Design Spec: Hybrid UNO Championship Web App & Documentation

**Date:** 2026-10-16  
**Event:** October Engagement Day: Hybrid UNO Championship  
**Author:** Pair Programming Agent & User  
**Target Date:** Wednesday, 28 October 2026  

---

## 1. Executive Summary & Goals

The goal is to deliver a complete documentation suite and a zero-backend, client-side, mobile-first Single Page Application (SPA) for the 30-player **October Engagement Day: Hybrid UNO Championship** organized by Talent Development | HR.

Participants access the web app by scanning a venue QR code on their mobile devices (iOS / Android browsers) at the Chatter Box venue. The app provides instant dual-language (English / Bahasa Melayu) access to tournament rules, step-by-step game room instructions, and an interactive player matchup search tool.

### Success Criteria
1. Zero server or database dependencies; runs completely static on any static host or local browser.
2. Fast load times (<1s) optimized for mobile viewports (375px – 430px).
3. Complete parity between English and Bahasa Melayu translations.
4. Working instant search for 30 participants to find their table, opponent, and BuddyBoardGames room link.
5. Fully written markdown reference documentation (`architecture.md`, `guide.md`, `tournament.md`) aligning with the implementation.

---

## 2. System Architecture

```text
uno-guide-rules/
├── index.html                   # Core semantic SPA structure
├── styles.css                   # Custom responsive UNO styles & tokens
├── app.js                       # SPA router, i18n renderer, search filter
├── tournament-data.js           # Static 30-player roster & matchup mappings
├── architecture.md              # Technical architecture documentation
├── guide.md                     # Player onboarding & BuddyBoardGames guide
├── tournament.md                # 3-Round bracket & tournament rules
├── rules.md                     # Official game rules & card action matrix
├── planning.md                  # Event operations & schedule
├── design.md                    # Visual tokens & UX wireframe definitions
└── localization.md              # i18n master dictionary (EN / BM)
```

### Architecture Principles
- **Zero-Build Vanilla Stack:** Standard HTML5, CSS3, and ES6 JavaScript. No bundlers or Node runtime requirements at build/deploy time.
- **Client-Side i18n:** Element labels marked with `data-i18n` attributes. A single global language state switches text content reactively.
- **Zero-Backend State:** Static roster embedded in `tournament-data.js`. State mutations during viewing (active tab, search input, language) reside purely in browser memory and `localStorage`.

---

## 3. UI/UX Specifications

### Color Palette (UNO Brand Tokens)
- Primary Action / Red: `#ED1C24`
- Highlight / Yellow: `#FFDE00`
- Success / Green: `#00A651`
- Info / Blue: `#0072BC`
- Neutral Dark (Text & Card Headers): `#1E293B`
- Neutral Light (Background): `#F8FAFC`
- Card Surface: `#FFFFFF` with subtle drop shadow

### Layout Structure (375px – 430px Mobile Optimized)
1. **Top Sticky Bar:**
   - Brand indicator: `Talent Development | HR`
   - Title: `October UNO Showdown` / `Kejohanan UNO 2026`
   - Language Switcher: Segmented pill toggle `[BM | EN]`
2. **Segmented Tab Bar:**
   - Tab 1: 📖 Rules (*Peraturan*)
   - Tab 2: 🕹️ Guide (*Panduan*)
   - Tab 3: 🏆 Tournament (*Kejohanan*)
3. **Tab Content Panels:**
   - **Rules View:**
     - Horizontal snap-scrolling card carousel (Skip, Reverse, Draw 2, Wild, Wild Draw 4) displaying differences between 1v1 digital and multi-player physical rounds.
     - Accordion items for 5 official house rules (The "UNO!" Call, Strict No-Stacking, 30s Turn Clock, Action Card Finish, Table Captain Authority).
   - **Guide View:**
     - 3-step visual cards for joining BuddyBoardGames: Enter Full Name, Enter Room Code (`HR-Match-01` to `15`), click 'Play Uno'.
     - Platform requirements, browser recommendations, and venue Wi-Fi tips.
   - **Tournament View:**
     - Real-time instant player search input.
     - Dynamic player card rendering: Name, Round 1 Match ID, Opponent, Table Assignment, and direct link to match room.
     - Tournament bracket stage progression visualizer (Round 1 Digital 1v1 ➔ Round 2 Physical Heats ➔ Round 3 Grand Final).
4. **Bottom Floating Action Bar:**
   - Sticky button: `Launch Game Room` / `Buka Bilik Permainan` directly linking to `https://buddyboardgames.com/uno`.

---

## 4. Data Specification & Static Roster

`tournament-data.js` defines an array of 30 staff entries across 15 matches:
```javascript
export const PLAYERS = [
  { id: 1, name: "Ahmad Razali", match: "HR-Match-01", table: 1, opponent: "Sarah Tan", round2Heat: "Table Alpha" },
  { id: 2, name: "Sarah Tan", match: "HR-Match-01", table: 1, opponent: "Ahmad Razali", round2Heat: "Table Alpha" },
  // ... Up to 30 players / 15 matches
];
```

Each player object contains:
- `id`: Unique integer
- `name`: Staff full name (searchable)
- `match`: BuddyBoardGames room identifier (`HR-Match-01` to `HR-Match-15`)
- `table`: Round 1 table number
- `opponent`: Assigned 1v1 opponent
- `round2Heat`: Tentative physical table assignment upon advancing

---

## 5. Documentation Updates

1. **`architecture.md`**: Complete the system overview, mobile-first design rationale, zero-backend model, performance benchmarks, and deployment steps.
2. **`guide.md`**: Detail step-by-step participant instructions, mobile browser compatibility, room setup instructions for table captains, and Wi-Fi troubleshooting.
3. **`tournament.md`**: Formulate the 30-player tournament progression mechanics, elimination rules, tiebreaker criteria, and physical heat configurations.

---

## 6. Error Handling & Edge Cases

- **Search Not Found:** If a query yields zero matches, show clear advice in active language ("Player not found. Check spelling or consult your Table Captain").
- **Offline Resilience:** App bundle is fully self-contained. Once fetched, navigating tabs, toggling language, and searching requires no internet connection.
- **Orientation & Viewport:** Fluid flex/grid styling ensures clean presentation on small mobile devices (iPhone SE 375px) up to tablet and desktop monitors.

---

## 7. Verification & Testing Plan

1. **Document Validation:** Ensure all markdown files (`architecture.md`, `guide.md`, `tournament.md`) are complete and consistent with `rules.md` and `planning.md`.
2. **Visual & Layout Testing:** Verify responsive rendering at 375px, 390px, 412px, and 1024px.
3. **Functionality Testing:**
   - Verify tab switching smoothly transitions between Rules, Guide, and Tournament views.
   - Verify EN/BM switcher updates all interface text without blank keys or glitches.
   - Verify search filters dynamically by name substring (case-insensitive) and resets when cleared.
   - Verify external links (`buddyboardgames.com`) open in a new tab with security attributes.
