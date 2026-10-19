# Interactive UNO Cards & Rules Playground Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build realistic digital UNO card components and an interactive "Can I Play This?" mini-table playground with real-time validation, animations, and scenario shuffling.

**Architecture:** Pure CSS & SVG card components replicating physical UNO cards (white border, angled center oval, corner pips, satin sheen). A client-side rule evaluation engine tests card plays against an active discard pile, triggering smooth discard animations or red wobble feedback.

**Tech Stack:** HTML5, CSS3 (3D transforms, keyframes), ES6 JavaScript, Node.js test runners.

## Global Constraints
- Zero external dependencies or build tools.
- Responsive across mobile (375px–430px) and desktop (768px–1200px).
- Full parity between English (EN) and Bahasa Melayu (BM).
- Official brand palette: Red (`#ED1C24`), Yellow (`#FFDE00`), Green (`#00A651`), Blue (`#0072BC`), Wild (`#18181B`).

---

### Task 1: Card Engine & Rules Validator Module with Unit Tests

**Files:**
- Create: `card-engine.js`
- Create: `tests/verify-card-engine.js`

**Interfaces:**
- Produces: `isPlayable(card, targetCard)`, `getPlayReason(card, targetCard, lang)`, `SCENARIOS`, `createCard(color, value, type)`

- [ ] **Step 1: Write failing unit test `tests/verify-card-engine.js`**

```javascript
// tests/verify-card-engine.js
import { isPlayable, getPlayReason, SCENARIOS } from '../card-engine.js';

console.log('Testing UNO Card Engine...');

const red7 = { color: 'red', value: '7', type: 'number' };
const blue7 = { color: 'blue', value: '7', type: 'number' };
const red3 = { color: 'red', value: '3', type: 'number' };
const green4 = { color: 'green', value: '4', type: 'number' };
const wild = { color: 'wild', value: 'wild', type: 'wild' };

// Same number
if (!isPlayable(blue7, red7)) {
  console.error('FAIL: blue7 should be playable on red7');
  process.exit(1);
}

// Same color
if (!isPlayable(red3, red7)) {
  console.error('FAIL: red3 should be playable on red7');
  process.exit(1);
}

// Wild card
if (!isPlayable(wild, red7)) {
  console.error('FAIL: wild should be playable on red7');
  process.exit(1);
}

// Mismatched color and number
if (isPlayable(green4, red7)) {
  console.error('FAIL: green4 should NOT be playable on red7');
  process.exit(1);
}

// Reason check
const reason = getPlayReason(blue7, red7, 'en');
if (!reason.success || !reason.message.includes('7')) {
  console.error('FAIL: Invalid reason output for blue7 on red7');
  process.exit(1);
}

// Scenarios check
if (!Array.isArray(SCENARIOS) || SCENARIOS.length < 3) {
  console.error('FAIL: Expected at least 3 preset scenarios');
  process.exit(1);
}

console.log('PASS: All card-engine tests passed!');
```

- [ ] **Step 2: Run test to observe failure**

Run: `node tests/verify-card-engine.js`  
Expected: Error: Cannot find module '../card-engine.js'

- [ ] **Step 3: Implement `card-engine.js`**

```javascript
// card-engine.js
export function isPlayable(card, target) {
  if (!card || !target) return false;
  if (card.color === 'wild' || target.color === 'wild') return true;
  if (card.color === target.color) return true;
  if (card.value === target.value) return true;
  return false;
}

export function getPlayReason(card, target, lang = 'en') {
  const isEn = lang === 'en';

  if (card.color === 'wild') {
    return {
      success: true,
      message: isEn
        ? "Legal Move! Wild cards can be placed on any color at any time."
        : "Pergerakan Sah! Kad Wild bebas diletakkan pada bila-bila masa atas mana-mana warna."
    };
  }

  if (card.color === target.color) {
    return {
      success: true,
      message: isEn
        ? `Legal Move! Matches color (${card.color.toUpperCase()}).`
        : `Pergerakan Sah! Warna sepadan (${card.color.toUpperCase()}).`
    };
  }

  if (card.value === target.value) {
    return {
      success: true,
      message: isEn
        ? `Legal Move! Matches number/symbol (${card.value.toUpperCase()}).`
        : `Pergerakan Sah! Nombor/simbol sepadan (${card.value.toUpperCase()}).`
    };
  }

  return {
    success: false,
    message: isEn
      ? `Cannot Play! ${card.color.toUpperCase()} ${card.value.toUpperCase()} does not match ${target.color.toUpperCase()} or ${target.value.toUpperCase()}. Try another card or draw!`
      : `Tidak Boleh Main! ${card.color.toUpperCase()} ${card.value.toUpperCase()} tidak sepadan dengan ${target.color.toUpperCase()} atau ${target.value.toUpperCase()}. Pilih kad lain atau cabut kad!`
  };
}

export const SCENARIOS = [
  {
    id: 1,
    titleEn: "Scenario 1: Color & Number Fundamentals",
    titleBm: "Senario 1: Asas Warna & Nombor",
    target: { color: 'red', value: '7', type: 'number' },
    hand: [
      { id: 'c1', color: 'red', value: '3', type: 'number' },
      { id: 'c2', color: 'blue', value: '7', type: 'number' },
      { id: 'c3', color: 'green', value: '4', type: 'number' },
      { id: 'c4', color: 'yellow', value: 'skip', type: 'action' },
      { id: 'c5', color: 'wild', value: 'wild', type: 'wild' }
    ]
  },
  {
    id: 2,
    titleEn: "Scenario 2: Action Cards & 1v1 Clashes",
    titleBm: "Senario 2: Kad Aksi & Pertembungan 1v1",
    target: { color: 'blue', value: 'reverse', type: 'action' },
    hand: [
      { id: 'c6', color: 'blue', value: 'skip', type: 'action' },
      { id: 'c7', color: 'yellow', value: 'reverse', type: 'action' },
      { id: 'c8', color: 'red', value: '5', type: 'number' },
      { id: 'c9', color: 'blue', value: '+2', type: 'action' },
      { id: 'c10', color: 'green', value: '9', type: 'number' }
    ]
  },
  {
    id: 3,
    titleEn: "Scenario 3: Wild Cards & Recovery",
    titleBm: "Senario 3: Kad Wild & Peluang Menang",
    target: { color: 'green', value: '2', type: 'number' },
    hand: [
      { id: 'c11', color: 'red', value: '9', type: 'number' },
      { id: 'c12', color: 'yellow', value: '5', type: 'number' },
      { id: 'c13', color: 'wild', value: '+4', type: 'wild' },
      { id: 'c14', color: 'blue', value: '8', type: 'number' },
      { id: 'c15', color: 'green', value: '+2', type: 'action' }
    ]
  }
];

export const DRAW_POOL = [
  { color: 'red', value: '1', type: 'number' },
  { color: 'blue', value: '2', type: 'number' },
  { color: 'green', value: '7', type: 'number' },
  { color: 'yellow', value: '7', type: 'number' },
  { color: 'red', value: 'reverse', type: 'action' },
  { color: 'blue', value: 'skip', type: 'action' },
  { color: 'green', value: '+2', type: 'action' },
  { color: 'wild', value: 'wild', type: 'wild' }
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-card-engine.js`  
Expected: `PASS: All card-engine tests passed!`

- [ ] **Step 5: Commit card engine**

```bash
git add card-engine.js tests/verify-card-engine.js
git commit -m "feat: implement uno card rule evaluation engine and tests"
```

---

### Task 2: Build CSS Realistic UNO Card Styles & Playground Layout

**Files:**
- Modify: `styles.css`

**Interfaces:**
- Produces: `.uno-card`, `.uno-card-inner`, `.uno-card-oval`, `.uno-card-pip`, `.uno-playground`, `.table-mat`, `.play-feedback-banner`, `.card-shake` animation.

- [ ] **Step 1: Add realistic UNO card CSS components and playground layout to `styles.css`**

Implement card visual realism:
- 4px crisp white border, angled oval center (`transform: rotate(-28deg)`), specular gradient sheen.
- Color skins: `--card-red`, `--card-yellow`, `--card-green`, `--card-blue`, `--card-wild`.
- Keyframe animations: `shakeCard` (horizontal wobble on illegal play), `playSuccess` (slide-up into pile).
- Felt gaming mat with discard pile and face-down deck.

- [ ] **Step 2: Verify CSS builds and contains required selectors**

Run: `grep -E "uno-card|table-mat|shakeCard" styles.css`  
Expected: Matching lines found.

- [ ] **Step 3: Commit CSS updates**

```bash
git add styles.css
git commit -m "feat: add realistic digital uno card styling and playground layout"
```

---

### Task 3: Integrate Playground Markup & i18n Dictionary

**Files:**
- Modify: `localization.md`
- Modify: `app.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `SCENARIOS` from `card-engine.js`
- Produces: HTML playground container with discard pile, draw deck, player hand dock, feedback banner, and scenario switcher.

- [ ] **Step 1: Add playground strings to `localization.md` and `TRANSLATIONS` in `app.js`**

Add `playground` dictionary section with `title`, `subtitle`, `tableCard`, `drawDeck`, `shuffleBtn`, `promptInitial`.

- [ ] **Step 2: Add playground DOM elements into `index.html` in the Guide/Rules tab**

Place the interactive table inside `#guideView` directly under the beginner guide hero.

- [ ] **Step 3: Run `npm test` to ensure i18n keys are fully matched**

Run: `npm test`  
Expected: All tests pass.

- [ ] **Step 4: Commit markup and localization updates**

```bash
git add localization.md app.js index.html
git commit -m "feat: integrate interactive playground markup and i18n strings"
```

---

### Task 4: Connect Interactive Event Handlers, Animations & Shuffler

**Files:**
- Modify: `app.js`

**Interfaces:**
- Consumes: `card-engine.js` (`isPlayable`, `getPlayReason`, `SCENARIOS`, `DRAW_POOL`)
- Produces: `renderPlayground()`, `handleCardClick()`, `handleDrawClick()`, `switchScenario()`

- [ ] **Step 1: Implement playground state and event handling in `app.js`**

- State: `currentScenarioIndex`, `activeTargetCard`, `currentHand`, `lastFeedback`.
- On card tap:
  - If legal: play sound (if audio context available), animate card into discard pile, update `activeTargetCard`, update feedback banner to success.
  - If illegal: trigger `.shake-card` CSS class, display red warning banner with explanatory reason.
- On Draw Deck tap:
  - Pick card from `DRAW_POOL`, add to hand with slide-in animation.
- On "Shuffle Scenario" button:
  - Advance to next scenario in `SCENARIOS`, re-render hand.

- [ ] **Step 2: Run `npm test`**

Run: `npm test`  
Expected: All test suites pass.

- [ ] **Step 3: Commit playground interactivity**

```bash
git add app.js
git commit -m "feat: bind interactive card clicking, move validation, and scenario shuffling"
```

---

### Task 5: End-to-End Simulation & Browser Subagent Verification

**Files:**
- Modify: `tests/e2e-simulation.js`

**Interfaces:**
- Produces: Automated validation report and browser visual inspection across desktop and mobile.

- [ ] **Step 1: Update `tests/e2e-simulation.js` to verify playground elements**

Add assertions verifying `card-engine.js` integration, playground DOM IDs (`#playgroundTable`, `#discardCard`, `#playerHandDock`), and CSS animation classes.

- [ ] **Step 2: Run automated test suite**

Run: `npm test`  
Expected: `PASS: All End-to-End simulation checks succeeded!`

- [ ] **Step 3: Test with browser subagent on Desktop and Mobile**

- Verify realistic digital UNO card rendering (angled oval, colors, corner pips).
- Click a legal card: verify discard pile updates and green banner shows.
- Click an illegal card: verify shake animation and red warning shows.
- Click Draw Deck: verify new card added.
- Click Shuffle Scenario: verify table resets.
- Toggle language to BM: verify playground labels translate.

- [ ] **Step 4: Commit all final test assets**

```bash
git add tests/e2e-simulation.js
git commit -m "test: add e2e assertions for interactive uno cards playground"
```
