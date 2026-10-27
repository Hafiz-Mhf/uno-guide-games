# What's New & Current Context

> **Project:** HR & Admin UNO Engagement Day 2026 Guide & Tournament Desk  
> **Target Event Date:** Wednesday, 28 October 2026 • 3:00 PM – 4:30 PM (90 Mins)  
> **Venue:** Common Area, Level 2, Hive 5, MRANTI Building  
> **Platform:** BuddyBoardGames UNO (Digital Round 1) & Physical Decks (Rounds 2 & 3)  
> **Status:** Production Ready • 10/10 Test Suites Passing (`npm test`)

---

## Round 1 BYE Pass Banner Typography & Layout Polish `27 October 2026` <span style="background:#eab308;color:#000;font-weight:700;padding:2px 8px;border-radius:6px;font-size:12px;">LATEST</span>

<span style="background:#dcfce7;color:#15803d;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;">IMPROVED</span>

* **Fixed unstyled stretched banner bug.** Added proper `.desk-bye-notice` styling to match `.desk-bye-card`, preventing the `.bye-badge` element from stretching into an awkward full-width yellow strip with uncontained text below.
* **Executive structured card layout:**
  * Replaced the single unstyled text block with a 3-tier card hierarchy:
    * **Left:** Golden `🎁` icon bubble with subtle elevation.
    * **Top Meta:** Pill badge (`🎁 Round 1 BYE Pass`) alongside an emerald qualifier badge (`✓ Direct Round 2 Qualifier`).
    * **Participant Spotlight:** High-contrast, bold 17px participant name with department chip (`[ Talent Development ]`), making the recipient instantly identifiable.
    * **Clear Explanation Line:** Spaced 13px line with 1.55 line-height explaining why the pass was awarded and that no digital 1v1 match is needed.
* **Warm Amber & Emerald Palette:**
  * Generous 16px/20px padding with 14px border-radius, warm gold-amber gradient, 5px deep-amber accent border (`#D97706`), and 22px bottom margin to separate cleanly from match cards.
* **Bilingual text refinement:**
  * **English:** *"Advances directly to Round 2 Physical Card Heats without playing a digital 1v1 match (randomly awarded due to odd participant count)."*
  * **Bahasa Melayu:** *"Layak terus ke Meja Fizikal Pusingan 2 tanpa perlu bertanding di Pusingan 1 (diberikan secara rawak akibat bilangan peserta ganjil)."*

---

## "Remove All Players" Roster Feature `27 October 2026`

<span style="background:#dbeafe;color:#1e40af;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;">NEW</span>

* **1-Click "Remove All Players" Button (`#deskRemoveAllBtn`):**
  * Added a dedicated `🗑️ Remove All Players` action button in the Tournament Desk Player Roster & Check-In panel (`.desk-roster-quick-actions`).
  * Styled with a clear `.btn-micro.danger` crimson aesthetic so organizers instantly recognize it as a destructive bulk operation.
  * Subject to Organizer Protection lock (`#deskLockBar`), preventing accidental clicks unless organizer mode is unlocked.
* **Safety Confirmation Popout & Zero-Player State:**
  * Clicking triggers the custom confirmation modal (`showCustomConfirm`) warning the organizer that all participants and existing matches will be cleared.
  * On confirmation, executes `removeAllPlayers(state)`: empties `roster`, clears Round 1 pairings, and resets Round 2 physical heats.
  * When roster is empty, live attendance metrics cleanly update to 0 (`0 Registered`, `0 Checked In`, `⚠️ Min 2 Players Needed`), and the roster grid renders an informative empty state.
  * Reversible at any time: clicking `🔄 Reset to Default 30` immediately restores all 30 official participants.
* **Bilingual Translation & State Synchronization:**
  * Fully localized in English (`🗑️ Remove All Players`) and Bahasa Melayu (`🗑️ Padam Semua Pemain`).
  * Unit, DOM, and E2E simulation test suites updated and passing 10/10 (`npm test`).

---

## Guest-Only Live Matchups Isolation `27 October 2026`

<span style="background:#dbeafe;color:#1e40af;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;">NEW</span>

* **Strict Guest Mode (Live Matchups Only):**
  * When guests (participants/attendees) access the portal, the other 3 content sections (`#guide` Beginner Guide & Practice Mat, `#rules` Official Rules & 7 House Rules, and `#schedule` Digital Platform) as well as `#desk` (Tournament Desk) are **completely hidden**.
  * **Only `#matchups` (Live Matchups & Digital Rooms)** is displayed to guests in both navigation and page content.
  * Tab navigation for guests renders as a sleek, centered single pill: `[ ⚔️ Live Matchups ]`.
  * Hero banner hides admin/platform buttons (`⚡ Quick Room Generator & Join`, `🏆 Open Tournament Desk`) and only displays participant buttons (`⚔️ View Live Matchups` and `🖼️ View Official Posters`).
* **Navigation & Direct URL Shielding:**
  * Initial page load and refresh for unauthenticated guests directly lands on `#matchups`.
  * If a guest attempts to switch to any other tab via direct hash or JavaScript, the system triggers the Organizer Login modal and keeps the guest on `#matchups`.
  * Strict CSS display guards (`body.role-guest #guideView, #rulesView, #scheduleView, #deskView { display: none !important; }`) guarantee that non-matchup sections cannot be exposed in guest mode.
* **Full 5-Tab Admin Mode:**
  * Entering local organizer credentials (`admin` / `uno2026`) immediately unlocks the full 5-tab segmented grid (`Guide`, `Rules`, `Platform`, `Live Matchups`, `Tournament Desk`).
  * Organizers have full access to navigate between all sections.
  * Logging out via `Exit / Guest` instantly returns to the restricted single-tab guest view.

---

## Search Placeholder & BYE Banner Typography Fix `25 October 2026`

<span style="background:#fee2e2;color:#991b1b;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;">FIXED</span>

* **Removed duplicate magnifying glass icon (`🔍 🔍`).** Fixed redundant `🔍` emoji prefix inside `publicMatchups.searchPlaceholder` translation strings in `app.js`. The search input field now renders a single crisp search icon on the left with clean placeholder text (`Search your name to find your table (e.g. Noorfaizal)...`).
* **Polished Round 1 BYE pass description.** Refined awkward wording to clear tournament language: `advances directly to Round 2 physical tables (BYE pass awarded due to odd participant count)`.

---

## Executive Header Streamlining & Decluttering `25 October 2026`

<span style="background:#dcfce7;color:#15803d;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;">IMPROVED</span>

* **Eliminated header crowding & visual competition.** Removed duplicate center quick-nav pills and redundant event date capsule (`28 Oct 2026 • 3:00 PM`) from the top header bar, immediately freeing ~500px of horizontal breathing room. (Event date, time, duration, and venue remain prominent in the Hero banner below).
* **Zero title truncation.** Removed ellipsis cut-off (`HR & Admin UNO En...`). Event title `HR & Admin UNO Engagement Day 2026` and gold `Championship Edition` badge now render in full crisp typography across all screen resolutions without squeezing.
* **Balanced executive layout.** Header now features an uncluttered 2-pillar architecture:
  * **Left:** Event Emblem Logo + Department (`● Talent Development | HR`) + Full Championship Title.
  * **Right:** Clean utility action pills (`🔐 Organizer Login` / `👑 Admin Mode` + `🌐 BM`).
* **Expanded container width.** Increased `.header-inner` width from 1240px to 1400px with generous 20px flex gaps.

---

## Guest vs Admin Role Separation & Local Authentication `25 October 2026`

<span style="background:#dbeafe;color:#1e40af;font-weight:700;padding:2px 8px;border-radius:6px;font-size:11px;">NEW</span>

* **Seamless zero-friction Guest Mode.** Any participant visiting the portal enters as a **Guest** by default with zero registration, login, or friction required.
* **Separated guest vs admin windows:**
  * **Guest Window:** Sees Beginner Guide (`#guide`), Official Rules (`#rules`), Digital Platform (`#schedule`), and Live Matchups (`#matchups`). Tournament Desk is completely hidden from both the main navigation grid (4 tabs) and header quick nav. Direct URL access to `#desk` is automatically guarded and redirected to `#matchups` with an organizer prompt.
  * **Admin Window (Unlocked):** Unlocks the full **Tournament Desk** (`#desk`) with bracket randomization, attendee roster management, 3-table/4-table heats formatting, and live winner recording.
* **Pure client-side local authentication (No database required):**
  * Stored and validated locally inside browser `localStorage`.
  * Default organizer credentials: Username `admin`, Password `uno2026`.
  * Authenticated state persists locally across page reloads (`uno_admin_logged_in: 'true'`) so organizers don't lose session state mid-tournament.
* **Glassmorphism organizer login modal:**
  * Accessible via header button (`🔐 Organizer Login`).
  * Features autofocus, show/hide password toggle (`👁️` / `🙈`), shake animation on invalid credentials, and keyboard `Enter` / `Esc` handling.
* **Header admin status indicator & 1-click logout:**
  * When logged in, header displays a glowing green pulse badge: `👑 Admin Mode` alongside an `Exit / Guest` button.
  * Tournament Desk displays a top status banner: *"Authenticated Organizer Session — Local browser session active"*.
  * Clicking `Exit / Guest` or `Switch to Guest View` clears local authentication, reverts the navigation grid to 4 tabs, and redirects to `#matchups`.

---

## Final Guideline Poster & Motto Sync `25 October 2026`

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
