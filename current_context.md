# What's New & Current Context

> **Project:** HR & Admin UNO Engagement Day 2026 Guide & Tournament Desk  
> **Target Event Date:** Wednesday, 28 October 2026 • 3:00 PM – 4:30 PM (90 Mins)  
> **Venue:** Common Area, Level 2, Hive 5, MRANTI Building  
> **Platform:** BuddyBoardGames UNO (Digital Round 1) & Physical Decks (Rounds 2 & 3)  
> **Status:** Production Ready • 9/9 Test Suites Passing (`npm test`)

---

## Final Guideline Poster & Motto Sync `25 October 2026` <span style="background:#eab308;color:#000;font-weight:700;padding:2px 8px;border-radius:6px;font-size:12px;">LATEST</span>

<span style="background:#dcfce7;color:#15803d;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;">IMPROVED</span>

* **Updated to final official guideline poster.** Replaced `official-guidelines.jpg` with the final graphic featuring the high-energy bottom banner: *"Ready to shout 'UNO'?! Bring your best moves, play your cards, and may the best player win!"*.
* **Bilingual motto synchronization.** Synced motto copy across `index.html` and both English and Bahasa Melayu dictionaries in `app.js` to match the physical print poster verbatim.
* **Lightbox download serving final asset.** The high-resolution modal download button (`⬇️ Download Full Resolution Poster`) and direct image viewer serve the updated 516KB graphic.

---

## Dedicated Player Matchups & Dual-Layer Protection `24 October 2026`

<span style="background:#dbeafe;color:#1e40af;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;">NEW</span>

* **Dedicated "Live Matchups" tab (`#matchups`).** Created a separate, spectator-safe participant view where attendees can view their pairings, room IDs, and table numbers without touching admin controls.
* **1-click BuddyBoardGames room launcher.** Every match card provides a direct `🚀 Launch BBG Room ↗` button with pre-filled room parameters so players jump straight into action with zero setup friction.
* **Instant name search filter.** Real-time input (`🔍 Search your name...`) allows any player among 30+ attendees to type their name and immediately highlight their match card in gold.
* **Live match status indicators.** Cards display dynamic status pills (`⏳ Ready to Play / In Progress` or `🏆 Winner: [Name] (Advances to Round 2 ➔)`).
* **Participant share link.** Added a 1-click clipboard button (`🔗 Copy Link for Players`) that copies the direct `#matchups` hash link for sharing via WhatsApp or Microsoft Teams.

<span style="background:#dcfce7;color:#15803d;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;">IMPROVED</span>

* **Organizer controls protection lock (`#desk`).** Added a persistent safety switch on the Tournament Desk (`🔒 Organizer Controls: Protected`). If curious participants open the desk tab, buttons for "Randomize Pairings", "Reset Roster", "Pick Winner", and "Delete" are guarded behind an unlock prompt to prevent accidental bracket corruption.
* **5-tab navigation bar layout.** Upgraded the main navigation bar to 5 columns on desktop (`grid-template-columns: repeat(5, 1fr)`) and smooth horizontal touch-scrolling on tablet/mobile, eliminating orphaned or wrapped buttons.

---

## Flexible Capacity & Tournament Scalability `23 October 2026`

<span style="background:#fee2e2;color:#991b1b;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;">FIXED</span>

* **Zero qualifier drops for 32/33+ rosters.** Fixed a table capacity cap where having 33 players (16 matches + 1 BYE = 17 qualifiers) dropped players #16 and #17 because tables were hardcoded to 5 pax (`15 / 15`).
* **Dynamic, even table distribution.** Heats automatically partition all qualifiers evenly across physical tables (e.g. 17 qualifiers split into 6, 6, 5 pax), updating the badge dynamically to `17 / 17 Qualifiers`.

<span style="background:#dbeafe;color:#1e40af;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;">NEW</span>

* **3 Tables vs 4 Tables format toggle.**
  * **3 Tables (5–6 Pax, Recommended):** Preserves the standard 3-winner Grand Final structure. Physical UNO decks easily accommodate 6 players.
  * **4 Tables (4–5 Pax):** Adds **Table Delta (Heat 4)** with amber card styling for a 4-player Grand Final showdown.
* **Cleaned player card typography.** Removed redundant "General" department subtitles from Round 2 seats to display clean, prominent participant names.

---

## Native Dialog Modernization & Refresh Resilience `23 October 2026`

<span style="background:#dbeafe;color:#1e40af;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;">NEW</span>

* **Custom popout & modal dialog system.** Completely eliminated native browser `alert()` and `confirm()` popups. Replaced with branded floating dialog cards featuring custom icon bubbles, kickers, danger/primary action buttons, backdrop blur, and keyboard `ESC` dismissal.
* **Animated toast notifications.** Built non-blocking corner toasts (`showToast`) for instant feedback when recording winners, copying links, importing rosters, or switching table formats.

<span style="background:#fee2e2;color:#991b1b;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;">FIXED</span>

* **Full refresh persistence.** Refreshing the page previously kicked the user back to the Home/Guide tab. Integrated bi-directional persistence between URL hash (`#guide`, `#rules`, `#schedule`, `#matchups`, `#desk`) and `localStorage` with a zero-flash head bootstrap script.
* **Streamlined roster management.** Simplified the player addition interface to name-only, removing unnecessary department inputs per user request.

---

## Tournament Desk & Bracket Engine Inception `22 October 2026`

<span style="background:#dbeafe;color:#1e40af;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;">NEW</span>

* **Complete Tournament Desk automation (`tournament-engine.js`).**
  * **Interactive check-in counter:** Real-time metrics for Registered, Checked-In, Absent, and Target Matches.
  * **Bulk roster import:** Paste multi-line attendee lists from Excel or Teams with automated whitespace cleansing.
  * **Fisher-Yates 1v1 randomizer:** Automatically balances pairings and awards a BYE pass to Round 2 when participant counts are odd.
  * **WhatsApp/Teams clipboard exporter:** Formats entire matchup tables into clean text for instant messaging.
  * **Physical Round 2 auto-seeding:** Winners from Round 1 automatically fill physical heat seats.
* **Official poster modal switcher.** Lightbox popup with tabbed navigation allowing users to toggle between the Event Announcement Poster and the Official Guidelines Poster with 1-click download.

---

## Digital Platform & Interactive Rules Playground `20–22 October 2026`

<span style="background:#dbeafe;color:#1e40af;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;">NEW</span>

* **Automated room name generator.** Generates pre-formatted official match rooms (`HR-Match-01` to `HR-Match-15`) with quick pill switchers and pre-encoded BuddyBoardGames direct URLs.
* **Interactive UNO rules playground (`card-engine.js`).**
  * Realistic SVG digital cards with central oval, corner pips, and authentic color shades (`#C72119`, `#E6A100`, `#2F8F46`, `#0050A4`).
  * Live move validator testing legal vs illegal discards by Color, Number, Symbol, or Wild Color Card.
  * Interactive 4-color selector modal for Wild card plays.
  * Live scenario generator and interactive deck draw mechanism.
* **Official Rules & 7 House Rules.** Documented 150-point series format, strict no-stacking enforcement, 1v1 Reverse-as-Skip mechanics, and single card play per turn.

---

## Core Architecture & Brand Identity `18–20 October 2026`

<span style="background:#dbeafe;color:#1e40af;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;">NEW</span>

* **Bilingual i18n engine (`app.js`).** Full English and Bahasa Melayu translations across all 5 views with instant live switching without page reloads.
* **MRANTI Talent Development branding.** Signature corporate color palette (MRANTI Blue, Deep Slate, Gold accents), custom circular TD emblem, and official event capsules.
* **Multi-column executive footer.** Incorporated MRANTI core values (*Win Together*, *Be the Change*, *Accelerate Impact*) and an interactive strategy pro-tip generator.
* **Zero-dependency deployment.** Clean HTML5, Vanilla CSS, and ES Modules architecture compatible with Vercel and static hosting (`serve`).

---

## Verification Test Matrix (`npm test`)

| # | Test Suite | Scope | Status |
|---|---|---|---|
| 1 | `tests/verify-data.js` | 30 default players, 15 initial pairings, unique IDs | ✅ Passed |
| 2 | `tests/verify-tournament-engine.js` | State lifecycle, check-in, odd BYE, 16/17 qualifier scaling | ✅ Passed |
| 3 | `tests/verify-tournament-desk-dom.js` | Desk DOM element IDs, metrics, inputs, translations | ✅ Passed |
| 4 | `tests/verify-app.js` | Bilingual dictionary completeness across required keys | ✅ Passed |
| 5 | `tests/verify-card-engine.js` | Card move legality, wild selection, scenario evaluation | ✅ Passed |
| 6 | `tests/verify-tab-persistence.js` | 5-tab switching, hash sync, localStorage fallback | ✅ Passed |
| 7 | `tests/verify-custom-popouts.js` | Custom confirm/alert DOM, backdrop, keyboard listeners | ✅ Passed |
| 8 | `tests/verify-public-matchups-view.js` | Participant read-only bracket, search, lock protection | ✅ Passed |
| 9 | `tests/e2e-simulation.js` | Full 188 i18n key parity, player search, 29-player sim | ✅ Passed |
