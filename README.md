# Focus Guard 🎯

**Focus Guard** is a full‑stack app with a companion Chrome extension that uses OpenAI to detect semantic drift and help students stay focused on study goals.

---

## 🚀 Quick Overview

- **Backend:** Node (Express/TypeScript)
- **Frontend:** React + Vite + Tailwind
- **DB:** PostgreSQL (Drizzle ORM)
- **AI:** OpenAI API (or OpenAI-compatible providers)
- **Chrome extension:** `client/public/extension/`

---

## 🔧 Prerequisites

- Node.js 18+ and npm
- PostgreSQL (local or hosted)
- OpenAI API key
- Chrome browser (for the extension)

> **Note:** See `SETUP.md` for a full walkthrough with screenshots and troubleshooting.

---

## ⚡ Quick Start

1. Install dependencies

```bash
npm install
```

2. Copy or create `.env` and set required vars:

```text
DATABASE_URL=postgresql://user:pass@host:5432/focus_guard
OPENAI_API_KEY=sk-...
PORT=5000
NODE_ENV=development
```

3. Prepare the database

```bash
npm run db:push
```

4. Start development server

```bash
npm run dev
# Open http://localhost:5000
```

5. Load the Chrome extension

- Update `client/public/extension/background.js` → set `API_ENDPOINT` to your backend URL (e.g., `http://localhost:5000/api/analyze-focus`).
- Go to `chrome://extensions/` → **Developer mode** → **Load unpacked** → select `client/public/extension/`.

---

## 📜 Available Scripts

- `npm run dev` — development server (hot reload)
- `npm run build` — build the app for production
- `npm run start` — run the production build
- `npm run check` — TypeScript check
- `npm run db:push` — apply DB schema via Drizzle

---

## 🧭 Project Structure (high level)

```
client/                 # React app & extension
  └── public/extension/  # Chrome extension files (manifest, background, popup)
server/                 # Express server, API routes, DB connection
shared/                 # Shared types, schema
script/                 # build scripts
SETUP.md                # Detailed setup & troubleshooting
package.json            # scripts & deps
```

---

## 🧪 Testing & Deployment

- Test locally with `npm run dev`.
- Build for production: `npm run build` then `npm run start` (ensure `NODE_ENV=production`).
- See `SETUP.md` for recommended deployment options (Vercel, Railway, Heroku, or self-hosting) and post-deploy steps (update extension `API_ENDPOINT`).

---

## 🤝 Contributing

- Fork the repo, create a branch, and open a PR.
- Run `npm run check` before submitting.

---

## 📚 Resources

- Detailed setup & troubleshooting: `SETUP.md`
- OpenAI docs: https://platform.openai.com/docs
- Chrome extension dev: https://developer.chrome.com/docs/extensions/

---

## 📄 License

MIT

---

If you'd like, I can add a `Contributing` checklist, example environment files, or a short demo GIF for the README.