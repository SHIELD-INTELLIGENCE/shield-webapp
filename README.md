
# SHIELD WebApp

A **multi-platform intelligence hub** for SHIELD — built with **React + Vite**, deployed globally via **Netlify**, and combat-ready on Android via **Capacitor**.  
Runs seamlessly as a **PWA** or native Android app, with **Firebase** as the secure backend.

---

## Core Features

- **Multi-Platform Deployment** — Web, PWA, and Android APK from one secure codebase.
- **Blazing Speed** — React + Vite ensures instant load times and smooth ops.
- **Firebase-Powered** — Authentication, database, and mission data handling.
- **PWA Capabilities** — Installable on devices for offline-ready access.
- **CI/CD with Netlify** — Instant redeploys when mission code changes.
- **Android Packaging via Capacitor** — Native app experience for operatives in the field.

---

## Tech Stack

- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Mobile Bridge**: [Capacitor](https://capacitorjs.com/)
- **Backend/Cloud**: [Firebase](https://firebase.google.com/)
- **Deployment**: [Netlify](https://www.netlify.com/)
- **Language**: JavaScript (ES6+)

---

## Mission Files (Folder Structure)

```
root/
├── android/                # Android native project (Capacitor)
├── public/                 # Static assets, PWA manifest, icons
├── src/                    # Core React components & mission pages
│   ├── pages/               # Page-level mission screens
│   ├── App.jsx              # Central control interface
│   ├── main.jsx             # Entry point for deployment
│   ├── firebase.js          # Firebase credentials & ops config
│   └── index.css            # Global styles
├── capacitor.config.json    # Capacitor mission settings
├── netlify.toml             # Netlify deployment directives
├── package.json             # Dependencies & scripts
└── vite.config.js           # Vite configuration
```

---

## Deployment & Setup

### 1️. Clone Repository
```bash
git clone https://github.com/reyanshrajmishra/shield-webapp.git
cd shield-webapp
```

### 2️. Install Dependencies

```bash
npm install
```

### 3️. Run Locally (Web)

```bash
npm run dev
```

Access HQ: `http://localhost:5173/`

---

## Android Build Procedure

```bash
npm run build
npx cap sync android
npx cap open android
```

Compile & launch in **Android Studio** for field use.

---

## Netlify Deployment

Push updates to `main` branch for auto-deployment.
Manual deploy:

```bash
npm run build
```

Upload `dist/` to Netlify dashboard.

---

## License

[MIT](LICENSE) — Operate with integrity.

---
**SHIELD Motto:** *Intelligence, Elegance, Learning, and Defense.*

---