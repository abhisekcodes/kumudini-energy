# Kumudini Energy

Kumudini Energy Private Limited is Keonjhar, Odisha's leading provider of clean energy, solar power plants, clean biomass cookstoves, and custom ecological electronics. This repository hosts the front-end website and built pipeline for the company.

## 🚀 Live Demo & Repository
*   **GitHub Repository**: [abhisekcodes/kumudini-energy](https://github.com/abhisekcodes/kumudini-energy)
*   **Location**: Keonjhar, Odisha, India

---

## ✨ Features

-   **Interactive Clean Energy Footprint Map**: Custom interactive Map powered by Leaflet.js showing local installations and clean energy statistics (Solar Capacity & Cookstoves distributed) across various districts of Odisha.
-   **Interactive Ecological Catalog**: Explore grid-tied solar plants, standalone off-grid systems, Prakti and Eco Chula biomass stoves, solar DC freezers, and custom LED drivers/PCBs with a modal-based technical specifications viewer.
-   **Impact Dashboard**: Real-time counter animations demonstrating households powered, clean energy generated (kWh), CO2 emissions saved (tons), and eco stoves distributed.
-   **Smart Contact Form**: Floating label input fields, preferred contact method selection (WhatsApp, Call, Email), and a cursor-tracking glassmorphic glow spotlight backdrop.
-   **Dark / Light / System Theme Mode**: High-efficiency theme manager with system setting auto-detection preventing un-themed screen flashes.
-   **Page Preloader**: Custom premium preloader showing logo and loading progress bar animations.
-   **Mobile Navigation Hamburger**: Fully responsive fluid navigation for mobile screens with scroll-locks.

---

## 🛠️ Technology Stack

-   **Core**: HTML5, Vanilla JavaScript, Vanilla CSS3 (Custom Variables/Design Tokens)
-   **Maps API**: Leaflet.js Map Library (uses theme-aware CartoDB tile layers)
-   **Build Tools**: Node.js, Clean-CSS (minifier), Terser (JS parser/compressor), HTML-Minifier-Terser

---

## ⚙️ Development & Scripts

To run the site locally or compile the production assets, follow these steps:

### Install Dependencies
```bash
npm install
```

### Start Development Server
Launches a local HTTP server on port 8080.
```bash
npm start
```

### Compile Production Build
Minifies CSS, JS, and HTML, copies assets, updates production asset paths, and outputs the optimized bundle into `./dist/`.
```bash
npm run build
```

### Serve Production Build
Runs a local server pointing directly to the compiled production directory.
```bash
npm run serve:prod
```
