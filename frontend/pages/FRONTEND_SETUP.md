# Frontend Setup — PrepRanked

## 1. Create the Next.js project

```bash
npx create-next-app@latest prepranked-frontend
```

When prompted:
- TypeScript? → No
- ESLint? → Yes
- Tailwind? → No  (we use custom CSS)
- App Router? → Yes
- src/ directory? → No

```bash
cd prepranked-frontend
```

---

## 2. Install dependencies

```bash
npm install @solana/web3.js
```

---

## 3. Drop in the page files

Next.js App Router uses the `app/` folder. Create this structure:

```
app/
├── page.jsx              ← login.jsx (rename + paste)
├── dashboard/
│   └── page.jsx          ← dashboard.jsx
├── interview/
│   └── page.jsx          ← interview-session.jsx
└── leaderboard/
    └── page.jsx          ← leaderboard.jsx
```

For each file: create the folder, create `page.jsx`, paste the contents.
Make sure the `'use client';` directive stays at the very top of each file.

Also drop `WalletConnect.jsx` into:
```
app/components/WalletConnect.jsx
```

---

## 4. Run it

```bash
npm run dev
```

Open http://localhost:3000 — you should see the login page.

Navigate to:
- http://localhost:3000/dashboard
- http://localhost:3000/interview
- http://localhost:3000/leaderboard

---

## 5. Wire up the backend (once auth route is built)

Each page has the real API calls commented out with `// Uncomment when auth is ready`.
Once you build `/api/auth` on the backend:
1. Log in → get a JWT → it's saved to `localStorage`
2. Remove the mock data and uncomment the fetch calls in `interview-session.jsx`

---

## Notes on mock data

- Dashboard and Leaderboard use hardcoded mock data right now — safe to view immediately
- Interview session uses 3 mock questions — works end-to-end without the backend
- Voice feedback (ElevenLabs audio) is stubbed — will play automatically once the real API is wired
