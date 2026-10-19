// app.js
import { PLAYERS, searchPlayers } from './tournament-data.js';
import { isPlayable, getPlayReason, SCENARIOS, DRAW_POOL } from './card-engine.js';

export const TRANSLATIONS = {
  en: {
    appTitle: "October UNO Championship 2026",
    department: "Talent Development | HR & Admin",
    toggleText: "BM",
    nav: {
      rules: "📖 Rules & House Rules",
      guide: "🕹️ Beginner Guide & Online Lobby",
      tournament: "🏆 Tournament & Match Search"
    },
    hero: {
      tagline: "HR & Admin Engagement Day 2026",
      eventDate: "Wednesday, 28 October 2026 • 3:00 PM – 4:30 PM",
      venue: "📍 Chatter Box, Level 3, Hive 5, MRANTI",
      subtext: "From Digital 1v1s to the 3-Player Grand Final — May the Best Card Win!"
    },
    buttons: {
      openGame: "Launch BuddyBoardGames Lobby ➔",
      findMatch: "Find My Match",
      viewRules: "View Official Rules",
      joinRoom: "Join Room",
      howToPlay: "How to Play UNO",
      tournamentRules: "Tournament Rules"
    },
    beginnerGuide: {
      title: "First Time Playing UNO? Start Here!",
      subtitle: "Master the fundamentals in 2 minutes. Simple, fast, and exciting!",
      step1Title: "1. The Objective",
      step1Desc: "Be the first player to empty all cards from your hand before your opponents do.",
      step2Title: "2. How a Turn Works",
      step2Desc: "Look at the card on top of the Discard Pile. On your turn, you must match it by:",
      step2RuleA: "Color (e.g. Red on Red)",
      step2RuleB: "Number or Symbol (e.g. 7 on 7, or Skip on Skip)",
      step2RuleC: "Wild Card (can be played on any card anytime!)",
      step3Title: "3. No Match? Draw 1 Card",
      step3Desc: "If you cannot play a matching card, draw 1 card from the Draw Pile. If the card drawn is playable, you can play it immediately!",
      step4Title: "4. Shout 'UNO!' at 1 Card",
      step4Desc: "The moment you play your second-to-last card and hold only 1 card, you MUST shout 'UNO!' (or tap the UNO button). If an opponent catches you before the next player takes a turn, you must draw a 2-card penalty!",
      step5Title: "5. Winning the Round",
      step5Desc: "The first person to discard their final card wins the round!"
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
      drewCardMsg: "Drew a card! Check if it can be played on the active card."
    },
    matchExample: {
      title: "Quick Match Visual Example",
      topCard: "Current Card on Table:",
      playable: "✅ Cards You Can Play:",
      playableColor: "Red 3 (Matches Color)",
      playableNumber: "Blue 7 (Matches Number)",
      playableWild: "Wild Card (Matches Anything)",
      notPlayable: "❌ Cannot Play:",
      notPlayableDesc: "Green 4 (Wrong Color & Wrong Number)"
    },
    rulesTab: {
      title: "Official Tournament House Rules",
      subtitle: "Enforced across all 15 digital matches and physical table heats.",
      shoutUnoTitle: "Rule 1: Calling 'UNO!' (Strict 2-Card Penalty)",
      shoutUnoDesc: "You must call out 'UNO!' loudly (or press the digital UNO button) the instant you have only 1 card left. If an opponent or Table Captain catches you with 1 card before the next player starts their turn, you must draw 2 penalty cards.",
      stackingTitle: "Rule 2: Strict No-Stacking Policy (+2 / +4)",
      stackingDesc: "Card stacking is strictly prohibited! You CANNOT place a +2 on a +2, or a +4 on a +4 to pass penalties. If hit with a Draw card, you must draw the cards and forfeit your turn immediately.",
      timerTitle: "Rule 3: 30-Second Turn Clock",
      timerDesc: "In Round 1 digital lobbies, turns exceeding 30 seconds are subject to automatic timeout. Table Captains may forfeit inactive players to ensure schedule integrity.",
      actionFinishTitle: "Rule 4: Winning on an Action Card",
      actionFinishDesc: "You are fully permitted to win the game by playing an Action Card (+2, Skip, Reverse, Wild, or Wild Draw 4) as your final card.",
      refereeTitle: "Rule 5: Table Captain & Referee Decisions Final",
      refereeDesc: "Table Captains preside over each physical table in Rounds 2 & 3. Any dispute regarding card drop timing, verbal shouts, or penalties is decided exclusively by the Table Captain."
    },
    guideTab: {
      title: "BuddyBoardGames Onboarding Guide",
      subtitle: "3 quick steps to connect with your opponent on tournament day.",
      step1: "Open BuddyBoardGames lobby and enter your real full name in the Nickname field.",
      step2: "Enter your assigned Room Name (e.g. HR-Match-01 to HR-Match-15) from the Tournament tab.",
      step3: "Tap 'Play Uno' and wait for your opponent to join. Matches are Best of 3 games."
    },
    guideSteps: {
      step1Title: "Enter Your Real Full Name",
      step2Title: "Enter Assigned Room Code",
      step3Title: "Join Lobby & Play Best-of-3"
    },
    tournamentTab: {
      title: "Tournament Progression (90-Minute Format)",
      subtitle: "From 30 HR & Admin staff to 1 Ultimate Champion.",
      round1Title: "Round 1: Digital 1v1s (3:15 – 3:35 PM)",
      round1Desc: "15 simultaneous 1v1 browser matches on BuddyBoardGames (Best of 3). 15 winners advance to Round 2.",
      round2Title: "Round 2: Physical Heats (3:35 – 4:00 PM)",
      round2Desc: "3 physical tables × 5 players (Table Alpha, Beta, Gamma) using physical UNO decks. 1 winner per table qualifies for Finals.",
      round3Title: "Round 3: Grand Final Showcase (4:00 – 4:20 PM)",
      round3Desc: "3-player championship table at the center showcase. Audience spectates live. Decides 1st, 2nd, and 3rd place!"
    },
    search: {
      title: "Interactive Player & Table Search",
      placeholder: "Type your name or department (e.g. Ahmad, Sarah, Recruitment)...",
      emptyPrompt: "Type your name above to see your table number, opponent, and room code.",
      noMatch: "No participant found. Check spelling or consult your Table Captain.",
      tableLabel: "Table #",
      roomLabel: "Match Room",
      opponentLabel: "Opponent",
      heatLabel: "Round 2 Table"
    }
  },
  bm: {
    appTitle: "Kejohanan UNO 2026",
    department: "Pembangunan Bakat | HR & Pentadbiran",
    toggleText: "EN",
    nav: {
      rules: "📖 Peraturan & Syarat Khas",
      guide: "🕹️ Panduan Pemain Baharu & Bilik Digital",
      tournament: "🏆 Kejohanan & Carian Lawan"
    },
    hero: {
      tagline: "Hari Penglibatan HR & Pentadbiran 2026",
      eventDate: "Rabu, 28 Oktober 2026 • 3:00 PM – 4:30 PM",
      venue: "📍 Chatter Box, Aras 3, Hive 5, MRANTI",
      subtext: "Dari 1v1 Digital ke Pentas Akhir 3 Penjuru — Semoga Kad Terbaik Menang!"
    },
    buttons: {
      openGame: "Buka Bilik BuddyBoardGames ➔",
      findMatch: "Cari Perlawanan Saya",
      viewRules: "Lihat Peraturan Rasmi",
      joinRoom: "Masuk Bilik",
      howToPlay: "Cara Bermain UNO",
      tournamentRules: "Peraturan Kejohanan"
    },
    beginnerGuide: {
      title: "Pertama Kali Main UNO? Mula Di Sini!",
      subtitle: "Kuasai asas dalam masa 2 minit. Mudah, pantas, dan menyeronokkan!",
      step1Title: "1. Objektif Utama",
      step1Desc: "Menjadi pemain pertama yang menghabiskan semua kad di tangan sebelum pihak lawan.",
      step2Title: "2. Cara Giliran Berjalan",
      step2Desc: "Lihat kad di atas timbunan buangan. Pada giliran anda, padankan kad mengikut:",
      step2RuleA: "Warna (cth: Merah atas Merah)",
      step2RuleB: "Nombor atau Simbol (cth: 7 atas 7, atau Skip atas Skip)",
      step2RuleC: "Kad Wild (boleh diletakkan bila-bila masa atas mana-mana kad!)",
      step3Title: "3. Tiada Padanan? Ambil 1 Kad",
      step3Desc: "Jika tiada kad yang sepadan, ambil 1 kad dari timbunan cabutan. Jika kad yang diambil boleh dimainkan, anda boleh terus meletakkannya!",
      step4Title: "4. Wajib Laung 'UNO!' Bila Tinggal 1 Kad",
      step4Desc: "Sebaik sahaja anda meletakkan kad kedua terakhir dan tinggal HANYA 1 KAD, anda WAJIB melaungkan 'UNO!' (atau tekan butang UNO dalam pelayar). Jika pihak lawan menangkap anda sebelum giliran seterusnya, anda dikenakan denda mengambil 2 kad!",
      step5Title: "5. Menang Pusingan",
      step5Desc: "Pemain pertama yang berjaya menghabiskan semua kad di tangan diisytiharkan sebagai pemenang!"
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
      drewCardMsg: "Kad telah dicabut! Semak sama ada ia boleh dimainkan atas kad semasa."
    },
    matchExample: {
      title: "Contoh Visual Padanan Pantas",
      topCard: "Kad Semasa di Atas Meja:",
      playable: "✅ Kad Yang Boleh Diletak:",
      playableColor: "Merah 3 (Sama Warna)",
      playableNumber: "Biru 7 (Sama Nombor)",
      playableWild: "Kad Wild (Bebas Warna)",
      notPlayable: "❌ Tidak Boleh Diletak:",
      notPlayableDesc: "Hijau 4 (Warna & Nombor Tidak Sama)"
    },
    rulesTab: {
      title: "Peraturan Rasmi Pertandingan",
      subtitle: "Dikuatkuasakan dalam semua 15 perlawanan digital dan meja fizikal.",
      shoutUnoTitle: "Peraturan 1: Laungan Wajib 'UNO!' (Denda 2 Kad)",
      shoutUnoDesc: "Wajib sebut 'UNO!' dengan lantang (atau tekan butang UNO di skrin) sebaik sahaja tinggal 1 kad di tangan. Jika tertangkap oleh lawan atau Ketua Meja sebelum pemain seterusnya jalan, anda wajib mengambil 2 kad denda.",
      stackingTitle: "Peraturan 2: Tiada 'Stacking' Kad (+2 / +4)",
      stackingDesc: "Penindanan kad dilarang sama sekali! Anda TIDAK BOLEH menepis kad +2 dengan +2, atau +4 dengan +4. Pemain yang terkena kad penalti wajib mengambil kad dan hilang giliran serta-merta.",
      timerTitle: "Peraturan 3: Had Masa Giliran (30 Saat)",
      timerDesc: "Dalam perlawanan digital Pusingan 1, masa maksimum setiap giliran ialah 30 saat. Kelewatan boleh menyebabkan giliran terbatal bagi memastikan kelancaran jadual.",
      actionFinishTitle: "Peraturan 4: Menamatkan Permainan dengan Kad Aksi",
      actionFinishDesc: "Pemain dibenarkan sepenuhnya untuk memenangi permainan dengan meletakkan Kad Aksi (+2, Skip, Reverse, Wild, atau Wild Draw 4) sebagai kad terakhir mereka.",
      refereeTitle: "Peraturan 5: Keputusan Ketua Meja & Pengadil Muktamad",
      refereeDesc: "Ketua Meja bertindak sebagai pengadil di setiap meja fizikal Pusingan 2 & 3. Sebarang pertikaian mengenai masa, laungan atau denda diputuskan secara muktamad oleh Ketua Meja."
    },
    guideTab: {
      title: "Panduan Masuk Platform BuddyBoardGames",
      subtitle: "3 langkah pantas untuk berhubung dengan lawan pada hari perlawanan.",
      step1: "Buka pautan permainan dan masukkan nama penuh sebenar anda sebagai nama samaran.",
      step2: "Masukkan nama bilik yang ditetapkan (cth: HR-Match-01 hingga HR-Match-15) dari tab Kejohanan.",
      step3: "Tekan butang 'Play Uno' dan tunggu lawan anda masuk. Pusingan 1 dimainkan format 'Best of 3'."
    },
    guideSteps: {
      step1Title: "Masukkan Nama Penuh Sebenar",
      step2Title: "Masukkan Kod Bilik Ditetapkan",
      step3Title: "Masuk Bilik & Main Best-of-3"
    },
    tournamentTab: {
      title: "Peringkat Kejohanan (Format 90 Minit)",
      subtitle: "Daripada 30 staf HR & Pentadbiran ke Pentas Juara Mutlak.",
      round1Title: "Pusingan 1: Digital 1v1 (3:15 – 3:35 PM)",
      round1Desc: "15 perlawanan 1v1 serentak di pelayar web BuddyBoardGames (Best of 3). 15 pemenang mara ke Pusingan 2.",
      round2Title: "Pusingan 2: Meja Fizikal (3:35 – 4:00 PM)",
      round2Desc: "3 meja fizikal × 5 pemain (Meja Alpha, Beta, Gamma) menggunakan kad fizikal. Johan setiap meja mara ke pusingan akhir.",
      round3Title: "Pusingan 3: Pentas Akhir (4:00 – 4:20 PM)",
      round3Desc: "Perlawanan 3 penjuru di meja utama disaksikan semua hadirin. Menentukan tempat Pertama, Kedua, dan Ketiga!"
    },
    search: {
      title: "Carian Interaktif Pemain & Meja",
      placeholder: "Taip nama atau bahagian anda (cth: Ahmad, Sarah, Recruitment)...",
      emptyPrompt: "Taip nama anda di atas untuk semak nombor meja, nama lawan, dan kod bilik.",
      noMatch: "Peserta tidak dijumpai. Sila semak ejaan atau rujuk Ketua Meja anda.",
      tableLabel: "Meja #",
      roomLabel: "Bilik Perlawanan",
      opponentLabel: "Lawan",
      heatLabel: "Meja Pusingan 2"
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
  if (searchInput) {
    searchInput.placeholder = dict.search.placeholder;
  }

  renderSearchResults();
  renderPlayground();
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

// Realistic UNO Card HTML Generator
export function createCardElementHtml(card, customClass = '') {
  const displayVal = getCardDisplayGlyph(card.value);
  return `
    <div class="uno-card card-color-${card.color} ${customClass}" data-id="${card.id || ''}" data-color="${card.color}" data-value="${card.value}">
      <div class="card-face">
        <span class="card-pip pip-top-left">${displayVal}</span>
        <div class="card-center-oval">
          <span class="card-center-val">${displayVal}</span>
        </div>
        <span class="card-pip pip-bottom-right">${displayVal}</span>
      </div>
    </div>
  `;
}

function getCardDisplayGlyph(val) {
  if (val === 'skip') return '🚫';
  if (val === 'reverse') return '🔁';
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

  // Render Table Active Card
  activeDiscardEl.innerHTML = createCardElementHtml(activeTableCard, 'table-target-card');

  // Render Hand Cards
  handDockEl.innerHTML = currentHand.map(c => createCardElementHtml(c, 'hand-card-item')).join('');

  // Attach card click handlers
  handDockEl.querySelectorAll('.uno-card').forEach(cardEl => {
    cardEl.addEventListener('click', () => {
      const cardId = cardEl.getAttribute('data-id');
      const card = currentHand.find(c => c.id === cardId);
      if (card) {
        handleCardPlay(card, cardEl);
      }
    });
  });
}

export function handleCardPlay(card, cardEl) {
  const banner = document.getElementById('playFeedbackBanner');
  const result = getPlayReason(card, activeTableCard, currentLang);

  if (result.success) {
    // Legal Move
    activeTableCard = { ...card };
    currentHand = currentHand.filter(c => c.id !== card.id);

    if (banner) {
      banner.className = 'play-feedback-banner feedback-legal';
      banner.textContent = `✅ ${result.message}`;
    }

    renderPlayground();
  } else {
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

  const banner = document.getElementById('playFeedbackBanner');
  const dict = TRANSLATIONS[currentLang];
  if (banner) {
    banner.className = 'play-feedback-banner';
    banner.textContent = dict.playground.initialPrompt;
  }

  renderPlayground();
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
    }

    // Initial render
    updateI18n();
  });
}
