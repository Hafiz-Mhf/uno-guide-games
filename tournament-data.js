// tournament-data.js
export const PLAYERS = [
  { id: 1, name: "Ahmad Razali", department: "Talent Development", match: "HR-Match-01", table: 1, opponent: "Sarah Tan", round2Heat: "Table Alpha" },
  { id: 2, name: "Sarah Tan", department: "HR Operations", match: "HR-Match-01", table: 1, opponent: "Ahmad Razali", round2Heat: "Table Alpha" },
  { id: 3, name: "Farhan Hakim", department: "Recruitment", match: "HR-Match-02", table: 2, opponent: "Nurul Aini", round2Heat: "Table Alpha" },
  { id: 4, name: "Nurul Aini", department: "People Experience", match: "HR-Match-02", table: 2, opponent: "Farhan Hakim", round2Heat: "Table Alpha" },
  { id: 5, name: "Daniel Lee", department: "Admin Services", match: "HR-Match-03", table: 3, opponent: "Kavita Nair", round2Heat: "Table Alpha" },
  { id: 6, name: "Kavita Nair", department: "Compensation & Benefits", match: "HR-Match-03", table: 3, opponent: "Daniel Lee", round2Heat: "Table Alpha" },
  { id: 7, name: "Zulhilmi Zain", department: "Talent Acquisition", match: "HR-Match-04", table: 4, opponent: "Chloe Wong", round2Heat: "Table Alpha" },
  { id: 8, name: "Chloe Wong", department: "HR Business Partner", match: "HR-Match-04", table: 4, opponent: "Zulhilmi Zain", round2Heat: "Table Alpha" },
  { id: 9, name: "Haris Iskandar", department: "Facility Admin", match: "HR-Match-05", table: 5, opponent: "Melissa Fernandez", round2Heat: "Table Alpha" },
  { id: 10, name: "Melissa Fernandez", department: "Talent Development", match: "HR-Match-05", table: 5, opponent: "Haris Iskandar", round2Heat: "Table Alpha" },

  { id: 11, name: "Syed Alwi", department: "Security & Admin", match: "HR-Match-06", table: 6, opponent: "Rachel Lim", round2Heat: "Table Beta" },
  { id: 12, name: "Rachel Lim", department: "HR Operations", match: "HR-Match-06", table: 6, opponent: "Syed Alwi", round2Heat: "Table Beta" },
  { id: 13, name: "Azman Kassim", department: "Fleet Management", match: "HR-Match-07", table: 7, opponent: "Siti Hajar", round2Heat: "Table Beta" },
  { id: 14, name: "Siti Hajar", department: "Payroll", match: "HR-Match-07", table: 7, opponent: "Azman Kassim", round2Heat: "Table Beta" },
  { id: 15, name: "Jonathan Teoh", department: "Employee Relations", match: "HR-Match-08", table: 8, opponent: "Anis Sofia", round2Heat: "Table Beta" },
  { id: 16, name: "Anis Sofia", department: "Talent Development", match: "HR-Match-08", table: 8, opponent: "Jonathan Teoh", round2Heat: "Table Beta" },
  { id: 17, name: "Pravin Kumar", department: "Office Admin", match: "HR-Match-09", table: 9, opponent: "Grace Ting", round2Heat: "Table Beta" },
  { id: 18, name: "Grace Ting", department: "HR Analytics", match: "HR-Match-09", table: 9, opponent: "Pravin Kumar", round2Heat: "Table Beta" },
  { id: 19, name: "Faizal Ramli", department: "Procurement Admin", match: "HR-Match-10", table: 10, opponent: "Wendy Kok", round2Heat: "Table Beta" },
  { id: 20, name: "Wendy Kok", department: "HR Operations", match: "HR-Match-10", table: 10, opponent: "Faizal Ramli", round2Heat: "Table Beta" },

  { id: 21, name: "Imran Fauzi", department: "Talent Sourcing", match: "HR-Match-11", table: 11, opponent: "Diana Low", round2Heat: "Table Gamma" },
  { id: 22, name: "Diana Low", department: "HR Business Partner", match: "HR-Match-11", table: 11, opponent: "Imran Fauzi", round2Heat: "Table Gamma" },
  { id: 23, name: "Kenneth Gomez", department: "Corporate Services", match: "HR-Match-12", table: 12, opponent: "Nadia Shahira", round2Heat: "Table Gamma" },
  { id: 24, name: "Nadia Shahira", department: "Talent Development", match: "HR-Match-12", table: 12, opponent: "Kenneth Gomez", round2Heat: "Table Gamma" },
  { id: 25, name: "Viknesh Rao", department: "IT & HR Systems", match: "HR-Match-13", table: 13, opponent: "Fatin Nabilah", round2Heat: "Table Gamma" },
  { id: 26, name: "Fatin Nabilah", department: "HR Operations", match: "HR-Match-13", table: 13, opponent: "Viknesh Rao", round2Heat: "Table Gamma" },
  { id: 27, name: "Bryan Chen", department: "Logistics Admin", match: "HR-Match-14", table: 14, opponent: "Amira Zulkifli", round2Heat: "Table Gamma" },
  { id: 28, name: "Amira Zulkifli", department: "People Experience", match: "HR-Match-14", table: 14, opponent: "Bryan Chen", round2Heat: "Table Gamma" },
  { id: 29, name: "Hafiz Suhaimi", department: "Health & Safety Admin", match: "HR-Match-15", table: 15, opponent: "Evelyn See", round2Heat: "Table Gamma" },
  { id: 30, name: "Evelyn See", department: "Talent Management", match: "HR-Match-15", table: 15, opponent: "Hafiz Suhaimi", round2Heat: "Table Gamma" }
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
