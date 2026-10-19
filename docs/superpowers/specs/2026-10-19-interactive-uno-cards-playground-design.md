# Design Spec: Realistic Digital UNO Cards & Interactive Rules Playground

**Date:** 2026-10-19  
**Event:** October Engagement Day: Hybrid UNO Championship (Talent Development | HR & Admin)  
**Author:** Pair Programming Agent & User  
**Target:** Web App (`d:\uno-guide-rules`)

---

## 1. Executive Summary & Problem Statement

While text rules and cards provide theoretical clarity, first-time players learn best by physically interacting with cards and experiencing immediate feedback on what constitutes a legal versus illegal move.

This specification details:
1. **Realistic Digital UNO Cards:** A pure CSS & SVG vector card component replicating the authentic physical card look: rounded corners, outer white margin, classic tilted center oval, bold slanted numbers, corner pips, and realistic satin sheen.
2. **Interactive "Can I Play This?" Rules Playground:** A playable mini-table where participants test card moves against an active discard pile. Valid plays animate onto the pile with green validation and rule explanations; invalid plays shake with red feedback explaining why the move is illegal.
3. **Dual-Language Parity:** Complete English and Bahasa Melayu support for all scenario prompts, validation messages, and card tooltips.

---

## 2. Card Anatomy & Design System

### 2.1 CSS Card Structure
```html
<div class="uno-card uno-card-red" data-color="red" data-value="7">
  <div class="card-inner">
    <div class="corner-pip top-left">7</div>
    <div class="center-oval">
      <span class="center-symbol">7</span>
    </div>
    <div class="corner-pip bottom-right">7</div>
    <div class="card-shine"></div>
  </div>
</div>
```

### 2.2 Aesthetic Specifications
- **Dimensions:** 
  - Desktop: 110px × 165px (Hand cards), 130px × 195px (Center table card).
  - Mobile: 75px × 112px (Hand cards), 90px × 135px (Center table card).
- **Border & Corner Radius:** 12px outer radius, 4px crisp white border.
- **Center Oval:** Ellipse oriented at `-28deg` angle (`transform: rotate(-28deg)`), drop-shadowed against the card surface.
- **Color Themes:**
  - Red: `#ED1C24`
  - Yellow: `#FFDE00` (darkened text/pip `#B45309` for contrast)
  - Green: `#00A651`
  - Blue: `#0072BC`
  - Wild: Black body (`#18181B`) with 4-quadrant rainbow central oval.
- **Action Card Center Glyphs:**
  - Skip: SVG diagonal cancel icon 🚫
  - Reverse: SVG twin curved cycle arrows 🔁
  - Draw 2: Bold `+2` with shadow
  - Wild: 4-color segmented concentric ellipse
  - Wild Draw 4: Miniature stacked cards with `+4`

---

## 3. Interactive Playground Architecture

### 3.1 Component Hierarchy
```text
[Playground Mat Container]
├── Header: Mode Title & Scenario Selector
├── Table Surface:
│   ├── [Draw Deck (Face Down)] ➔ Click to draw 1 card
│   └── [Discard Pile (Active Card)] ➔ e.g. Red 7
├── Live Validation Banner:
│   ├── Dynamic Message: "Legal Move! Blue 7 matches number 7." (Green)
│   └── Dynamic Error: "Illegal! Green 4 does not match Red or 7." (Red)
├── Player Hand Fan:
│   └── 5 Interactive UNO Cards (Clickable)
└── Control Footer:
    ├── "Shuffle Scenario" Button
    └── "Reset Hand" Button
```

### 3.2 Move Validation Logic
A card `C` is playable on target card `T` if:
```javascript
export function isPlayable(card, target) {
  if (card.color === 'wild' || target.color === 'wild') return true;
  if (card.color === target.color) return true;
  if (card.value === target.value) return true;
  return false;
}
```

### 3.3 Interactive Behaviors & Animations
- **Hover State:** Card lifts upward (`translateY(-12px)`) with realistic shadow expansion and glowing edge.
- **Legal Play Animation:** Card transforms into discard pile (`scale(1.05)` ➔ `translateY(-60px)` ➔ fade/swap onto discard pile). Banner flashes green with explanation text.
- **Illegal Play Animation:** Card triggers CSS keyframe `shake` animation (horizontal wiggle + red border highlight). Banner flashes red with detailed reason.
- **Draw Action:** Clicking the draw deck deals 1 random card into the player's hand with slide-in animation.

---

## 4. Scenario Presets

1. **Scenario 1: Color & Number Fundamentals**
   - Table Card: **Red 7**
   - Hand: Red 3 (Color match), Blue 7 (Number match), Green 4 (Illegal), Yellow Skip (Illegal), Wild (Universal match).
2. **Scenario 2: Action Cards & 1v1 Rules**
   - Table Card: **Blue Reverse**
   - Hand: Blue Skip (Color match), Yellow Reverse (Symbol match), Red 5 (Illegal), Blue +2 (Color match), Green 9 (Illegal).
3. **Scenario 3: Wild Cards & Recovery**
   - Table Card: **Green 2**
   - Hand: Red 9 (Illegal), Yellow 5 (Illegal), Wild Draw 4 (Legal), Blue 8 (Illegal), Draw Deck available.

---

## 5. Localization Additions (EN & BM)

New keys added to `TRANSLATIONS` under `playground`:
- `title`: "Interactive UNO Rules Playground" / "Pentas Latihan Interaktif Peraturan UNO"
- `subtitle`: "Click the cards in your hand below to test legal vs illegal moves live!" / "Tekan kad di tangan anda untuk menguji pergerakan sah atau tidak sah secara langsung!"
- `tableCard`: "Card on Table (Discard Pile)" / "Kad di Atas Meja"
- `drawDeck`: "Draw Deck (Tap if stuck)" / "Timbunan Cabutan (Tekan jika tiada kad)"
- `shuffleBtn`: "New Challenge Scenario" / "Senario Cabaran Baharu"
- `legalSameColor`: "Legal Move! Matches active color." / "Pergerakan Sah! Warna kad sepadan."
- `legalSameValue`: "Legal Move! Matches number or symbol." / "Pergerakan Sah! Nombor atau simbol sepadan."
- `legalWild`: "Legal Move! Wild cards can be played anytime." / "Pergerakan Sah! Kad Wild bebas diletakkan bila-bila masa."
- `illegalMismatch`: "Illegal Move! Card does not match color or number. Tap the Draw Deck to pick a card." / "Tidak Sah! Warna dan nombor tidak sepadan. Tekan timbunan cabutan untuk ambil kad."

---

## 6. Verification & Testing Plan

1. **Automated Unit Tests:**
   - Test `isPlayable(card, target)` with all card combinations (same color, same number, mismatched, wild cards).
   - Ensure all i18n keys for the playground exist in both `en` and `bm`.
2. **Browser Subagent E2E Verification:**
   - Test clicking legal cards (verify discard pile updates and green banner displays).
   - Test clicking illegal cards (verify shake animation and red warning banner displays).
   - Test drawing cards from draw deck.
   - Test scenario shuffling.
   - Test responsive layout at Desktop (`1200x800`) and Mobile (`390x844`).
