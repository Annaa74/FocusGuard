# Deployment Guide

This guide covers deploying Focus Guard to various platforms.

## Supported Platforms

- Vercel (recommended)
- Railway
- Render
- Heroku
- Self-hosted VPS
- AWS, Google Cloud, Azure (via containers)

---

## Vercel Deployment

### 1. Prepare Your Repository

Ensure your code is pushed to GitHub.

### 2. Connect to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Select your GitHub repository
4. Vercel auto-detects Node.js

### 3. Set Environment Variables

In the Vercel dashboard:

1. Go to "Settings" → "Environment Variables"
2. Add the following:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `NODE_ENV` | `production` |

### 4. Deploy

Click "Deploy". Vercel will build and deploy automatically.

### 5. Update Chrome Extension

After deployment, update `background.js`:

```javascript
const API_ENDPOINT = 'https://your-app-name.vercel.app/api/analyze-focus';
```

Reload the extension in Chrome.

---

## Railway Deployment

### 1. Connect GitHub

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository

### 2. Add PostgreSQL

1. In your project, click "Add Service" → "PostgreSQL"
2. Railway auto-generates a `DATABASE_URL`

### 3. Set Variables

In Railway, go to "Variables":

| Key | Value |
|-----|-------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `NODE_ENV` | `production` |
| `PORT` | `3000` (Railway automatically assigns this) |

### 4. Deploy

Railway auto-deploys on every push to main.

### 5. Get Your URL

Your app will be available at: `https://your-project-name.railway.app`

Update the extension accordingly.

---

## Render Deployment

### 1. Connect GitHub

1. Go to https://render.com
2. Click "New" → "Web Service"
3. Select your repository

### 2. Configure

| Setting | Value |
|---------|-------|
| **Environment** | Node |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |
| **Plan** | Free or Paid (free has sleep after inactivity) |

### 3. Add Environment Variables

Under "Environment", add:

```
DATABASE_URL=postgresql://user:pass@host/dbname
OPENAI_API_KEY=sk-xxx
NODE_ENV=production
```

### 4. Add PostgreSQL

1. Click "New" → "PostgreSQL"
2. Copy the connection string to your web service's `DATABASE_URL`

### 5. Deploy

Click "Create Web Service". Render deploys automatically.

---

## Heroku Deployment (Legacy - Paid Only)

Heroku now requires a paid plan. Use Railway or Render instead.

If you have a Heroku account:

```bash
# Login
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Set environment variables
heroku config:set OPENAI_API_KEY=sk-xxx
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## Self-Hosted (VPS/Dedicated Server)

### 1. Prerequisites

- Server with Ubuntu 20.04+ or similar
- SSH access
- Domain name (optional)

### 2. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 (process manager)
sudo npm install -g pm2
```

### 3. Set Up Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Inside psql:
CREATE DATABASE focus_guard;
CREATE USER focus_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE focus_guard TO focus_user;
\q
```

### 4. Clone and Setup

```bash
# Clone repo
git clone https://github.com/your-username/focus-guard.git
cd focus-guard

# Install dependencies
npm install

# Create .env
cat > .env << EOF
DATABASE_URL=postgresql://focus_user:your_secure_password@localhost:5432/focus_guard
OPENAI_API_KEY=sk-xxx
NODE_ENV=production
PORT=5000
EOF

# Run migrations
npm run db:push

# Build
npm run build
```

### 5. Start with PM2

```bash
# Start app
pm2 start dist/index.cjs --name focus-guard

# Save startup hook
pm2 startup
pm2 save

# View logs
pm2 logs focus-guard
```

### 6. Set Up Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Create config
sudo tee /etc/nginx/sites-available/focus-guard > /dev/null << EOF
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable config
sudo ln -s /etc/nginx/sites-available/focus-guard /etc/nginx/sites-enabled/
sudo systemctl restart nginx

# (Optional) Set up HTTPS with Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Docker Deployment

If you want to containerize your app:

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "run", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: focus_guard
      POSTGRES_USER: focus_user
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://focus_user:your_password@db:5432/focus_guard
      OPENAI_API_KEY: sk-xxx
      NODE_ENV: production
    depends_on:
      - db

volumes:
  postgres_data:
```

Deploy with:
```bash
docker-compose up -d
```

---

## Post-Deployment Checklist

- [ ] Environment variables are set correctly
- [ ] Database migrations ran successfully
- [ ] OpenAI API calls are working
- [ ] Frontend is accessible
- [ ] Chrome extension API endpoint is updated
- [ ] Extension can connect to backend
- [ ] HTTPS is enabled (for production)
- [ ] Logging is configured
- [ ] Backup strategy is in place

---

## Monitoring & Maintenance

### Check Logs

Vary by platform:
- **Vercel:** Dashboard → Logs
- **Railway:** Dashboard → Logs
- **Self-hosted:** `pm2 logs` or `journalctl -u app`

### Monitor Costs

- **OpenAI:** Check usage at https://platform.openai.com/account/usage/overview
- **Database:** Monitor PostgreSQL usage (varies by provider)

### Backup Database

```bash
# Manual backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

For production, use your hosting provider's backup features.

---

## Troubleshooting Deployment

### App won't start

```bash
# Check logs
pm2 logs focus-guard  # Self-hosted
heroku logs --tail    # Heroku

# Common issues:
# - DATABASE_URL not set
# - OPENAI_API_KEY not set
# - Database migrations not run
```

### Database connection error

```bash
# Test connection
psql $DATABASE_URL

# Run migrations
npm run db:push
```

### Extension not connecting

- Verify backend URL in `background.js`
- Check CORS headers (add if needed in routes)
- Ensure backend is running and accessible

---

## Questions?

Refer to the main [SETUP.md](./SETUP.md) for configuration details.
