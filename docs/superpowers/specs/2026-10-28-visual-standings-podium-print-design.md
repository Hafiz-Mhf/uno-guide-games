# Visual Standings & Championship Podium Print Engine Design

> **Project:** Talent Development & Human Resource UNO Engagement Day 2026  
> **Event Date:** Wednesday, 28 October 2026 • 3:00 PM – 4:30 PM  
> **Venue:** Common Area, Level 2, Hive 5, MRANTI Building  
> **Topic:** Visual Standings & Championship Podium Print Engine  
> **Status:** Approved Spec  

---

## 1. Executive Summary

This feature enables users and tournament directors to print an executive-quality, branded physical sheet featuring:
1. **The Official Championship Visual Podium:** The 3-place or 4-place stepped pedestals (1st Grand Champion [Gold], 2nd Runner-Up [Silver], 3rd 2nd Runner-Up [Bronze], and optional 4th Place Finalist [Blue]) with floating player profile cards, crown glow, medal icons, player names, departments, and accolade titles exactly matching the visual display on screen.
2. **The Complete Official Standings Leaderboard Table:** Ranked list of finalists with medal badges, player names, department information, and official accolades.
3. **Official Executive Letterhead & Footer:** Corporate event branding with `event-logo.png`, event title, date, venue, and timestamp verification.

---

## 2. User Experience & Trigger Points

### 2.1 Public Matchups & Standings (`#matchupsView`)
- Located in the `#publicGrandFinalSection` header actions alongside the finalists counter.
- Button: `🖨️ Print Standings & Podium` (`#printStandingsBtn`)
- Available to all participants, spectators, and organizers viewing the public board.

### 2.2 Organizer Tournament Desk (`#deskView`)
- Located in the `#deskGrandFinalCard` header actions next to `🔄 Reset Finale Placements`.
- Button: `🖨️ Print Standings` (`#deskPrintStandingsBtn`)
- Enables tournament organizers to immediately print official results directly from the administrative desk upon crowning champions.

### 2.3 Keyboard & Browser Native Triggers
- When the user presses `Ctrl+P` / `Cmd+P` while on the Live Matchups tab, the print engine automatically activates the standings print format.
- When on the Tournament Desk tab, it prints desk pairings or standings based on user context.

---

## 3. Structural & HTML Changes

1. **Letterhead Container (`.print-standings-header`):**
   - Placed directly above the podium within `#publicGrandFinalSection`.
   - Hidden on screen via `display: none;`, visible only during `@media print` when `body.print-mode-standings` is active.
   - Includes:
     - Event logo: `<img src="event-logo.png" class="print-brand-logo" alt="Event Logo" />`
     - Organization: *"Talent Development & Human Resource Division"*
     - Event Title: *"UNO Engagement Day 2026"*
     - Document Title: *"OFFICIAL CHAMPIONSHIP STANDINGS & PODIUM"*
     - Metadata Strip: *"Wednesday, 28 October 2026 • Level 2, Hive 5, MRANTI Building"*

2. **Official Timestamp Footer (`.print-standings-footer`):**
   - Placed directly below the standings leaderboard table.
   - Hidden on screen via `display: none;`, visible only during print.
   - Contains official verification notice: *"Official tournament record generated via UNO Tournament Desk • Talent Development & HR Division"*.

---

## 4. CSS Print Engine (`@media print`)

1. **Exact Color Preservation:**
   - Enforce `-webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;` across `body`, `.olympic-podium-container`, `.podium-block`, `.podium-player-card`, and `.standings-table-wrapper`.
   - Ensures the gold, silver, bronze, and ocean-blue gradients, borders, and shadows are rendered faithfully in print previews and physical printing.

2. **Clean Element Filtering:**
   - When printing in standings mode (`body.print-mode-standings`):
     - Hide all screen-only chrome: `header`, `.hero-banner`, `.tab-nav-wrapper`, `.corp-footer`, `#deskView`, `#publicMatchesGrid`, `#publicRound2Grid`, `.matchups-filter-toolbar`, `#publicGrandFinalGrid`, buttons, and search bars.
     - Display `#matchupsView` and `#publicGrandFinalSection` cleanly.
     - Show `.print-standings-header`, `#publicPodiumBoard`, `#publicStandingsTable`, and `.print-standings-footer`.

3. **Page Geometry & Break Avoidance:**
   - Define `@page { size: auto; margin: 12mm 15mm; }`.
   - `.olympic-podium-container` has `page-break-inside: avoid; break-inside: avoid;`.
   - `.standings-row` has `page-break-inside: avoid;`.
   - Ensure the podium layout fits neatly on standard A4 (both landscape and portrait).

4. **Regression Protection for Desk Print:**
   - The existing desk print button (`#deskPrintBtn`) sets `body.print-mode-desk` and continues to print desk matchup pairings without alteration.

---

## 5. JavaScript Architecture & State Management

1. **Print Mode Trigger Functions:**
   - `handlePrintStandings()`:
     - Adds `print-mode-standings` class to `document.body`.
     - Calls `window.print()`.
     - Uses `window.addEventListener('afterprint', ...)` and a safety `setTimeout(..., 1000)` to remove the class.
   - `handlePrintDesk()`:
     - Adds `print-mode-desk` class to `document.body`.
     - Calls `window.print()`.
     - Cleans up on `afterprint`.

2. **Keyboard Shortcut Interception (`Ctrl+P` / `Cmd+P`):**
   - Detects the active tab. If `#matchupsView` is active, seamlessly applies `print-mode-standings` prior to the native print sequence.

---

## 6. Internationalization (Bilingual EN / BM)

Support English and Bahasa Melayu strings across all new elements:
- `publicMatchups.printStandingsBtn`: `"🖨️ Print Standings & Podium"` / `"🖨️ Cetak Kedudukan & Podium"`
- `tournamentDesk.grandFinal.printStandingsBtn`: `"🖨️ Print Standings"` / `"🖨️ Cetak Kedudukan"`
- `print.standingsTitle`: `"OFFICIAL CHAMPIONSHIP STANDINGS & PODIUM"` / `"KEDUDUKAN RASMI KEJUARAAN & PODIUM"`
- `print.subtitle`: `"Talent Development & Human Resource UNO Engagement Day 2026"` / `"Hari Penglibatan UNO Pembangunan Bakat & Sumber Manusia 2026"`
- `print.venueDate`: `"Wednesday, 28 October 2026 • Level 2, Hive 5, MRANTI"` / `"Rabu, 28 Oktober 2026 • Aras 2, Hive 5, MRANTI"`
- `print.footerNote`: `"Official tournament record generated via UNO Tournament Desk"` / `"Rekod kejohanan rasmi dijana melalui Meja Kejohanan UNO"`

---

## 7. Verification & Testing Criteria

1. **Automated Test Suites:**
   - Run existing test suites (`npm test`) to ensure zero regressions in tournament logic, state persistence, or data schemas.
2. **Visual & Print Fidelity:**
   - Test 3-pedestal podium print (Tables Alpha, Beta, Gamma winners).
   - Test 4-pedestal podium print (Tables Alpha, Beta, Gamma, Delta winners).
   - Verify podium background colors (gold, silver, bronze, blue) appear in print preview with `print-color-adjust: exact`.
   - Verify all screen navigation, action buttons, and irrelevant sections are hidden in print.
   - Verify Desk View print button still prints desk view properly.
