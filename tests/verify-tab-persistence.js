// tests/verify-tab-persistence.js
import fs from 'fs';

console.log('Testing Tab Persistence and Refresh Navigation...');

// 1. Verify index.html contains tab elements and fast restore script
const html = fs.readFileSync('index.html', 'utf-8');
const tabs = ['guide', 'rules', 'schedule', 'desk'];

for (const tab of tabs) {
  if (!html.includes(`data-tab="${tab}"`)) {
    console.error(`FAIL: index.html missing main nav button for data-tab="${tab}"`);
    process.exit(1);
  }
  if (!html.includes(`id="${tab}View"`)) {
    console.error(`FAIL: index.html missing view container for id="${tab}View"`);
    process.exit(1);
  }
  if (!html.includes(`data-switch-tab="${tab}"`)) {
    console.error(`FAIL: index.html missing quick nav pill for data-switch-tab="${tab}"`);
    process.exit(1);
  }
}

// Verify fast restore script in head
if (!html.includes('uno_active_tab') || !html.includes('window.location.hash')) {
  console.error('FAIL: index.html missing head fast restore script for active tab');
  process.exit(1);
}

// 2. Mock browser environment to test switchTab and initApp
let storedData = {};
global.localStorage = {
  getItem: (k) => storedData[k] || null,
  setItem: (k, v) => { storedData[k] = String(v); },
  removeItem: (k) => { delete storedData[k]; },
  clear: () => { storedData = {}; }
};

let currentHash = '';
global.window = {
  location: {
    get hash() { return currentHash; },
    set hash(v) { currentHash = v; }
  },
  history: {
    replaceState: (_state, _title, url) => {
      currentHash = url;
    }
  },
  scrollTo: () => {},
  addEventListener: () => {}
};

// Create a DOM mock structure
class MockElement {
  constructor(id = '', className = '', attrs = {}) {
    this.id = id;
    this.className = className;
    this.attrs = attrs;
    this.listeners = {};
    this.classList = {
      add: (c) => {
        const set = new Set(this.className.split(/\s+/).filter(Boolean));
        set.add(c);
        this.className = [...set].join(' ');
      },
      remove: (c) => {
        const set = new Set(this.className.split(/\s+/).filter(Boolean));
        set.delete(c);
        this.className = [...set].join(' ');
      },
      toggle: (c, force) => {
        if (force) this.classList.add(c);
        else this.classList.remove(c);
      },
      contains: (c) => this.className.split(/\s+/).includes(c)
    };
  }
  addEventListener(event, fn) {
    this.listeners[event] = fn;
  }
  getAttribute(name) {
    return this.attrs[name] || null;
  }
}

const mockElements = {
  tabBtns: tabs.map(t => new MockElement('', t === 'guide' ? 'tab-btn active' : 'tab-btn', { 'data-tab': t })),
  views: tabs.map(t => new MockElement(`${t}View`, t === 'guide' ? 'tab-content active' : 'tab-content')),
  quickPills: tabs.map(t => new MockElement('', t === 'guide' ? 'quick-nav-pill active' : 'quick-nav-pill', { 'data-switch-tab': t }))
};

global.document = {
  addEventListener: () => {},
  removeEventListener: () => {},
  querySelectorAll: (selector) => {
    if (selector === '.tab-btn') return mockElements.tabBtns;
    if (selector === '.tab-content') return mockElements.views;
    if (selector === '.quick-nav-pill') return mockElements.quickPills;
    return [];
  },
  querySelector: (selector) => {
    for (const t of tabs) {
      if (selector === `.tab-btn[data-tab="${t}"]`) {
        return mockElements.tabBtns.find(b => b.attrs['data-tab'] === t);
      }
    }
    return null;
  },
  getElementById: (id) => {
    return mockElements.views.find(v => v.id === id) || null;
  }
};

// Import switchTab
const { switchTab } = await import('../app.js');

// Test 1: Switch to 'desk' tab
switchTab('desk', false, true);

const deskBtn = mockElements.tabBtns.find(b => b.attrs['data-tab'] === 'desk');
const deskView = mockElements.views.find(v => v.id === 'deskView');
const guideView = mockElements.views.find(v => v.id === 'guideView');
const deskPill = mockElements.quickPills.find(p => p.attrs['data-switch-tab'] === 'desk');

if (!deskBtn.classList.contains('active')) {
  console.error('FAIL: desk tab button should be active');
  process.exit(1);
}
if (!deskView.classList.contains('active')) {
  console.error('FAIL: deskView should be active');
  process.exit(1);
}
if (guideView.classList.contains('active')) {
  console.error('FAIL: guideView should not be active');
  process.exit(1);
}
if (!deskPill.classList.contains('active')) {
  console.error('FAIL: desk quick nav pill should be active');
  process.exit(1);
}
if (global.localStorage.getItem('uno_active_tab') !== 'desk') {
  console.error('FAIL: localStorage uno_active_tab was not set to desk');
  process.exit(1);
}
if (currentHash !== '#desk') {
  console.error('FAIL: URL hash was not updated to #desk');
  process.exit(1);
}

// Test 2: Switch to 'rules' tab
switchTab('rules', false, true);
if (global.localStorage.getItem('uno_active_tab') !== 'rules') {
  console.error('FAIL: localStorage uno_active_tab was not set to rules');
  process.exit(1);
}
if (currentHash !== '#rules') {
  console.error('FAIL: URL hash was not updated to #rules');
  process.exit(1);
}

// Test 3: Invalid tab does not change current tab
switchTab('non_existent_tab', false, true);
if (global.localStorage.getItem('uno_active_tab') !== 'rules') {
  console.error('FAIL: invalid tab should not overwrite active tab');
  process.exit(1);
}

console.log('PASS: All Tab Persistence assertions passed successfully!');
