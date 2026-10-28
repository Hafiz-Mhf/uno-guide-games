// Static event gallery manifest.
// Add new files to "Gallery Engagement Session", then add one item here.
// Keep featured photos first because the guest preview uses this order.
const GALLERY_ROOT = 'Gallery Engagement Session';

export const GALLERY_ITEMS = [
  {
    id: 'full-room-action',
    type: 'image',
    src: `${GALLERY_ROOT}/9.jpeg`,
    category: 'tournament',
    featured: true,
    title: { en: 'The room comes alive', bm: 'Suasana acara semakin meriah' },
    caption: {
      en: 'Teams gather around the floor for a fast and lively UNO round.',
      bm: 'Pasukan berkumpul di ruang permainan untuk pusingan UNO yang pantas dan meriah.'
    }
  },
  {
    id: 'table-showdown',
    type: 'image',
    src: `${GALLERY_ROOT}/6.jpeg`,
    category: 'tournament',
    featured: true,
    title: { en: 'Cards on the table', bm: 'Kad di atas meja' },
    caption: {
      en: 'A table showdown draws a crowd and plenty of reactions.',
      bm: 'Pertarungan di meja menarik perhatian ramai dan pelbagai reaksi.'
    }
  },
  {
    id: 'shared-laughs',
    type: 'image',
    src: `${GALLERY_ROOT}/15.jpeg`,
    category: 'tournament',
    featured: true,
    title: { en: 'Shared laughs between rounds', bm: 'Gelak tawa antara pusingan' },
    caption: {
      en: 'Colleagues reconnect while the next play takes shape.',
      bm: 'Rakan sekerja berinteraksi sementara permainan seterusnya bermula.'
    }
  },
  {
    id: 'physical-heat',
    type: 'image',
    src: `${GALLERY_ROOT}/11.jpeg`,
    category: 'tournament',
    featured: true,
    title: { en: 'Physical heat in progress', bm: 'Perlawanan fizikal sedang berlangsung' },
    caption: {
      en: 'Four players focus on every card during the physical heat.',
      bm: 'Empat pemain memberi tumpuan pada setiap kad dalam perlawanan fizikal.'
    }
  },
  {
    id: 'warm-up-briefing-one',
    type: 'image',
    src: `${GALLERY_ROOT}/4.jpeg`,
    category: 'briefing',
    title: { en: 'Test Round briefing', bm: 'Taklimat Pusingan Ujian' },
    caption: {
      en: 'The facilitator gets everyone ready for the warm-up round.',
      bm: 'Fasilitator menyediakan semua peserta untuk pusingan pemanasan.'
    }
  },
  {
    id: 'warm-up-briefing-two',
    type: 'image',
    src: `${GALLERY_ROOT}/5.jpeg`,
    category: 'briefing',
    title: { en: 'Ready for the first card', bm: 'Bersedia untuk kad pertama' },
    caption: {
      en: 'Final instructions before the activity begins.',
      bm: 'Arahan terakhir sebelum aktiviti bermula.'
    }
  },
  {
    id: 'table-reactions-one',
    type: 'image',
    src: `${GALLERY_ROOT}/7.jpeg`,
    category: 'tournament',
    title: { en: 'A move worth watching', bm: 'Gerakan yang menarik perhatian' },
    caption: {
      en: 'Players and spectators share the tension around the table.',
      bm: 'Pemain dan penonton berkongsi debaran di sekeliling meja.'
    }
  },
  {
    id: 'table-reactions-two',
    type: 'image',
    src: `${GALLERY_ROOT}/8.jpeg`,
    category: 'tournament',
    title: { en: 'The next card decides it', bm: 'Kad seterusnya menjadi penentu' },
    caption: {
      en: 'The table watches closely as the round develops.',
      bm: 'Semua di meja memerhati dengan teliti ketika pusingan berlangsung.'
    }
  },
  {
    id: 'uno-hand-reveal',
    type: 'image',
    src: `${GALLERY_ROOT}/10.jpeg`,
    category: 'tournament',
    title: { en: 'A confident UNO hand', bm: 'Pegangan kad UNO penuh yakin' },
    caption: {
      en: 'A player shows the hand while the table plans its response.',
      bm: 'Seorang pemain menunjukkan kad sementara pemain lain merancang langkah.'
    }
  },
  {
    id: 'floor-heat-break',
    type: 'image',
    src: `${GALLERY_ROOT}/12.jpeg`,
    category: 'tournament',
    title: { en: 'A quick break between plays', bm: 'Rehat ringkas antara permainan' },
    caption: {
      en: 'Players reset before returning to the cards.',
      bm: 'Pemain berehat seketika sebelum kembali kepada permainan.'
    }
  },
  {
    id: 'crowded-table-one',
    type: 'image',
    src: `${GALLERY_ROOT}/13.jpeg`,
    category: 'tournament',
    title: { en: 'Every seat has a view', bm: 'Setiap tempat ada pandangan' },
    caption: {
      en: 'The crowd closes in as the table approaches a decisive play.',
      bm: 'Orang ramai menghampiri meja ketika permainan menuju langkah penentu.'
    }
  },
  {
    id: 'crowded-table-two',
    type: 'image',
    src: `${GALLERY_ROOT}/14.jpeg`,
    category: 'tournament',
    title: { en: 'Tournament table focus', bm: 'Tumpuan di meja kejohanan' },
    caption: {
      en: 'A focused hand keeps players and spectators guessing.',
      bm: 'Pegangan kad yang penuh tumpuan membuat pemain dan penonton terus meneka.'
    }
  },
  {
    id: 'closing-table',
    type: 'image',
    src: `${GALLERY_ROOT}/16.jpeg`,
    category: 'tournament',
    title: { en: 'One more round together', bm: 'Satu lagi pusingan bersama' },
    caption: {
      en: 'The team stays gathered for another memorable round.',
      bm: 'Pasukan terus berkumpul untuk satu lagi pusingan yang bermakna.'
    }
  },
  ...Array.from({ length: 6 }, (_, index) => ({
    id: `activity-video-${index + 1}`,
    type: 'video',
    src: `${GALLERY_ROOT}/vid ${index + 1}.mp4`,
    category: 'video',
    title: {
      en: `Activity highlight ${index + 1}`,
      bm: `Sorotan aktiviti ${index + 1}`
    },
    caption: {
      en: 'A short moment captured during today\'s UNO engagement session.',
      bm: 'Detik ringkas yang dirakam semasa sesi penglibatan UNO hari ini.'
    }
  })),
  {
    id: 'first-place-video',
    type: 'video',
    src: `${GALLERY_ROOT}/vid 7 1st place.mp4`,
    category: 'awards',
    title: { en: 'Grand Champion recognition', bm: 'Pengiktirafan Juara Keseluruhan' },
    caption: {
      en: 'The Grand Champion receives first-place recognition.',
      bm: 'Juara Keseluruhan menerima pengiktirafan tempat pertama.'
    }
  },
  {
    id: 'second-place-video',
    type: 'video',
    src: `${GALLERY_ROOT}/vid 8 2nd place.mp4`,
    category: 'awards',
    title: { en: 'Runner-Up recognition', bm: 'Pengiktirafan Naib Juara' },
    caption: {
      en: 'The Runner-Up receives second-place recognition.',
      bm: 'Naib Juara menerima pengiktirafan tempat kedua.'
    }
  },
  {
    id: 'third-place-video',
    type: 'video',
    src: `${GALLERY_ROOT}/vid 9 3rd place.mp4`,
    category: 'awards',
    title: { en: 'Third-place recognition', bm: 'Pengiktirafan Tempat Ketiga' },
    caption: {
      en: 'The third-place finalist receives podium recognition.',
      bm: 'Finalis tempat ketiga menerima pengiktirafan podium.'
    }
  }
];

export const GALLERY_CATEGORIES = ['all', 'briefing', 'tournament', 'awards', 'video'];
