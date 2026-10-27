// app.js
import { PLAYERS, searchPlayers } from './tournament-data.js';
import { isPlayable, getPlayReason, SCENARIOS, DRAW_POOL } from './card-engine.js';
import {
  loadTournamentState,
  saveTournamentState,
  resetTournamentState,
  togglePlayerCheckIn,
  addPlayer,
  removePlayer,
  bulkImportRoster,
  setAllCheckInStatus,
  removeAllPlayers,
  generateRound1Pairings,
  recordMatchWinner,
  computeRound2Heats,
  setRound2TableCount,
  formatMatchupsClipboard,
  recordHeatWinner,
  recordPodiumPlace,
  resetGrandFinal,
  computeGrandFinalists,
  computeChampionshipStandings
} from './tournament-engine.js';

export const TRANSLATIONS = {
  en: {
    appTitle: "HR & Admin UNO Engagement Day 2026",
    department: "Talent Development | Human Resource",
    toggleText: "BM",
    nav: {
      guide: "🕹️ Beginner Guide & Practice Mat",
      rules: "📜 Official Rules & 7 House Rules",
      schedule: "🎮 Digital Platform & Room Setup",
      matchups: "⚔️ Live Matchups",
      tournamentDesk: "🏆 Tournament Desk"
    },
    hero: {
      tagline: "October Engagement Day: Guide & Official Rules",
      eventDate: "Wednesday, 28 October 2026 • 3:00 PM – 4:30 PM (90 Mins)",
      venue: "📍 Common Area, Level 2, Hive 5, MRANTI Building",
      platform: "🎮 BuddyBoardGames UNO & Physical UNO Decks",
      subtext: "Casual UNO Championship — From Digital 1v1s to the 3-Player Grand Final!",
      slogan: "💬 \"Let's Play, Connect & Laugh!\"",
      prizes: "🏆 Special Prizes for Top Players!"
    },
    buttons: {
      openGame: "Launch BuddyBoardGames Lobby ➔",
      practiceWithBuddy: "Practice With AI Bots ➔",
      viewPosters: "🖼️ View Official Posters"
    },
    guidelines: {
      badge: "Official Event Walkthrough",
      title: "Event Guidelines: 3 Steps to Victory",
      subtitle: "Official guidelines brought to you by Talent Development | HR • Admin Engagement Day",
      step1Tag: "Before Event",
      step1Title: "RSVP & Practice",
      step1Point1: "RSVP 'Yes' on your calendar invite",
      step1Point2: "Practice on buddyboardgames.com/uno",
      step2Tag: "Event Day",
      step2Title: "Check-In & Join Match Room",
      step2Point1: "Join us at the Common Area, Level 2, Hive 5",
      step2Point2: "Open your browser to join your assigned match room",
      step3Tag: "Game Flow",
      step3Title: "Game Flow: Digital to Physical Card Game",
      step3Point1: "Round 1: Play digital matches on your phone/laptop",
      step3Point2: "Round 2: Winners advance to play with physical card tables",
      step3Point3: "Round 3: The grand physical card final!",
      step4Tag: "Fair Play",
      step4Title: "Key Rules: Fair Play",
      step4Point1: "Call 'UNO!' on your last card",
      step4Point2: "Play only one card per turn",
      step4Point3: "No Stacking (no double power cards, no double number cards)",
      step4Point4: "No card? Draw 1 and pass to the next player",
      punsTitle: "Event Spirit:",
      motto: "Ready to shout 'UNO'?! Bring your best moves, play your cards, and may the best player win!"
    },
    posterModal: {
      badge: "Official Event Assets",
      title: "Official Event Posters & Guidelines",
      tabAnnouncement: "📢 Event Announcement Poster",
      tabGuidelines: "📋 Official Guidelines Poster",
      download: "⬇️ Download Full Resolution Poster",
      dismiss: "Close"
    },
    beginnerGuide: {
      title: "First Time Playing UNO? Start Here!",
      subtitle: "Master the fundamentals in 2 minutes. Simple, fast, and exciting!",
      step1Title: "1. The Objective",
      step1Desc: "Be the first player to play all the cards in your hand by matching the top card of the Discard pile by Color, Number, or Symbol.",
      step2Title: "2. How a Turn Works",
      step2Desc: "Look at the card on top of the Discard Pile. On your turn, you must match it by:",
      step2RuleA: "Color (e.g. Red on Red)",
      step2RuleB: "Number or Symbol (e.g. 7 on 7, or Skip on Skip)",
      step2RuleC: "Color Card / Wild (allows you to choose among 4 colors anytime!)",
      step3Title: "3. No Match? Draw 1 Card & Pass",
      step3Desc: "If you don't have a matching card in hand, simply draw 1 card from the deck. If that card cannot be played right away, your turn ends there—no continuous drawing until you find a match!",
      step4Title: "4. Shout 'UNO!' at 1 Card",
      step4Desc: "Digital Rounds: Hit that on-screen 'UNO' button before placing down your second-to-last card. Physical Rounds: Shout 'UNO!' loud and proud the second you're down to your last card! Penalty: Draw 2 cards if caught slipping before the next player plays.",
      step5Title: "5. Winning the Round",
      step5Desc: "The first player to discard their final card wins the round! (Yes, winning on an Action Card is 100% legal!)"
    },
    matchExample: {
      title: "Quick Match Visual Example",
      topCard: "Current Card on Table:",
      playable: "✅ Cards You Can Play:",
      playableColor: "Red 3 (Matches Color)",
      playableNumber: "Blue 7 (Matches Number)",
      playableWild: "Color Card (Choose any of 4 colors)",
      notPlayable: "❌ Cannot Play:",
      notPlayableDesc: "Green 4 (Wrong Color & Wrong Number)"
    },
    playground: {
      badge: "Interactive Training Mat",
      title: "UNO Rules Playground: Can I Play This?",
      subtitle: "Click any card in your hand below to test legal vs illegal moves live!",
      tableCard: "Card on Table",
      drawDeck: "Draw Deck (Tap to Draw)",
      yourHand: "Your Hand (Click to Play)",
      shuffleBtn: "🎲 New Scenario",
      resetBtn: "🔄 Reset Scenario",
      initialPrompt: "👉 Click any card from your hand below to test if it's a legal move!",
      drewCardMsg: "Drew a card! Check if it can be played on the active card.",
      chooseColorTitle: "Choose Next Active Color",
      chooseColorDesc: "Color Card played! Select which color the next card must match:",
      colorRed: "Red",
      colorYellow: "Yellow",
      colorGreen: "Green",
      colorBlue: "Blue",
      activeColorBadge: "Active Color:",
      legalColorChoice: "Color chosen: {color}! Next play must match {color}.",
      cancelChoice: "✕ Cancel (Keep Card)",
      chooseColorHint: "Selecting a color dictates what color your opponent must match on the next turn."
    },
    rulesTab: {
      title: "Tournament House Rules & Etiquette",
      subtitle: "7 friendly rules to keep our casual championship fun, fair, and flowing smoothly.",
      rule1Title: "1. Don't Forget to Call 'UNO!' 🗣️",
      rule1Desc: "Digital Rounds: Hit that on-screen 'UNO' button before placing down your second-to-last card. Physical Rounds: Shout 'UNO!' loud and proud the second you're down to your last card! Penalty: If someone catches you slipping before the next person plays, you'll have to draw 2 penalty cards. Eyes peeled, everyone!",
      rule2Title: "2. No Playable Card? Draw One & Pass 🃏",
      rule2Desc: "If you don't have a matching card in hand, simply draw one card from the deck. If that card can't be played right away, your turn ends there—no continuous drawing until you find a match!",
      rule3Title: "3. One Card at a Time (No Multiple Drops) ✋",
      rule3Desc: "Even if you hold matching numbers or colors (such as two Blue 7s), you may only play one card per turn. Playing multiple cards or paired sets at the same time is not permitted.",
      rule4Title: "4. No Stacking (+2 and +4 Stay With You) 🛑",
      rule4Desc: "Card stacking is strictly off the table—you cannot play a +2 onto another +2 (or a +4 onto a +4) to pass the penalty to the next player. When targeted, simply draw your required cards and pass your turn.",
      rule5Title: "5. Take Your Time, But Keep It Flowing ⏳",
      rule5Desc: "No stressful turn timers! Feel free to think through your moves and strategize. Please maintain a steady rhythm of play so every table finishes comfortably on schedule.",
      rule6Title: "6. Yes, You Can Finish on an Action Card! 🎉",
      rule6Desc: "Want to end the game on a high note with a Skip, Reverse, +2, or Color Card / Wild? Go right ahead! Winning on an Action card is 100% legal here.",
      rule7Title: "7. Respect the Table Captains & Referees 🤝",
      rule7Desc: "Every physical table in Round 2 will have a designated Table Captain to keep things running smooth and fair. If any playful arguments break out, their word (or the Tournament Director's) is final!"
    },
    cardEffects: {
      title: "Card Types & Special Mechanics",
      subtitle: "Special effects in play during Round 1 (1v1 Digital) vs Rounds 2 & 3 (Multi-Player Physical).",
      numberTitle: "Number Cards (0–9)",
      numberDesc: "Standard colored cards (Red, Yellow, Green, Blue) played by matching color or number.",
      skipTitle: "Skip Card",
      skipDesc: "Rounds 2 & 3: Skips next player's turn.\nRound 1 (1v1): Skips opponent; take another turn immediately!",
      reverseTitle: "Reverse Card",
      reverseDesc: "Rounds 2 & 3: Reverses play direction.\nRound 1 (1v1): Acts as a Skip card; take another turn immediately!",
      draw2Title: "Draw 2 (+2)",
      draw2Desc: "Next player must draw 2 cards and forfeit their turn (No stacking allowed).",
      colorCardTitle: "Color Card / Wild",
      colorCardDesc: "Can be played on any color or number anytime. Player announces the next active color.",
      color4Title: "Color +4 / Wild Draw 4",
      color4Desc: "Player chooses next color; next player draws 4 cards and loses their turn (No stacking)."
    },
    scheduleTab: {
      title: "Event Schedule & Run of Show",
      subtitle: "90 minutes of casual, high-energy gaming from digital matches to physical finals.",
      r1Time: "3:00 PM – 3:15 PM (15 mins)",
      r1Stage: "Check-In & Onboarding",
      r1Desc: "Arrival at Common Area, Level 2, Hive 5, device Wi-Fi check, scanning the event guide, and room/match allocations.",
      r2Time: "3:15 PM – 3:35 PM (20 mins)",
      r2Stage: "Round 1 — Digital 1v1",
      r2Desc: "30 players compete in 15 simultaneous 1v1 head-to-head browser matches (Best of 1). The 15 winners advance.",
      r3Time: "3:35 PM – 4:00 PM (25 mins)",
      r3Stage: "Round 2 — Physical Heats",
      r3Desc: "15 qualifying players split across 3 physical card tables (5 players per table). Table winners advance to the Grand Final.",
      r4Time: "4:00 PM – 4:20 PM (20 mins)",
      r4Stage: "Round 3 — Grand Final",
      r4Desc: "The 3 finalists face off at the central championship table while the rest of the department spectates and cheers.",
      r5Time: "4:20 PM – 4:30 PM (10 mins)",
      r5Stage: "Awards & Wrap-Up",
      r5Desc: "Prize presentation for 1st, 2nd, and 3rd place winners, team photo, and light refreshments.",
      consolationTitle: "☕ Consolation / Casual Play (Open Side Tables)",
      consolationDesc: "Players eliminated in Rounds 1 and 2 are encouraged to join open side tables with physical card decks to enjoy casual rounds and cheer on colleagues!"
    },
    technicalSetup: {
      title: "Player Guide & Technical Setup",
      subtitle: "Quick instructions to connect with your opponent on BuddyBoardGames.",
      platformTitle: "Digital Platform (Round 1)",
      platformDesc: "Website: buddyboardgames.com/uno • Compatibility: Works directly in any standard smartphone, tablet, or laptop browser (Chrome, Safari, Edge, Firefox). No app installation or registration needed. (Note: May contain web ads. Install adblock extension at your own discretion).",
      stepsTitle: "Step-by-Step Match Joining Instructions",
      step1: "1. Open the browser on your fully charged device and navigate to buddyboardgames.com/uno.",
      step2: "2. Enter your nickname in the 'Your name' field so organizers can record match results accurately.",
      step3: "3. Enter your pre-assigned Room Name (e.g., HR-Match-01 through HR-Match-15).",
      step4: "4. Click 'Play Uno' and wait for your paired opponent to enter.",
      step5: "5. Play your Best of 1 match. Upon completion, report the winner to the tournament desk.",
      practiceTitle: "Pre-Event Practice Options",
      practiceDesc: "Anyone wanting to test before game day can go to the website, create a custom test room name, and click Play Uno. Click 'Play with Buddy' to test solo against AI bots, or click 'Invite a buddy' to copy your direct room link and challenge a colleague!"
    },
    roomGenerator: {
      badge: "⚡ Automated Tool",
      title: "Automated Room Generator & Direct Join Links",
      subtitle: "Instantly generate official tournament rooms or random practice rooms with 1-click pre-filled BuddyBoardGames links.",
      matchSelectLabel: "Official Match (Round 1):",
      randomBtn: "🎲 Generate Random Room",
      officialBtn: "🏆 Next Official Match",
      nameLabel: "Your Nickname (Optional):",
      namePlaceholder: "Enter nickname (e.g. Sarah, Razali)...",
      roomLabel: "Active Room Name:",
      directLinkLabel: "Pre-filled BuddyBoardGames Direct URL:",
      launchBtn: "🚀 Launch Pre-filled Room on BuddyBoardGames ➔",
      copyRoomBtn: "📋 Copy Room Name",
      copyLinkBtn: "🔗 Copy Direct Link",
      copiedToast: "Copied to clipboard! ✅",
      quickPicksLabel: "⚡ Quick Match Switcher (1 to 15):"
    },
    footer: {
      tagline: "October Engagement Day 2026: Official Tournament & Casual Play Guide. Win Together | Be the Change | Accelerate Impact.",
      status: "Live Engagement Day • 28 Oct 2026",
      eventInfoTitle: "Event Logistics",
      dateTime: "Wednesday, 28 Oct 2026 • 3:00 PM – 4:30 PM (90 Mins)",
      venue: "Common Area, Level 2, Hive 5, MRANTI Building",
      format: "Digital 1v1 Prelims → 5-Player Heats → Grand Final",
      gameCentralTitle: "Game Central",
      linkGuide: "🕹️ Beginner Guide & Practice Mat",
      linkRules: "📜 7 House Rules & Etiquette",
      linkRoomGen: "⚡ Automated Room Generator",
      linkDesk: "🏆 Tournament Desk",
      linkBuddy: "BuddyBoardGames UNO ↗",
      proTipTitle: "Strategy Pro-Tip",
      tipShuffleBtn: "🎲 Shuffle Tip",
      copyright: "© 2026 Malaysian Research Accelerator for Technology and Innovation (MRANTI). Internal Staff Engagement.",
      builtBy: "Organized by Talent Development | Human Resource"
    },
    tournamentDesk: {
      badge: "Organizer Automation",
      title: "Tournament Desk: Check-In, Randomizer & Heats",
      subtitle: "Manage attendees, remove no-shows, randomize Round 1 1v1 matchups, and feed winners into Round 2 physical tables.",
      stats: {
        registered: "Registered",
        checkedIn: "Checked In (Ready)",
        absent: "Absent / No-Show",
        targetMatches: "Round 1 Matches",
        statusEven: "✅ Even Pairings Ready",
        statusOdd: "🎁 1 Player BYE Pass (Odd Count)"
      },
      roster: {
        title: "Player Roster & Check-In",
        searchPlaceholder: "Search player by name...",
        namePlaceholder: "Enter player name...",
        addBtn: "+ Add Player",
        bulkToggle: "📝 Bulk Import / Paste",
        bulkLabel: "Paste names (one per line):",
        bulkPlaceholder: "Paste names (one per line):\nAlice Tan\nBob Wong\nCharlie Lee",
        bulkImportBtn: "Import to Roster",
        checkAllBtn: "Check In All",
        uncheckAllBtn: "Clear Check-Ins",
        removeAllBtn: "🗑️ Remove All Players",
        resetBtn: "🔄 Reset to Default 30",
        resetConfirm: "Reset roster back to the original 30 participants?",
        checkedInTag: "Checked In",
        absentTag: "Absent",
        deleteBtnTitle: "Remove player from roster"
      },
      matches: {
        title: "Round 1 Matchups & Digital Rooms",
        subtitle: "Launch matches on BuddyBoardGames and click winners to advance them to Round 2.",
        randomizeBtn: "🎲 Randomize Round 1 Pairings",
        randomizeConfirm: "Round 1 matches already exist. Re-shuffle and generate new pairings?",
        copyBtn: "📋 Copy Matchups (WhatsApp/Teams)",
        copiedToast: "Matchups copied to clipboard! 📋",
        printBtn: "🖨️ Print Desk View",
        emptyPrompt: "No matches generated yet. Check in attendees above and click 'Randomize Round 1 Pairings'.",
        vs: "VS",
        tableLabel: "Table",
        launchRoomBtn: "Launch BBG Room ↗",
        selectWinnerPrompt: "Select Winner to Advance:",
        winnerWonSuffix: "Won 👑",
        byeTitle: "🎁 Round 1 BYE Pass",
        byeDesc: "Advances directly to Round 2 Physical Card Heats without playing a digital 1v1 match (randomly awarded due to odd participant count)."
      },
      round2: {
        title: "Round 2 Physical Card Heats",
        subtitle: "Winners from Round 1 automatically fill physical heat tables for casual championship showdowns.",
        qualifiersBadge: "Qualifiers Ready",
        tableAlpha: "Table Alpha (Heat 1)",
        tableBeta: "Table Beta (Heat 2)",
        tableGamma: "Table Gamma (Heat 3)",
        tableDelta: "Table Delta (Heat 4)",
        slotEmpty: "Awaiting Round 1 Winner..."
      },
      lockBar: {
        lockedTitle: "Organizer Controls: Protected",
        lockedDesc: "Editing pairings, winners, and roster is locked to prevent accidental clicks. Share 'Live Matchups' with attendees.",
        unlockBtn: "🔓 Unlock Organizer Mode",
        unlockedTitle: "Organizer Controls: Active",
        unlockedDesc: "You can now edit pairings, record winners, and manage participants.",
        lockBtn: "🔒 Lock Controls"
      },
      grandFinal: {
        badge: "Round 3 Championship Stage",
        title: "Round 3: Grand Finale & Championship Podium",
        subtitle: "Crown 1 winner per heat table above to fill this table. Once the physical showdown finishes, award 1st, 2nd, and 3rd place.",
        crownWinnerBtn: "👑 Crown Winner",
        crownedBadge: "👑 Heat Champion",
        uncrownBtn: "↩️ Change",
        resetBtn: "🔄 Reset Finale Placements",
        resetConfirm: "Reset all Grand Finale podium placements and heat winners?",
        assignPrompt: "Award Podium Position:",
        firstPlaceBtn: "🥇 1st (Champion)",
        secondPlaceBtn: "🥈 2nd Place",
        thirdPlaceBtn: "🥉 3rd Place",
        fourthPlaceBtn: "🎖️ 4th Place",
        pendingFinalists: "Waiting for Round 2 heat winners to qualify...",
        tableTitle: "Championship Showdown Table",
        heatTableLabel: "Heat Winner:"
      }
    },
    publicMatchups: {
      badge: "Live Tournament Bracket",
      title: "Round 1 Matchups & Digital Rooms",
      subtitle: "Find your table number and paired opponent. Click 'Launch BBG Room' to enter your game room immediately.",
      safeNotice: "🛡️ Participant Read-Only View — Click any table room button to play!",
      searchPlaceholder: "Search your name to find your table (e.g. Noorfaizal)...",
      shareBtn: "🔗 Copy Matchups Link",
      emptyPrompt: "Round 1 pairings have not been generated yet. Please wait for the tournament organizer to start the round.",
      statusInProgress: "⏳ In Progress • Best of 1",
      statusWinner: "🏆 Winner:",
      advancesTag: "Advances to Round 2 ➔",
      tableLabel: "Table",
      launchRoomBtn: "Launch BBG Room ↗",
      vs: "VS",
      round2Title: "Round 2 Physical Card Heats",
      round2Subtitle: "Winners from Round 1 automatically fill Table Alpha, Beta, Gamma (and Delta).",
      grandFinalBadge: "Round 3 Championship Stage",
      grandFinalTitle: "🏆 Grand Finale & Official Standings",
      grandFinalDesc: "The 1st place finisher from each Round 2 physical heat advances to this championship showdown! View the live finalists and official tournament standings below.",
      finalTableTitle: "👑 Championship Final Table",
      podiumTitle: "Official Championship Podium",
      standingsTitle: "Official Tournament Standings",
      championLabel: "Grand Champion",
      runnerUpLabel: "Runner-Up",
      thirdPlaceLabel: "2nd Runner-Up",
      fourthPlaceLabel: "4th Place Finalist",
      awaitingWinner: "Pending Heat Result...",
      rankCol: "Rank",
      playerCol: "Participant",
      deptCol: "Department",
      accoladeCol: "Accolade / Title",
      statusCol: "Status",
      statusCrowned: "🏆 Crowned",
      statusFinalist: "⭐ Finalist",
      statusPending: "⏳ Showdown in Progress",
      standingsPendingNote: "Final standings will be updated in real time as the Grand Finale concludes."
    },
    auth: {
      adminLogin: "Organizer Login",
      organizerActive: "👑 Admin Mode",
      logout: "Exit / Guest",
      adminBadge: "Admin Desk",
      modalTitle: "Tournament Organizer Login",
      modalSubtitle: "Enter organizer credentials to access tournament desk, randomize brackets, and record winners. Saved locally in your browser.",
      usernameLabel: "Username",
      passwordLabel: "Password",
      loginBtn: "Log In to Desk 🚀",
      cancelBtn: "Continue as Guest",
      localNote: "🔒 No database required. Credentials authenticate locally on your device. Default: admin / uno2026",
      deskBannerTitle: "Authenticated Organizer Session",
      deskBannerSub: "Local browser session active. Only you can view this desk.",
      switchToGuest: "👁️ Switch to Guest View"
    }
  },
  bm: {
    appTitle: "Hari Penglibatan UNO HR & Pentadbiran 2026",
    department: "Pembangunan Bakat | Sumber Manusia",
    toggleText: "EN",
    nav: {
      guide: "🕹️ Panduan Pemain & Pentas Latihan",
      rules: "📜 Peraturan Rasmi & 7 Syarat Santai",
      schedule: "🎮 Platform Digital & Penjana Bilik",
      matchups: "⚔️ Jadual Perlawanan",
      tournamentDesk: "🏆 Meja Kejohanan"
    },
    hero: {
      tagline: "Hari Penglibatan Oktober: Panduan & Peraturan Rasmi",
      eventDate: "Rabu, 28 Oktober 2026 • 3:00 PM – 4:30 PM (90 Minit)",
      venue: "📍 Common Area, Aras 2, Hive 5, Bangunan MRANTI",
      platform: "🎮 BuddyBoardGames UNO & Kad UNO Fizikal",
      subtext: "Kejohanan UNO Santai — Dari 1v1 Digital ke Pentas Akhir 3 Penjuru!",
      slogan: "💬 \"Jom Bermain, Beramah Mesra & Bergelak Tawa!\"",
      prizes: "🏆 Hadiah Khas Untuk Pemain Terbaik!"
    },
    buttons: {
      openGame: "Buka Bilik BuddyBoardGames ➔",
      practiceWithBuddy: "Latihan Menentang Bot AI ➔",
      viewPosters: "🖼️ Lihat Poster Rasmi"
    },
    guidelines: {
      badge: "Panduan Acara Rasmi",
      title: "Garis Panduan Acara: 3 Langkah Menuju Kemenangan",
      subtitle: "Garis panduan rasmi dibawakan oleh Pembangunan Bakat | Hari Penglibatan HR & Pentadbiran",
      step1Tag: "Sebelum Acara",
      step1Title: "RSVP & Latihan Awal",
      step1Point1: "Sahkan RSVP 'Yes' pada jemputan kalendar anda",
      step1Point2: "Buat latihan di buddyboardgames.com/uno",
      step2Tag: "Hari Acara",
      step2Title: "Daftar Masuk & Sertai Bilik Perlawanan",
      step2Point1: "Sertai kami di Common Area, Aras 2, Hive 5",
      step2Point2: "Buka pelayar web untuk menyertai bilik perlawanan anda",
      step3Tag: "Aliran Permainan",
      step3Title: "Aliran Permainan: Dari Digital ke Meja Kad Fizikal",
      step3Point1: "Pusingan 1: Perlawanan digital pada telefon pintar/komputer riba",
      step3Point2: "Pusingan 2: Pemenang mara ke meja kad fizikal",
      step3Point3: "Pusingan 3: Pentas Akhir fizikal untuk merebut kejuaraan!",
      step4Tag: "Semangat Kesukanan",
      step4Title: "Peraturan Utama: Permainan Adil",
      step4Point1: "Sebut 'UNO!' pada kad terakhir anda",
      step4Point2: "Main satu kad sahaja setiap giliran",
      step4Point3: "Tiada 'Stacking' (tiada kad kuasa berganda, tiada kad nombor berganda)",
      step4Point4: "Tiada kad? Cabut 1 dan serah kepada pemain seterusnya",
      punsTitle: "Semangat Acara:",
      motto: "Bersedia laung 'UNO'?! Tunjukkan skil terbaik anda, susun strategi kad, dan semoga pemain terbaik bergelar juara!"
    },
    posterModal: {
      badge: "Bahan Rasmi Acara",
      title: "Poster Rasmi & Garis Panduan Acara",
      tabAnnouncement: "📢 Poster Pengumuman Acara",
      tabGuidelines: "📋 Poster Garis Panduan Rasmi",
      download: "⬇️ Muat Turun Poster Resolusi Penuh",
      dismiss: "Tutup"
    },
    beginnerGuide: {
      title: "Pertama Kali Main UNO? Mula Di Sini!",
      subtitle: "Kuasai asas dalam masa 2 minit. Mudah, pantas, dan menyeronokkan!",
      step1Title: "1. Objektif Utama",
      step1Desc: "Menjadi pemain pertama yang menghabiskan semua kad di tangan dengan memadankan kad teratas pada longgokan buangan mengikut Warna, Nombor, atau Simbol.",
      step2Title: "2. Cara Giliran Berjalan",
      step2Desc: "Lihat kad di atas timbunan buangan. Pada giliran anda, padankan kad mengikut:",
      step2RuleA: "Warna (cth: Merah atas Merah)",
      step2RuleB: "Nombor atau Simbol (cth: 7 atas 7, atau Skip atas Skip)",
      step2RuleC: "Kad Warna / Wild (membolehkan anda memilih antara 4 warna bila-bila masa!)",
      step3Title: "3. Tiada Kad Sesuai? Cabut Satu & Giliran Tamat",
      step3Desc: "Jika anda tiada kad yang sepadan di tangan, hanya cabut satu kad sahaja daripada dek. Sekiranya kad tersebut masih tidak boleh dimainkan, giliran anda tamat di situ—tidak dibenarkan mencabut kad berulang kali sehingga dapat!",
      step4Title: "4. Wajib Laung 'UNO!' Bila Tinggal 1 Kad",
      step4Desc: "Pusingan Digital: Tekan butang 'UNO' pada skrin sebelum meletakkan kad kedua terakhir anda. Pusingan Fizikal: Jerit 'UNO!' dengan kuat dan jelas sebaik sahaja kad anda tinggal sekeping di tangan! Denda: Ambil 2 kad penalti jika ditangkap sebelum giliran seterusnya.",
      step5Title: "5. Menang Pusingan",
      step5Desc: "Pemain pertama yang berjaya menghabiskan semua kad di tangan diisytiharkan sebagai pemenang! (Boleh tamatkan permainan menggunakan Kad Aksi!)"
    },
    matchExample: {
      title: "Contoh Visual Padanan Pantas",
      topCard: "Kad Semasa di Atas Meja:",
      playable: "✅ Kad Yang Boleh Diletak:",
      playableColor: "Merah 3 (Sama Warna)",
      playableNumber: "Biru 7 (Sama Nombor)",
      playableWild: "Kad Warna (Bebas pilih antara 4 warna)",
      notPlayable: "❌ Tidak Boleh Diletak:",
      notPlayableDesc: "Hijau 4 (Warna & Nombor Tidak Sama)"
    },
    playground: {
      badge: "Pentas Latihan Interaktif",
      title: "Latihan Peraturan UNO: Boleh Main Kad Ini?",
      subtitle: "Tekan mana-mana kad di tangan anda untuk menguji pergerakan sah atau tidak sah secara langsung!",
      tableCard: "Kad di Atas Meja",
      drawDeck: "Timbunan Cabutan (Tekan untuk Cabut)",
      yourHand: "Kad di Tangan Anda (Tekan untuk Main)",
      shuffleBtn: "🎲 Senario Baharu",
      resetBtn: "🔄 Set Semula Senario",
      initialPrompt: "👉 Tekan mana-mana kad di tangan anda di bawah untuk uji sama ada sah atau tidak!",
      drewCardMsg: "Kad telah dicabut! Semak sama ada ia boleh dimainkan atas kad semasa.",
      chooseColorTitle: "Pilih Warna Seterusnya",
      chooseColorDesc: "Kad Warna dimainkan! Pilih warna yang perlu dipadankan seterusnya:",
      colorRed: "Merah",
      colorYellow: "Kuning",
      colorGreen: "Hijau",
      colorBlue: "Biru",
      activeColorBadge: "Warna Semasa:",
      legalColorChoice: "Warna dipilih: {color}! Pergerakan seterusnya wajib memadan {color}.",
      cancelChoice: "✕ Batal (Simpan Kad)",
      chooseColorHint: "Memilih warna menentukan warna yang mesti dipadankan oleh lawan pada giliran seterusnya."
    },
    rulesTab: {
      title: "Peraturan & Etika (House Rules)",
      subtitle: "7 peraturan santai bagi memastikan kejohanan berjalan lancar, adil, dan menyeronokkan.",
      rule1Title: "1. Wajib Cakap 'UNO!' 🗣️",
      rule1Desc: "Pusingan Digital: Tekan butang 'UNO' pada skrin sebelum meletakkan kad kedua terakhir anda. Pusingan Fizikal: Jerit 'UNO!' dengan kuat dan jelas sebaik sahaja kad anda tinggal sekeping di tangan! Denda: Jika anda terlupa dan ditangkap oleh pemain lain sebelum pemain seterusnya membuat giliran, anda wajib mengambil 2 keping kad penalti. Mata kena sentiasa peka!",
      rule2Title: "2. Tiada Kad Sesuai? Cabut Satu & Giliran Tamat 🃏",
      rule2Desc: "Jika anda tiada kad yang sepadan di tangan, hanya cabut satu kad sahaja daripada dek. Sekiranya kad tersebut masih tidak boleh dimainkan, giliran anda tamat di situ—tidak dibenarkan mencabut kad berulang kali sehingga dapat.",
      rule3Title: "3. Satu Kad Sahaja Setiap Giliran ✋",
      rule3Desc: "Walaupun anda memegang kad yang sama (seperti dua keping Biru 7), setiap pemain hanya boleh memainkan satu kad sahaja bagi setiap giliran. Meletakkan pasangan atau beberapa kad serentak tidak dibenarkan.",
      rule4Title: "4. Tiada 'Stacking' (Terima Kad Denda Seadanya) 🛑",
      rule4Desc: "Penimbunan kad denda (stacking) tidak dibenarkan—pemain tidak boleh meletakkan +2 ke atas +2 lain (atau +4 ke atas +4) untuk memindahkan penalti kepada rakan sebelah. Jika anda dikenakan kad tersebut, ambil bilangan kad yang ditetapkan dan lepaskan giliran anda.",
      rule5Title: "5. Ambil Masa Berfikir, Tapi Pastikan Permainan Berjalan ⏳",
      rule5Desc: "Tiada pemasa pusingan yang ketat. Anda bebas menyusun strategi kemenangan, namun pastikan permainan kekal bergerak lancar supaya setiap meja menamatkan pusingan mengikut jadual.",
      rule6Title: "6. Boleh Tamatkan Permainan Menggunakan Kad Aksi! 🎉",
      rule6Desc: "Ingin menghabiskan kad terakhir dengan menggunakan kad Skip, Reverse, +2, atau Kad Warna / Wild? Boleh, tiada masalah! Kemenangan anda sah.",
      rule7Title: "7. Hormati Ketua Meja (Table Captain) & Pengadil 🤝",
      rule7Desc: "Setiap meja fizikal pada Pusingan 2 akan mempunyai Ketua Meja yang dilantik bagi memastikan permainan lancar dan adil. Sekiranya timbul sebarang keraguan atau pertikaian santai, keputusan Ketua Meja (atau Pengadil) adalah muktamad!"
    },
    cardEffects: {
      title: "Jenis Kad & Fungsi Dalam Permainan",
      subtitle: "Kesan khas kad semasa Pusingan 1 (1v1 Digital) berbanding Pusingan 2 & 3 (Meja Fizikal).",
      numberTitle: "Kad Nombor (0–9)",
      numberDesc: "Kad berwarna standard (Merah, Kuning, Hijau, Biru) yang dipadankan mengikut warna atau nombor yang sama.",
      skipTitle: "Kad Skip",
      skipDesc: "Pusingan 2 & 3: Giliran pemain seterusnya dibatalkan.\nPusingan 1 (1v1): Giliran pihak lawan dibatalkan; anda jalan sekali lagi serta-merta.",
      reverseTitle: "Kad Reverse",
      reverseDesc: "Pusingan 2 & 3: Menukar arah putaran giliran pemain.\nPusingan 1 (1v1): Berfungsi sama seperti kad Skip; anda jalan sekali lagi serta-merta.",
      draw2Title: "Kad Draw 2 (+2)",
      draw2Desc: "Pemain seterusnya wajib mengambil 2 keping kad dan hilang gilirannya (Tiada stacking dibenarkan).",
      colorCardTitle: "Kad Warna / Wild",
      colorCardDesc: "Boleh dimainkan atas mana-mana kad atau warna. Pemain bebas memilih warna pusingan seterusnya.",
      color4Title: "Kad Warna +4 / Wild Draw 4",
      color4Desc: "Pemain bebas memilih warna seterusnya; pemain seterusnya wajib mengambil 4 keping kad dan hilang giliran (Tiada stacking)."
    },
    scheduleTab: {
      title: "Jadual Acara & Atur Cara Penuh",
      subtitle: "90 minit permainan santai dan penuh semangat dari perlawanan digital ke pentas akhir.",
      r1Time: "3:00 PM – 3:15 PM (15 minit)",
      r1Stage: "Pendaftaran & Taklimat",
      r1Desc: "Berkumpul di Common Area, Aras 2, Hive 5, semakan sambungan Wi-Fi peranti, imbas panduan acara, dan pengagihan bilik perlawanan.",
      r2Time: "3:15 PM – 3:35 PM (20 minit)",
      r2Stage: "Pusingan 1 — 1v1 Digital",
      r2Desc: "30 pemain bertanding serentak dalam 15 perlawanan 1v1 di pelayar web (Best of 1). 15 pemenang mara ke pusingan seterusnya.",
      r3Time: "3:35 PM – 4:00 PM (25 minit)",
      r3Stage: "Pusingan 2 — Perlawanan Kad Fizikal",
      r3Desc: "15 pemain dibahagikan kepada 3 meja kad fizikal (5 pemain setiap meja). Pemenang setiap meja mara ke Pentas Akhir.",
      r4Time: "4:00 PM – 4:20 PM (20 minit)",
      r4Stage: "Pusingan 3 — Pentas Akhir",
      r4Desc: "3 finalis berentap di meja utama sambil disorak dan disokong oleh seluruh rakan sekerja.",
      r5Time: "4:20 PM – 4:30 PM (10 minit)",
      r5Stage: "Penyampaian Hadiah & Penutup",
      r5Desc: "Sesi penyampaian hadiah bagi tempat Pertama, Kedua, dan Ketiga, sesi bergambar, serta jamuan ringan.",
      consolationTitle: "☕ Meja Santai (Pilihan)",
      consolationDesc: "Pemain yang tersingkir pada Pusingan 1 dan Pusingan 2 dialu-alukan untuk menyertai meja kosong lain bagi terus bermain secara santai serta memberi sokongan kepada rakan sekerja yang lain!"
    },
    technicalSetup: {
      title: "Panduan Pemain & Persediaan Teknikal",
      subtitle: "Langkah pantas untuk masuk ke bilik perlawanan BuddyBoardGames.",
      platformTitle: "Platform Digital (Pusingan 1)",
      platformDesc: "Laman Web: buddyboardgames.com/uno • Keserasian: Boleh diakses terus menggunakan mana-mana pelayar web telefon pintar, tablet, atau komputer riba (Chrome, Safari, Edge, Firefox). Tiada pemasangan aplikasi atau pendaftaran akaun diperlukan. (Nota: Laman web mungkin mengandungi iklan. Pemasangan penyekat iklan adalah atas budi bicara sendiri).",
      stepsTitle: "Langkah Masuk Perlawanan (Step-by-Step)",
      step1: "1. Buka pelayar web pada peranti anda (pastikan bateri penuh) dan layari buddyboardgames.com/uno.",
      step2: "2. Masukkan nama panggilan (nickname) anda pada ruangan 'Your name' supaya urusetia dapat merekodkan keputusan perlawanan dengan tepat.",
      step3: "3. Masukkan nama bilik yang telah ditetapkan untuk anda (contoh: HR-Match-01 hingga HR-Match-15).",
      step4: "4. Klik 'Play Uno' dan tunggu lawan anda masuk ke bilik yang sama.",
      step5: "5. Main perlawanan anda (Best of 1). Selesai bermain, maklumkan pemenang perlawanan kepada meja urusetia.",
      practiceTitle: "Pilihan Latihan Sebelum Acara",
      practiceDesc: "Sesiapa yang ingin mencuba sebelum hari kejadian boleh melayari laman web tersebut, letak sebarang nama bilik percubaan, dan klik 'Play Uno'. Klik 'Play with Buddy' untuk berlatih secara solo menentang bot AI, atau klik 'Invite a buddy' untuk menyalin pautan bilik dan bermain bersama rakan sekerja!"
    },
    roomGenerator: {
      badge: "⚡ Alat Automasi",
      title: "Penjana Nama Bilik & Pautan Terus Automatik",
      subtitle: "Jana nama bilik perlawanan rasmi atau bilik latihan rawak secara pantas dengan pautan terus BuddyBoardGames.",
      matchSelectLabel: "Perlawanan Rasmi (Pusingan 1):",
      randomBtn: "🎲 Jana Bilik Rawak",
      officialBtn: "🏆 Perlawanan Rasmi Seterusnya",
      nameLabel: "Nama Panggilan (Pilihan):",
      namePlaceholder: "Masukkan nama (cth: Sarah, Razali)...",
      roomLabel: "Nama Bilik Aktif:",
      directLinkLabel: "Pautan Terus BuddyBoardGames (Telah Diisi):",
      launchBtn: "🚀 Masuk Bilik di BuddyBoardGames ➔",
      copyRoomBtn: "📋 Salin Nama Bilik",
      copyLinkBtn: "🔗 Salin Pautan Terus",
      copiedToast: "Disalin ke papan keratan! ✅",
      quickPicksLabel: "⚡ Pilihan Pantas Perlawanan (1 hingga 15):"
    },
    footer: {
      tagline: "Hari Penglibatan Oktober 2026: Panduan Rasmi Kejohanan & Permainan Santai. Win Together | Be the Change | Accelerate Impact.",
      status: "Hari Penglibatan Langsung • 28 Okt 2026",
      eventInfoTitle: "Logistik Acara",
      dateTime: "Rabu, 28 Okt 2026 • 3:00 PM – 4:30 PM (90 Minit)",
      venue: "Common Area, Aras 2, Hive 5, Bangunan MRANTI",
      format: "1v1 Digital → Pusingan Fizikal 5 Orang → Pentas Akhir",
      gameCentralTitle: "Pusat Permainan",
      linkGuide: "🕹️ Panduan Pemain & Pentas Latihan",
      linkRules: "📜 7 Syarat Santai & Etika",
      linkRoomGen: "⚡ Penjana Bilik Automatik",
      linkDesk: "🏆 Meja Kejohanan",
      linkBuddy: "BuddyBoardGames UNO ↗",
      proTipTitle: "Petua Strategi UNO",
      tipShuffleBtn: "🎲 Tukar Petua",
      copyright: "© 2026 Malaysian Research Accelerator for Technology and Innovation (MRANTI). Penglibatan Staf Dalaman.",
      builtBy: "Dianjurkan oleh Pembangunan Bakat | Sumber Manusia"
    },
    tournamentDesk: {
      badge: "Automasi Penganjur",
      title: "Meja Kejohanan: Daftar Masuk, Rawak & Kumpulan",
      subtitle: "Urus peserta, singkirkan mereka yang tidak hadir, rawakkan perlawanan 1v1 Pusingan 1, dan salurkan pemenang ke meja fizikal Pusingan 2.",
      stats: {
        registered: "Berdaftar",
        checkedIn: "Hadir (Sedia)",
        absent: "Tidak Hadir / Tiada",
        targetMatches: "Perlawanan Pusingan 1",
        statusEven: "✅ Padanan Genap Sedia",
        statusOdd: "🎁 1 Pemain Layak Automatik (BYE)"
      },
      roster: {
        title: "Senarai Pemain & Daftar Masuk",
        searchPlaceholder: "Cari pemain mengikut nama...",
        namePlaceholder: "Masukkan nama pemain...",
        addBtn: "+ Tambah Pemain",
        bulkToggle: "📝 Import Pukal / Tampal",
        bulkLabel: "Tampal nama (satu per baris):",
        bulkPlaceholder: "Tampal nama (satu per baris):\nAlice Tan\nBob Wong\nCharlie Lee",
        bulkImportBtn: "Import ke Senarai",
        checkAllBtn: "Tanda Hadir Semua",
        uncheckAllBtn: "Kosongkan Kehadiran",
        removeAllBtn: "🗑️ Padam Semua Pemain",
        resetBtn: "🔄 Tetap Semula ke 30 Asal",
        resetConfirm: "Tetapkan semula senarai peserta kepada 30 pemain asal?",
        checkedInTag: "Hadir",
        absentTag: "Tidak Hadir",
        deleteBtnTitle: "Keluarkan pemain dari senarai"
      },
      matches: {
        title: "Perlawanan Pusingan 1 & Bilik Digital",
        subtitle: "Lancarkan perlawanan di BuddyBoardGames dan klik pemenang untuk melayakkan mereka ke Pusingan 2.",
        randomizeBtn: "🎲 Rawak Perlawanan Pusingan 1",
        randomizeConfirm: "Perlawanan Pusingan 1 sudah wujud. Rawak semula untuk hasilkan padanan baharu?",
        copyBtn: "📋 Salin Padanan (WhatsApp/Teams)",
        copiedToast: "Senarai padanan disalin ke papan klip! 📋",
        printBtn: "🖨️ Cetak Paparan Meja",
        emptyPrompt: "Tiada perlawanan lagi. Sila sahkan kehadiran pemain di atas dan klik 'Rawak Perlawanan Pusingan 1'.",
        vs: "LWN",
        tableLabel: "Meja",
        launchRoomBtn: "Buka Bilik BBG ↗",
        selectWinnerPrompt: "Pilih Pemenang:",
        winnerWonSuffix: "Menang 👑",
        byeTitle: "🎁 Pas Percuma Pusingan 1 (BYE)",
        byeDesc: "Layak terus ke Meja Fizikal Pusingan 2 tanpa perlu bertanding di Pusingan 1 (diberikan secara rawak akibat bilangan peserta ganjil)."
      },
      round2: {
        title: "Pusingan 2 Meja Kad Fizikal",
        subtitle: "Pemenang Pusingan 1 akan mengisi meja perlawanan fizikal secara automatik.",
        qualifiersBadge: "Pemain Layak",
        tableAlpha: "Meja Alpha (Kumpulan 1)",
        tableBeta: "Meja Beta (Kumpulan 2)",
        tableGamma: "Meja Gamma (Kumpulan 3)",
        tableDelta: "Meja Delta (Kumpulan 4)",
        slotEmpty: "Menunggu Pemenang Pusingan 1..."
      },
      lockBar: {
        lockedTitle: "Kawalan Penganjur: Dilindungi",
        lockedDesc: "Pengubahsuaian perlawanan, pemenang, dan roster dikunci untuk elak salah tekan. Kongsi tab 'Jadual Perlawanan' dengan peserta.",
        unlockBtn: "🔓 Buka Kunci Penganjur",
        unlockedTitle: "Kawalan Penganjur: Aktif",
        unlockedDesc: "Anda kini boleh menyusun perlawanan, mencatat pemenang, dan mengurus peserta.",
        lockBtn: "🔒 Kunci Kawalan"
      },
      grandFinal: {
        badge: "Pusingan 3 Pentas Akhir",
        title: "Pusingan 3: Pentas Akhir & Podium Kejuaraan",
        subtitle: "Pilih 1 pemenang bagi setiap meja pusingan 2 di atas untuk mara ke sini. Selepas perlawanan akhir selesai, tetapkan tempat pertama, kedua, dan ketiga.",
        crownWinnerBtn: "👑 Pilih Pemenang",
        crownedBadge: "👑 Juara Kumpulan",
        uncrownBtn: "↩️ Tukar",
        resetBtn: "🔄 Set Semula Keputusan Akhir",
        resetConfirm: "Set semula semua kedudukan podium Pentas Akhir dan pemenang kumpulan?",
        assignPrompt: "Tetapkan Kedudukan Podium:",
        firstPlaceBtn: "🥇 Tempat Pertama (Juara)",
        secondPlaceBtn: "🥈 Tempat Ke-2",
        thirdPlaceBtn: "🥉 Tempat Ke-3",
        fourthPlaceBtn: "🎖️ Tempat Ke-4",
        pendingFinalists: "Menunggu pemenang meja Pusingan 2 untuk layak...",
        tableTitle: "Meja Perlawanan Akhir Kejuaraan",
        heatTableLabel: "Juara Kumpulan:"
      }
    },
    publicMatchups: {
      badge: "Jadual Perlawanan Langsung",
      title: "Jadual Perlawanan Pusingan 1 & Bilik Digital",
      subtitle: "Cari nombor meja dan lawan anda. Klik 'Buka Bilik BBG' untuk terus masuk ke bilik perlawanan anda.",
      safeNotice: "🛡️ Paparan Peserta Sahaja — Klik butang meja untuk mula bermain!",
      searchPlaceholder: "Cari nama anda untuk lihat meja (cth: Noorfaizal)...",
      shareBtn: "🔗 Salin Pautan Jadual",
      emptyPrompt: "Jadual perlawanan Pusingan 1 belum dijana lagi. Sila tunggu penganjur memulakan pusingan.",
      statusInProgress: "⏳ Sedang Berlangsung • Best of 1",
      statusWinner: "🏆 Pemenang:",
      advancesTag: "Mara ke Pusingan 2 ➔",
      tableLabel: "Meja",
      launchRoomBtn: "Buka Bilik BBG ↗",
      vs: "LWN",
      round2Title: "Pusingan 2: Meja Kad Fizikal",
      round2Subtitle: "Pemenang Pusingan 1 akan mengisi Meja Alpha, Beta, Gamma (dan Delta) secara automatik.",
      grandFinalBadge: "Pusingan 3 Pentas Akhir",
      grandFinalTitle: "🏆 Pentas Akhir & Kedudukan Rasmi Kejohanan",
      grandFinalDesc: "Juara dari setiap meja kad fizikal Pusingan 2 mara ke perlawanan akhir ini! Lihat peserta akhir dan kedudukan rasmi kejohanan di bawah.",
      finalTableTitle: "👑 Meja Perlawanan Akhir Kejuaraan",
      podiumTitle: "Podium Kejuaraan Rasmi",
      standingsTitle: "Kedudukan Rasmi Kejohanan",
      championLabel: "Juara Keseluruhan",
      runnerUpLabel: "Naib Juara",
      thirdPlaceLabel: "Tempat Ketiga",
      fourthPlaceLabel: "Tempat Keempat",
      awaitingWinner: "Menunggu Keputusan Kumpulan...",
      rankCol: "Kedudukan",
      playerCol: "Peserta",
      deptCol: "Jabatan",
      accoladeCol: "Gelaran / Keputusan",
      statusCol: "Status",
      statusCrowned: "🏆 Ditetapkan",
      statusFinalist: "⭐ Peserta Akhir",
      statusPending: "⏳ Sedang Berlangsung",
      standingsPendingNote: "Kedudukan akhir akan dikemas kini serta-merta sebaik sahaja perlawanan tamat."
    },
    auth: {
      adminLogin: "Log Masuk Penganjur",
      organizerActive: "👑 Mod Penganjur",
      logout: "Keluar / Tetamu",
      adminBadge: "Meja Admin",
      modalTitle: "Log Masuk Meja Penganjur",
      modalSubtitle: "Masukkan maklumat penganjur untuk mengakses meja kejohanan, rawakkan perlawanan dan rekod pemenang. Disimpan secara setempat dalam pelayar anda.",
      usernameLabel: "Nama Pengguna",
      passwordLabel: "Kata Laluan",
      loginBtn: "Log Masuk ke Meja 🚀",
      cancelBtn: "Teruskan sebagai Tetamu",
      localNote: "🔒 Tiada pangkalan data diperlukan. Pengesahan setempat pada peranti anda. Lalai: admin / uno2026",
      deskBannerTitle: "Sesi Penganjur Disahkan",
      deskBannerSub: "Sesi pelayar setempat aktif. Hanya anda yang boleh melihat meja ini.",
      switchToGuest: "👁️ Beralih ke Paparan Tetamu"
    }
  }
};

let currentLang = 'en';

// Tournament Desk Reactive State
export let tournamentState = typeof window !== 'undefined' ? loadTournamentState() : loadTournamentState(null);

// Playground State
let currentScenarioIdx = 0;
let activeTableCard = { ...SCENARIOS[0].target };
let currentHand = SCENARIOS[0].hand.map(c => ({ ...c }));

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
  if (searchInput && dict.search) {
    searchInput.placeholder = dict.search.placeholder;
  }

  const genNameInput = document.getElementById('genPlayerNameInput');
  if (genNameInput && dict.roomGenerator) {
    genNameInput.placeholder = dict.roomGenerator.namePlaceholder;
  }

  // Update Tournament Desk Placeholders
  const deskDict = dict.tournamentDesk;
  if (deskDict) {
    const pNameInput = document.getElementById('deskPlayerNameInput');
    if (pNameInput) pNameInput.placeholder = deskDict.roster.namePlaceholder;

    const rosterSearchInput = document.getElementById('deskRosterSearch');
    if (rosterSearchInput) rosterSearchInput.placeholder = deskDict.roster.searchPlaceholder;

    const bulkTextarea = document.getElementById('deskBulkTextarea');
    if (bulkTextarea) bulkTextarea.placeholder = deskDict.roster.bulkPlaceholder;
  }

  const publicSearchInput = document.getElementById('publicMatchupsSearch');
  if (publicSearchInput && dict.publicMatchups) {
    publicSearchInput.placeholder = dict.publicMatchups.searchPlaceholder;
  }

  if (document.getElementById('searchResults')) {
    renderSearchResults();
  }
  renderPlayground();
  if (typeof refreshRoomGeneratorDisplays === 'function') {
    refreshRoomGeneratorDisplays();
  }
  if (typeof renderFooterTip === 'function') {
    renderFooterTip();
  }
  if (typeof renderTournamentDesk === 'function') {
    renderTournamentDesk();
  }
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

// Realistic UNO Card HTML Generator (Matches Authentic UNO Deck Reference)
export function createCardElementHtml(card, customClass = '') {
  const isColorCard = card.color === 'wild' && card.value === 'wild';
  const isColorPlus4 = card.color === 'wild' && card.value === '+4';
  const isUnderlined = card.value === '6' || card.value === '9';

  let centerContent = '';
  let pipTopLeft = '';
  let pipBottomRight = '';

  if (isColorCard) {
    // Authentic Color Card: Clean White Oval in center, 4-Color corner pips
    centerContent = '';
    pipTopLeft = '<span class="wild-quad-pip" aria-hidden="true"></span>';
    pipBottomRight = '<span class="wild-quad-pip" aria-hidden="true"></span>';
  } else if (isColorPlus4) {
    // Authentic Color +4 Card: 4 overlapping fanned cards in center, +4 in corners
    centerContent = `
      <div class="wild-stack-visual" aria-hidden="true">
        <span class="mini-uno-card mini-card-green"></span>
        <span class="mini-uno-card mini-card-blue"></span>
        <span class="mini-uno-card mini-card-red"></span>
        <span class="mini-uno-card mini-card-yellow"></span>
      </div>
    `;
    pipTopLeft = '+4';
    pipBottomRight = '+4';
  } else {
    // Number or Action Cards: Bold white with black drop stroke
    const displayVal = getCardDisplayGlyph(card.value);
    const underlineClass = isUnderlined ? ' card-underlined' : '';
    centerContent = `<span class="card-center-val${underlineClass}">${displayVal}</span>`;
    pipTopLeft = `<span class="${underlineClass}">${displayVal}</span>`;
    pipBottomRight = `<span class="${underlineClass}">${displayVal}</span>`;
  }

  const isHandCard = customClass.includes('hand-card-item');
  const roleAttr = isHandCard ? `role="button" tabindex="0" aria-label="Play ${card.color} ${card.value}"` : '';

  return `
    <div class="uno-card card-color-${card.color} ${customClass}" ${roleAttr} data-id="${card.id || ''}" data-color="${card.color}" data-value="${card.value}">
      <div class="card-face">
        <span class="card-pip pip-top-left">${pipTopLeft}</span>
        <div class="card-center-oval">
          ${centerContent}
        </div>
        <span class="card-pip pip-bottom-right">${pipBottomRight}</span>
      </div>
    </div>
  `;
}

function getCardDisplayGlyph(val) {
  if (val === 'skip') return '🚫';
  if (val === 'reverse') return '⇄';
  if (val === 'wild') return '🌈';
  if (val === '+4') return '+4';
  if (val === '+2') return '+2';
  return val;
}

// Render Table Playground
export function renderPlayground() {
  const activeDiscardEl = document.getElementById('activeDiscardPile');
  const handDockEl = document.getElementById('playerHandDock');
  if (!activeDiscardEl || !handDockEl) return;

  const dict = TRANSLATIONS[currentLang];

  // Render Table Active Card
  let activeCardHtml = createCardElementHtml(activeTableCard, 'table-target-card');
  if (activeTableCard.color === 'wild' && activeTableCard.chosenColor) {
    const colorKey = `color${activeTableCard.chosenColor.charAt(0).toUpperCase() + activeTableCard.chosenColor.slice(1)}`;
    const colorLabel = dict.playground[colorKey] || activeTableCard.chosenColor.toUpperCase();
    activeCardHtml += `
      <div class="active-color-badge">
        <span class="color-dot dot-${activeTableCard.chosenColor}"></span>
        <span>${dict.playground.activeColorBadge} <strong>${colorLabel}</strong></span>
      </div>
    `;
  }
  activeDiscardEl.innerHTML = activeCardHtml;

  // Render Hand Cards
  handDockEl.innerHTML = currentHand.map(c => createCardElementHtml(c, 'hand-card-item')).join('');

  // Attach card click & keyboard handlers
  handDockEl.querySelectorAll('.uno-card').forEach(cardEl => {
    const playCard = () => {
      const cardId = cardEl.getAttribute('data-id');
      const card = currentHand.find(c => c.id === cardId);
      if (card) {
        handleCardPlay(card, cardEl);
      }
    };

    cardEl.addEventListener('click', playCard);
    cardEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playCard();
      }
    });
  });
}

let pendingWildCard = null;

export function handleCardPlay(card, cardEl) {
  const banner = document.getElementById('playFeedbackBanner');
  const result = getPlayReason(card, activeTableCard, currentLang);

  if (!result.success) {
    // Illegal Move
    if (cardEl) {
      cardEl.classList.remove('shake-card');
      void cardEl.offsetWidth; // trigger reflow
      cardEl.classList.add('shake-card');
    }

    if (banner) {
      banner.className = 'play-feedback-banner feedback-illegal';
      banner.textContent = `❌ ${result.message}`;
    }
    return;
  }

  // If Color Card or Color +4, user must choose among 4 colors
  if (card.color === 'wild') {
    pendingWildCard = card;
    const overlay = document.getElementById('colorPickerOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
    }
    if (banner) {
      banner.className = 'play-feedback-banner feedback-legal';
      banner.textContent = `🎯 ${result.message}`;
    }
    return;
  }

  // Normal Playable Move
  activeTableCard = { ...card };
  currentHand = currentHand.filter(c => c.id !== card.id);

  if (banner) {
    banner.className = 'play-feedback-banner feedback-legal';
    banner.textContent = `✅ ${result.message}`;
  }

  renderPlayground();
}

export function handleColorSelection(chosenColor) {
  if (!pendingWildCard) return;

  const overlay = document.getElementById('colorPickerOverlay');
  if (overlay) {
    overlay.style.display = 'none';
  }

  activeTableCard = {
    ...pendingWildCard,
    chosenColor: chosenColor
  };
  currentHand = currentHand.filter(c => c.id !== pendingWildCard.id);
  pendingWildCard = null;

  const dict = TRANSLATIONS[currentLang];
  const colorKey = `color${chosenColor.charAt(0).toUpperCase() + chosenColor.slice(1)}`;
  const colorLabel = dict.playground[colorKey] || chosenColor.toUpperCase();
  const banner = document.getElementById('playFeedbackBanner');

  if (banner) {
    banner.className = 'play-feedback-banner feedback-legal';
    const msgTemplate = dict.playground.legalColorChoice || "Color chosen: {color}! Next play must match {color}.";
    banner.textContent = `✅ ${msgTemplate.replace(/\{color\}/g, colorLabel.toUpperCase())}`;
  }

  renderPlayground();
}

export function cancelColorSelection() {
  const overlay = document.getElementById('colorPickerOverlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
  pendingWildCard = null;

  const banner = document.getElementById('playFeedbackBanner');
  const dict = TRANSLATIONS[currentLang];
  if (banner) {
    banner.className = 'play-feedback-banner';
    banner.textContent = dict.playground.initialPrompt;
  }
}

export function handleDrawCard() {
  const randomCard = DRAW_POOL[Math.floor(Math.random() * DRAW_POOL.length)];
  const newCard = {
    ...randomCard,
    id: 'd_' + Date.now() + Math.random().toString(36).substring(2, 6)
  };
  currentHand.push(newCard);

  const banner = document.getElementById('playFeedbackBanner');
  const dict = TRANSLATIONS[currentLang];
  if (banner) {
    banner.className = 'play-feedback-banner';
    banner.textContent = `📥 ${dict.playground.drewCardMsg}`;
  }

  renderPlayground();
}

export function shuffleScenario() {
  currentScenarioIdx = (currentScenarioIdx + 1) % SCENARIOS.length;
  resetScenario();
}

export function resetScenario() {
  const scenario = SCENARIOS[currentScenarioIdx];
  activeTableCard = { ...scenario.target };
  currentHand = scenario.hand.map(c => ({ ...c }));
  pendingWildCard = null;

  const overlay = document.getElementById('colorPickerOverlay');
  if (overlay) {
    overlay.style.display = 'none';
  }

  const banner = document.getElementById('playFeedbackBanner');
  const dict = TRANSLATIONS[currentLang];
  if (banner) {
    banner.className = 'play-feedback-banner';
    banner.textContent = dict.playground.initialPrompt;
  }

  renderPlayground();
}

// ==========================================================================
// Automated Room Generator & Direct Join Links for BuddyBoardGames UNO
// ==========================================================================
export let activeGenMatchIndex = 1;
export let activeGenRoomName = 'HR-Match-01';
export let activeGenPlayerName = '';

export function buildBuddyBoardGamesUrl(roomName, playerName = '') {
  const cleanRoom = (roomName || '').trim();
  if (!cleanRoom) return 'https://buddyboardgames.com/uno';

  let b64Room;
  try {
    b64Room = btoa(unescape(encodeURIComponent(cleanRoom)));
  } catch (e) {
    b64Room = btoa(cleanRoom);
  }
  let url = `https://buddyboardgames.com/uno?room=${encodeURIComponent(b64Room)}`;

  const cleanPlayer = (playerName || '').trim();
  if (cleanPlayer) {
    let b64Player;
    try {
      b64Player = btoa(unescape(encodeURIComponent(cleanPlayer)));
    } catch (e) {
      b64Player = btoa(cleanPlayer);
    }
    url += `&name=${encodeURIComponent(b64Player)}`;
  }
  return url;
}

export function generateRandomRoomName() {
  const prefixes = ['HR-UNO', 'UNO-CHAMP', 'UNO-HEAT', 'HR-SPARK', 'UNO-STRIKE', 'UNO-BLAZE'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${prefix}-${num}`;
}

export function copyTextToClipboard(text, btnEl, originalKey) {
  if (!text) return;
  const dict = TRANSLATIONS[currentLang];
  const successMsg = dict.roomGenerator?.copiedToast || 'Copied! ✅';

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => {
      fallbackCopyText(text);
    });
  } else {
    fallbackCopyText(text);
  }

  if (typeof showToast === 'function') {
    showToast(successMsg, '📋', 2000);
  }

  if (btnEl) {
    const origText = btnEl.textContent;
    btnEl.textContent = successMsg;
    btnEl.classList.add('copied-success');
    setTimeout(() => {
      const currentDict = TRANSLATIONS[currentLang];
      btnEl.textContent = currentDict.roomGenerator?.[originalKey] || origText;
      btnEl.classList.remove('copied-success');
    }, 1800);
  }
}

function fallbackCopyText(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
  } catch (err) {}
  document.body.removeChild(textarea);
}

export function renderRoomGeneratorPills() {
  const pillsContainer = document.getElementById('quickMatchPills');
  if (!pillsContainer) return;

  pillsContainer.innerHTML = Array.from({ length: 15 }, (_, i) => {
    const matchNum = i + 1;
    const isActive = activeGenMatchIndex === matchNum;
    return `<button type="button" class="match-quick-pill ${isActive ? 'active' : ''}" data-match="${matchNum}">M-${matchNum}</button>`;
  }).join('');

  pillsContainer.querySelectorAll('.match-quick-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const matchNum = parseInt(pill.getAttribute('data-match'), 10);
      selectOfficialMatch(matchNum);
    });
  });
}

export function selectOfficialMatch(matchNum) {
  activeGenMatchIndex = matchNum;
  activeGenRoomName = `HR-Match-${String(matchNum).padStart(2, '0')}`;
  refreshRoomGeneratorDisplays();
}

export function refreshRoomGeneratorDisplays() {
  const roomDisplay = document.getElementById('genRoomNameDisplay');
  const linkDisplay = document.getElementById('genDirectLinkDisplay');
  const launchBtn = document.getElementById('genLaunchDirectBtn');
  const playerInput = document.getElementById('genPlayerNameInput');

  if (playerInput) {
    activeGenPlayerName = playerInput.value;
  }

  const directUrl = buildBuddyBoardGamesUrl(activeGenRoomName, activeGenPlayerName);

  if (roomDisplay) {
    roomDisplay.value = activeGenRoomName;
  }
  if (linkDisplay) {
    linkDisplay.value = directUrl;
  }
  if (launchBtn) {
    launchBtn.href = directUrl;
  }

  // Update pills active state
  document.querySelectorAll('#quickMatchPills .match-quick-pill').forEach(pill => {
    const matchNum = parseInt(pill.getAttribute('data-match'), 10);
    if (activeGenMatchIndex === matchNum) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });
}

export function setupRoomGeneratorEvents() {
  renderRoomGeneratorPills();
  refreshRoomGeneratorDisplays();

  const playerInput = document.getElementById('genPlayerNameInput');
  if (playerInput) {
    playerInput.addEventListener('input', () => {
      refreshRoomGeneratorDisplays();
    });
  }

  const nextOfficialBtn = document.getElementById('genNextOfficialBtn');
  if (nextOfficialBtn) {
    nextOfficialBtn.addEventListener('click', () => {
      const nextMatch = ((activeGenMatchIndex || 0) % 15) + 1;
      selectOfficialMatch(nextMatch);
    });
  }

  const randomRoomBtn = document.getElementById('genRandomRoomBtn');
  if (randomRoomBtn) {
    randomRoomBtn.addEventListener('click', () => {
      activeGenMatchIndex = null;
      activeGenRoomName = generateRandomRoomName();
      refreshRoomGeneratorDisplays();
    });
  }

  const copyRoomBtn = document.getElementById('copyRoomNameBtn');
  if (copyRoomBtn) {
    copyRoomBtn.addEventListener('click', () => {
      copyTextToClipboard(activeGenRoomName, copyRoomBtn, 'copyRoomBtn');
    });
  }

  const copyLinkBtn = document.getElementById('copyDirectLinkBtn');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      const url = buildBuddyBoardGamesUrl(activeGenRoomName, activeGenPlayerName);
      copyTextToClipboard(url, copyLinkBtn, 'copyLinkBtn');
    });
  }
}

// Strategy Pro-Tips for Footer
export const PRO_TIPS = {
  en: [
    {
      badge: "🎉 Legal Finishes",
      tip: "Ending on an Action Card: Finishing your hand on a Skip, Reverse, Draw 2, or Color Card is 100% legal! Save a power card for your final blow."
    },
    {
      badge: "🗣️ Call 'UNO!'",
      tip: "Shout 'UNO!' the moment you hold 1 card! If an opponent catches you before the next person plays, you must draw 2 penalty cards."
    },
    {
      badge: "⚡ 1v1 Digital Twist",
      tip: "In Round 1 (1v1), Reverse cards act as Skip cards, allowing you to play another card immediately!"
    },
    {
      badge: "🛑 Strictly No Stacking",
      tip: "Stacking is banned! If someone hits you with a +2 or +4, you must take the cards and forfeit your turn."
    },
    {
      badge: "🃏 Draw 1 & Pass",
      tip: "No playable card? Draw just 1 card from the deck. If it doesn't match, your turn ends immediately without digging further."
    }
  ],
  bm: [
    {
      badge: "🎉 Kemenangan Sah",
      tip: "Menamatkan Kad Aksi: Menghabiskan kad terakhir dengan Skip, Reverse, Draw 2, atau Kad Warna adalah 100% sah! Simpan kad kuasa untuk langkah akhir."
    },
    {
      badge: "🗣️ Laung 'UNO!'",
      tip: "Jerit 'UNO!' sebaik tinggal 1 kad! Jika dikesan lawan sebelum giliran seterusnya, anda dikenakan penalti cabut 2 kad."
    },
    {
      badge: "⚡ Kelainan 1v1 Digital",
      tip: "Dalam Pusingan 1 (1v1), kad Reverse bertindak sebagai Skip, membolehkan anda bermain sekali lagi secara terus!"
    },
    {
      badge: "🛑 Tiada 'Stacking'",
      tip: "'Stacking' dilarang sama sekali! Jika dikenakan +2 atau +4, anda mesti ambil kad dan giliran anda dibatalkan."
    },
    {
      badge: "🃏 Cabut 1 Kad Sahaja",
      tip: "Tiada kad sesuai? Cabut 1 kad sahaja. Jika masih tidak sepadan, giliran tamat tanpa perlu cabut berulang kali."
    }
  ]
};

let currentTipIndex = 0;

export function renderFooterTip() {
  const badgeEl = document.getElementById('footerTipBadge');
  const textEl = document.getElementById('footerTipText');
  if (!badgeEl || !textEl) return;

  const tips = PRO_TIPS[currentLang] || PRO_TIPS.en;
  const item = tips[currentTipIndex % tips.length];
  badgeEl.textContent = item.badge;
  textEl.textContent = item.tip;
}

export function shuffleFooterTip() {
  const tips = PRO_TIPS[currentLang] || PRO_TIPS.en;
  currentTipIndex = (currentTipIndex + 1) % tips.length;
  const card = document.getElementById('footerTipCard');
  if (card) {
    card.style.opacity = '0.3';
    card.style.transform = 'translateY(2px)';
    setTimeout(() => {
      renderFooterTip();
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 120);
  } else {
    renderFooterTip();
  }
}

// Official Poster Lightbox Modal Functions (Global & Resilient)
export function openPosterModal(posterType = 'announcement') {
  const posterModalOverlay = document.getElementById('posterModalOverlay');
  if (posterModalOverlay) {
    posterModalOverlay.style.display = 'flex';
    posterModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    switchPosterTab(posterType);
  }
}

export function closePosterModal() {
  const posterModalOverlay = document.getElementById('posterModalOverlay');
  if (posterModalOverlay) {
    posterModalOverlay.style.display = 'none';
    posterModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

export function switchPosterTab(posterType) {
  const activePosterImg = document.getElementById('activePosterImg');
  const downloadPosterBtn = document.getElementById('downloadPosterBtn');
  const posterTabs = document.querySelectorAll('.poster-tab-btn');

  posterTabs.forEach(tab => {
    tab.classList.toggle('active', tab.getAttribute('data-poster') === posterType);
  });

  if (posterType === 'guidelines') {
    if (activePosterImg) {
      activePosterImg.src = 'official-guidelines.jpg';
      activePosterImg.alt = 'Official UNO Event Guidelines Poster';
    }
    if (downloadPosterBtn) {
      downloadPosterBtn.href = 'official-guidelines.jpg';
      downloadPosterBtn.download = 'UNO-Guidelines-Poster.jpg';
    }
  } else {
    if (activePosterImg) {
      activePosterImg.src = 'official-poster.jpg';
      activePosterImg.alt = 'Official UNO Event Announcement Poster';
    }
    if (downloadPosterBtn) {
      downloadPosterBtn.href = 'official-poster.jpg';
      downloadPosterBtn.download = 'UNO-Engagement-Day-Poster.jpg';
    }
  }
}

// ==========================================================================
// Interactive Custom Dialogs & Toast Notifications System
// ==========================================================================
let activeDialogResolve = null;

export function showCustomConfirm({
  icon = '⚠️',
  kicker = 'Confirmation',
  title = 'Are you sure?',
  message = '',
  note = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary'
} = {}) {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      return resolve(true);
    }
    const overlay = document.getElementById('customDialogOverlay');
    if (!overlay) {
      const fallback = typeof window !== 'undefined' && window.confirm ? window.confirm(message || title) : true;
      return resolve(fallback);
    }

    activeDialogResolve = resolve;

    const iconEl = document.getElementById('customDialogIcon');
    const bubbleEl = document.getElementById('customDialogIconBubble');
    const kickerEl = document.getElementById('customDialogKicker');
    const titleEl = document.getElementById('customDialogTitle');
    const msgEl = document.getElementById('customDialogMessage');
    const noteEl = document.getElementById('customDialogNote');
    const cancelBtn = document.getElementById('customDialogCancelBtn');
    const confirmBtn = document.getElementById('customDialogConfirmBtn');
    const closeX = document.getElementById('customDialogCloseX');

    if (iconEl) iconEl.textContent = icon;
    if (bubbleEl) bubbleEl.className = `dialog-icon-bubble variant-${confirmVariant}`;
    if (kickerEl) kickerEl.textContent = kicker;
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    if (noteEl) {
      if (note) {
        noteEl.innerHTML = note;
        noteEl.style.display = 'block';
      } else {
        noteEl.style.display = 'none';
      }
    }

    if (cancelBtn) {
      cancelBtn.style.display = 'inline-flex';
      cancelBtn.textContent = cancelText;
    }
    if (confirmBtn) {
      confirmBtn.textContent = confirmText;
      confirmBtn.className = `dialog-btn dialog-btn-confirm btn-variant-${confirmVariant}`;
    }

    overlay.style.display = 'flex';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      if (confirmBtn) confirmBtn.focus();
    }, 40);

    function cleanup(res) {
      overlay.classList.remove('active');
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
      if (activeDialogResolve) {
        const cb = activeDialogResolve;
        activeDialogResolve = null;
        cb(res);
      }
    }

    function handleKey(e) {
      if (e.key === 'Escape') {
        cleanup(false);
      }
    }

    document.addEventListener('keydown', handleKey);

    if (cancelBtn) cancelBtn.onclick = () => cleanup(false);
    if (closeX) closeX.onclick = () => cleanup(false);
    if (confirmBtn) confirmBtn.onclick = () => cleanup(true);
    overlay.onclick = (e) => {
      if (e.target === overlay) cleanup(false);
    };
  });
}

export function showCustomAlert({
  icon = 'ℹ️',
  kicker = 'Notice',
  title = 'Attention',
  message = '',
  note = '',
  buttonText = 'Got it',
  variant = 'primary'
} = {}) {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      return resolve();
    }
    const overlay = document.getElementById('customDialogOverlay');
    if (!overlay) {
      if (typeof window !== 'undefined' && window.alert) window.alert(message || title);
      return resolve();
    }

    activeDialogResolve = resolve;

    const iconEl = document.getElementById('customDialogIcon');
    const bubbleEl = document.getElementById('customDialogIconBubble');
    const kickerEl = document.getElementById('customDialogKicker');
    const titleEl = document.getElementById('customDialogTitle');
    const msgEl = document.getElementById('customDialogMessage');
    const noteEl = document.getElementById('customDialogNote');
    const cancelBtn = document.getElementById('customDialogCancelBtn');
    const confirmBtn = document.getElementById('customDialogConfirmBtn');
    const closeX = document.getElementById('customDialogCloseX');

    if (iconEl) iconEl.textContent = icon;
    if (bubbleEl) bubbleEl.className = `dialog-icon-bubble variant-${variant}`;
    if (kickerEl) kickerEl.textContent = kicker;
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    if (noteEl) {
      if (note) {
        noteEl.innerHTML = note;
        noteEl.style.display = 'block';
      } else {
        noteEl.style.display = 'none';
      }
    }

    if (cancelBtn) cancelBtn.style.display = 'none';
    if (confirmBtn) {
      confirmBtn.textContent = buttonText;
      confirmBtn.className = `dialog-btn dialog-btn-confirm btn-variant-${variant}`;
    }

    overlay.style.display = 'flex';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      if (confirmBtn) confirmBtn.focus();
    }, 40);

    function cleanup() {
      overlay.classList.remove('active');
      overlay.style.display = 'none';
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
      if (activeDialogResolve) {
        const cb = activeDialogResolve;
        activeDialogResolve = null;
        cb();
      }
    }

    function handleKey(e) {
      if (e.key === 'Escape' || e.key === 'Enter') {
        cleanup();
      }
    }

    document.addEventListener('keydown', handleKey);

    if (closeX) closeX.onclick = () => cleanup();
    if (confirmBtn) confirmBtn.onclick = () => cleanup();
    overlay.onclick = (e) => {
      if (e.target === overlay) cleanup();
    };
  });
}

export function showToast(message, icon = '✅', durationMs = 2800) {
  if (typeof document === 'undefined') return;
  let container = document.getElementById('appToastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'appToastContainer';
    container.className = 'app-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'app-toast';
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-message">${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 220);
  }, durationMs);
}

// State flag for Organizer Controls Protection
export let isDeskOrganizerUnlocked = false;

export async function ensureOrganizerUnlocked() {
  if (isDeskOrganizerUnlocked) return true;
  const isBM = currentLang === 'bm';
  const confirmed = await showCustomConfirm({
    icon: '🔒',
    kicker: isBM ? 'Kawalan Penganjur Dikunci' : 'Organizer Mode Locked',
    title: isBM ? 'Buka Kunci Mod Penganjur?' : 'Unlock Organizer Controls?',
    message: isBM
      ? 'Meja Kejohanan dilindungi daripada salah tekan. Sila buka kunci untuk menyusun perlawanan, memilih pemenang atau mengurus peserta.'
      : 'Tournament Desk is locked to protect tournament arrangement from accidental clicks. Unlock organizer editing controls now?',
    confirmText: isBM ? 'Buka Kunci Sekarang 🔓' : 'Unlock Controls 🔓',
    cancelText: isBM ? 'Kekalkan Berkunci' : 'Keep Locked',
    confirmVariant: 'primary'
  });
  if (confirmed) {
    isDeskOrganizerUnlocked = true;
    renderTournamentDesk();
    showToast(isBM ? 'Kawalan penganjur dibuka! 🔓' : 'Organizer controls unlocked! 🔓', '🔓');
    return true;
  }
  return false;
}

// ==========================================================================
// Participant-Facing Live Matchups Controller (Read-Only & Interactive)
// ==========================================================================
export function renderPublicMatchups() {
  if (!tournamentState || typeof document === 'undefined') return;
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const pmDict = dict.publicMatchups || TRANSLATIONS.en.publicMatchups;
  const deskDict = dict.tournamentDesk || TRANSLATIONS.en.tournamentDesk;

  // 1. BYE Notice
  const byeNoticeEl = document.getElementById('publicByeNotice');
  if (byeNoticeEl) {
    if (tournamentState.round1?.byePlayer) {
      const bp = tournamentState.round1.byePlayer;
      const isBM = currentLang === 'bm';
      byeNoticeEl.style.display = 'flex';
      byeNoticeEl.innerHTML = `
        <div class="bye-icon-bubble" aria-hidden="true">🎁</div>
        <div class="bye-body">
          <div class="bye-header-row">
            <span class="bye-badge">${deskDict.matches.byeTitle}</span>
            <span class="bye-status-pill">✓ ${isBM ? 'Layak Terus Pusingan 2' : 'Direct Round 2 Qualifier'}</span>
          </div>
          <div class="bye-player-name-row">
            <h4 class="bye-player-name">${bp.name}</h4>
            <span class="bye-dept-chip">${bp.dept || 'Talent Development'}</span>
          </div>
          <p class="bye-content bye-desc-text">
            ${deskDict.matches.byeDesc}
          </p>
        </div>
      `;
    } else {
      byeNoticeEl.style.display = 'none';
      byeNoticeEl.innerHTML = '';
    }
  }

  // 2. Public Matches Grid
  const publicMatchesGrid = document.getElementById('publicMatchesGrid');
  const searchInput = document.getElementById('publicMatchupsSearch');
  const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
  const matches = tournamentState.round1?.matches || [];

  if (publicMatchesGrid) {
    if (matches.length === 0) {
      publicMatchesGrid.innerHTML = `
        <div class="desk-empty-state">${pmDict.emptyPrompt}</div>
      `;
    } else {
      publicMatchesGrid.innerHTML = matches.map(m => {
        const p1Won = m.winnerId === m.player1.id;
        const p2Won = m.winnerId === m.player2.id;
        const winner = p1Won ? m.player1 : (p2Won ? m.player2 : null);
        const isMatchSearch = query && (
          (m.player1.name || '').toLowerCase().includes(query) ||
          (m.player2.name || '').toLowerCase().includes(query) ||
          (m.matchId || '').toLowerCase().includes(query) ||
          String(m.tableNum) === query
        );
        const roomUrl = buildBuddyBoardGamesUrl(m.matchId);

        return `
          <div class="round1-match-card public-match-card ${m.winnerId ? 'has-winner' : ''} ${isMatchSearch ? 'search-match-highlight' : ''}" data-match-id="${m.matchId}">
            <div class="match-card-header">
              <div class="match-room-tag">
                <span class="table-tag">${pmDict.tableLabel} #${m.tableNum}</span>
                <span class="room-id">${m.matchId}</span>
              </div>
              <a href="${roomUrl}" target="_blank" rel="noopener noreferrer" class="match-launch-btn">
                ${pmDict.launchRoomBtn}
              </a>
            </div>

            <div class="match-vs-row">
              <div class="match-combatant ${p1Won ? 'is-winner' : ''}">
                <span class="combatant-name">${m.player1.name}</span>
                ${p1Won ? '<span class="crown-badge">👑 Winner</span>' : ''}
              </div>

              <div class="match-vs-badge">${pmDict.vs}</div>

              <div class="match-combatant ${p2Won ? 'is-winner' : ''}">
                <span class="combatant-name">${m.player2.name}</span>
                ${p2Won ? '<span class="crown-badge">👑 Winner</span>' : ''}
              </div>
            </div>

            <div class="public-match-status-wrap ${m.winnerId ? 'finished' : 'in-progress'}">
              ${m.winnerId ? `
                <div class="public-winner-badge">
                  <span>🏆 ${pmDict.statusWinner} <strong>${winner ? winner.name : 'Qualified'}</strong></span>
                  <span class="advancing-tag">${pmDict.advancesTag}</span>
                </div>
              ` : `
                <div class="public-live-indicator">
                  <span class="pulse-indicator-dot"></span>
                  <span class="in-progress-text">${pmDict.statusInProgress}</span>
                </div>
              `}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 3. Quick Stats
  const statsEl = document.getElementById('publicMatchupsStats');
  if (statsEl) {
    const finishedCount = matches.filter(m => m.winnerId).length;
    const isBM = currentLang === 'bm';
    statsEl.textContent = isBM
      ? `${matches.length} Perlawanan • ${finishedCount}/${matches.length} Selesai`
      : `${matches.length} Matches • ${finishedCount}/${matches.length} Concluded`;
  }

  // 4. Public Round 2 Heats Grid (Read-Only)
  const publicRound2Grid = document.getElementById('publicRound2Grid');
  const publicQualifiersCount = document.getElementById('publicQualifiersCount');
  const numTables = tournamentState.round2?.numTables === 4 ? 4 : 3;
  const heats = computeRound2Heats(
    tournamentState.round1?.byePlayer,
    tournamentState.round1?.matches || [],
    numTables
  );
  const totalExpected = tournamentState.round1?.matches?.length
    ? tournamentState.round1.matches.length + (tournamentState.round1.byePlayer ? 1 : 0)
    : Math.ceil(tournamentState.roster.filter(p => p.checkedIn).length / 2) || 15;

  if (publicQualifiersCount) {
    publicQualifiersCount.textContent = `${heats.totalQualifiers} / ${totalExpected} Qualifiers`;
  }

  if (publicRound2Grid) {
    const tables = [
      { id: 'alpha', title: deskDict.round2.tableAlpha, list: heats.tableAlpha, color: 'blue' },
      { id: 'beta', title: deskDict.round2.tableBeta, list: heats.tableBeta, color: 'green' },
      { id: 'gamma', title: deskDict.round2.tableGamma, list: heats.tableGamma, color: 'purple' }
    ];

    if (numTables === 4) {
      tables.push({
        id: 'delta',
        title: deskDict.round2.tableDelta || 'Table Delta (Heat 4)',
        list: heats.tableDelta,
        color: 'amber'
      });
    }

    const baseCap = Math.floor(totalExpected / numTables);
    const rem = totalExpected % numTables;

    publicRound2Grid.innerHTML = tables.map((t, tableIdx) => {
      const targetTableCap = Math.max(t.list.length, baseCap + (tableIdx < rem ? 1 : 0), 5);
      return `
        <div class="round2-table-card border-${t.color}">
          <div class="table-card-head bg-${t.color}">
            <span class="table-title">${t.title}</span>
            <span class="table-occupancy">${t.list.length} / ${targetTableCap} Pax</span>
          </div>
          <ol class="table-seats-list">
            ${Array.from({ length: targetTableCap }, (_, idx) => {
              const player = t.list[idx];
              if (player) {
                const isTableWinner = tournamentState.round2?.winners?.[t.id] === player.id;
                return `
                  <li class="table-seat filled ${isTableWinner ? 'heat-winner-seat' : ''}">
                    <span class="seat-num">${isTableWinner ? '👑' : idx + 1}</span>
                    <div class="seat-player">
                      <strong>${player.name}</strong>
                      ${isTableWinner ? `<span class="seat-winner-badge">⭐ ${pmDict.statusFinalist || 'Finalist'}</span>` : ''}
                    </div>
                  </li>
                `;
              }
              return `
                <li class="table-seat empty">
                  <span class="seat-num">${idx + 1}</span>
                  <span class="seat-empty-text">${deskDict.round2.slotEmpty}</span>
                </li>
              `;
            }).join('')}
          </ol>
        </div>
      `;
    }).join('');
  }

  // 5. Public Grand Finale Stage & Championship Standings
  const publicFinalistsCount = document.getElementById('publicFinalistsCount');
  const publicGrandFinalGrid = document.getElementById('publicGrandFinalGrid');
  const publicPodiumBoard = document.getElementById('publicPodiumBoard');
  const publicStandingsTable = document.getElementById('publicStandingsTable');

  const gf = computeGrandFinalists(tournamentState);
  const standings = computeChampionshipStandings(tournamentState);
  const isBM = currentLang === 'bm';

  if (publicFinalistsCount) {
    publicFinalistsCount.textContent = `${gf.finalists.length} / ${gf.expectedFinalists} ${isBM ? 'Peserta Akhir' : 'Finalists'}`;
  }

  if (publicGrandFinalGrid) {
    publicGrandFinalGrid.innerHTML = gf.tables.map(t => {
      if (t.winner) {
        return `
          <div class="grandfinal-showcase-card is-qualified">
            <div class="gf-card-top">
              <span class="gf-source-tag">${t.title}</span>
              <span class="gf-status-tag">⭐ ${pmDict.statusFinalist || 'Finalist'}</span>
            </div>
            <div class="gf-card-body">
              <span class="gf-crown-icon">👑</span>
              <strong class="gf-player-name">${t.winner.name}</strong>
              <span class="gf-player-dept">${t.winner.dept || 'General'}</span>
            </div>
          </div>
        `;
      }
      return `
        <div class="grandfinal-showcase-card is-pending">
          <div class="gf-card-top">
            <span class="gf-source-tag">${t.title}</span>
            <span class="gf-status-tag">⏳ ${pmDict.statusPending || 'In Progress'}</span>
          </div>
          <div class="gf-card-body">
            <span class="gf-pending-icon">🎲</span>
            <strong class="gf-player-name pending-text">${pmDict.awaitingWinner || 'Awaiting Heat Winner...'}</strong>
            <span class="gf-player-dept">${isBM ? 'Perlawanan Meja Fizikal' : 'Physical Table Showdown'}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  if (publicPodiumBoard) {
    publicPodiumBoard.innerHTML = renderPodiumMarkup(standings, dict, false);
  }

  if (publicStandingsTable) {
    publicStandingsTable.innerHTML = renderStandingsTableMarkup(standings, dict);
  }
}

export function renderPodiumMarkup(standings, dict, isDesk = false) {
  const pmDict = dict.publicMatchups || {};
  const { podium, numTables } = standings;
  const p1 = podium.first;
  const p2 = podium.second;
  const p3 = podium.third;
  const p4 = podium.fourth;

  return `
    <div class="olympic-podium-container ${numTables === 4 ? 'has-fourth' : ''}">
      <!-- 2nd Place (Silver - Left) -->
      <div class="podium-step step-second ${p2 ? 'filled' : 'pending'}">
        <div class="podium-player-card">
          <div class="podium-medal-badge silver">🥈</div>
          <div class="podium-player-meta">
            <strong class="podium-player-name">${p2 ? p2.name : (pmDict.awaitingWinner || 'Pending Showdown...')}</strong>
            <span class="podium-player-dept">${p2 ? (p2.dept || 'General') : 'Showdown Finalist'}</span>
          </div>
          <div class="podium-trophy-title">${pmDict.runnerUpLabel || 'Runner-Up'}</div>
        </div>
        <div class="podium-block block-silver">
          <span class="podium-rank-num">2</span>
          <span class="podium-pedestal-label">2ND PLACE</span>
        </div>
      </div>

      <!-- 1st Place (Gold Champion - Center, Tallest) -->
      <div class="podium-step step-first ${p1 ? 'filled is-champion' : 'pending'}">
        <div class="podium-player-card champion-card">
          <div class="podium-crown-glow">👑</div>
          <div class="podium-medal-badge gold">🥇</div>
          <div class="podium-player-meta">
            <strong class="podium-player-name champion-name">${p1 ? p1.name : (pmDict.awaitingWinner || 'Pending Showdown...')}</strong>
            <span class="podium-player-dept champion-dept">${p1 ? (p1.dept || 'General') : 'Grand Champion Showdown'}</span>
          </div>
          <div class="podium-trophy-title champion-tag">🏆 ${pmDict.championLabel || 'Grand Champion'} 2026</div>
        </div>
        <div class="podium-block block-gold">
          <span class="podium-rank-num">1</span>
          <span class="podium-pedestal-label">GRAND CHAMPION</span>
        </div>
      </div>

      <!-- 3rd Place (Bronze - Right) -->
      <div class="podium-step step-third ${p3 ? 'filled' : 'pending'}">
        <div class="podium-player-card">
          <div class="podium-medal-badge bronze">🥉</div>
          <div class="podium-player-meta">
            <strong class="podium-player-name">${p3 ? p3.name : (pmDict.awaitingWinner || 'Pending Showdown...')}</strong>
            <span class="podium-player-dept">${p3 ? (p3.dept || 'General') : 'Showdown Finalist'}</span>
          </div>
          <div class="podium-trophy-title">${pmDict.thirdPlaceLabel || '2nd Runner-Up'}</div>
        </div>
        <div class="podium-block block-bronze">
          <span class="podium-rank-num">3</span>
          <span class="podium-pedestal-label">3RD PLACE</span>
        </div>
      </div>

      ${numTables === 4 ? `
        <!-- 4th Place (Finalist - Side Block) -->
        <div class="podium-step step-fourth ${p4 ? 'filled' : 'pending'}">
          <div class="podium-player-card">
            <div class="podium-medal-badge finalist">🎖️</div>
            <div class="podium-player-meta">
              <strong class="podium-player-name">${p4 ? p4.name : (pmDict.awaitingWinner || 'Pending Showdown...')}</strong>
              <span class="podium-player-dept">${p4 ? (p4.dept || 'General') : 'Showdown Finalist'}</span>
            </div>
            <div class="podium-trophy-title">${pmDict.fourthPlaceLabel || '4th Place Finalist'}</div>
          </div>
          <div class="podium-block block-fourth">
            <span class="podium-rank-num">4</span>
            <span class="podium-pedestal-label">4TH PLACE</span>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

export function renderStandingsTableMarkup(standings, dict) {
  const pmDict = dict.publicMatchups || {};
  const { placements } = standings;

  const rows = placements.map(pl => {
    const isAwarded = !!pl.player;
    return `
      <tr class="standings-row rank-${pl.rank} ${isAwarded ? 'is-crowned' : 'is-pending'}">
        <td class="standings-col-rank">
          <span class="rank-badge rank-badge-${pl.rank}">${pl.medal} #${pl.rank}</span>
        </td>
        <td class="standings-col-name">
          ${isAwarded ? `<strong class="player-crowned-name">${pl.player.name}</strong>` : `<span class="player-pending-name">${pmDict.awaitingWinner || 'Pending Showdown Result...'}</span>`}
        </td>
        <td class="standings-col-dept">
          ${isAwarded ? (pl.player.dept || 'General') : '—'}
        </td>
        <td class="standings-col-accolade">
          <span class="accolade-tag rank-tag-${pl.rank}">${pl.medal} ${pl.label}</span>
        </td>
        <td class="standings-col-status">
          ${isAwarded ? `<span class="status-pill status-crowned">${pmDict.statusCrowned || '🏆 Crowned'}</span>` : `<span class="status-pill status-in-progress">${pmDict.statusPending || '⏳ In Progress'}</span>`}
        </td>
      </tr>
    `;
  });

  return `
    <table class="standings-table">
      <thead>
        <tr>
          <th>${pmDict.rankCol || 'Rank'}</th>
          <th>${pmDict.playerCol || 'Participant'}</th>
          <th>${pmDict.deptCol || 'Department'}</th>
          <th>${pmDict.accoladeCol || 'Accolade / Title'}</th>
          <th>${pmDict.statusCol || 'Status'}</th>
        </tr>
      </thead>
      <tbody>
        ${rows.join('')}
      </tbody>
    </table>
  `;
}

// ==========================================================================
// Tournament Desk Controller & Round 1 Automation
// ==========================================================================
export function renderTournamentDesk() {
  if (!tournamentState || typeof document === 'undefined') return;
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const deskDict = dict.tournamentDesk;
  if (!deskDict) return;

  // Sync Organizer Protection Bar
  const lockBarEl = document.getElementById('deskLockBar');
  const lockTitleEl = document.getElementById('deskLockTitle');
  const lockDescEl = document.getElementById('deskLockDesc');
  const lockToggleBtn = document.getElementById('deskLockToggleBtn');
  const deskViewEl = document.getElementById('deskView');

  if (lockBarEl && deskDict.lockBar) {
    if (isDeskOrganizerUnlocked) {
      lockBarEl.className = 'desk-lock-bar is-unlocked';
      if (lockTitleEl) lockTitleEl.textContent = deskDict.lockBar.unlockedTitle;
      if (lockDescEl) lockDescEl.textContent = deskDict.lockBar.unlockedDesc;
      if (lockToggleBtn) {
        lockToggleBtn.className = 'btn-lock-toggle active';
        lockToggleBtn.textContent = deskDict.lockBar.lockBtn;
      }
      if (deskViewEl) deskViewEl.classList.remove('desk-controls-protected');
    } else {
      lockBarEl.className = 'desk-lock-bar is-locked';
      if (lockTitleEl) lockTitleEl.textContent = deskDict.lockBar.lockedTitle;
      if (lockDescEl) lockDescEl.textContent = deskDict.lockBar.lockedDesc;
      if (lockToggleBtn) {
        lockToggleBtn.className = 'btn-lock-toggle';
        lockToggleBtn.textContent = deskDict.lockBar.unlockBtn;
      }
      if (deskViewEl) deskViewEl.classList.add('desk-controls-protected');
    }
  }

  // Also update participant-facing Live Matchups
  renderPublicMatchups();

  // 1. Attendance Metrics
  const rosterCountEl = document.getElementById('deskRosterCount');
  const checkedInCountEl = document.getElementById('deskCheckedInCount');
  const absentCountEl = document.getElementById('deskAbsentCount');
  const targetMatchesEl = document.getElementById('deskMatchesTargetCount');
  const statusPillEl = document.getElementById('deskStatusPill');

  const total = tournamentState.roster.length;
  const checkedIn = tournamentState.roster.filter(p => p.checkedIn).length;
  const absent = total - checkedIn;
  const targetMatches = Math.floor(checkedIn / 2);
  const isOdd = checkedIn % 2 !== 0;

  if (rosterCountEl) rosterCountEl.textContent = total;
  if (checkedInCountEl) checkedInCountEl.textContent = checkedIn;
  if (absentCountEl) absentCountEl.textContent = absent;
  if (targetMatchesEl) targetMatchesEl.textContent = targetMatches;

  if (statusPillEl) {
    if (checkedIn < 2) {
      statusPillEl.className = 'desk-status-pill status-warning';
      statusPillEl.textContent = '⚠️ Min 2 Players Needed';
    } else if (isOdd) {
      statusPillEl.className = 'desk-status-pill status-odd';
      statusPillEl.textContent = deskDict.stats.statusOdd;
    } else {
      statusPillEl.className = 'desk-status-pill status-even';
      statusPillEl.textContent = deskDict.stats.statusEven;
    }
  }

  // 2. Roster List
  const rosterListEl = document.getElementById('deskRosterList');
  const searchInput = document.getElementById('deskRosterSearch');
  const query = (searchInput ? searchInput.value : '').trim().toLowerCase();

  if (rosterListEl) {
    const filtered = tournamentState.roster.filter(p => {
      if (!query) return true;
      return (p.name || '').toLowerCase().includes(query) || (p.dept || '').toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      rosterListEl.innerHTML = `<div class="desk-empty-state">No players found matching "${query}".</div>`;
    } else {
      rosterListEl.innerHTML = filtered.map(p => `
        <div class="player-roster-card ${p.checkedIn ? 'checked-in' : 'absent'}" data-id="${p.id}">
          <button type="button" class="check-toggle-btn ${p.checkedIn ? 'active' : ''}" data-action="toggle-check" data-id="${p.id}" aria-label="Toggle presence for ${p.name}">
            <span class="check-icon">${p.checkedIn ? '✓' : '—'}</span>
            <span class="check-text">${p.checkedIn ? deskDict.roster.checkedInTag : deskDict.roster.absentTag}</span>
          </button>
          <div class="roster-player-info">
            <span class="roster-player-name">${p.name}</span>
            <span class="roster-player-dept">${p.dept || 'General'}</span>
          </div>
          <button type="button" class="btn-roster-delete" data-action="delete-player" data-id="${p.id}" title="${deskDict.roster.deleteBtnTitle}" aria-label="Delete ${p.name}">
            🗑️
          </button>
        </div>
      `).join('');
    }
  }

  // 3. BYE Notice Banner
  const byeNoticeEl = document.getElementById('deskByeNotice');
  if (byeNoticeEl) {
    if (tournamentState.round1?.byePlayer) {
      const bp = tournamentState.round1.byePlayer;
      const isBM = currentLang === 'bm';
      byeNoticeEl.style.display = 'flex';
      byeNoticeEl.innerHTML = `
        <div class="bye-icon-bubble" aria-hidden="true">🎁</div>
        <div class="bye-body">
          <div class="bye-header-row">
            <span class="bye-badge">${deskDict.matches.byeTitle}</span>
            <span class="bye-status-pill">✓ ${isBM ? 'Layak Terus Pusingan 2' : 'Direct Round 2 Qualifier'}</span>
          </div>
          <div class="bye-player-name-row">
            <h4 class="bye-player-name">${bp.name}</h4>
            <span class="bye-dept-chip">${bp.dept || 'Talent Development'}</span>
          </div>
          <p class="bye-content bye-desc-text">
            ${deskDict.matches.byeDesc}
          </p>
        </div>
      `;
    } else {
      byeNoticeEl.style.display = 'none';
      byeNoticeEl.innerHTML = '';
    }
  }

  // 4. Matches Grid
  const matchesGridEl = document.getElementById('deskMatchesGrid');
  if (matchesGridEl) {
    const matches = tournamentState.round1?.matches || [];
    if (matches.length === 0) {
      matchesGridEl.innerHTML = `
        <div class="desk-empty-state">${deskDict.matches.emptyPrompt}</div>
      `;
    } else {
      matchesGridEl.innerHTML = matches.map(m => {
        const p1Won = m.winnerId === m.player1.id;
        const p2Won = m.winnerId === m.player2.id;
        const roomUrl = buildBuddyBoardGamesUrl(m.matchId);

        return `
          <div class="round1-match-card ${m.winnerId ? 'has-winner' : ''}" data-match-id="${m.matchId}">
            <div class="match-card-header">
              <div class="match-room-tag">
                <span class="table-tag">${deskDict.matches.tableLabel} #${m.tableNum}</span>
                <span class="room-id">${m.matchId}</span>
              </div>
              <a href="${roomUrl}" target="_blank" rel="noopener noreferrer" class="match-launch-btn">
                ${deskDict.matches.launchRoomBtn}
              </a>
            </div>

            <div class="match-vs-row">
              <div class="match-combatant ${p1Won ? 'is-winner' : ''}">
                <span class="combatant-name">${m.player1.name}</span>
                <span class="combatant-dept">${m.player1.dept}</span>
                ${p1Won ? '<span class="crown-badge">👑 Winner</span>' : ''}
              </div>

              <div class="match-vs-badge">${deskDict.matches.vs}</div>

              <div class="match-combatant ${p2Won ? 'is-winner' : ''}">
                <span class="combatant-name">${m.player2.name}</span>
                <span class="combatant-dept">${m.player2.dept}</span>
                ${p2Won ? '<span class="crown-badge">👑 Winner</span>' : ''}
              </div>
            </div>

            <div class="match-winner-actions">
              <span class="winner-prompt-label">${deskDict.matches.selectWinnerPrompt}</span>
              <div class="winner-buttons-row">
                <button type="button" class="btn-winner-pick ${p1Won ? 'active' : ''}" data-action="pick-winner" data-match="${m.matchId}" data-winner="${m.player1.id}">
                  👑 ${m.player1.name.split(' ')[0]} ${deskDict.matches.winnerWonSuffix}
                </button>
                <button type="button" class="btn-winner-pick ${p2Won ? 'active' : ''}" data-action="pick-winner" data-match="${m.matchId}" data-winner="${m.player2.id}">
                  👑 ${m.player2.name.split(' ')[0]} ${deskDict.matches.winnerWonSuffix}
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 5. Round 2 Heats
  const round2GridEl = document.getElementById('deskRound2HeatsGrid');
  const qualifiersCountEl = document.getElementById('deskQualifiersCount');
  const numTables = tournamentState.round2?.numTables === 4 ? 4 : 3;

  const heats = computeRound2Heats(
    tournamentState.round1?.byePlayer,
    tournamentState.round1?.matches || [],
    numTables
  );

  const totalExpected = tournamentState.round1?.matches?.length
    ? tournamentState.round1.matches.length + (tournamentState.round1.byePlayer ? 1 : 0)
    : Math.ceil(tournamentState.roster.filter(p => p.checkedIn).length / 2) || 15;

  if (qualifiersCountEl) {
    qualifiersCountEl.textContent = `${heats.totalQualifiers} / ${totalExpected}`;
  }

  // Sync format buttons active state
  document.querySelectorAll('.btn-heat-format').forEach(btn => {
    const t = parseInt(btn.getAttribute('data-tables'), 10);
    btn.classList.toggle('active', t === numTables);
  });

  if (round2GridEl) {
    const tables = [
      { id: 'alpha', title: deskDict.round2.tableAlpha, list: heats.tableAlpha, color: 'blue' },
      { id: 'beta', title: deskDict.round2.tableBeta, list: heats.tableBeta, color: 'green' },
      { id: 'gamma', title: deskDict.round2.tableGamma, list: heats.tableGamma, color: 'purple' }
    ];

    if (numTables === 4) {
      tables.push({
        id: 'delta',
        title: deskDict.round2.tableDelta || 'Table Delta (Heat 4)',
        list: heats.tableDelta,
        color: 'amber'
      });
    }

    const baseCap = Math.floor(totalExpected / numTables);
    const rem = totalExpected % numTables;

    round2GridEl.innerHTML = tables.map((t, tableIdx) => {
      const targetTableCap = Math.max(t.list.length, baseCap + (tableIdx < rem ? 1 : 0), 5);

      return `
        <div class="round2-table-card border-${t.color}">
          <div class="table-card-head bg-${t.color}">
            <span class="table-title">${t.title}</span>
            <span class="table-occupancy">${t.list.length} / ${targetTableCap} Pax</span>
          </div>
          <ol class="table-seats-list">
            ${Array.from({ length: targetTableCap }, (_, idx) => {
              const player = t.list[idx];
              if (player) {
                const isTableWinner = tournamentState.round2?.winners?.[t.id] === player.id;
                return `
                  <li class="table-seat filled ${isTableWinner ? 'heat-winner-seat' : ''}">
                    <span class="seat-num">${isTableWinner ? '👑' : idx + 1}</span>
                    <div class="seat-player">
                      <strong>${player.name}</strong>
                    </div>
                    <div class="seat-actions">
                      <button type="button" class="btn-heat-winner-crown ${isTableWinner ? 'is-crowned' : ''}" data-action="crown-heat-winner" data-table="${t.id}" data-player-id="${player.id}">
                        ${isTableWinner ? (deskDict.grandFinal?.crownedBadge || '👑 Heat Champion') : (deskDict.grandFinal?.crownWinnerBtn || '👑 Crown Winner')}
                      </button>
                    </div>
                  </li>
                `;
              }
              return `
                <li class="table-seat empty">
                  <span class="seat-num">${idx + 1}</span>
                  <span class="seat-empty-text">${deskDict.round2.slotEmpty}</span>
                </li>
              `;
            }).join('')}
          </ol>
        </div>
      `;
    }).join('');
  }

  // 6. Round 3 Grand Finale & Championship Desk
  const grandFinalRosterEl = document.getElementById('deskGrandFinalRoster');
  const deskPodiumPreviewEl = document.getElementById('deskPodiumPreview');
  const gf = computeGrandFinalists(tournamentState);
  const standings = computeChampionshipStandings(tournamentState);
  const gfDict = deskDict.grandFinal || {};
  const isBM = currentLang === 'bm';

  if (grandFinalRosterEl) {
    if (gf.tables.every(t => !t.winner)) {
      grandFinalRosterEl.innerHTML = `
        <div class="desk-empty-state">
          <span>⏳ ${gfDict.pendingFinalists || 'Waiting for Round 2 heat winners to qualify...'}</span>
          <p class="desk-empty-hint">${gfDict.subtitle || 'Crown 1 winner per heat table above to advance them here.'}</p>
        </div>
      `;
    } else {
      grandFinalRosterEl.innerHTML = `
        <div class="grandfinal-desk-grid">
          ${gf.tables.map(t => {
            if (!t.winner) {
              return `
                <div class="grandfinal-desk-slot empty">
                  <div class="slot-source-badge">${t.title}</div>
                  <div class="slot-empty-notice">
                    <span class="slot-empty-icon">⏳</span>
                    <span>${deskDict.round2?.slotEmpty || 'Awaiting Heat Winner...'}</span>
                  </div>
                </div>
              `;
            }
            const p = t.winner;
            const podium = tournamentState.grandFinal?.podium || {};
            const is1st = podium.first === p.id;
            const is2nd = podium.second === p.id;
            const is3rd = podium.third === p.id;
            const is4th = gf.numTables === 4 && podium.fourth === p.id;

            let placementBadge = '';
            if (is1st) placementBadge = `<span class="placement-pill gold">🥇 1st (${isBM ? 'Juara' : 'Champion'})</span>`;
            else if (is2nd) placementBadge = `<span class="placement-pill silver">🥈 2nd (${isBM ? 'Naib Juara' : 'Runner-Up'})</span>`;
            else if (is3rd) placementBadge = `<span class="placement-pill bronze">🥉 3rd (${isBM ? 'Tempat Ke-3' : '3rd Place'})</span>`;
            else if (is4th) placementBadge = `<span class="placement-pill finalist">🎖️ 4th (${isBM ? 'Tempat Ke-4' : '4th Place'})</span>`;

            return `
              <div class="grandfinal-desk-slot filled ${placementBadge ? 'has-placement' : ''}">
                <div class="slot-source-badge">${t.title} ${gfDict.heatTableLabel || 'Winner:'}</div>
                <div class="slot-player-info">
                  <strong class="slot-player-name">👑 ${p.name}</strong>
                  <span class="slot-player-dept">${p.dept || 'General'}</span>
                  ${placementBadge}
                </div>
                <div class="slot-placement-actions">
                  <span class="placement-label">${gfDict.assignPrompt || 'Assign Placement:'}</span>
                  <div class="placement-buttons-row">
                    <button type="button" class="btn-placement-pick ${is1st ? 'active-gold' : ''}" data-action="pick-podium" data-place="first" data-player-id="${p.id}" title="${is1st ? 'Remove 1st place' : 'Award 1st Place (Champion)'}">
                      🥇 1st
                    </button>
                    <button type="button" class="btn-placement-pick ${is2nd ? 'active-silver' : ''}" data-action="pick-podium" data-place="second" data-player-id="${p.id}" title="${is2nd ? 'Remove 2nd place' : 'Award 2nd Place'}">
                      🥈 2nd
                    </button>
                    <button type="button" class="btn-placement-pick ${is3rd ? 'active-bronze' : ''}" data-action="pick-podium" data-place="third" data-player-id="${p.id}" title="${is3rd ? 'Remove 3rd place' : 'Award 3rd Place'}">
                      🥉 3rd
                    </button>
                    ${gf.numTables === 4 ? `
                      <button type="button" class="btn-placement-pick ${is4th ? 'active-finalist' : ''}" data-action="pick-podium" data-place="fourth" data-player-id="${p.id}" title="${is4th ? 'Remove 4th place' : 'Award 4th Place'}">
                        🎖️ 4th
                      </button>
                    ` : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  }

  if (deskPodiumPreviewEl) {
    deskPodiumPreviewEl.innerHTML = renderPodiumMarkup(standings, dict, true);
  }
}

export function setupTournamentDeskEvents() {
  if (typeof document === 'undefined') return;

  // Search input filter
  const searchInput = document.getElementById('deskRosterSearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderTournamentDesk();
    });
  }

  // Add single player
  const addBtn = document.getElementById('deskAddPlayerBtn');
  const nameInput = document.getElementById('deskPlayerNameInput');

  async function handleAddPlayer() {
    if (!nameInput) return;
    const allowed = await ensureOrganizerUnlocked();
    if (!allowed) return;
    const name = nameInput.value.trim();
    if (!name) return;

    tournamentState = addPlayer(tournamentState, name, '');
    saveTournamentState(localStorage, tournamentState);
    nameInput.value = '';
    renderTournamentDesk();
    const isBM = currentLang === 'bm';
    showToast(isBM ? `Peserta "${name}" ditambah ke senarai` : `Added "${name}" to roster`, '➕');
  }

  if (addBtn) addBtn.addEventListener('click', handleAddPlayer);
  if (nameInput) {
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddPlayer();
      }
    });
  }

  // Bulk import drawer toggle
  const bulkToggleBtn = document.getElementById('deskBulkToggleBtn');
  const bulkContainer = document.getElementById('deskBulkContainer');
  const bulkImportBtn = document.getElementById('deskBulkImportBtn');
  const bulkTextarea = document.getElementById('deskBulkTextarea');

  if (bulkToggleBtn && bulkContainer) {
    bulkToggleBtn.addEventListener('click', () => {
      const isHidden = bulkContainer.style.display === 'none';
      bulkContainer.style.display = isHidden ? 'block' : 'none';
      if (isHidden && bulkTextarea) bulkTextarea.focus();
    });
  }

  if (bulkImportBtn && bulkTextarea) {
    bulkImportBtn.addEventListener('click', async () => {
      const allowed = await ensureOrganizerUnlocked();
      if (!allowed) return;
      const text = bulkTextarea.value.trim();
      if (text) {
        const prevCount = tournamentState.roster.length;
        tournamentState = bulkImportRoster(tournamentState, text);
        const addedCount = tournamentState.roster.length - prevCount;
        saveTournamentState(localStorage, tournamentState);
        bulkTextarea.value = '';
        if (bulkContainer) bulkContainer.style.display = 'none';
        renderTournamentDesk();
        const isBM = currentLang === 'bm';
        showToast(isBM ? `${addedCount} peserta berjaya diimport!` : `Imported ${addedCount} participants!`, '📝');
      }
    });
  }

  // Check all / Clear all
  const checkAllBtn = document.getElementById('deskCheckAllBtn');
  if (checkAllBtn) {
    checkAllBtn.addEventListener('click', async () => {
      const allowed = await ensureOrganizerUnlocked();
      if (!allowed) return;
      tournamentState = setAllCheckInStatus(tournamentState, true);
      saveTournamentState(localStorage, tournamentState);
      renderTournamentDesk();
      const isBM = currentLang === 'bm';
      showToast(isBM ? 'Semua peserta ditandakan hadir' : 'All participants marked checked-in', '✅');
    });
  }

  const uncheckAllBtn = document.getElementById('deskUncheckAllBtn');
  if (uncheckAllBtn) {
    uncheckAllBtn.addEventListener('click', async () => {
      const allowed = await ensureOrganizerUnlocked();
      if (!allowed) return;
      tournamentState = setAllCheckInStatus(tournamentState, false);
      saveTournamentState(localStorage, tournamentState);
      renderTournamentDesk();
      const isBM = currentLang === 'bm';
      showToast(isBM ? 'Semua tanda kehadiran dikosongkan' : 'All check-in marks cleared', '🔄');
    });
  }

  // Reset to default roster with custom popout
  const resetBtn = document.getElementById('deskResetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      const allowed = await ensureOrganizerUnlocked();
      if (!allowed) return;
      const isBM = currentLang === 'bm';
      const confirmed = await showCustomConfirm({
        icon: '🔄',
        kicker: isBM ? 'Set Semula Roster' : 'Reset Tournament Roster',
        title: isBM ? 'Set Semula ke 30 Peserta Asal?' : 'Reset to Default 30 Roster?',
        message: isBM
          ? 'Tindakan ini akan mengembalikan senarai asal 30 peserta dan mengosongkan semua perlawanan Pusingan 1.'
          : 'This will restore the original 30 registered participants and clear any current match pairings.',
        note: isBM ? '⚠️ Perubahan nama atau peserta tambahan akan dipadam.' : '⚠️ Any custom added players or match results will be cleared.',
        confirmText: isBM ? 'Set Semula Roster' : 'Reset Roster',
        cancelText: isBM ? 'Kekalkan Sekarang' : 'Keep Current',
        confirmVariant: 'danger'
      });

      if (confirmed) {
        tournamentState = resetTournamentState(localStorage);
        renderTournamentDesk();
        showToast(isBM ? 'Roster telah diset semula ke 30 peserta asal' : 'Roster reset to default 30 participants', '🔄');
      }
    });
  }

  // Remove all players from roster with custom popout
  const removeAllBtn = document.getElementById('deskRemoveAllBtn');
  if (removeAllBtn) {
    removeAllBtn.addEventListener('click', async () => {
      const allowed = await ensureOrganizerUnlocked();
      if (!allowed) return;
      const isBM = currentLang === 'bm';
      if (!tournamentState.roster || tournamentState.roster.length === 0) {
        showToast(isBM ? 'Tiada pemain di dalam senarai.' : 'No players in roster to remove.', 'ℹ️');
        return;
      }
      const confirmed = await showCustomConfirm({
        icon: '🗑️',
        kicker: isBM ? 'Padam Semua Pemain' : 'Clear Entire Roster',
        title: isBM ? 'Keluarkan Semua Pemain dari Senarai?' : 'Remove All Players from Roster?',
        message: isBM
          ? `Tindakan ini akan memadamkan kesemua ${tournamentState.roster.length} pemain dan mengosongkan perlawanan Pusingan 1 sedia ada.`
          : `This will remove all ${tournamentState.roster.length} participants from the roster and clear any current Round 1 matchups.`,
        note: isBM
          ? '💡 Anda boleh menambah pemain baru atau menekan "Tetap Semula ke 30 Asal" pada bila-bila masa.'
          : '💡 You can add new players, paste a roster via Bulk Import, or click "Reset to Default 30" at any time.',
        confirmText: isBM ? 'Padam Semua Pemain' : 'Remove All Players',
        cancelText: isBM ? 'Batal' : 'Cancel',
        confirmVariant: 'danger'
      });

      if (confirmed) {
        tournamentState = removeAllPlayers(tournamentState);
        saveTournamentState(localStorage, tournamentState);
        renderTournamentDesk();
        showToast(isBM ? 'Semua pemain telah dipadam dari senarai' : 'All players removed from roster', '🗑️');
      }
    });
  }

  // Roster event delegation (check toggle and delete)
  const rosterList = document.getElementById('deskRosterList');
  if (rosterList) {
    rosterList.addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const allowed = await ensureOrganizerUnlocked();
      if (!allowed) return;
      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');

      if (action === 'toggle-check') {
        tournamentState = togglePlayerCheckIn(tournamentState, id);
        saveTournamentState(localStorage, tournamentState);
        renderTournamentDesk();
      } else if (action === 'delete-player') {
        const isBM = currentLang === 'bm';
        const player = tournamentState.roster.find(p => p.id === id);
        const pName = player ? player.name : 'this participant';

        const confirmed = await showCustomConfirm({
          icon: '🗑️',
          kicker: isBM ? 'Keluarkan Peserta' : 'Remove Participant',
          title: isBM ? `Keluarkan ${pName}?` : `Remove ${pName}?`,
          message: isBM
            ? `Adakah anda pasti mahu memadamkan ${pName} daripada senarai kejohanan?`
            : `Are you sure you want to remove ${pName} from the tournament roster?`,
          confirmText: isBM ? 'Keluarkan Peserta' : 'Remove Player',
          cancelText: isBM ? 'Batal' : 'Cancel',
          confirmVariant: 'danger'
        });

        if (confirmed) {
          tournamentState = removePlayer(tournamentState, id);
          saveTournamentState(localStorage, tournamentState);
          renderTournamentDesk();
          showToast(isBM ? `Peserta "${pName}" dikeluarkan` : `Removed "${pName}" from roster`, '🗑️');
        }
      }
    });
  }

  // Randomize Round 1 Pairings with custom popout
  const randomizeBtn = document.getElementById('deskRandomizeBtn');
  if (randomizeBtn) {
    randomizeBtn.addEventListener('click', async () => {
      const allowed = await ensureOrganizerUnlocked();
      if (!allowed) return;
      const isBM = currentLang === 'bm';
      if (tournamentState.round1?.matches?.length > 0) {
        const confirmed = await showCustomConfirm({
          icon: '🎲',
          kicker: isBM ? 'Pengesahan Pusingan 1' : 'Round 1 Re-Shuffle',
          title: isBM ? 'Rawak Semula Perlawanan?' : 'Re-shuffle Pairings?',
          message: isBM
            ? 'Perlawanan Pusingan 1 telah pun dijana. Adakah anda ingin mengocok semula dan menjana susunan perlawanan 1v1 yang baru?'
            : 'Round 1 matches already exist. Re-shuffle and generate new pairings? Existing table assignments will be recalculated.',
          note: isBM ? '💡 Petua: Pemenang perlawanan semasa akan disetkan semula untuk susunan baru.' : '💡 Note: Any recorded winners will be reset for the new pairings.',
          confirmText: isBM ? 'Ya, Rawak Semula 🎲' : 'Yes, Re-shuffle 🎲',
          cancelText: isBM ? 'Kekalkan Sedia Ada' : 'Keep Existing',
          confirmVariant: 'primary'
        });
        if (!confirmed) return;
      }

      const checkedIn = tournamentState.roster.filter(p => p.checkedIn);
      if (checkedIn.length < 2) {
        await showCustomAlert({
          icon: '👥',
          kicker: isBM ? 'Perlu Peserta Hadir' : 'Check-In Required',
          title: isBM ? 'Peserta Tidak Mencukupi' : 'Not Enough Checked-In Players',
          message: isBM
            ? 'Sekurang-kurangnya 2 pemain yang bertanda hadir diperlukan untuk menjana perlawanan.'
            : 'At least 2 checked-in players are required to generate pairings. Please mark participants as Checked-In first.',
          buttonText: isBM ? 'Faham' : 'Got it',
          variant: 'warning'
        });
        return;
      }

      const pairings = generateRound1Pairings(checkedIn);
      tournamentState.round1 = pairings;
      saveTournamentState(localStorage, tournamentState);
      renderTournamentDesk();
      showToast(isBM ? '🎲 Perlawanan Pusingan 1 berjaya dijana!' : '🎲 Round 1 pairings generated successfully!', '🎲');
    });
  }

  // Matches grid event delegation (winner selection)
  const matchesGrid = document.getElementById('deskMatchesGrid');
  if (matchesGrid) {
    matchesGrid.addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-action="pick-winner"]');
      if (!btn) return;
      const allowed = await ensureOrganizerUnlocked();
      if (!allowed) return;
      const matchId = btn.getAttribute('data-match');
      const winnerId = btn.getAttribute('data-winner');

      tournamentState = recordMatchWinner(tournamentState, matchId, winnerId);
      saveTournamentState(localStorage, tournamentState);
      renderTournamentDesk();
      const winner = tournamentState.roster.find(p => p.id === winnerId);
      if (winner) {
        const isBM = currentLang === 'bm';
        showToast(isBM ? `Pemenang dicatat: ${winner.name} 🏆` : `Winner recorded: ${winner.name} 🏆`, '🏆', 2200);
      }
    });
  }

  // Copy matchups to clipboard with custom alert & toast
  const copyMatchupsBtn = document.getElementById('deskCopyMatchupsBtn');
  if (copyMatchupsBtn) {
    copyMatchupsBtn.addEventListener('click', async () => {
      const isBM = currentLang === 'bm';
      const text = formatMatchupsClipboard(tournamentState.round1);
      if (!text) {
        await showCustomAlert({
          icon: '📋',
          kicker: isBM ? 'Tiada Jadual Perlawanan' : 'No Matchups Found',
          title: isBM ? 'Jana Perlawanan Dahulu' : 'Generate Pairings First',
          message: isBM
            ? 'Tiada jadual perlawanan untuk disalin lagi. Sila klik butang "🎲 Rawak Perlawanan Pusingan 1" terlebih dahulu.'
            : 'There are no active matchups to copy yet. Click "🎲 Randomize Round 1 Pairings" to generate match tables first.',
          buttonText: isBM ? 'Faham' : 'Got it',
          variant: 'info'
        });
        return;
      }

      copyTextToClipboard(text, copyMatchupsBtn, null);
      showToast(isBM ? '📋 Jadual perlawanan telah disalin ke papan keratan!' : '📋 Matchups copied to clipboard for WhatsApp/Teams!', '📋');
      copyMatchupsBtn.textContent = isBM ? 'Telah Disalin! 📋' : 'Copied! 📋';
      copyMatchupsBtn.classList.add('copied-success');
      setTimeout(() => {
        copyMatchupsBtn.innerHTML = `📋 <span>${isBM ? 'Salin Perlawanan' : 'Copy Matchups'}</span>`;
        copyMatchupsBtn.classList.remove('copied-success');
      }, 2000);
    });
  }

  // Round 2 Heat Format toggle (3 Tables vs 4 Tables)
  document.querySelectorAll('.btn-heat-format').forEach(btn => {
    btn.addEventListener('click', async () => {
      const allowed = await ensureOrganizerUnlocked();
      if (!allowed) return;
      const count = parseInt(btn.getAttribute('data-tables'), 10) || 3;
      tournamentState = setRound2TableCount(tournamentState, count);
      saveTournamentState(localStorage, tournamentState);
      renderTournamentDesk();
      const isBM = currentLang === 'bm';
      showToast(
        count === 4
          ? (isBM ? 'Format 4 Meja diaktifkan (Meja Delta ditambah)' : '4 Tables format active (Table Delta added)')
          : (isBM ? 'Format 3 Meja diaktifkan' : '3 Tables format active'),
        '🎛️'
      );
    });
  });

  // Organizer Mode Lock Switch
  const lockToggleBtn = document.getElementById('deskLockToggleBtn');
  if (lockToggleBtn) {
    lockToggleBtn.addEventListener('click', () => {
      isDeskOrganizerUnlocked = !isDeskOrganizerUnlocked;
      renderTournamentDesk();
      const isBM = currentLang === 'bm';
      if (isDeskOrganizerUnlocked) {
        showToast(isBM ? 'Mod Penganjur Dibuka! 🔓' : 'Organizer Mode Unlocked! 🔓', '🔓');
      } else {
        showToast(isBM ? 'Kawalan Meja Dikunci 🔒' : 'Organizer Controls Locked 🔒', '🔒');
      }
    });
  }

  // Round 2 Heat Winner crowning event delegation
  const round2DeskGrid = document.getElementById('deskRound2HeatsGrid');
  if (round2DeskGrid) {
    round2DeskGrid.addEventListener('click', async (e) => {
      const crownBtn = e.target.closest('button[data-action="crown-heat-winner"]');
      if (!crownBtn) return;
      const allowed = await ensureOrganizerUnlocked();
      if (!allowed) return;
      const tableKey = crownBtn.getAttribute('data-table');
      const playerId = crownBtn.getAttribute('data-player-id');
      if (tableKey && playerId) {
        tournamentState = recordHeatWinner(tournamentState, tableKey, playerId);
        saveTournamentState(localStorage, tournamentState);
        renderTournamentDesk();
        renderPublicMatchups();
        const isBM = currentLang === 'bm';
        const crowned = tournamentState.round2?.winners?.[tableKey] === playerId;
        showToast(
          crowned
            ? (isBM ? `Pemenang Kumpulan ditetapkan! Mara ke Pentas Akhir 👑` : `Heat Winner crowned! Advances to Grand Finale 👑`)
            : (isBM ? `Pemenang Kumpulan dibatalkan` : `Heat Winner cleared`),
          '👑'
        );
      }
    });
  }

  // Grand Finale Podium Placement assignment delegation
  const grandFinalRoster = document.getElementById('deskGrandFinalRoster');
  if (grandFinalRoster) {
    grandFinalRoster.addEventListener('click', async (e) => {
      const pickBtn = e.target.closest('button[data-action="pick-podium"]');
      if (!pickBtn) return;
      const allowed = await ensureOrganizerUnlocked();
      if (!allowed) return;
      const placeKey = pickBtn.getAttribute('data-place');
      const playerId = pickBtn.getAttribute('data-player-id');
      if (placeKey && playerId) {
        tournamentState = recordPodiumPlace(tournamentState, placeKey, playerId);
        saveTournamentState(localStorage, tournamentState);
        renderTournamentDesk();
        renderPublicMatchups();
        const isBM = currentLang === 'bm';
        const assigned = tournamentState.grandFinal?.podium?.[placeKey] === playerId;
        showToast(
          assigned
            ? (isBM ? `Kedudukan podium berjaya ditetapkan!` : `Podium placement updated!`)
            : (isBM ? `Kedudukan dipadamkan` : `Placement cleared`),
          '🏆'
        );
      }
    });
  }

  // Reset Finale Placements button
  const resetFinaleBtn = document.getElementById('deskResetFinaleBtn');
  if (resetFinaleBtn) {
    resetFinaleBtn.addEventListener('click', async () => {
      const allowed = await ensureOrganizerUnlocked();
      if (!allowed) return;
      const isBM = currentLang === 'bm';
      const confirmed = await showCustomConfirm({
        icon: '🔄',
        kicker: isBM ? 'Set Semula Pentas Akhir' : 'Reset Grand Finale',
        title: isBM ? 'Set Semula Keputusan Pentas Akhir?' : 'Reset Grand Finale Results?',
        message: deskDict.grandFinal?.resetConfirm || 'Reset all Grand Finale podium placements and heat winners?',
        note: isBM ? '⚠️ Semua pemenang kumpulan dan kedudukan podium akan dikosongkan.' : '⚠️ All crowned heat winners and podium standings will be cleared.',
        confirmText: isBM ? 'Set Semula' : 'Reset Placements',
        cancelText: isBM ? 'Batal' : 'Cancel',
        confirmVariant: 'danger'
      });
      if (confirmed) {
        tournamentState = resetGrandFinal(tournamentState);
        saveTournamentState(localStorage, tournamentState);
        renderTournamentDesk();
        renderPublicMatchups();
        showToast(isBM ? 'Keputusan Pentas Akhir telah diset semula.' : 'Grand Finale placements reset.', '🔄');
      }
    });
  }

  // Public Matchups Filter & Share
  const publicSearch = document.getElementById('publicMatchupsSearch');
  if (publicSearch) {
    publicSearch.addEventListener('input', () => {
      renderPublicMatchups();
    });
  }

  const shareBtn = document.getElementById('copyMatchupsShareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      const isBM = currentLang === 'bm';
      const url = (typeof window !== 'undefined' && window.location)
        ? (window.location.origin + window.location.pathname + '#matchups')
        : '#matchups';
      copyTextToClipboard(url, shareBtn, null);
      showToast(isBM ? '🔗 Pautan jadual disalin untuk peserta!' : '🔗 Matchups link copied for participants!', '🔗');
    });
  }

  // Print button
  const printBtn = document.getElementById('deskPrintBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

// ==========================================================================
// Guest vs Admin (Organizer) Authentication & View Protection (Local Only)
// ==========================================================================

export const DEFAULT_ADMIN_USER = 'admin';
export const DEFAULT_ADMIN_PASS = 'uno2026';

export function isAdminAuthenticated() {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('uno_admin_logged_in') === 'true';
    }
  } catch (e) {}
  return false;
}

export function getStoredAdminCredentials() {
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('uno_admin_creds');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.username && parsed.password) {
          return parsed;
        }
      }
    }
  } catch (e) {}
  return { username: DEFAULT_ADMIN_USER, password: DEFAULT_ADMIN_PASS };
}

export function loginAdmin(username, password) {
  const creds = getStoredAdminCredentials();
  const inputUser = String(username || '').trim().toLowerCase();
  const inputPass = String(password || '').trim();

  if (inputUser === creds.username.toLowerCase() && inputPass === creds.password) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('uno_admin_logged_in', 'true');
      }
    } catch (e) {}
    // Automatically unlock organizer desk protection on successful admin login
    isDeskOrganizerUnlocked = true;
    renderAuthUI();
    return { success: true };
  }

  const isBM = currentLang === 'bm';
  return {
    success: false,
    error: isBM
      ? 'Nama pengguna atau kata laluan tidak sah. (Lalai: admin / uno2026)'
      : 'Invalid username or password. (Default: admin / uno2026)'
  };
}

export function logoutAdmin() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('uno_admin_logged_in');
    }
  } catch (e) {}
  isDeskOrganizerUnlocked = false;
  renderAuthUI();

  // Revert strictly to matchups (guest view)
  switchTab('matchups', true, true);

  const isBM = currentLang === 'bm';
  showToast(isBM
    ? 'Log keluar berjaya. Beralih ke Paparan Tetamu (Perlawanan Langsung).'
    : 'Logged out. Switched to Guest View (Live Matchups).', '👋');
}

export function renderAuthUI() {
  if (typeof document === 'undefined') return;
  const isAdmin = isAdminAuthenticated();

  // Update body role classes
  if (document.body) {
    document.body.classList.toggle('role-admin', isAdmin);
    document.body.classList.toggle('role-guest', !isAdmin);
  }

  // Update tab-nav grid mode
  const tabNav = document.querySelector('.tab-nav');
  if (tabNav) {
    tabNav.classList.toggle('admin-mode', isAdmin);
    tabNav.classList.toggle('guest-mode', !isAdmin);
  }

  // Toggle header login trigger vs status group
  const openLoginBtn = document.getElementById('openAdminLoginBtn');
  if (openLoginBtn) {
    openLoginBtn.style.display = isAdmin ? 'none' : 'inline-flex';
  }

  const adminStatusGroup = document.getElementById('adminStatusGroup');
  if (adminStatusGroup) {
    adminStatusGroup.style.display = isAdmin ? 'inline-flex' : 'none';
  }

  // Toggle admin-only items (guide, rules, schedule, desk tabs, quick nav pills, hero buttons)
  document.querySelectorAll('.admin-only-item').forEach(el => {
    el.style.display = isAdmin ? '' : 'none';
  });

  // Toggle desk view admin session banner
  const deskAdminBanner = document.getElementById('deskAdminSessionBar');
  if (deskAdminBanner) {
    deskAdminBanner.style.display = isAdmin ? 'flex' : 'none';
  }

  // If in guest mode, enforce matchups tab as active
  if (!isAdmin && typeof document !== 'undefined') {
    const activeTabBtn = document.querySelector('.tab-btn.active');
    if (activeTabBtn && activeTabBtn.getAttribute('data-tab') !== 'matchups') {
      switchTab('matchups', false, true);
    }
  }
}

export function openAdminLoginModal() {
  if (typeof document === 'undefined') return;
  const overlay = document.getElementById('adminLoginModalOverlay');
  if (!overlay) return;

  const errorBox = document.getElementById('adminLoginError');
  if (errorBox) errorBox.style.display = 'none';

  const usernameInput = document.getElementById('adminUsernameInput');
  const passwordInput = document.getElementById('adminPasswordInput');
  if (usernameInput) usernameInput.value = '';
  if (passwordInput) passwordInput.value = '';

  overlay.style.display = 'flex';
  overlay.classList.add('active');
  if (document.body) document.body.style.overflow = 'hidden';

  setTimeout(() => {
    if (usernameInput) usernameInput.focus();
  }, 100);
}

export function closeAdminLoginModal() {
  if (typeof document === 'undefined') return;
  const overlay = document.getElementById('adminLoginModalOverlay');
  if (!overlay) return;

  overlay.style.display = 'none';
  overlay.classList.remove('active');
  if (document.body) document.body.style.overflow = '';
}

export function setupAuthEventListeners() {
  if (typeof document === 'undefined') return;

  // Header open login modal button
  const openLoginBtn = document.getElementById('openAdminLoginBtn');
  if (openLoginBtn) {
    openLoginBtn.addEventListener('click', () => {
      openAdminLoginModal();
    });
  }

  // Header logout button
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      logoutAdmin();
    });
  }

  // Desk view switch to guest button
  const deskSwitchGuestBtn = document.getElementById('deskSwitchGuestBtn');
  if (deskSwitchGuestBtn) {
    deskSwitchGuestBtn.addEventListener('click', () => {
      logoutAdmin();
    });
  }

  // Close modal X button & Cancel button
  const closeX = document.getElementById('adminLoginCloseX');
  if (closeX) {
    closeX.addEventListener('click', closeAdminLoginModal);
  }

  const cancelBtn = document.getElementById('adminLoginCancelBtn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeAdminLoginModal);
  }

  // Modal backdrop click outside to close
  const overlay = document.getElementById('adminLoginModalOverlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAdminLoginModal();
      }
    });
  }

  // Password toggle show/hide
  const togglePassBtn = document.getElementById('adminTogglePasswordBtn');
  const passwordInput = document.getElementById('adminPasswordInput');
  if (togglePassBtn && passwordInput) {
    togglePassBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      togglePassBtn.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  // Login form submission
  const loginForm = document.getElementById('adminLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('adminUsernameInput');
      const passwordInput = document.getElementById('adminPasswordInput');
      const errorBox = document.getElementById('adminLoginError');
      const errorText = document.getElementById('adminLoginErrorText');

      const user = usernameInput ? usernameInput.value : '';
      const pass = passwordInput ? passwordInput.value : '';

      const result = loginAdmin(user, pass);
      if (result.success) {
        closeAdminLoginModal();
        switchTab('desk', true, true);
        const isBM = currentLang === 'bm';
        showToast(isBM
          ? '👑 Selamat datang Admin! Meja Kejohanan kini dibuka sepenuhnya.'
          : '👑 Welcome Admin! Tournament Desk is now unlocked.', '👑');
      } else {
        if (errorBox && errorText) {
          errorText.textContent = result.error;
          errorBox.style.display = 'flex';
          const card = document.querySelector('.admin-login-card');
          if (card) {
            card.classList.remove('shake');
            void card.offsetWidth; // trigger reflow
            card.classList.add('shake');
          }
        }
      }
    });
  }

  // Keyboard Escape listener for modal
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const overlay = document.getElementById('adminLoginModalOverlay');
        if (overlay && (overlay.style.display === 'flex' || overlay.classList.contains('active'))) {
          closeAdminLoginModal();
        }
      }
    });
  }
}

// Tab Switching Controller with Hash & localStorage persistence
export function switchTab(tab, shouldScroll = true, updateHistory = true) {
  if (!tab || typeof document === 'undefined') return;
  const validTabs = ['guide', 'rules', 'schedule', 'matchups', 'desk'];
  if (!validTabs.includes(tab)) return;

  // Gate non-matchup tabs (guide, rules, schedule, desk) for guests when login modal is available in browser DOM
  if (tab !== 'matchups' && !isAdminAuthenticated()) {
    if (typeof document !== 'undefined' && document.getElementById('adminLoginModalOverlay')) {
      openAdminLoginModal();
      const isBM = currentLang === 'bm';
      showToast(isBM
        ? (tab === 'desk' ? '🔐 Akses Meja Kejohanan memerlukan log masuk Penganjur.' : '🔐 Bahagian ini memerlukan log masuk Penganjur / Admin.')
        : (tab === 'desk' ? '🔐 Tournament Desk requires Organizer login.' : '🔐 This section requires Organizer / Admin login.'), '🔐');
      return;
    }
  }

  const btn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
  const view = document.getElementById(`${tab}View`);
  if (!view) return;

  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

  if (btn) btn.classList.add('active');
  view.classList.add('active');

  // Sync header quick nav pills
  document.querySelectorAll('.quick-nav-pill').forEach(p => {
    p.classList.toggle('active', p.getAttribute('data-switch-tab') === tab);
  });

  // Persist to localStorage so page refresh preserves tab even without hash
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('uno_active_tab', tab);
    }
  } catch (e) {}

  // Sync URL hash for refresh and bookmarking
  const winHistory = typeof window !== 'undefined' ? window.history : (typeof history !== 'undefined' ? history : null);
  if (updateHistory && winHistory && winHistory.replaceState) {
    winHistory.replaceState(null, '', `#${tab}`);
  }

  if (shouldScroll && typeof window !== 'undefined' && window.scrollTo) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Initialize Application
export function initApp() {
  if (typeof window !== 'undefined') {
    window.switchTab = switchTab;
    window.renderPublicMatchups = renderPublicMatchups;
    window.loginAdmin = loginAdmin;
    window.logoutAdmin = logoutAdmin;
    window.isAdminAuthenticated = isAdminAuthenticated;
    window.openAdminLoginModal = openAdminLoginModal;
    window.closeAdminLoginModal = closeAdminLoginModal;
  }

  const validTabs = ['guide', 'rules', 'schedule', 'matchups', 'desk'];

  // Tab switching click handlers
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchTab(tab, true, true);
    });
  });

  // Quick switch tab handlers
  document.querySelectorAll('[data-switch-tab]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = el.getAttribute('data-switch-tab');
      switchTab(tab, true, true);
    });
  });

  // Browser hash change listener (back/forward)
  if (typeof window !== 'undefined') {
    window.addEventListener('hashchange', () => {
      const hash = (window.location.hash || '').replace(/^#/, '').trim();
      if (validTabs.includes(hash)) {
        switchTab(hash, false, false);
      }
    });
  }

  // Restore language preference
  try {
    if (typeof localStorage !== 'undefined') {
      const savedLang = localStorage.getItem('uno_lang');
      if (savedLang === 'en' || savedLang === 'bm') {
        currentLang = savedLang;
      }
    }
  } catch (e) {}

  // Language toggle
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'bm' : 'en';
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('uno_lang', currentLang);
        }
      } catch (e) {}
      updateI18n();
    });
  }

    // Search input
    const searchInput = document.getElementById('playerSearch');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderSearchResults();
      });
    }

    // Playground Controls
    const shuffleBtn = document.getElementById('shuffleScenarioBtn');
    if (shuffleBtn) {
      shuffleBtn.addEventListener('click', shuffleScenario);
    }

    const resetBtn = document.getElementById('resetScenarioBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetScenario);
    }

    const drawDeckBtn = document.getElementById('drawDeckBtn');
    if (drawDeckBtn) {
      drawDeckBtn.addEventListener('click', handleDrawCard);
      drawDeckBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleDrawCard();
        }
      });
    }

    // Color Choice Modal Buttons
    document.querySelectorAll('.color-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        if (color) {
          handleColorSelection(color);
        }
      });
    });

    // Cancel Color Picker Modal
    const cancelModalBtn = document.getElementById('cancelColorPickerBtn');
    if (cancelModalBtn) {
      cancelModalBtn.addEventListener('click', cancelColorSelection);
    }

    const colorPickerOverlay = document.getElementById('colorPickerOverlay');
    if (colorPickerOverlay) {
      colorPickerOverlay.addEventListener('click', (e) => {
        if (e.target === colorPickerOverlay) {
          cancelColorSelection();
        }
      });
    }

    // Dismiss on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const overlay = document.getElementById('colorPickerOverlay');
        if (overlay && overlay.style.display === 'flex') {
          cancelColorSelection();
        }
        const pOverlay = document.getElementById('posterModalOverlay');
      if (pOverlay && (pOverlay.style.display === 'flex' || pOverlay.classList.contains('active'))) {
        closePosterModal();
      }
    }
  });

  // Setup Official Poster Modal Events
  const viewPostersBtn = document.getElementById('viewPostersBtn');
  const posterModalOverlay = document.getElementById('posterModalOverlay');
  const closePosterModalBtn = document.getElementById('closePosterModalBtn');
  const dismissPosterBtn = document.getElementById('dismissPosterBtn');
  const posterTabs = document.querySelectorAll('.poster-tab-btn');

  if (viewPostersBtn) {
    viewPostersBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openPosterModal('announcement');
    });
  }
  if (closePosterModalBtn) {
    closePosterModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closePosterModal();
    });
  }
  if (dismissPosterBtn) {
    dismissPosterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closePosterModal();
    });
  }
  if (posterModalOverlay) {
    posterModalOverlay.addEventListener('click', (e) => {
      if (e.target === posterModalOverlay) closePosterModal();
    });
  }

  posterTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const posterType = tab.getAttribute('data-poster') || 'announcement';
      switchPosterTab(posterType);
    });
  });

  // Setup Room Generator Widget
  setupRoomGeneratorEvents();

  // Setup Tournament Desk Widget
  setupTournamentDeskEvents();

  // Setup Authentication Controls
  setupAuthEventListeners();

  // Setup Footer Interactive Events
  const shuffleTipBtn = document.getElementById('shuffleFooterTipBtn');
  if (shuffleTipBtn) {
    shuffleTipBtn.addEventListener('click', shuffleFooterTip);
  }

  // Initial render of translations, UI & Auth state
  updateI18n();
  renderAuthUI();

  // Restore persisted active tab (URL Hash > localStorage > default 'matchups' for guest, 'guide' for admin)
  const isAdmin = isAdminAuthenticated();
  let initialTab = isAdmin ? 'guide' : 'matchups';
  try {
    const hash = (typeof window !== 'undefined' && window.location && window.location.hash)
      ? window.location.hash.replace(/^#/, '').trim()
      : '';
    if (validTabs.includes(hash)) {
      initialTab = (!isAdmin && hash !== 'matchups') ? 'matchups' : hash;
    } else if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('uno_active_tab');
      if (stored && validTabs.includes(stored)) {
        initialTab = (!isAdmin && stored !== 'matchups') ? 'matchups' : stored;
      }
    }
  } catch (e) {}

  switchTab(initialTab, false, true);
}

// Fail-safe self-initialization
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}


