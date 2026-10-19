// card-engine.js

export function isPlayable(card, target) {
  if (!card || !target) return false;

  // Color Cards (Wild) can always be placed on anything
  if (card.color === 'wild') return true;

  // If the target on table is a Color Card with an active chosenColor, player must match that chosenColor
  if (target.color === 'wild' && target.chosenColor) {
    return card.color === target.chosenColor;
  }

  // Normal matching: same color OR same number/symbol
  if (card.color === target.color) return true;
  if (card.value === target.value) return true;

  return false;
}

export function getPlayReason(card, target, lang = 'en') {
  const isEn = lang === 'en';

  if (card.color === 'wild') {
    const cardName = card.value === '+4' 
      ? (isEn ? "Color +4 Card" : "Kad Warna +4")
      : (isEn ? "Color Card" : "Kad Warna");
    return {
      success: true,
      needsColorChoice: true,
      message: isEn
        ? `Legal Move! ${cardName} played. Please choose a color (Red, Yellow, Green, or Blue).`
        : `Pergerakan Sah! ${cardName} dimainkan. Sila pilih warna seterusnya (Merah, Kuning, Hijau, atau Biru).`
    };
  }

  const activeColor = (target.color === 'wild' && target.chosenColor) 
    ? target.chosenColor 
    : target.color;

  if (target.color === 'wild' && target.chosenColor) {
    if (card.color === target.chosenColor) {
      return {
        success: true,
        message: isEn
          ? `Legal Move! Matches chosen color (${target.chosenColor.toUpperCase()}).`
          : `Pergerakan Sah! Memadan warna yang dipilih (${target.chosenColor.toUpperCase()}).`
      };
    } else {
      return {
        success: false,
        message: isEn
          ? `Cannot Play! Active color was set to ${target.chosenColor.toUpperCase()}. Your card is ${card.color.toUpperCase()}.`
          : `Tidak Boleh Main! Warna aktif telah ditetapkan kepada ${target.chosenColor.toUpperCase()}. Kad anda berwarna ${card.color.toUpperCase()}.`
      };
    }
  }

  if (card.color === target.color) {
    return {
      success: true,
      message: isEn
        ? `Legal Move! Matches color (${card.color.toUpperCase()}).`
        : `Pergerakan Sah! Warna sepadan (${card.color.toUpperCase()}).`
    };
  }

  if (card.value === target.value) {
    return {
      success: true,
      message: isEn
        ? `Legal Move! Matches number/symbol (${card.value.toUpperCase()}).`
        : `Pergerakan Sah! Nombor/simbol sepadan (${card.value.toUpperCase()}).`
    };
  }

  return {
    success: false,
    message: isEn
      ? `Cannot Play! ${card.color.toUpperCase()} ${card.value.toUpperCase()} does not match ${target.color.toUpperCase()} or ${target.value.toUpperCase()}. Try another card or draw!`
      : `Tidak Boleh Main! ${card.color.toUpperCase()} ${card.value.toUpperCase()} tidak sepadan dengan ${target.color.toUpperCase()} atau ${target.value.toUpperCase()}. Pilih kad lain atau cabut kad!`
  };
}

export const SCENARIOS = [
  {
    id: 1,
    titleEn: "Scenario 1: Color & Number Fundamentals",
    titleBm: "Senario 1: Asas Warna & Nombor",
    target: { color: 'red', value: '7', type: 'number' },
    hand: [
      { id: 'c1', color: 'red', value: '3', type: 'number' },
      { id: 'c2', color: 'blue', value: '7', type: 'number' },
      { id: 'c3', color: 'green', value: '4', type: 'number' },
      { id: 'c4', color: 'yellow', value: 'skip', type: 'action' },
      { id: 'c5', color: 'wild', value: 'wild', type: 'wild' }
    ]
  },
  {
    id: 2,
    titleEn: "Scenario 2: Action Cards & 1v1 Clashes",
    titleBm: "Senario 2: Kad Aksi & Pertembungan 1v1",
    target: { color: 'blue', value: 'reverse', type: 'action' },
    hand: [
      { id: 'c6', color: 'blue', value: 'skip', type: 'action' },
      { id: 'c7', color: 'yellow', value: 'reverse', type: 'action' },
      { id: 'c8', color: 'red', value: '5', type: 'number' },
      { id: 'c9', color: 'blue', value: '+2', type: 'action' },
      { id: 'c10', color: 'green', value: '9', type: 'number' }
    ]
  },
  {
    id: 3,
    titleEn: "Scenario 3: Color +4 Card & Color Selection",
    titleBm: "Senario 3: Kad Warna +4 & Pemilihan Warna",
    target: { color: 'green', value: '2', type: 'number' },
    hand: [
      { id: 'c11', color: 'red', value: '9', type: 'number' },
      { id: 'c12', color: 'yellow', value: '5', type: 'number' },
      { id: 'c13', color: 'wild', value: '+4', type: 'wild' },
      { id: 'c14', color: 'blue', value: '8', type: 'number' },
      { id: 'c15', color: 'green', value: '+2', type: 'action' }
    ]
  }
];

export const DRAW_POOL = [
  { color: 'red', value: '1', type: 'number' },
  { color: 'blue', value: '2', type: 'number' },
  { color: 'green', value: '8', type: 'number' },
  { color: 'yellow', value: '5', type: 'number' },
  { color: 'red', value: '9', type: 'number' },
  { color: 'blue', value: '4', type: 'number' },
  { color: 'red', value: 'reverse', type: 'action' },
  { color: 'blue', value: 'skip', type: 'action' },
  { color: 'green', value: '+2', type: 'action' },
  { color: 'wild', value: 'wild', type: 'wild' },
  { color: 'wild', value: '+4', type: 'wild' }
];
