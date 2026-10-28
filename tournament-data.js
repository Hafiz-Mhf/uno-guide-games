// tournament-data.js
export const PLAYERS = [
  { id: 1, name: "Zaharudin Bin Ismail", department: "HR Division", match: "HR-Match-01", table: 1, opponent: "Mohd Rizal Bin Abd Rahim", round2Heat: "Table Alpha" },
  { id: 2, name: "Mohd Rizal Bin Abd Rahim", department: "HR Division", match: "HR-Match-01", table: 1, opponent: "Zaharudin Bin Ismail", round2Heat: "Table Alpha" },
  { id: 3, name: "Zain Padzar Bin Musa", department: "HR Division", match: "HR-Match-02", table: 2, opponent: "Ahaime Bin Abu Seman @ Hj Ahmad", round2Heat: "Table Alpha" },
  { id: 4, name: "Ahaime Bin Abu Seman @ Hj Ahmad", department: "HR Division", match: "HR-Match-02", table: 2, opponent: "Zain Padzar Bin Musa", round2Heat: "Table Alpha" },
  { id: 5, name: "Sapawi Bin M Noor", department: "HR Division", match: "HR-Match-03", table: 3, opponent: "Rahmat Firdaus Bin Osman", round2Heat: "Table Alpha" },
  { id: 6, name: "Rahmat Firdaus Bin Osman", department: "HR Division", match: "HR-Match-03", table: 3, opponent: "Sapawi Bin M Noor", round2Heat: "Table Alpha" },

  { id: 7, name: "Rusnita Binti Che Harun", department: "HR Division", match: "HR-Match-04", table: 4, opponent: "Raja Norfazeela Bt Raja Badri Shah", round2Heat: "Table Alpha" },
  { id: 8, name: "Raja Norfazeela Bt Raja Badri Shah", department: "HR Division", match: "HR-Match-04", table: 4, opponent: "Rusnita Binti Che Harun", round2Heat: "Table Alpha" },
  { id: 9, name: "Wan Nor Fadula Binti Wan Noh", department: "HR Division", match: "HR-Match-05", table: 5, opponent: "Hamidun Bin Samsuddin", round2Heat: "Table Alpha" },
  { id: 10, name: "Hamidun Bin Samsuddin", department: "HR Division", match: "HR-Match-05", table: 5, opponent: "Wan Nor Fadula Binti Wan Noh", round2Heat: "Table Alpha" },
  { id: 11, name: "Aahmad Bin Mahmud", department: "HR Division", match: "HR-Match-06", table: 6, opponent: "Ahmad Zainuddin Bin Mamat", round2Heat: "Table Alpha" },
  { id: 12, name: "Ahmad Zainuddin Bin Mamat", department: "HR Division", match: "HR-Match-06", table: 6, opponent: "Aahmad Bin Mahmud", round2Heat: "Table Alpha" },

  { id: 13, name: "Mohd Sidek Bin Ibrahim", department: "HR Division", match: "HR-Match-07", table: 7, opponent: "Noorfaizal Bin Abdul Rahman", round2Heat: "Table Beta" },
  { id: 14, name: "Noorfaizal Bin Abdul Rahman", department: "HR Division", match: "HR-Match-07", table: 7, opponent: "Mohd Sidek Bin Ibrahim", round2Heat: "Table Beta" },
  { id: 15, name: "Sabrina Binti Mohd Haris Maurice", department: "HR Division", match: "HR-Match-08", table: 8, opponent: "Siti Aznee Binti Noor Hassan", round2Heat: "Table Beta" },
  { id: 16, name: "Siti Aznee Binti Noor Hassan", department: "HR Division", match: "HR-Match-08", table: 8, opponent: "Sabrina Binti Mohd Haris Maurice", round2Heat: "Table Beta" },
  { id: 17, name: "Saiful Yusri Bin Othman", department: "HR Division", match: "HR-Match-09", table: 9, opponent: "Naimi Adilah binti Mohd Ruslan", round2Heat: "Table Beta" },
  { id: 18, name: "Naimi Adilah binti Mohd Ruslan", department: "HR Division", match: "HR-Match-09", table: 9, opponent: "Saiful Yusri Bin Othman", round2Heat: "Table Beta" },

  { id: 19, name: "Noor Haizah Binti Abdul Halim", department: "HR Division", match: "HR-Match-10", table: 10, opponent: "Zarina Binti Salim", round2Heat: "Table Beta" },
  { id: 20, name: "Zarina Binti Salim", department: "HR Division", match: "HR-Match-10", table: 10, opponent: "Noor Haizah Binti Abdul Halim", round2Heat: "Table Beta" },
  { id: 21, name: "Mustaqim Kumar bin Abdullah", department: "HR Division", match: "HR-Match-11", table: 11, opponent: "Zahuri bin Mat Ibrahim", round2Heat: "Table Beta" },
  { id: 22, name: "Zahuri bin Mat Ibrahim", department: "HR Division", match: "HR-Match-11", table: 11, opponent: "Mustaqim Kumar bin Abdullah", round2Heat: "Table Beta" },
  { id: 23, name: "Nur Amalina binti Amran", department: "HR Division", match: "HR-Match-12", table: 12, opponent: "Ganes a/l Bandu Rengan", round2Heat: "Table Beta" },
  { id: 24, name: "Ganes a/l Bandu Rengan", department: "HR Division", match: "HR-Match-12", table: 12, opponent: "Nur Amalina binti Amran", round2Heat: "Table Beta" },

  { id: 25, name: "Norkhairul Hafiza binti Hamzah", department: "HR Division", match: "HR-Match-13", table: 13, opponent: "Nur Fatimah binti Attaullah", round2Heat: "Table Gamma" },
  { id: 26, name: "Nur Fatimah binti Attaullah", department: "HR Division", match: "HR-Match-13", table: 13, opponent: "Norkhairul Hafiza binti Hamzah", round2Heat: "Table Gamma" },
  { id: 27, name: "Afiqah binti Mad Kassim", department: "HR Division", match: "HR-Match-14", table: 14, opponent: "Hanisah Nabihah binti Azlan", round2Heat: "Table Gamma" },
  { id: 28, name: "Hanisah Nabihah binti Azlan", department: "HR Division", match: "HR-Match-14", table: 14, opponent: "Afiqah binti Mad Kassim", round2Heat: "Table Gamma" },
  { id: 29, name: "Rachel How Zhen Yi", department: "HR Division", match: "HR-Match-15", table: 15, opponent: "Adibah binti Zainal Abidin", round2Heat: "Table Gamma" },
  { id: 30, name: "Adibah binti Zainal Abidin", department: "HR Division", match: "HR-Match-15", table: 15, opponent: "Rachel How Zhen Yi", round2Heat: "Table Gamma" },

  { id: 31, name: "Muhammad Syafiq Rahimi bin Rosly", department: "HR Division", match: "HR-Match-16", table: 16, opponent: "Siti Norashikin binti Alias", round2Heat: "Table Gamma" },
  { id: 32, name: "Siti Norashikin binti Alias", department: "HR Division", match: "HR-Match-16", table: 16, opponent: "Muhammad Syafiq Rahimi bin Rosly", round2Heat: "Table Gamma" },
  { id: 33, name: "Fadzlul Baqi Faez bin Fadzil", department: "HR Division", match: "HR-Match-17", table: 17, opponent: "Muhammad Hafiz Faruqi bin Md Saifuddin", round2Heat: "Table Gamma" },
  { id: 34, name: "Muhammad Hafiz Faruqi bin Md Saifuddin", department: "HR Division", match: "HR-Match-17", table: 17, opponent: "Fadzlul Baqi Faez bin Fadzil", round2Heat: "Table Gamma" }
];

export function getPlayerByName(nameQuery) {
  if (!nameQuery) return null;
  const q = nameQuery.trim().toLowerCase();
  return PLAYERS.find(p => p.name.toLowerCase() === q) || null;
}

export function searchPlayers(query) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  return PLAYERS.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.department.toLowerCase().includes(q) ||
    p.match.toLowerCase().includes(q)
  );
}

export function getMatches() {
  const map = new Map();
  PLAYERS.forEach(p => {
    if (!map.has(p.match)) {
      map.set(p.match, []);
    }
    map.get(p.match).push(p);
  });
  return Array.from(map.entries()).map(([match, players]) => ({
    match,
    table: players[0].table,
    players
  }));
}
