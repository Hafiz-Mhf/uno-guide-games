// tests/verify-guest-admin-separation.js
import fs from 'fs';
import {
  DEFAULT_ADMIN_USER,
  DEFAULT_ADMIN_PASS,
  isAdminAuthenticated,
  loginAdmin,
  logoutAdmin,
  TRANSLATIONS
} from '../app.js';

console.log('Testing Guest vs Admin Separation & Local Authentication...');

// 1. Mock LocalStorage and DOM for auth testing
let mockStore = {};
global.localStorage = {
  getItem: (k) => mockStore[k] || null,
  setItem: (k, v) => { mockStore[k] = String(v); },
  removeItem: (k) => { delete mockStore[k]; },
  clear: () => { mockStore = {}; }
};

// Test Default State: Guest
if (isAdminAuthenticated() !== false) {
  console.error('FAIL: isAdminAuthenticated must default to false for guests');
  process.exit(1);
}

// Test Failed Login
const failAttempt = loginAdmin('admin', 'wrongpass123');
if (failAttempt.success !== false) {
  console.error('FAIL: loginAdmin should fail with incorrect password');
  process.exit(1);
}
if (isAdminAuthenticated() !== false) {
  console.error('FAIL: isAdminAuthenticated should remain false after failed login');
  process.exit(1);
}

// Test Successful Login
const successAttempt = loginAdmin('admin', 'uno2026');
if (successAttempt.success !== true) {
  console.error('FAIL: loginAdmin should succeed with default credentials admin/uno2026');
  process.exit(1);
}
if (isAdminAuthenticated() !== true) {
  console.error('FAIL: isAdminAuthenticated must be true after successful login');
  process.exit(1);
}
if (mockStore['uno_admin_logged_in'] !== 'true') {
  console.error('FAIL: localStorage uno_admin_logged_in must be set to "true"');
  process.exit(1);
}

// Test Logout
logoutAdmin();
if (isAdminAuthenticated() !== false) {
  console.error('FAIL: isAdminAuthenticated must be false after logoutAdmin()');
  process.exit(1);
}
if (mockStore['uno_admin_logged_in']) {
  console.error('FAIL: localStorage uno_admin_logged_in must be removed on logout');
  process.exit(1);
}

// 2. Verify index.html contains all required UI elements
const html = fs.readFileSync('index.html', 'utf-8');

const requiredAuthIds = [
  'adminLoginModalOverlay',
  'adminUsernameInput',
  'adminPasswordInput',
  'adminTogglePasswordBtn',
  'adminLoginError',
  'adminLoginForm',
  'adminLoginSubmitBtn',
  'adminLoginCancelBtn',
  'adminLoginCloseX',
  'openAdminLoginBtn',
  'adminStatusGroup',
  'adminLogoutBtn',
  'deskAdminSessionBar',
  'deskSwitchGuestBtn'
];

for (const id of requiredAuthIds) {
  if (!html.includes(`id="${id}"`)) {
    console.error(`FAIL: index.html missing auth element id: "${id}"`);
    process.exit(1);
  }
}

// Verify admin-only-item class is tagged on desk, guide, rules, schedule tabs
if (!html.includes('admin-only-item') || !html.includes('desk-tab-btn admin-only-item')) {
  console.error('FAIL: index.html missing admin-only-item class on desk tab button');
  process.exit(1);
}

// Verify other 3 tabs (guide, rules, schedule) are admin-only and only matchups is public for guests
const adminTabs = ['guide', 'rules', 'schedule', 'desk'];
for (const tab of adminTabs) {
  if (!html.includes(`data-tab="${tab}"`)) {
    console.error(`FAIL: missing tab button for "${tab}"`);
    process.exit(1);
  }
}
if (!html.includes('class="tab-btn active" data-tab="matchups"')) {
  console.error('FAIL: matchups tab must be default active public tab for guest');
  process.exit(1);
}

// Verify fast restore in index.html head checks uno_admin_logged_in
if (!html.includes('uno_admin_logged_in') || !html.includes("targetTab === 'desk' && !isAdmin")) {
  console.error('FAIL: index.html head fast restore must guard desk tab against unauthenticated guests');
  process.exit(1);
}

// 3. Verify CSS styling rules for guest vs admin
const css = fs.readFileSync('styles.css', 'utf-8');
const requiredCssPatterns = [
  'body.role-guest .admin-only-item',
  'body.role-admin #adminStatusGroup',
  'tab-nav.guest-mode',
  'tab-nav.admin-mode',
  'admin-login-modal-overlay',
  'admin-login-card',
  'desk-admin-session-bar'
];

for (const pattern of requiredCssPatterns) {
  if (!css.includes(pattern)) {
    console.error(`FAIL: styles.css missing pattern: "${pattern}"`);
    process.exit(1);
  }
}

// 4. Verify auth translation dictionaries in app.js
const authKeys = [
  'adminLogin',
  'organizerActive',
  'logout',
  'adminBadge',
  'modalTitle',
  'modalSubtitle',
  'usernameLabel',
  'passwordLabel',
  'loginBtn',
  'cancelBtn',
  'localNote',
  'deskBannerTitle',
  'deskBannerSub',
  'switchToGuest'
];

for (const k of authKeys) {
  if (!TRANSLATIONS.en.auth || !TRANSLATIONS.en.auth[k]) {
    console.error(`FAIL: TRANSLATIONS.en.auth missing key "${k}"`);
    process.exit(1);
  }
  if (!TRANSLATIONS.bm.auth || !TRANSLATIONS.bm.auth[k]) {
    console.error(`FAIL: TRANSLATIONS.bm.auth missing key "${k}"`);
    process.exit(1);
  }
}

// 5. Verify Mobile View Hardening & Safe Guest Mode Defaults
if (!html.includes('<body class="role-guest">')) {
  console.error('FAIL: index.html <body> must include class="role-guest" by default to prevent organizer mode flashes on mobile');
  process.exit(1);
}

if (!css.includes('body:not(.explicit-mobile-admin) #deskView')) {
  console.error('FAIL: styles.css must include mobile hardening rule to hide #deskView on mobile screens');
  process.exit(1);
}

const appJs = fs.readFileSync('app.js', 'utf-8');
if (!appJs.includes('?view=guest#matchups')) {
  console.error('FAIL: app.js share URLs must include ?view=guest#matchups to enforce guest view for mobile attendees');
  process.exit(1);
}

console.log('PASS: All Guest vs Admin separation and local auth tests passed successfully!');
