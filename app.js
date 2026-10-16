// app.js
import { PLAYERS, searchPlayers } from './tournament-data.js';

export const TRANSLATIONS = {
  en: {
    appTitle: "October UNO Showdown",
    department: "Talent Development | HR",
    toggleText: "BM",
    nav: {
      rules: "📖 Rules",
      guide: "🕹️ Guide",
      tournament: "🏆 Tournament"
    },
    hero: {
      tagline: "October Engagement Day",
      subtext: "From Digital 1v1s to 1 Ultimate Champion!"
    },
    buttons: {
      openGame: "Open Game Room ➔",
      findMatch: "Find My Match",
      viewRules: "View Official Rules",
      joinRoom: "Join Room"
    },
    guideSteps: {
      step1Title: "Enter Your Real Name",
      step2Title: "Enter Assigned Room Code",
      step3Title: "Start the Match"
    },
    rulesTab: {
      title: "Official House Rules",
      shoutUnoTitle: "Calling 'UNO!'",
      shoutUnoDesc: "You must call out 'UNO!' clearly when you have only 1 card left. If caught with 1 card before the next player takes their turn, draw a 2-card penalty.",
      stackingTitle: "No Card Stacking",
      stackingDesc: "You cannot stack +2 on +2 or +4 on +4 to pass penalties. Penalties must be resolved immediately.",
      timerTitle: "Turn Timer (30s)",
      timerDesc: "Players have 30 seconds per turn in digital rounds to ensure smooth flow."
    },
    guideTab: {
      title: "Player's Quick Guide",
      step1: "Open the link and enter your full name as nickname.",
      step2: "Enter your assigned Room Name (e.g., HR-Match-01).",
      step3: "Tap 'Play Uno' and wait for your opponent to join."
    },
    tournamentTab: {
      title: "Tournament Progression",
      round1Title: "Round 1: Digital 1v1s",
      round1Desc: "15 simultaneous 1v1 browser matches (Best of 3). Winners advance.",
      round2Title: "Round 2: Physical Heats",
      round2Desc: "3 tables × 5 players using physical cards. Top 1 advances per table.",
      round3Title: "Round 3: Grand Final",
      round3Desc: "3-player championship table to decide 1st, 2nd, and 3rd place."
    },
    search: {
      placeholder: "Type your name (e.g., Ahmad, Sarah)...",
      emptyPrompt: "Enter your name above to see your table and room assignment.",
      noMatch: "Player not found. Check spelling or see Table Captain.",
      tableLabel: "Table",
      roomLabel: "Match Room",
      opponentLabel: "Opponent",
      heatLabel: "Next Heat"
    }
  },
  bm: {
    appTitle: "Kejohanan UNO 2026",
    department: "Pembangunan Bakat | HR",
    toggleText: "EN",
    nav: {
      rules: "📖 Peraturan",
      guide: "🕹️ Panduan",
      tournament: "🏆 Kejohanan"
    },
    hero: {
      tagline: "Hari Penglibatan Oktober",
      subtext: "Dari 1v1 Digital ke Pentas Juara Mutlak!"
    },
    buttons: {
      openGame: "Buka Bilik Permainan ➔",
      findMatch: "Cari Perlawanan Saya",
      viewRules: "Lihat Peraturan Rasmi",
      joinRoom: "Masuk Bilik"
    },
    guideSteps: {
      step1Title: "Masukkan Nama Sebenar",
      step2Title: "Masukkan Kod Bilik Ditetapkan",
      step3Title: "Mulakan Perlawanan"
    },
    rulesTab: {
      title: "Peraturan Rasmi Pertandingan",
      shoutUnoTitle: "Laungan 'UNO!'",
      shoutUnoDesc: "Wajib sebut 'UNO!' dengan jelas apabila tinggal 1 kad di tangan. Jika tertangkap sebelum giliran pemain seterusnya, anda dikenakan denda mengambil 2 kad.",
      stackingTitle: "Tiada 'Stacking' Kad",
      stackingDesc: "Kad +2 atau +4 tidak boleh ditindan untuk diserahkan kepada pihak lawan. Penalti wajib diambil serta-merta.",
      timerTitle: "Had Masa Giliran (30s)",
      timerDesc: "Pemain mempunyai 30 saat untuk setiap giliran dalam pusingan digital bagi memastikan kelancaran masa."
    },
    guideTab: {
      title: "Panduan Ringkas Pemain",
      step1: "Buka pautan permainan dan masukkan nama sebenar anda sebagai nama samaran.",
      step2: "Masukkan nama bilik yang ditetapkan (contoh: HR-Match-01).",
      step3: "Tekan butang 'Play Uno' dan tunggu lawan anda masuk ke bilik perlawanan."
    },
    tournamentTab: {
      title: "Peringkat Kejohanan",
      round1Title: "Pusingan 1: Digital 1v1",
      round1Desc: "15 perlawanan 1v1 serentak di pelayar web (Best of 3). Pemenang mara ke Pusingan 2.",
      round2Title: "Pusingan 2: Meja Fizikal",
      round2Desc: "3 meja × 5 pemain menggunakan kad fizikal. Johan setiap meja mara ke pusingan akhir.",
      round3Title: "Pusingan 3: Pentas Akhir",
      round3Desc: "Perlawanan 3 penjuru untuk menentukan tempat Pertama, Kedua, dan Ketiga."
    },
    search: {
      placeholder: "Taip nama anda (cth: Ahmad, Sarah)...",
      emptyPrompt: "Taip nama anda di atas untuk semak meja dan bilik permainan.",
      noMatch: "Nama tidak dijumpai. Sila semak ejaan atau rujuk Ketua Meja.",
      tableLabel: "Meja",
      roomLabel: "Bilik Perlawanan",
      opponentLabel: "Lawan",
      heatLabel: "Pusingan Seterusnya"
    }
  }
};

let currentLang = 'en';

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

    // Accordions
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        item.classList.toggle('open');
        const icon = header.querySelector('.acc-icon');
        if (icon) {
          icon.textContent = item.classList.contains('open') ? '➖' : '➕';
        }
      });
    });

    // Search input
    const searchInput = document.getElementById('playerSearch');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        renderSearchResults();
      });
    }

    // Initial render
    updateI18n();
  });
}
