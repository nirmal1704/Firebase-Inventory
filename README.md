# StashBox — Inventory Manager

A cartoon-styled, pastel inventory web app built with **React**, **Vite**, **Tailwind CSS**, and **Firebase**, deployable on **Vercel**.

## What you can do

- **Add / edit / remove** items with name, description, SKU, category, quantity, weight, dimensions, and storage location
- **Interactive 3D boxes** — size/weight change the box; quantity stacks boxes
- **Pack & ship** — “All done” plays a packing + truck animation (no Firebase Storage needed)
- **Real-time sync** — changes appear instantly on every open tab (Firestore `onSnapshot`)
- **Low-stock alerts** when quantity drops below your minimum
- **Search & filter** by name, SKU, location, or category
- **Sign in** with email/password or Google (Firebase Authentication)

---

## Vite — what is it? Should you use it?

**Vite** (French for “fast”) is a modern frontend **build tool and dev server**. For React projects it replaces older setups like Create React App.

| | **Vite** | **Create React App (CRA)** | **Next.js** |
|---|----------|---------------------------|-------------|
| Dev speed | Very fast (native ES modules) | Slower as app grows | Fast |
| Best for | SPAs, dashboards, tools | Legacy / tutorials | SEO, full-stack, routing on server |
| Learning curve | Low | Low | Medium–high |
| Deployment | Static (Vercel, Netlify) | Static | Vercel, Node server |

**For this project: yes, use Vite.** You only need a client-side React app talking to Firebase—no server-side rendering. Vite is the current standard for new React SPAs.

**Alternatives:** Parcel (zero-config), Webpack (more manual), Next.js (overkill unless you want SSR/API routes in one repo).

---

## Firebase: Realtime Database vs Firestore?

Firebase offers two databases:

| | **Cloud Firestore** (used here) | **Realtime Database** |
|---|--------------------------------|------------------------|
| Model | Documents & collections (NoSQL) | One big JSON tree |
| Queries | Rich filtering, ordering | Simpler, path-based |
| Offline | Built-in | Built-in |
| Best for | Apps, inventory, user data | Chat, live counters, games |

**This app uses Cloud Firestore** — the scalable document database. It is **not** the legacy Realtime Database, though Firestore still updates in **real time** via listeners (`onSnapshot`).

### Firebase services used in this project

| Service | Role |
|---------|------|
| **Authentication** | Email/password + Google sign-in; each user sees only their data |
| **Cloud Firestore** | Stores inventory items under `users/{uid}/items` |
| **Analytics** | Optional usage stats (if `VITE_FIREBASE_MEASUREMENT_ID` is set) |

**Not required:** Cloud Storage (no photo uploads in this version).

---

## Setup: Firebase (step by step)

### 1. Create a project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. **Add project** → name it (e.g. `stashbox-inventory`) → continue
3. Disable Google Analytics if you want (optional; you can add it later)

### 2. Register a web app

1. Project overview → **</> Web**
2. App nickname: `stashbox-web`
3. Copy the `firebaseConfig` object — you will map it to `.env` in the next section

### 3. Enable Authentication

1. **Build → Authentication → Get started**
2. **Sign-in method** tab:
   - Enable **Email/Password**
   - Enable **Google** (add a support email when prompted)

### 4. Create Firestore database

1. **Build → Firestore Database → Create database**
2. Start in **test mode** for learning, then deploy security rules (step 6)
3. Choose a region close to you

### 5. Paste keys into `.env` (local)

In the project folder (`inventory-manager`):

```bash
copy .env.example .env
```

Open `.env` and fill in values from Firebase → **Project settings** → **Your apps** → **SDK setup and configuration**:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXX   # optional
```

**Why `VITE_`?** Vite only exposes env variables that start with `VITE_` to your frontend. Never put server-only secrets here—they would still be visible in the browser bundle.

**Are API keys secret?** Firebase web API keys are **not** like passwords; security comes from **Firestore/Storage rules** and **Auth**. Still, use `.env` so keys are not committed to GitHub, and restrict your Firebase project in [Google Cloud Console](https://console.cloud.google.com/) if needed.

### 6. Deploy security rules

Install Firebase CLI (once):

```bash
npm install -g firebase-tools
firebase login
firebase init
```

Select **Firestore** only, use existing `firestore.rules` in this repo.

Or paste manually in the console:

- **Firestore → Rules** → contents of `firestore.rules`

### 7. Run locally

```bash
npm install
npm run dev
```

Open the URL shown (usually `http://localhost:5173`).

---

## Setup: GitHub (without leaking secrets)

1. Create a repo on GitHub (do **not** initialize with a README if you already have one locally)
2. In your project folder:

```bash
git init
git add .
git commit -m "Initial StashBox inventory app"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

**Checked before push:**

- `.env` is in `.gitignore` ✅
- Only `.env.example` (placeholders) is committed ✅
- No API keys in source files ✅

If you ever commit a secret by mistake, rotate keys in Firebase/Google Cloud and remove it from git history.

---

## Setup: Vercel deployment

1. Push the project to GitHub (above)
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. Framework preset: **Vite**
4. **Environment variables** — add the same `VITE_FIREBASE_*` variables as in your local `.env` (Project Settings → Environment Variables). Apply to **Production** and **Preview**.
5. Deploy

`vercel.json` rewrites all routes to `index.html` so React Router works on refresh.

After deploy, add your Vercel URL to Firebase **Authentication → Settings → Authorized domains**.

---

## Project structure

```
src/
  firebase/       # App init, Firestore CRUD
  components/     # InteractiveBox, PackAndShipModal, forms, cards
  contexts/       # Auth state (Firebase Auth)
  hooks/          # useInventory — real-time Firestore listener
  components/     # UI (cards, forms, modals)
  pages/          # Home, Login
  utils/          # Default form values, categories
firestore.rules   # Only the signed-in user can touch their items
storage.rules     # Optional — not used by the app anymore
.env.example      # Template — copy to .env
```

---

## Learn-by-doing: Firebase concepts in this repo

1. **`src/firebase/config.js`** — `initializeApp`, exports `auth`, `db`
2. **`AuthContext.jsx`** — `onAuthStateChanged` keeps login state in sync
3. **`items.js`** — `onSnapshot` = live query; `addDoc` / `updateDoc` / `deleteDoc` = CRUD
4. **`firestore.rules`** — server-side enforcement: `request.auth.uid == userId`
5. **`InteractiveBox.jsx`** — visual size/stack from dimensions, weight, quantity
6. **`PackAndShipModal.jsx`** — CSS packing + truck animation (pure frontend)

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |

---

## License

MIT — use freely for learning and portfolio projects.
