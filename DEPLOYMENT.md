# ISH Scholarship Hub — Deployment Guide

## Prerequisites

- Node.js 22+
- MongoDB Atlas account (or self-hosted MongoDB 7+)
- Cloudinary account
- SMTP provider (e.g. Mailtrap, SendGrid, Resend)
- Docker + Docker Compose (for containerized deploy)

---

## 1. Environment Setup

### Backend

Copy the example and fill in all values:

```bash
cp Backend/.env.example Backend/.env
```

Generate JWT secrets:

```bash
node -e "require('crypto').randomBytes(64).toString('hex')"
```

Run the above 3 times for `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EMAIL_VERIFY_SECRET`.

### Frontend

```bash
cp Frontend/.env.example Frontend/.env
```

Set `VITE_API_URL` and `VITE_SOCKET_URL` to your deployed backend URL.

---

## 2. Local Development

```bash
# Backend
cd Backend && npm install && npm run dev

# Frontend (separate terminal)
cd Frontend && npm install && npm run dev
```

---

## 3. Docker Deployment

```bash
# Build and start all services
docker compose up --build -d

# View logs
docker compose logs -f

# Stop
docker compose down
```

Set `VITE_API_URL` and `VITE_SOCKET_URL` in a `.env` file at the repo root before building.

---

## 4. Manual Production Build

### Backend

```bash
cd Backend
npm ci --omit=dev
NODE_ENV=production node src/server.js
```

Use PM2 for process management:

```bash
npm install -g pm2
pm2 start src/server.js --name ish-backend --env production
pm2 save && pm2 startup
```

### Frontend

```bash
cd Frontend
npm ci
VITE_API_URL=https://api.yourdomain.com npm run build
# Serve dist/ with nginx or any static host
```

---

## 5. Reverse Proxy (nginx example)

```nginx
server {
    listen 443 ssl;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Request-ID $request_id;
    }
}
```

The WebSocket upgrade headers are required for Socket.IO to work through nginx.

---

## 6. Health Check

```bash
curl https://api.yourdomain.com/health
# Expected: {"status":"ok","uptime":...,"timestamp":"..."}
```

---

## 7. Database

- Enable MongoDB Atlas IP allowlist for your server IP
- Use a dedicated database user with least-privilege access (readWrite on app DB only)
- Enable Atlas automated backups (daily snapshots)

---

## 8. SSL/TLS

- Use Let's Encrypt (certbot) or a managed certificate from your cloud provider
- Set `NODE_ENV=production` to enable `Secure` flag on cookies
- Add HSTS header via nginx: `add_header Strict-Transport-Security "max-age=31536000" always;`

---

## 9. Running Tests

```bash
cd Backend && npm test
```

---

## Production Checklist

### Security
- [ ] All `.env` values are real secrets (not placeholders)
- [ ] `.env` files are NOT committed to git
- [ ] JWT secrets are 64+ byte random hex strings
- [ ] `NODE_ENV=production` is set
- [ ] HTTPS/TLS is enabled for all endpoints
- [ ] CORS `ALLOWED_ORIGINS` lists only your frontend domain(s)
- [ ] MongoDB user has minimal permissions
- [ ] Cloudinary API key is restricted to your app's IP/hostname

### Reliability
- [ ] PM2 or Docker with restart policy is configured
- [ ] MongoDB Atlas automated backups are enabled
- [ ] Health check endpoint responds correctly
- [ ] Logs are being written and rotated (`logs/` directory)

### Performance
- [ ] MongoDB indexes verified (run `db.scholarships.getIndexes()`)
- [ ] Cloudinary images served via CDN
- [ ] Frontend build is minified and code-split (check `dist/`)
- [ ] nginx gzip compression enabled

### Monitoring
- [ ] Set up uptime monitoring (UptimeRobot, BetterStack, etc.) on `/health`
- [ ] Configure log aggregation (Papertrail, Datadog, etc.)
- [ ] Set up error alerting
