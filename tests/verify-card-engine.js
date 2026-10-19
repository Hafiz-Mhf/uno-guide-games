// tests/verify-card-engine.js
import { isPlayable, getPlayReason, SCENARIOS } from '../card-engine.js';

console.log('Testing UNO Card Engine...');

const red7 = { color: 'red', value: '7', type: 'number' };
const blue7 = { color: 'blue', value: '7', type: 'number' };
const red3 = { color: 'red', value: '3', type: 'number' };
const green4 = { color: 'green', value: '4', type: 'number' };
const wild = { color: 'wild', value: 'wild', type: 'wild' };

// Same number
if (!isPlayable(blue7, red7)) {
  console.error('FAIL: blue7 should be playable on red7');
  process.exit(1);
}

// Same color
if (!isPlayable(red3, red7)) {
  console.error('FAIL: red3 should be playable on red7');
  process.exit(1);
}

// Wild card
if (!isPlayable(wild, red7)) {
  console.error('FAIL: wild should be playable on red7');
  process.exit(1);
}

// Mismatched color and number
if (isPlayable(green4, red7)) {
  console.error('FAIL: green4 should NOT be playable on red7');
  process.exit(1);
}

// Reason check
const reason = getPlayReason(blue7, red7, 'en');
if (!reason.success || !reason.message.includes('7')) {
  console.error('FAIL: Invalid reason output for blue7 on red7');
  process.exit(1);
}

// Scenarios check
if (!Array.isArray(SCENARIOS) || SCENARIOS.length < 3) {
  console.error('FAIL: Expected at least 3 preset scenarios');
  process.exit(1);
}

console.log('PASS: All card-engine tests passed!');
