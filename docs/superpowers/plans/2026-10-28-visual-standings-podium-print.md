# Visual Standings & Championship Podium Print Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable participants and organizers to print an executive-quality, branded physical sheet featuring the visual championship podium (1st–4th pedestals with player cards) and the full standings leaderboard table with exact color reproduction.

**Architecture:** 
- Add dedicated print buttons in both the Public Standings header and Tournament Desk Round 3 card.
- Inject executive letterhead (`.print-standings-header`) and official verification footer (`.print-standings-footer`) into `index.html`.
- Implement `@media print` CSS engine with `print-color-adjust: exact !important;` to retain rich gold, silver, bronze, and ocean-blue gradients and card elevations while stripping web-only controls (nav, hero, inputs, buttons).
- Support contextual print modes (`.print-mode-standings` vs `.print-mode-desk`) in `app.js` with automated lifecycle cleanup via `afterprint`.

**Tech Stack:** Vanilla JavaScript (ES Modules), HTML5 Semantic Markup, Vanilla CSS with CSS Grid/Flexbox and `@media print`, Node.js test suite.

## Global Constraints

- Event: Talent Development & Human Resource UNO Engagement Day 2026 (Wednesday, 28 October 2026 • 3:00 PM – 4:30 PM • Hive 5, Level 2, MRANTI).
- Full bilingual i18n support in both English (`en`) and Bahasa Melayu (`ms`).
- Exact color fidelity in print (`print-color-adjust: exact` and `-webkit-print-color-adjust: exact`).
- Avoid breaking changes or regressions to existing desk print functionality (`#deskPrintBtn`).
- All 11 existing test suites plus the new verification test suite must pass (`npm test`).

---

### Task 1: Create Automated Test Suite for Standings & Podium Print Engine

**Files:**
- Create: `tests/verify-standings-print.js`
- Modify: `package.json:8`

**Interfaces:**
- Consumes: `index.html`, `styles.css`, `app.js`
- Produces: Test runner exit code 0 on success, non-zero on failure

- [ ] **Step 1: Write the failing test suite in `tests/verify-standings-print.js`**

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const stylesCss = fs.readFileSync(path.join(rootDir, 'styles.css'), 'utf8');
const appJs = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');

console.log('Testing Standings & Championship Podium Print Engine...');

// 1. Verify DOM Elements in index.html
if (!indexHtml.includes('id="printStandingsBtn"')) {
  throw new Error('FAIL: index.html missing #printStandingsBtn in public grand final section');
}
if (!indexHtml.includes('id="deskPrintStandingsBtn"')) {
  throw new Error('FAIL: index.html missing #deskPrintStandingsBtn in tournament desk grand final card');
}
if (!indexHtml.includes('class="print-standings-header"')) {
  throw new Error('FAIL: index.html missing .print-standings-header element');
}
if (!indexHtml.includes('class="print-standings-footer"')) {
  throw new Error('FAIL: index.html missing .print-standings-footer element');
}

// 2. Verify Print CSS Rules in styles.css
if (!stylesCss.includes('print-color-adjust: exact')) {
  throw new Error('FAIL: styles.css missing print-color-adjust: exact');
}
if (!stylesCss.includes('-webkit-print-color-adjust: exact')) {
  throw new Error('FAIL: styles.css missing -webkit-print-color-adjust: exact');
}
if (!stylesCss.includes('.print-mode-standings')) {
  throw new Error('FAIL: styles.css missing .print-mode-standings rules in @media print');
}

// 3. Verify i18n Translation Keys in app.js
const requiredKeys = [
  'printStandingsBtn',
  'standingsTitle',
  'subtitle',
  'venueDate',
  'footerNote'
];

for (const key of requiredKeys) {
  if (!appJs.includes(key)) {
    throw new Error(`FAIL: app.js missing translation key or reference: ${key}`);
  }
}

// 4. Verify JS Handlers in app.js
if (!appJs.includes('print-mode-standings')) {
  throw new Error('FAIL: app.js missing print-mode-standings class manipulation');
}
if (!appJs.includes('printStandingsBtn')) {
  throw new Error('FAIL: app.js missing printStandingsBtn listener');
}

console.log('PASS: All Standings & Championship Podium Print Engine assertions passed successfully!');
```

- [ ] **Step 2: Add test to `package.json`**

Update `package.json` line 8 to append `&& node tests/verify-standings-print.js`.

- [ ] **Step 3: Run test to verify it fails**

Run: `node tests/verify-standings-print.js`
Expected: FAIL with `FAIL: index.html missing #printStandingsBtn in public grand final section`

- [ ] **Step 4: Commit**

```bash
git add tests/verify-standings-print.js package.json
git commit -m "test: add verification test suite for standings and podium print engine"
```

---

### Task 2: Update HTML Structure with Print Buttons & Executive Letterhead

**Files:**
- Modify: `index.html:862-890` (Public Grand Final Section)
- Modify: `index.html:1089-1095` (Tournament Desk Grand Final Card)

**Interfaces:**
- Produces: 
  - `#printStandingsBtn` in `#publicGrandFinalSection`
  - `#deskPrintStandingsBtn` in `#deskGrandFinalCard`
  - `.print-standings-header` letterhead
  - `.print-standings-footer` verification banner

- [ ] **Step 1: Add `#printStandingsBtn` to `#publicGrandFinalSection` in `index.html`**

In `index.html`, inside `.desk-heats-header-actions` at line 862:
```html
            <div class="desk-heats-header-actions">
              <span id="publicFinalistsCount" class="badge-pill-gold">Finalists: 0 / 3</span>
              <button id="printStandingsBtn" class="btn-secondary-action btn-sm-action" type="button" data-i18n="publicMatchups.printStandingsBtn">🖨️ Print Standings & Podium</button>
            </div>
```

- [ ] **Step 2: Add `.print-standings-header` and `.print-standings-footer` inside `#publicGrandFinalSection` in `index.html`**

Directly above `.grandfinal-podium-section` at line 875:
```html
          <!-- Executive Print Letterhead (Visible in @media print only) -->
          <div class="print-standings-header" aria-hidden="true">
            <div class="print-header-brand">
              <img src="event-logo.png" alt="Talent Development & HR Logo" class="print-header-logo" width="60" height="60">
              <div class="print-header-text">
                <span class="print-header-dept" data-i18n="print.department">Talent Development & Human Resource Division</span>
                <h2 class="print-header-title" data-i18n="print.subtitle">UNO Engagement Day 2026</h2>
                <span class="print-header-venue" data-i18n="print.venueDate">Wednesday, 28 October 2026 • Level 2, Hive 5, MRANTI</span>
              </div>
            </div>
            <div class="print-header-badge-strip">
              <h3 class="print-doc-title" data-i18n="print.standingsTitle">OFFICIAL CHAMPIONSHIP STANDINGS & PODIUM</h3>
            </div>
          </div>
```

Directly below `.grandfinal-standings-section` at line 889:
```html
          <!-- Executive Print Verification Footer (Visible in @media print only) -->
          <div class="print-standings-footer" aria-hidden="true">
            <span class="print-footer-rule"></span>
            <div class="print-footer-content">
              <span class="print-footer-stamp">🏆 Official Championship Record</span>
              <span class="print-footer-note" data-i18n="print.footerNote">Official tournament record generated via UNO Tournament Desk • Talent Development & HR Division</span>
            </div>
          </div>
```

- [ ] **Step 3: Add `#deskPrintStandingsBtn` to `#deskGrandFinalCard` in `index.html`**

In `index.html` at line 1089:
```html
            <div class="desk-card-actions">
              <button id="deskPrintStandingsBtn" class="btn-secondary-action btn-sm-action" type="button" data-i18n="tournamentDesk.grandFinal.printStandingsBtn">
                🖨️ Print Standings
              </button>
              <button id="deskResetFinaleBtn" class="btn-secondary-action btn-sm-action" type="button" data-i18n="tournamentDesk.grandFinal.resetBtn">
                🔄 Reset Finale Placements
              </button>
            </div>
```

- [ ] **Step 4: Run test to verify progress**

Run: `node tests/verify-standings-print.js`
Expected: Passes DOM checks, fails on CSS (`FAIL: styles.css missing print-color-adjust: exact`).

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add print buttons, executive letterhead, and footer markup"
```

---

### Task 3: Implement Visual Print Stylesheet Engine in `styles.css`

**Files:**
- Modify: `styles.css:4665-4712` (`@media print` section)
- Modify: `styles.css:6030-6200` (Podium print color rules)

**Interfaces:**
- Produces: CSS rules for `.print-mode-standings`, `.print-mode-desk`, `.print-standings-header`, `.print-standings-footer`, and `print-color-adjust: exact`.

- [ ] **Step 1: Add on-screen styles for `.print-standings-header` and `.print-standings-footer`**

In `styles.css` (around line 6030):
```css
/* Executive Print Letterhead & Footer (Screen default: hidden) */
.print-standings-header,
.print-standings-footer {
  display: none;
}
```

- [ ] **Step 2: Update `@media print` in `styles.css`**

Replace lines 4668-4712 in `styles.css` with:
```css
/* ==========================================================================
   Print Stylesheet (@media print)
   ========================================================================== */
@media print {
  @page {
    size: auto;
    margin: 10mm 14mm 12mm 14mm;
  }

  /* Universal print resets */
  *,
  *::before,
  *::after {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body {
    background: #FFFFFF !important;
    color: #0F172A !important;
    font-size: 10.5pt !important;
  }

  /* Hide interactive screen-only elements */
  header,
  .hero-banner,
  .tab-nav-wrapper,
  .corp-footer,
  .desk-header-actions,
  .desk-roster-quick-actions,
  .desk-add-toolbar,
  .desk-search-bar,
  .desk-randomize-cta-strip,
  .match-launch-btn,
  .match-winner-actions,
  .btn-roster-delete,
  .check-toggle-btn,
  .matchups-filter-toolbar,
  .matchups-header-actions,
  .desk-card-actions,
  .custom-dialog-overlay,
  .desk-heats-header-actions {
    display: none !important;
  }

  /* ------------------------------------------------------------------------
     MODE 1: Standings & Podium Print Mode (.print-mode-standings)
     ------------------------------------------------------------------------ */
  body.print-mode-standings #deskView,
  body.print-mode-standings #rulesView,
  body.print-mode-standings #guideView,
  body.print-mode-standings #scheduleView,
  body.print-mode-standings #publicMatchesGrid,
  body.print-mode-standings .desk-heats-panel:not(.desk-grandfinal-panel),
  body.print-mode-standings .grandfinal-showcase,
  body.print-mode-standings .section-header,
  body.print-mode-standings #publicByeNotice {
    display: none !important;
  }

  body.print-mode-standings #matchupsView {
    display: block !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  body.print-mode-standings #publicGrandFinalSection {
    display: block !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  body.print-mode-standings .desk-grandfinal-header {
    display: none !important;
  }

  /* Print Letterhead */
  body.print-mode-standings .print-standings-header {
    display: flex !important;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 2px solid #E2E8F0;
  }

  .print-header-brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-bottom: 8px;
  }

  .print-header-logo {
    width: 54px;
    height: 54px;
    object-fit: contain;
  }

  .print-header-dept {
    font-size: 11pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #475569;
    display: block;
  }

  .print-header-title {
    font-size: 17pt;
    font-weight: 900;
    color: #0F172A;
    margin: 2px 0;
    line-height: 1.2;
  }

  .print-header-venue {
    font-size: 9.5pt;
    color: #64748B;
    display: block;
  }

  .print-header-badge-strip {
    margin-top: 10px;
  }

  .print-doc-title {
    display: inline-block;
    background: #0F172A !important;
    color: #FFFFFF !important;
    font-size: 10.5pt;
    font-weight: 900;
    letter-spacing: 1.5px;
    padding: 4px 16px;
    border-radius: 999px;
    margin: 0;
  }

  /* Podium Styling for Print */
  body.print-mode-standings .grandfinal-podium-section {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 10px auto 20px auto !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  body.print-mode-standings .showcase-section-title {
    text-align: center;
    font-size: 12pt;
    font-weight: 800;
    color: #1E293B;
    margin-bottom: 14px;
  }

  body.print-mode-standings .olympic-podium-container {
    max-width: 100% !important;
    margin: 0 auto !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    gap: 12px !important;
  }

  body.print-mode-standings .podium-player-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
    border: 1px solid #CBD5E1 !important;
    background: #FFFFFF !important;
    min-height: 110px !important;
    padding: 10px 8px !important;
  }

  body.print-mode-standings .podium-player-card.champion-card {
    border: 2px solid #F59E0B !important;
    background: linear-gradient(180deg, #FFFBEB 0%, #FFFFFF 100%) !important;
    box-shadow: 0 4px 14px rgba(245, 158, 11, 0.25) !important;
  }

  body.print-mode-standings .podium-block {
    box-shadow: none !important;
  }

  body.print-mode-standings .podium-block.block-gold {
    height: 155px !important;
    background: linear-gradient(180deg, #F59E0B 0%, #D97706 100%) !important;
    border-top: 4px solid #FDE68A !important;
  }

  body.print-mode-standings .podium-block.block-silver {
    height: 120px !important;
    background: linear-gradient(180deg, #94A3B8 0%, #64748B 100%) !important;
    border-top: 4px solid #E2E8F0 !important;
  }

  body.print-mode-standings .podium-block.block-bronze {
    height: 95px !important;
    background: linear-gradient(180deg, #D97706 0%, #9A3412 100%) !important;
    border-top: 4px solid #FDBA74 !important;
  }

  body.print-mode-standings .podium-block.block-fourth {
    height: 75px !important;
    background: linear-gradient(180deg, #0284C7 0%, #0369A1 100%) !important;
    border-top: 4px solid #BAE6FD !important;
  }

  body.print-mode-standings .podium-crown-glow {
    animation: none !important;
  }

  /* Standings Table Styling for Print */
  body.print-mode-standings .grandfinal-standings-section {
    margin-top: 15px !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  body.print-mode-standings .standings-table-wrapper {
    box-shadow: none !important;
    border: 1px solid #CBD5E1 !important;
    border-radius: 8px !important;
    overflow: hidden !important;
  }

  body.print-mode-standings .standings-table {
    width: 100% !important;
    border-collapse: collapse !important;
  }

  body.print-mode-standings .standings-table th {
    background: #F1F5F9 !important;
    color: #334155 !important;
    font-size: 9pt !important;
    padding: 8px 10px !important;
    border-bottom: 2px solid #CBD5E1 !important;
  }

  body.print-mode-standings .standings-table td {
    padding: 7px 10px !important;
    border-bottom: 1px solid #E2E8F0 !important;
    font-size: 9.5pt !important;
  }

  /* Print Verification Footer */
  body.print-mode-standings .print-standings-footer {
    display: flex !important;
    flex-direction: column;
    margin-top: 20px;
    padding-top: 10px;
    border-top: 1px solid #CBD5E1;
    font-size: 8pt;
    color: #64748B;
  }

  .print-footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .print-footer-stamp {
    font-weight: 700;
    color: #334155;
  }

  /* ------------------------------------------------------------------------
     MODE 2: Desk Matchups Print Mode (.print-mode-desk or default)
     ------------------------------------------------------------------------ */
  body:not(.print-mode-standings) #deskView {
    display: block !important;
  }

  body:not(.print-mode-standings) .desk-panel-card {
    border: 1px solid #000000 !important;
    box-shadow: none !important;
    page-break-inside: avoid;
    margin-bottom: 20px !important;
  }

  body:not(.print-mode-standings) .round1-match-card {
    border: 1px solid #666666 !important;
    box-shadow: none !important;
    page-break-inside: avoid;
  }

  body:not(.print-mode-standings) .desk-matches-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
```

- [ ] **Step 3: Run test to verify progress**

Run: `node tests/verify-standings-print.js`
Expected: Passes CSS checks, fails on translation keys/JS in `app.js`.

- [ ] **Step 4: Commit**

```bash
git add styles.css
git commit -m "feat: implement high-fidelity visual print stylesheet for standings and podium"
```

---

### Task 4: Add Bilingual Translations and Print Handlers in `app.js`

**Files:**
- Modify: `app.js:200-380` (English translations)
- Modify: `app.js:600-750` (Bahasa Melayu translations)
- Modify: `app.js:3065-3090` (Print event listeners & keyboard shortcut)

**Interfaces:**
- Consumes: `#printStandingsBtn`, `#deskPrintStandingsBtn`, `#deskPrintBtn`
- Produces: `handlePrintStandings()` and `handlePrintDesk()` functions with clean lifecycle cleanup

- [ ] **Step 1: Add translation keys to English dictionary in `app.js`**

In `app.js`, inside `en.publicMatchups`:
```javascript
      printStandingsBtn: "🖨️ Print Standings & Podium",
```
Inside `en.tournamentDesk.grandFinal`:
```javascript
        printStandingsBtn: "🖨️ Print Standings",
```
Inside `en.print`:
```javascript
    print: {
      department: "Talent Development & Human Resource Division",
      subtitle: "UNO Engagement Day 2026",
      venueDate: "Wednesday, 28 October 2026 • Level 2, Hive 5, MRANTI",
      standingsTitle: "OFFICIAL CHAMPIONSHIP STANDINGS & PODIUM",
      footerNote: "Official tournament record generated via UNO Tournament Desk • Talent Development & HR Division"
    },
```

- [ ] **Step 2: Add translation keys to Bahasa Melayu dictionary in `app.js`**

In `app.js`, inside `ms.publicMatchups`:
```javascript
      printStandingsBtn: "🖨️ Cetak Kedudukan & Podium",
```
Inside `ms.tournamentDesk.grandFinal`:
```javascript
        printStandingsBtn: "🖨️ Cetak Kedudukan",
```
Inside `ms.print`:
```javascript
    print: {
      department: "Bahagian Pembangunan Bakat & Sumber Manusia",
      subtitle: "Hari Penglibatan UNO 2026",
      venueDate: "Rabu, 28 Oktober 2026 • Aras 2, Hive 5, MRANTI",
      standingsTitle: "KEDUDUKAN RASMI KEJUARAAN & PODIUM",
      footerNote: "Rekod kejohanan rasmi dijana melalui Meja Kejohanan UNO • Bahagian Pembangunan Bakat & Sumber Manusia"
    },
```

- [ ] **Step 3: Implement print handlers and event listeners in `app.js`**

In `app.js` around line 3070:
```javascript
  // Contextual Print Handlers
  function cleanupPrintModes() {
    document.body.classList.remove('print-mode-standings', 'print-mode-desk');
  }

  window.addEventListener('afterprint', cleanupPrintModes);

  function triggerPrintStandings() {
    document.body.classList.remove('print-mode-desk');
    document.body.classList.add('print-mode-standings');
    setTimeout(() => {
      window.print();
      setTimeout(cleanupPrintModes, 1000);
    }, 50);
  }

  function triggerPrintDesk() {
    document.body.classList.remove('print-mode-standings');
    document.body.classList.add('print-mode-desk');
    setTimeout(() => {
      window.print();
      setTimeout(cleanupPrintModes, 1000);
    }, 50);
  }

  // Standings Print Buttons
  const printStandingsBtn = document.getElementById('printStandingsBtn');
  if (printStandingsBtn) {
    printStandingsBtn.addEventListener('click', triggerPrintStandings);
  }

  const deskPrintStandingsBtn = document.getElementById('deskPrintStandingsBtn');
  if (deskPrintStandingsBtn) {
    deskPrintStandingsBtn.addEventListener('click', triggerPrintStandings);
  }

  // Desk Matchups Print Button
  const printBtn = document.getElementById('deskPrintBtn');
  if (printBtn) {
    printBtn.addEventListener('click', triggerPrintDesk);
  }

  // Keyboard shortcut (Ctrl+P / Cmd+P) contextual trigger
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
      const matchupsView = document.getElementById('matchupsView');
      if (matchupsView && matchupsView.classList.contains('active')) {
        document.body.classList.remove('print-mode-desk');
        document.body.classList.add('print-mode-standings');
      } else {
        document.body.classList.remove('print-mode-standings');
        document.body.classList.add('print-mode-desk');
      }
    }
  });
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-standings-print.js`
Expected: PASS: All Standings & Championship Podium Print Engine assertions passed successfully!

- [ ] **Step 5: Run full test suite**

Run: `npm test`
Expected: 12/12 test suites passing with 0 errors.

- [ ] **Step 6: Commit**

```bash
git add app.js
git commit -m "feat: wire up bilingual translations and contextual print handlers"
```

---

### Task 5: End-to-End Simulation & Verification

**Files:**
- Modify: `tests/e2e-simulation.js` (Include print buttons and i18n keys)

- [ ] **Step 1: Run end-to-end simulation**

Run: `node tests/e2e-simulation.js`
Expected: All simulation checks pass with 0 missing i18n keys.

- [ ] **Step 2: Commit any final test updates**

```bash
git add tests/e2e-simulation.js
git commit -m "test: verify end-to-end simulation with print engine keys"
```
