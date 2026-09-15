# LIBRA — Smart Library Catalog & Asset Management Platform

> *“Discover. Borrow. Track. Return.”*  
> **Your library, intelligently organized.**

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Build](https://img.shields.io/badge/Build-Passing-10B981.svg)]()

LIBRA is a complete, production-quality, portfolio-grade Single Page Application (SPA) designed as a modern SaaS product for academic, enterprise, and community libraries. Rather than a basic CRUD system, LIBRA delivers a command center experience with fluid glassmorphic surfaces, dynamic penalty engines, multi-attribute natural language search, asset management, and dark/light themes.

---

## ✨ Signature Highlights

### ⚡ 1. Quick Borrow Workflow
A streamlined 3-step checkout flow that issues books in under 10 seconds:
1. **Select Borrower**: Search member by name, student ID, or department.
2. **Select Book**: Instant lookup of titles with live inventory copy counts.
3. **Confirm & Issue**: Automatic return due date calculation (configurable 7/14/21/30 days) and celebratory receipt generation.

### 🧠 2. Smart Natural Language Search
Supports contextual search prompts in addition to standard queries:
- *“Books about psychology for beginners”*
- *“Programming books under 400 pages”*
- *“Self-improvement books similar to Atomic Habits”*
Features real-time debounced indexing, auto-suggestions, category filter chips, and multi-attribute sorting.

### ⚖️ 3. Automatic Penalty Engine
Dynamic date-difference mathematical calculation:
- Configurable penalty rate (default: ₹10 per overdue day)
- Configurable grace period (default: 0 days)
- Book condition surcharges:
  - 🟢 **Good**: ₹0
  - 🟡 **Minor Damage**: +₹50
  - 🔴 **Damaged**: +₹150
- Zero hardcoded fines; dynamic evaluation against current date or actual return date.

### 📦 4. Library Asset Management
Extends beyond books to monitor physical technology & facility infrastructure:
- Equipment: Laptops (Dell Latitude), Projectors (Epson High-Res), Barcode Scanners, Tablets, Noise-Cancelling Headphones
- Furniture: Herman Miller Aeron Chairs, Mobile Magnetic Glass Whiteboards, Oak Modular Study Tables
- Real-time statuses: `Available`, `In Use`, `Maintenance`.

### 🎨 5. Dynamic Theme Engine & Dark Mode
- **Light Mode**: Off-white clean canvas (`#F6F8FF`), subtle translucent glassmorphism (`backdrop-filter: blur(12px)`), soft shadows.
- **Dark Mode**: Deep navy SaaS aesthetic (`#0B132B`, `#121E3E`), soft glowing borders, zero harsh contrast.
- **5 Selectable Color Accents**:
  1. 🌊 **Ocean Blue** (Default)
  2. 🍃 **Mint Fresh**
  3. 🔮 **Lavender Dream**
  4. ⛅ **Sky Minimal**
  5. 🌌 **Midnight Luxe**
- All theme choices persist across sessions via `localStorage`.

---

## 🗺️ Application Routes

### Public
- **Landing Showcase (`/`)**: Hero section ("More Books. Brighter Futures."), smart search, live counters (10K+ Books, 2K+ Active Members, 99% Availability), feature breakdown, and testimonials.
- **Login (`/login`)**: 1-click quick demo login buttons for **Chief Librarian (Admin)** and **Student Member (Priya Singh)**.
- **Sign Up (`/signup`)**: Immediate registration for students and faculty.

### Application (Protected Command Center)
- **Dashboard (`/dashboard`)**: KPI cards with trend indicators, **Library Pulse** dynamic insights, interactive SVG circulation charts (Issued vs. Returned, Category distribution), and live recent activity feed.
- **Catalog (`/catalog`)**: Rich book cards with hover lift, star ratings, stock badges, wishlist toggle, and `+ Add Book` modal.
- **Book Details (`/book/:id`)**: Comprehensive bibliographic specifications, monthly borrowing statistics, and "You may also like" related recommendation carousel.
- **Quick Borrow (`/borrow`)**: 3-step checkout with due date automation and confetti celebration.
- **Return Book (`/return`)**: Active loans filter, condition assessment, instant penalty settlement.
- **Needs Attention / Overdue (`/overdue`)**: Action center with live overdue badges, single-click reminder notices, and bulk automated alert broadcast.
- **Members (`/members`)**: Member directory with department filters and `+ Add Member` modal.
- **Member Details (`/member/:id`)**: Borrower profile, active loans, lifetime history, and penalty settlement ledger.
- **Library Assets (`/assets`)**: Hardware and furniture inventory with status rotation.
- **Analytics (`/analytics`)**: Date range filters (7D, 30D, 3M, 6M, 1Y), circulation demand curves, top books leaderboard, and CSV report export.
- **Notifications Center (`/notifications`)**: Alert feed with category filters, unread badges, and read toggles.
- **Settings (`/settings`)**: Theme switcher, dark mode toggle, penalty rule editor, and 1-click **Reset to Demo Data**.

---

## 🏗️ Technical Architecture & Stack

```
Library-Catalog/
├── index.html                  # HTML5 shell with Google Fonts
├── server.js                   # Node.js production server with /api/health
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies & scripts
└── src/
    ├── main.jsx                # Entry point
    ├── App.jsx                 # Hash router & context wrapper
    ├── data/
    │   └── initialData.js      # 32 books, 16 members, 22 loans, 12 assets, 10 notifications
    ├── utils/
    │   ├── penaltyEngine.js    # calculatePenalty, calculateDaysLate, calculateDueDate
    │   ├── searchEngine.js     # Natural language parser, multi-attribute filter
    │   └── formatters.js       # Dates, INR currency, status badge helpers
    ├── context/
    │   └── LibraryContext.jsx  # React Context with action dispatchers
    ├── reducer/
    │   └── libraryReducer.js   # useReducer synchronized state machine
    ├── hooks/
    │   ├── useLibrary.js       # Typed context hook
    │   ├── useRouter.js        # Hash-based SPA routing hook
    │   ├── useDebounce.js      # Debounced search input
    │   └── useLocalStorage.js  # Persistence hook
    ├── styles/
    │   ├── variables.css       # CSS custom properties, 5 themes & dark mode
    │   └── global.css          # Reset, typography, animations, scrollbars
    ├── components/
    │   ├── common/             # Button, Card, Badge, Modal, Toast, StatCard, EmptyState, Logo
    │   └── layout/             # Sidebar, Navbar, AppLayout
    └── pages/                  # 15 distinct views & pages
```

---

## 🚀 Running the Project Locally

### Prerequisites
- Node.js (v18+ or v24+)
- npm

### 1. Installation
```bash
npm install
```

### 2. Development Server (Vite)
Starts the rapid development server with hot-module replacement (HMR):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build & Compile
Compiles optimized static bundles into `/dist`:
```bash
npm run build
```

### 4. Production Server
Serves the compiled SPA using the built-in Node.js server with SPA fallback and healthcheck API:
```bash
npm start
```
Server runs on [http://localhost:5000](http://localhost:5000).  
Check API health: [http://localhost:5000/api/health](http://localhost:5000/api/health).

---

## 💾 Data Persistence & Reset

- All transactions, book loans, new members, theme choices, and settings are saved to browser `localStorage`.
- To reset everything back to the rich demo dataset at any time, navigate to **Settings → Data Management → Reset All Demo Data**.

---

## 📄 License
MIT License © 2026 LIBRA Platform.