// tests/verify-card-engine.js
import { isPlayable, getPlayReason, SCENARIOS } from '../card-engine.js';

console.log('Testing UNO Card Engine with Color Card logic...');

const red7 = { color: 'red', value: '7', type: 'number' };
const blue7 = { color: 'blue', value: '7', type: 'number' };
const red3 = { color: 'red', value: '3', type: 'number' };
const green4 = { color: 'green', value: '4', type: 'number' };
const colorCard = { color: 'wild', value: 'wild', type: 'wild' };
const colorPlus4 = { color: 'wild', value: '+4', type: 'wild' };

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

// Color card playable on anything
if (!isPlayable(colorCard, red7) || !isPlayable(colorPlus4, red7)) {
  console.error('FAIL: Color card should be playable on red7');
  process.exit(1);
}

// Mismatched color and number
if (isPlayable(green4, red7)) {
  console.error('FAIL: green4 should NOT be playable on red7');
  process.exit(1);
}

// Chosen color test: colorCard on table with chosenColor='blue'
const tableColorCard = { color: 'wild', value: 'wild', type: 'wild', chosenColor: 'blue' };
if (!isPlayable(blue7, tableColorCard)) {
  console.error('FAIL: blue7 should match chosenColor blue on tableColorCard');
  process.exit(1);
}

if (isPlayable(red3, tableColorCard)) {
  console.error('FAIL: red3 should NOT match chosenColor blue on tableColorCard');
  process.exit(1);
}

// Another color card is always playable even if chosenColor is active
if (!isPlayable(colorPlus4, tableColorCard)) {
  console.error('FAIL: Color +4 should be playable on tableColorCard');
  process.exit(1);
}

// Scenarios check
if (!Array.isArray(SCENARIOS) || SCENARIOS.length < 3) {
  console.error('FAIL: Expected at least 3 preset scenarios');
  process.exit(1);
}

console.log('PASS: All card-engine tests passed!');
