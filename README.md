<div align="center">

# SafeHarbor

### Mental health first aid — for the 3am moments.

**Breathing exercises · Grounding · Mood tracking · Private journal · Crisis hotlines**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-safeharbor-4A9B8F?style=for-the-badge&logo=vercel)](https://rahulkarda.github.io/safeharbor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev)

</div>

---

> *You're not alone. Help is here.*

SafeHarbor is a free, open-source mental health support app built for the moments when professional help isn't immediately available — the middle of the night, the quiet overwhelm, the panic that arrives without warning. It's not a replacement for therapy. It's a bridge.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🆘 **Crisis Resources** | 7 real hotlines with one-tap call links (988, Crisis Text Line, NAMI, Trevor Project, Veterans Line…) |
| 💨 **Guided Breathing** | 4 animated techniques — Box (4-4-4-4), 4-7-8, 5-5-5 Diaphragmatic, Pursed Lip — with countdown timers |
| ⚓ **Grounding (5-4-3-2-1)** | Full-screen interactive walkthrough for panic and dissociation |
| 📊 **Mood Tracking** | 1-10 scale + 16 emotions, 30-day trend charts, emotion frequency analysis |
| 📓 **Private Journal** | Safe journaling space with 5 therapeutic prompts and 30-second auto-save |
| 🌟 **Daily Affirmations** | 40 evidence-informed affirmations across 5 categories with favorites |
| 💡 **Wellness Tips** | 30 CBT/DBT-based daily tips that rotate each day |
| 🔐 **Private & Secure** | JWT auth, bcrypt passwords, rate-limited API, helmet security headers |

---

## 🖼️ Screenshots

<table>
  <tr>
    <td align="center"><b>Landing Page</b></td>
    <td align="center"><b>Dashboard</b></td>
    <td align="center"><b>Breathing Exercise</b></td>
  </tr>
  <tr>
    <td>Compassionate hero with quick actions</td>
    <td>Mood streak, 7-day chart, daily affirmation</td>
    <td>Animated breathing circle with phase timer</td>
  </tr>
  <tr>
    <td align="center"><b>Grounding (5-4-3-2-1)</b></td>
    <td align="center"><b>Crisis Resources</b></td>
    <td align="center"><b>Journal</b></td>
  </tr>
  <tr>
    <td>Step-by-step panic relief</td>
    <td>Hotlines + coping skills accordion</td>
    <td>Private editor with journaling prompts</td>
  </tr>
</table>

---

## 🚀 Quick Start

### Option 1 — One command

```bash
git clone https://github.com/rahulkarda/safeharbor.git
cd safeharbor
./start.sh
```

Open **http://localhost:5173** — done.

### Option 2 — Manual

```bash
# 1. Backend
cd server
npm install
cp .env.example .env
# Edit .env — set a strong JWT_SECRET
npm run dev        # → http://localhost:5001

# 2. Frontend (new terminal)
cd ../client
npm install
npm run dev        # → http://localhost:5173
```

---

## 🗂️ Project Structure

```
safeharbor/
├── server/                   # Node.js + Express backend
│   ├── src/
│   │   ├── db.js             # SQLite setup + seed data
│   │   ├── index.js          # App entry, middleware, routes
│   │   ├── techniques.js     # Breathing technique definitions
│   │   ├── middleware/
│   │   │   └── auth.js       # JWT verification
│   │   └── routes/
│   │       ├── auth.js       # Register, login, /me
│   │       ├── mood.js       # Mood entries + analytics
│   │       ├── journal.js    # Journal CRUD + search
│   │       ├── breathing.js  # Session logging + techniques
│   │       ├── crisis.js     # Crisis contacts (public)
│   │       └── wellness.js   # Tips + affirmations
│   ├── .env.example
│   └── package.json
│
├── client/                   # React 18 + Vite frontend
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js     # Axios instance + interceptors
│   │   │   └── hooks.js      # React Query hooks (all w/ offline fallback)
│   │   ├── components/
│   │   │   ├── Layout.jsx    # App shell (sidebar + mobile tabs)
│   │   │   ├── MoodBadge.jsx
│   │   │   ├── EmotionChip.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── BreathingExercise.jsx
│   │   │   ├── Grounding.jsx
│   │   │   ├── MoodTracker.jsx
│   │   │   ├── Journal.jsx
│   │   │   ├── JournalEntry.jsx
│   │   │   ├── CrisisResources.jsx
│   │   │   └── Affirmations.jsx
│   │   └── store/
│   │       └── appStore.js   # Zustand store (persisted)
│   ├── tailwind.config.js    # Calming design tokens
│   └── package.json
│
├── start.sh                  # One-command startup
└── README.md
```

---

## 🛠️ Tech Stack

**Backend**
- Node.js + Express
- SQLite via `better-sqlite3` (zero-config, embedded)
- JWT auth (`jsonwebtoken` + `bcryptjs`)
- `helmet` · `cors` · `express-rate-limit`

**Frontend**
- React 18 + Vite
- Tailwind CSS (custom calming palette)
- Framer Motion (page transitions + breathing animations)
- Recharts (mood trend charts)
- TanStack Query v5 (data fetching + caching)
- Zustand (global state, persisted)
- React Router v6
- Lucide React (icons)

---

## 🌐 Deploying to Production

### Frontend (GitHub Pages — free)
```bash
cd client
npm run build
# dist/ folder → deploy to GitHub Pages / Netlify / Vercel
```

### Backend (Render — free tier)
1. Push to GitHub
2. New Web Service on [render.com](https://render.com)
3. Root: `server/`, Build: `npm install`, Start: `npm start`
4. Add env vars: `JWT_SECRET`, `PORT=10000`, `NODE_ENV=production`

### One-service deploy
The server can serve the React build directly:
```bash
# In server/.env, set:
SERVE_CLIENT=true
CLIENT_BUILD_PATH=../client/dist
```
Then deploy just the `server/` to any Node.js host.

---

## 🔒 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `JWT_SECRET` | ✅ | Secret for signing JWT tokens (min 32 chars, random) |
| `PORT` | | Server port (default: `5001`) |
| `DB_PATH` | | SQLite file path (default: `./safeharbor.db`) |
| `CORS_ORIGINS` | | Comma-separated allowed origins |
| `NODE_ENV` | | `development` or `production` |

---

## 🧠 Design Philosophy

SafeHarbor is built on one principle: **meet people where they are**.

- Copy is warm, human, never clinical. No jargon.
- The crisis page is gentle *and* urgent — not scary.
- Every feature works offline (crisis contacts + breathing fallback data is embedded in the frontend).
- Privacy-first: journal entries are stored locally in your own database. We never touch them.
- No ads, no tracking, no paywall. Ever.

**If you or someone you know is in immediate danger, please call 911 or your local emergency services.**

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first.

Areas that would make a real difference:
- [ ] Mobile app (React Native)
- [ ] More crisis resources for non-US countries
- [ ] Therapist-reviewed content improvements
- [ ] Offline PWA mode
- [ ] Multilingual support

---

## 📄 License

MIT — use it, fork it, build on it. If it helps one person, it was worth it.

---

<div align="center">

Built with care by [Rahul Karda](https://github.com/rahulkarda)

*For everyone who has ever needed it.*

</div>
