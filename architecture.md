# Technical Architecture

## 1. System Overview
The web application is a client-side, zero-backend, mobile-first single-page application (SPA) designed to run seamlessly on participants' mobile browsers when scanned via a venue QR code at Chatter Box, MRANTI.

## 2. Technical Stack & Rationale
- **Core:** Vanilla HTML5, modern CSS3, and ES6 JavaScript.
- **Hosting:** Any static file server or CDN (GitHub Pages, Netlify, Vercel, or local static server).
- **Zero-Backend Design:** Eliminates network failure risks during live event execution. All player rosters, match room assignments, and localized copy are bundled directly into static assets.
- **Offline Tolerance:** Assets load instantly over venue Wi-Fi and cache in browser memory for uninterrupted access during matches.

## 3. Directory & Component Layout
- `index.html`: Semantic entry point housing the sticky header, segmented navigation, and view panels.
- `styles.css`: Custom responsive styling adhering to UNO brand palette and mobile viewports (375px–430px).
- `app.js`: Tab routing controller, reactive i18n translation renderer, and search filter.
- `tournament-data.js`: Master 30-player roster with match rooms and table mappings.
- `localization.md`: Master i18n dictionary.

## 4. Performance & Compatibility Targets
- First Contentful Paint (FCP): < 500ms on 4G / venue Wi-Fi.
- Supported Browsers: Mobile Safari (iOS 14+), Mobile Chrome (Android 9+), Edge, Firefox.
- Viewports: Optimized for 375px – 430px with fluid scaling for tablet and desktop display.