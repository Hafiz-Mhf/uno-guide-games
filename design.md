# UI / UX Design Specifications

## 1. Visual Theme & Palette
Inspired by classic UNO cards and modern corporate engagement branding:

- **UNO Red:** `#ED1C24` (Action / Alert / Primary buttons)
- **UNO Yellow:** `#FFDE00` (Highlights / Trophies / Active tabs)
- **UNO Green:** `#00A651` (Confirmations / Success / Qualified tags)
- **UNO Blue:** `#0072BC` (Secondary buttons / Headers / Information)
- **Neutral Dark:** `#1E293B` (Typography and dark cards)
- **Neutral Light:** `#F8FAFC` (Mobile background)

---

## 2. Layout & Key Views

### Mobile Viewport Structure (375px - 430px optimized)
1. **Header Sticky Bar:**
   - Left: Department Brand (`Talent Development | HR`)
   - Center: `October UNO Showdown`
   - Right: Floating Language Switcher Pill (`[BM] | EN`)
2. **Tab Navigation (Segmented Controller):**
   - 📖 Rules (*Peraturan*)
   - 🕹️ Guide (*Panduan*)
   - 🏆 Tournament (*Kejohanan*)
3. **Dynamic View Area:**
   - Tab-swapped content loaded dynamically without page refresh.
4. **Bottom Floating Action Bar:**
   - Prominent button: `Launch Game Room` ➔ opens BuddyBoardGames lobby directly.

---

## 3. UX Components
- **Card Glossary Carousel:** Horizontal snap-scrolling cards showing card visuals, effects, and rules.
- **House Rule Toggles:** Expandable accordion FAQs for quick clarity during gameplay disputes.
- **Interactive Matchup Search:** Single-input search box enabling players to type their name and receive their assigned table, opponent, and room link instantly.