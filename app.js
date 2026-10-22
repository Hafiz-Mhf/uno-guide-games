// app.js
import { PLAYERS, searchPlayers } from './tournament-data.js';
import { isPlayable, getPlayReason, SCENARIOS, DRAW_POOL } from './card-engine.js';

export const TRANSLATIONS = {
  en: {
    appTitle: "HR & Admin UNO Engagement Day 2026",
    department: "Talent Development | Human Resource",
    toggleText: "BM",
    nav: {
      guide: "🕹️ Beginner Guide & Practice Mat",
      rules: "📜 Official Rules & 7 House Rules",
      schedule: "🎮 Digital Platform & Room Setup"
    },
    hero: {
      tagline: "October Engagement Day: Guide & Official Rules",
      eventDate: "Wednesday, 28 October 2026 • 3:00 PM – 4:30 PM (90 Mins)",
      venue: "📍 Mranti Corporation-2-L2-E-6-Common Area Space",
      platform: "🎮 BuddyBoardGames UNO & Physical UNO Decks",
      subtext: "Casual UNO Championship — From Digital 1v1s to the 3-Player Grand Final!"
    },
    buttons: {
      openGame: "Launch BuddyBoardGames Lobby ➔",
      practiceWithBuddy: "Practice With AI Bots ➔"
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
      r1Desc: "Arrival at Mranti Corporation-2-L2-E-6-Common Area Space, device Wi-Fi check, scanning the event guide, and room/match allocations.",
      r2Time: "3:15 PM – 3:35 PM (20 mins)",
      r2Stage: "Round 1 — Digital 1v1",
      r2Desc: "30 players compete in 15 simultaneous 1v1 head-to-head browser matches (Best of 3 / 150-point series). The 15 winners advance.",
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
      step5: "5. Play your 150-point series. Upon completion, report the winner to the tournament desk.",
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
      venue: "Mranti Corporation-2-L2-E-6-Common Area Space",
      format: "Digital 1v1 Prelims → 5-Player Heats → Grand Final",
      gameCentralTitle: "Game Central",
      linkGuide: "🕹️ Beginner Guide & Practice Mat",
      linkRules: "📜 7 House Rules & Etiquette",
      linkRoomGen: "⚡ Automated Room Generator",
      linkBuddy: "BuddyBoardGames UNO ↗",
      proTipTitle: "Strategy Pro-Tip",
      tipShuffleBtn: "🎲 Shuffle Tip",
      copyright: "© 2026 Malaysian Research Accelerator for Technology and Innovation (MRANTI). Internal Staff Engagement.",
      builtBy: "Organized by Talent Development | Human Resource"
    }
  },
  bm: {
    appTitle: "Hari Penglibatan UNO HR & Pentadbiran 2026",
    department: "Pembangunan Bakat | Sumber Manusia",
    toggleText: "EN",
    nav: {
      guide: "🕹️ Panduan Pemain & Pentas Latihan",
      rules: "📜 Peraturan Rasmi & 7 Syarat Santai",
      schedule: "🎮 Platform Digital & Penjana Bilik"
    },
    hero: {
      tagline: "Hari Penglibatan Oktober: Panduan & Peraturan Rasmi",
      eventDate: "Rabu, 28 Oktober 2026 • 3:00 PM – 4:30 PM (90 Minit)",
      venue: "📍 Mranti Corporation-2-L2-E-6-Common Area Space",
      platform: "🎮 BuddyBoardGames UNO & Kad UNO Fizikal",
      subtext: "Kejohanan UNO Santai — Dari 1v1 Digital ke Pentas Akhir 3 Penjuru!"
    },
    buttons: {
      openGame: "Buka Bilik BuddyBoardGames ➔",
      practiceWithBuddy: "Latihan Menentang Bot AI ➔"
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
      r1Desc: "Berkumpul di Common Area Space, semakan sambungan Wi-Fi peranti, imbas panduan acara, dan pengagihan bilik perlawanan.",
      r2Time: "3:15 PM – 3:35 PM (20 minit)",
      r2Stage: "Pusingan 1 — 1v1 Digital",
      r2Desc: "30 pemain bertanding serentak dalam 15 perlawanan 1v1 di pelayar web (Siri 150 mata). 15 pemenang mara ke pusingan seterusnya.",
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
      step5: "5. Main siri perlawanan sehingga mencapai 150 mata. Selesai bermain, maklumkan pemenang perlawanan kepada meja urusetia.",
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
      venue: "Mranti Corporation-2-L2-E-6-Ruang Legar Gunasama",
      format: "1v1 Digital → Pusingan Fizikal 5 Orang → Pentas Akhir",
      gameCentralTitle: "Pusat Permainan",
      linkGuide: "🕹️ Panduan Pemain & Pentas Latihan",
      linkRules: "📜 7 Syarat Santai & Etika",
      linkRoomGen: "⚡ Penjana Bilik Automatik",
      linkBuddy: "BuddyBoardGames UNO ↗",
      proTipTitle: "Petua Strategi UNO",
      tipShuffleBtn: "🎲 Tukar Petua",
      copyright: "© 2026 Malaysian Research Accelerator for Technology and Innovation (MRANTI). Penglibatan Staf Dalaman.",
      builtBy: "Dianjurkan oleh Pembangunan Bakat | Sumber Manusia"
    }
  }
};

let currentLang = 'en';

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

        // Sync header quick nav pills
        document.querySelectorAll('.quick-nav-pill').forEach(p => {
          p.classList.toggle('active', p.getAttribute('data-switch-tab') === tab);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
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
      }
    });

    // Setup Room Generator Widget
    setupRoomGeneratorEvents();

    // Setup Footer Interactive Events
    const shuffleTipBtn = document.getElementById('shuffleFooterTipBtn');
    if (shuffleTipBtn) {
      shuffleTipBtn.addEventListener('click', shuffleFooterTip);
    }

    document.querySelectorAll('[data-switch-tab]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = el.getAttribute('data-switch-tab');
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
        if (tabBtn) tabBtn.click();
      });
    });

    // Initial render
    updateI18n();

    // Sync header quick nav pills on initial load
    const activeTab = document.querySelector('.tab-btn.active')?.getAttribute('data-tab') || 'guide';
    document.querySelectorAll('.quick-nav-pill').forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-switch-tab') === activeTab);
    });
  });
}


