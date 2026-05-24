# ☀️ Kumudini Energy

**Kumudini Energy Private Limited** — Keonjhar, Odisha's leading provider of renewable energy solutions, solar power plants, clean biomass cookstoves, and custom ecological electronics.

> _Powering rural Odisha with clean, affordable energy since 2021._

[![Deploy](https://img.shields.io/badge/Live_Site-GitHub_Pages-2ea44f?style=for-the-badge&logo=github)](https://abhisekcodes.github.io/kumudini-energy/)
[![License](https://img.shields.io/badge/License-Proprietary-blue?style=for-the-badge)]()

---

## 🌐 Live Site

🔗 **[abhisekcodes.github.io/kumudini-energy](https://abhisekcodes.github.io/kumudini-energy/)**

---

## ✨ Features

### 🗺️ Interactive Footprint Map
- Custom Leaflet.js-powered map showing real installations across Odisha districts
- Theme-aware CartoDB tile layers (light/dark) that switch with the site theme
- Click-to-explore district cards with solar capacity & biomass stove statistics
- Auto-fills the contact form with district-specific inquiry details

### 🛒 Ecological Product Catalog
- Grid-tied solar plants, standalone off-grid systems, Prakti & Eco Chula biomass stoves, solar DC freezers, LED drivers, and custom PCBs
- Category filter tabs with smooth animated transitions
- Modal-based technical specifications viewer with detailed product data

### 📊 Impact Dashboard
- Animated counter widgets: households powered, clean energy generated (kWh), CO₂ saved (tons), eco stoves distributed
- Intersection Observer triggers counters only when scrolled into view

### 📬 Smart Contact Form
- Floating-label input fields with validation
- Preferred contact method selector (WhatsApp, Call, Email)
- Cursor-tracking glassmorphic glow spotlight on the form card
- Floating parallax bubble particles responding to mouse movement
- District-aware pre-fill from the footprint map

### 🌗 Theme System
- Three-mode toggle: Light → Dark → System → cycle
- System auto-detection via `prefers-color-scheme`
- Inline `<script>` flash prevention — theme is applied before first paint
- Leaflet map tiles switch dynamically with theme

### 📱 Fully Responsive Design
- Mobile hamburger navigation with scroll-lock overlay (activates at 1024px)
- 2-column contact info grid on desktop, single-column on mobile
- Fluid typography, adaptive grids, and touch-friendly interactions
- Comfortable on phones, tablets, small laptops, and desktops

### 🎨 Premium UI/UX
- Custom page preloader with logo animation and progress bar
- Scroll-reveal animations (left, right, bottom) via Intersection Observer
- Glassmorphism card effects, gradient borders, and micro-animations
- SVG logo with sun-spin hover animation
- Typed text effect on hero section headings

### 👥 Team Section
- Interactive team cards with tab switcher (Our Story, Vision, Team)
- Photo gallery with hover overlays
- Customer impact stories modal

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Structure** | HTML5 (semantic, SEO-optimized, Schema.org JSON-LD) |
| **Styling** | Vanilla CSS3 — custom properties, design tokens, glassmorphism |
| **Logic** | Vanilla JavaScript (ES6+) — zero frameworks |
| **Maps** | Leaflet.js with CartoDB tile layers |
| **Fonts** | Google Fonts — Outfit, Plus Jakarta Sans |
| **Build** | Node.js, Clean-CSS, Terser, HTML-Minifier-Terser |
| **Deploy** | GitHub Pages via `gh-pages` |

---

## 📁 Project Structure

```
kumudini-energy/
├── index.html            # Main single-page application
├── css/
│   └── style.css         # Complete stylesheet (~3000 lines)
├── js/
│   └── app.js            # All interactive logic (~1100 lines)
├── assets/               # Images, SVGs, team photos, product images
│   ├── logo.svg
│   ├── solar_hero.png
│   ├── grid_solar.png
│   ├── eco_chula.png
│   ├── team_*.png
│   └── ...               # 20 assets total
├── build.js              # Production build script
├── dist/                 # Compiled production output (auto-generated)
├── package.json
└── README.md
```

---

## ⚙️ Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)

### Install Dependencies
```bash
npm install
```

### Start Development Server
Launches a local HTTP server on port 8080 with cache disabled.
```bash
npm start
```
Then open [http://localhost:8080](http://localhost:8080) in your browser.

### Build for Production
Minifies CSS, JS, and HTML, copies assets, and outputs the optimized bundle into `./dist/`.
```bash
npm run build
```

### Serve Production Build
Runs a local server pointing to the compiled `./dist/` directory.
```bash
npm run serve:prod
```

### Deploy to GitHub Pages
Builds and publishes the `./dist/` folder to the `gh-pages` branch.
```bash
npm run build
npm run deploy
```

---

## 🌍 SEO & Accessibility

- Schema.org JSON-LD structured data for organization
- Open Graph and Twitter Card meta tags for social sharing
- Semantic HTML5 elements with proper heading hierarchy
- Descriptive `alt` text and ARIA-friendly interactive elements
- Optimized meta titles and descriptions

---

## 📞 Contact

- **Registered Office**: Bhatta Sahi, Old Town, Keonjhar, Odisha — 758001
- **Phone / WhatsApp**: +91 94372 58140
- **Email**: info@kumudinienergy.com

---

## 📄 License

This project is proprietary software of **Kumudini Energy Private Limited**. All rights reserved.

---

<p align="center">
  <em>Built with ☀️ clean energy and 💚 for rural Odisha</em>
</p>
