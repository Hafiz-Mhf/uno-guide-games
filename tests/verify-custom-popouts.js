// tests/verify-custom-popouts.js
import fs from 'fs';

console.log('Testing Premium Custom Popouts & Dialog System...');

// 1. Verify index.html contains all custom dialog elements
const html = fs.readFileSync('index.html', 'utf-8');
const requiredDialogIds = [
  'customDialogOverlay',
  'customDialogCard',
  'customDialogCloseX',
  'customDialogIconBubble',
  'customDialogIcon',
  'customDialogKicker',
  'customDialogTitle',
  'customDialogMessage',
  'customDialogNote',
  'customDialogActionsRow',
  'customDialogCancelBtn',
  'customDialogConfirmBtn',
  'appToastContainer'
];

for (const id of requiredDialogIds) {
  if (!html.includes(`id="${id}"`)) {
    console.error(`FAIL: index.html missing custom dialog element with id: ${id}`);
    process.exit(1);
  }
}

// 2. Verify styles.css contains dialog and toast animation styles
const css = fs.readFileSync('styles.css', 'utf-8');
const requiredCssClasses = [
  '.custom-dialog-overlay',
  '.custom-dialog-card',
  '.dialog-icon-bubble',
  '.dialog-btn-confirm',
  '.dialog-btn-cancel',
  '.app-toast-container',
  '.app-toast'
];

for (const cls of requiredCssClasses) {
  if (!css.includes(cls)) {
    console.error(`FAIL: styles.css missing style rule for: ${cls}`);
    process.exit(1);
  }
}

// 3. Test app.js exports showCustomConfirm, showCustomAlert, showToast
const { showCustomConfirm, showCustomAlert, showToast } = await import('../app.js');

if (typeof showCustomConfirm !== 'function') {
  console.error('FAIL: showCustomConfirm is not exported as a function');
  process.exit(1);
}
if (typeof showCustomAlert !== 'function') {
  console.error('FAIL: showCustomAlert is not exported as a function');
  process.exit(1);
}
if (typeof showToast !== 'function') {
  console.error('FAIL: showToast is not exported as a function');
  process.exit(1);
}

// 4. Test safe headless fallback resolution
const confirmResult = await showCustomConfirm({ title: 'Test headless fallback' });
if (confirmResult !== true) {
  console.error('FAIL: Headless showCustomConfirm should resolve true in non-DOM environment');
  process.exit(1);
}

await showCustomAlert({ title: 'Test headless alert' });

console.log('PASS: All Custom Popouts & Dialog assertions passed successfully!');
