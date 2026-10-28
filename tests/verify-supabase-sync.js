// tests/verify-supabase-sync.js
import fs from 'fs';
import {
  SUPABASE_CONFIG,
  getSyncStatus,
  onSyncStatusChange,
  isNodeTestEnvironment
} from '../sync-engine.js';
import { TRANSLATIONS, persistTournamentState, openShareQrModal, closeShareQrModal } from '../app.js';

console.log('Testing Supabase Cloud Real-Time Sync & Share QR System...');

// 1. Verify Supabase configuration
if (SUPABASE_CONFIG.url !== 'https://csdhoihirffjqkkhkfnv.supabase.co') {
  console.error('FAIL: SUPABASE_CONFIG.url mismatch');
  process.exit(1);
}
if (SUPABASE_CONFIG.table !== 'tournament_state') {
  console.error('FAIL: SUPABASE_CONFIG.table must be tournament_state');
  process.exit(1);
}
if (!SUPABASE_CONFIG.anonKey || !SUPABASE_CONFIG.anonKey.startsWith('eyJ')) {
  console.error('FAIL: Missing or invalid Supabase anon key');
  process.exit(1);
}
if (!isNodeTestEnvironment()) {
  console.error('FAIL: isNodeTestEnvironment should return true under Node.js');
  process.exit(1);
}

// 2. Verify HTML structure for Cloud Sync & QR Modal
const html = fs.readFileSync('index.html', 'utf-8');
const requiredSyncElements = [
  'cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
  'id="cloudSyncStatusPill"',
  'id="deskShareQrBtn"',
  'id="deskQuickShareBtn"',
  'id="shareQrModalOverlay"',
  'id="qrCodeImage"',
  'id="shareDirectUrlInput"',
  'id="modalCopyShareUrlBtn"',
  'id="closeShareQrModalBtn"',
  'id="doneShareQrBtn"'
];

for (const needle of requiredSyncElements) {
  if (!html.includes(needle)) {
    console.error(`FAIL: index.html missing required sync element: ${needle}`);
    process.exit(1);
  }
}

// 3. Verify CSS styling rules exist
const css = fs.readFileSync('styles.css', 'utf-8');
const requiredCssClasses = [
  '.cloud-sync-pill',
  '.sync-dot',
  '.desk-cloud-bar',
  '.share-qr-card',
  '.qr-code-box',
  '.share-url-box'
];

for (const cls of requiredCssClasses) {
  if (!css.includes(cls)) {
    console.error(`FAIL: styles.css missing sync class: ${cls}`);
    process.exit(1);
  }
}

// 4. Verify Translations completeness
const requiredTranslationKeys = [
  'live',
  'syncing',
  'offline',
  'deskBadge',
  'deskHint',
  'shareQrBtn',
  'modalTitle',
  'modalSubtitle',
  'scanTip',
  'copyUrlBtn',
  'copiedUrl',
  'closeModal'
];

for (const key of requiredTranslationKeys) {
  if (!TRANSLATIONS.en.cloudSync?.[key]) {
    console.error(`FAIL: TRANSLATIONS.en.cloudSync missing key "${key}"`);
    process.exit(1);
  }
  if (!TRANSLATIONS.bm.cloudSync?.[key]) {
    console.error(`FAIL: TRANSLATIONS.bm.cloudSync missing key "${key}"`);
    process.exit(1);
  }
}

// 5. Verify exported functions
if (typeof persistTournamentState !== 'function') {
  console.error('FAIL: persistTournamentState must be exported as a function');
  process.exit(1);
}
if (typeof openShareQrModal !== 'function' || typeof closeShareQrModal !== 'function') {
  console.error('FAIL: openShareQrModal and closeShareQrModal must be exported');
  process.exit(1);
}

console.log('PASS: All Supabase Cloud Sync & Share QR assertions passed successfully!');
