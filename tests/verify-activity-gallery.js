import fs from 'fs';
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from '../gallery-data.js';
import {
  TRANSLATIONS,
  getActivityGalleryItems,
  renderActivityGallery,
  openActivityGalleryLightbox,
  closeActivityGalleryLightbox,
  navigateActivityGallery
} from '../app.js';

console.log('Testing Static Curated Activity Gallery...');

const html = fs.readFileSync('index.html', 'utf-8');
const css = fs.readFileSync('styles.css', 'utf-8');

const requiredIds = [
  'activityGallerySection',
  'activityGalleryPreview',
  'toggleActivityGalleryBtn',
  'activityGalleryPanel',
  'activityGalleryFilters',
  'activityGalleryGrid',
  'activityGalleryLightbox',
  'activityLightboxMedia',
  'closeActivityLightboxBtn',
  'previousActivityMediaBtn',
  'nextActivityMediaBtn'
];

for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) {
    console.error(`FAIL: index.html missing gallery element id="${id}"`);
    process.exit(1);
  }
}

if (GALLERY_ITEMS.length !== 22) {
  console.error(`FAIL: Expected 22 curated gallery items, found ${GALLERY_ITEMS.length}`);
  process.exit(1);
}

for (const item of GALLERY_ITEMS) {
  if (!['image', 'video'].includes(item.type)) {
    console.error(`FAIL: Unsupported media type for ${item.id}`);
    process.exit(1);
  }
  if (!item.title?.en || !item.title?.bm || !item.caption?.en || !item.caption?.bm) {
    console.error(`FAIL: Missing bilingual gallery metadata for ${item.id}`);
    process.exit(1);
  }
  if (!fs.existsSync(item.src)) {
    console.error(`FAIL: Missing gallery asset ${item.src}`);
    process.exit(1);
  }
}

if (getActivityGalleryItems('all').length !== 22) {
  console.error('FAIL: All-moments filter does not return every gallery item');
  process.exit(1);
}

if (getActivityGalleryItems('video').length !== 9) {
  console.error('FAIL: Video filter must return all 9 clips');
  process.exit(1);
}

for (const category of GALLERY_CATEGORIES) {
  if (!TRANSLATIONS.en.gallery.categories[category] || !TRANSLATIONS.bm.gallery.categories[category]) {
    console.error(`FAIL: Missing bilingual gallery category ${category}`);
    process.exit(1);
  }
}

for (const fn of [renderActivityGallery, openActivityGalleryLightbox, closeActivityGalleryLightbox, navigateActivityGallery]) {
  if (typeof fn !== 'function') {
    console.error('FAIL: Missing exported gallery function');
    process.exit(1);
  }
}

for (const marker of ['.activity-gallery-preview', '.activity-gallery-grid', 'column-count: 3', 'height: auto', 'object-fit: contain', '.activity-lightbox[hidden]', '@media (max-width: 640px)', '@media (prefers-reduced-motion: reduce)']) {
  if (!css.includes(marker)) {
    console.error(`FAIL: styles.css missing gallery marker ${marker}`);
    process.exit(1);
  }
}

if (css.includes('aspect-ratio: 4 / 3')) {
  console.error('FAIL: Gallery tiles must preserve each media asset\'s original aspect ratio');
  process.exit(1);
}

console.log('PASS: Static gallery assets, localization, DOM, filters, and lightbox checks passed!');
