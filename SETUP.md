# Focus Guard - Setup Guide

A full-stack application with a Chrome extension that uses AI to detect semantic drift and help students stay focused on their study goals.

## Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** database (local or remote)
- **OpenAI API key** (get one at https://platform.openai.com/api-keys)
- **Chrome** browser (for the extension)

---

## 1. Backend Setup

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory with your configuration:

```bash
# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/focus_guard

# OpenAI API Key (required)
OPENAI_API_KEY=sk-your-api-key-here

# Optional: Use a different OpenAI-compatible provider
# OPENAI_API_BASE_URL=https://api.example.com/v1

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

**Important Variables:**
- `DATABASE_URL`: Connection string for PostgreSQL
  - Format: `postgresql://username:password@host:port/database`
  - Example: `postgresql://postgres:password@localhost:5432/focus_guard`
  
- `OPENAI_API_KEY`: Your OpenAI API key
  - Get it from: https://platform.openai.com/api-keys
  - Format: `sk-...`

### Step 3: Set Up Database

Create a PostgreSQL database:

```bash
# Using psql
psql -U postgres -c "CREATE DATABASE focus_guard;"
```

Or use your preferred database tool (pgAdmin, DBeaver, etc.)

### Step 4: Run Database Migrations

```bash
npm run db:push
```

This will create all necessary tables (`focus_sessions`, `focus_logs`, `conversations`, `messages`).

### Step 5: Start the Backend

```bash
npm run dev
```

The server will start on `http://localhost:5000`.

---

## 2. Frontend Setup

The frontend is built with React and automatically served by the backend.

### Accessing the Dashboard

Open your browser and navigate to:
```
http://localhost:5000
```

You'll see the Focus Guard Dashboard where you can:
- Enter a study goal (e.g., "Researching Neural Networks")
- Paste webpage content
- Click "Analyze" to test the AI detection
- See the relevance score and whether you're on track

---

## 3. Chrome Extension Setup

The Chrome extension allows real-time monitoring of your browsing activity.

### Installation

1. **Locate the extension files:**
   - Navigate to `client/public/extension/` in your project
   - You should see: `manifest.json`, `background.js`, `content.js`, `popup.html`, `popup.js`

2. **Update the API endpoint:**
   - Open `client/public/extension/background.js`
   - Find the line: `const API_ENDPOINT = 'https://YOUR_REPLIT_APP_URL.replit.app/api/analyze-focus';`
   - Replace with your actual backend URL (e.g., `http://localhost:5000/api/analyze-focus` for local, or your deployed URL)

3. **Load in Chrome:**
   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer mode** (toggle in the top right)
   - Click **Load unpacked**
   - Select the `client/public/extension/` folder
   - The "Focus Guard" extension should now appear

4. **Use the extension:**
   - Click the Focus Guard icon in your Chrome toolbar
   - Enter your study goal (e.g., "Learning Python")
   - Click **Start Session**
   - The extension will monitor your tabs and alert you if you drift away from your goal
   - Click **Snooze** to silence alerts for 5 minutes, or **Return to Focus** to dismiss

---

## 4. API Endpoints

### Analyze Focus Content

**Endpoint:** `POST /api/analyze-focus`

**Request:**
```json
{
  "goal": "Researching Neural Networks",
  "content": "Lorem ipsum dolor sit amet... (webpage text)"
}
```

**Response:**
```json
{
  "isOnTrack": true,
  "relevanceScore": 85,
  "reason": "The content discusses neural networks, which is directly related to your goal."
}
```

---

## 5. Deployment

### Deploying to Production

#### Option A: Deploy on Vercel (Recommended for Node.js)

1. Create a Vercel account at https://vercel.com
2. Connect your GitHub repository
3. Set environment variables:
   - `DATABASE_URL`: Your production PostgreSQL URL
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NODE_ENV`: `production`
4. Deploy

#### Option B: Deploy on Railway

1. Create a Railway account at https://railway.app
2. Connect your GitHub repository
3. Railway will auto-detect Node.js
4. Add environment variables in the dashboard
5. Deploy

#### Option C: Deploy on Heroku

```bash
heroku create your-app-name
heroku config:set DATABASE_URL=your_postgres_url
heroku config:set OPENAI_API_KEY=your_openai_key
git push heroku main
```

#### Option D: Self-Hosted (VPS/Server)

1. SSH into your server
2. Install Node.js and PostgreSQL
3. Clone your repository
4. Create `.env` with production values
5. Run:
   ```bash
   npm install
   npm run build
   npm run start
   ```
6. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start dist/index.cjs --name focus-guard
   pm2 startup
   pm2 save
   ```

### After Deployment

1. Update the Chrome extension's `API_ENDPOINT` in `background.js` to your production URL
2. Reload the extension in Chrome (`chrome://extensions/`)

---

## 6. Database Setup (Detailed)

### PostgreSQL Connection String Format

```
postgresql://[username]:[password]@[host]:[port]/[database]
```

### Common Databases

**Local PostgreSQL:**
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/focus_guard
```

**Railway PostgreSQL:**
```
DATABASE_URL=postgresql://user:pass@rail.internal:5432/railway
```

**Neon (Serverless PostgreSQL):**
```
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/focus_guard?sslmode=require
```

**Vercel Postgres:**
```
DATABASE_URL=postgresql://user:password@db.vercel-postgres.com/focus_guard
```

### Create Tables

Tables are automatically created when you run:
```bash
npm run db:push
```

If you need to reset the database:
```bash
npm run db:push -- --force
```

---

## 7. Troubleshooting

### Extension not connecting to API
- Check the `API_ENDPOINT` in `background.js` matches your backend URL
- Ensure your backend is running and accessible
- Check browser console for CORS errors (may need to add CORS headers)

### "OPENAI_API_KEY is not set" error
- Verify the `.env` file exists in the root directory
- Check that `OPENAI_API_KEY` is set correctly (no extra spaces)
- Restart the development server: `npm run dev`

### Database connection fails
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL server is running
- Check that the database exists: `psql -U postgres -l`
- Test connection: `psql $DATABASE_URL`

### Port 5000 already in use
- Change the `PORT` in `.env` to another value (e.g., `PORT=3000`)
- Or kill the process using port 5000:
  ```bash
  lsof -ti:5000 | xargs kill -9  # macOS/Linux
  netstat -ano | findstr :5000    # Windows
  ```

---

## 8. Project Structure

```
focus-guard/
├── client/
│   ├── src/
│   │   ├── App.tsx              # Main React app
│   │   ├── pages/               # Page components
│   │   ├── components/          # Reusable components
│   │   └── index.css            # Styling
│   └── public/
│       └── extension/           # Chrome extension files
│           ├── manifest.json
│           ├── background.js
│           ├── content.js
│           ├── popup.html
│           └── popup.js
├── server/
│   ├── index.ts                 # Express server setup
│   ├── routes.ts                # API endpoints
│   ├── storage.ts               # Database operations
│   ├── db.ts                    # Database connection
│   └── vite.ts                  # Vite setup (dev only)
├── shared/
│   ├── schema.ts                # Database schema & types
│   └── routes.ts                # API contract
├── .env.example                 # Environment template
└── package.json
```

---

## 9. Development vs Production

### Development
```bash
npm run dev
# Runs on http://localhost:5000
# Hot reload enabled
# Uses .env file
```

### Production
```bash
npm run build
npm run start
# Optimized build
# Ensure NODE_ENV=production
```

---

## 10. Support & Resources

- **OpenAI API Docs:** https://platform.openai.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Chrome Extension Docs:** https://developer.chrome.com/docs/extensions/

---

## Quick Start Summary

```bash
# 1. Install
npm install

# 2. Create .env with your config
cp .env.example .env
# Edit .env with your DATABASE_URL and OPENAI_API_KEY

# 3. Setup database
npm run db:push

# 4. Start development
npm run dev

# 5. Load Chrome extension
# - Open chrome://extensions/
# - Enable Developer mode
# - Click "Load unpacked"
# - Select client/public/extension/

# 6. Access dashboard
# - Open http://localhost:5000
```

---

Enjoy Focus Guard! 🎯
