# AGENTS.md - Developer Guidelines for ISH Scholarship Hub

This file provides guidelines for AI agents working in this repository.

## Project Overview

Full-stack web application:
- **Frontend**: React 19 + Vite 7 + Tailwind CSS v4 + React Router v7 + React Toastify
- **Backend**: Express.js v5 + MongoDB (Mongoose) + JWT auth + Socket.IO (chat) + Cloudinary (uploads)

---

## Build Commands

### Frontend
```bash
cd Frontend
npm run dev      # Development (http://localhost:5173)
npm run build    # Production build → dist/
npm run lint     # ESLint check
npm run preview  # Preview production build
```

### Backend
```bash
cd Backend
npm start        # Production server (node src/server.js)
npm run dev      # Development with nodemon (watches src/, ignores logs/)
```

**No test framework is configured.** Verify manually: run both servers, test in browser or with Postman.

---

## Environment Setup

### Backend (Backend/.env)
Required vars (no .env.example exists):
```
MONGO_URI=mongodb+srv://...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_EMAIL_VERIFY_SECRET=...
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
CLOUDINARY_NAME=...
CLOUDINARY_API=...
CLOUDINARY_SECRET=...
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
EMAIL_FROM=...
CLIENT_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000
```

### Frontend (Frontend/.env)
```
VITE_API_URL=http://localhost:3000
```
**Important**: Vite requires the `VITE_` prefix for env vars to be exposed to the client.

---

## Code Style Guidelines

### General
- **Plain JavaScript only** — No TypeScript
- **ES Modules** — Use `import`/`export`, NOT CommonJS
- **Include `.js` extension** in all relative imports: `./auth.service.js`
- **No `@ts-ignore`** or type suppression ever

### Frontend (React)

**Imports**: No `.jsx` extension in import paths:
```javascript
import Button from './Button';        // ✅ no .jsx
import React, { useState } from 'react';
```

**Components**:
- Functional components with hooks only
- **Pages**: `export default` (e.g. `DashboardPage`)
- **Reusable components**: named `export` (e.g. `export const Button`)
- PascalCase for all component names

**Tailwind v4**: CSS-first config. No `tailwind.config.js`. Single import in `index.css`:
```css
@import "tailwindcss";
```

### Backend (Express)

**Module structure** (MVC per feature):
```
modules/<feature>/
├── <feature>.controller.js   # Request handlers
├── <feature>.service.js      # Business logic
├── <feature>.routes.js       # Route definitions (usually)
└── <feature>.validation.js   # Joi schemas
```

**Naming inconsistencies to be aware of**:
- Blog module uses `blog.route.js` (singular, not `.routes.js`)
- Scholarship model is `scholarship.js` (missing `.model.` suffix)
- All other modules/models follow the standard naming convention

**Controller pattern**:
```javascript
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { AppError } from '../../utils/AppError.js';

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  res.status(200).json({ success: true, data: user });
});
```

**Auth middleware**: `VerifyUser` (note: PascalCase, not camelCase). Attach as middleware:
```javascript
router.get('/profile', VerifyUser, getProfile);
```

**Role middleware**: `isAuthorized('admin')` — chain after `VerifyUser`:
```javascript
router.post('/create', upload.single('image'), VerifyUser, isAuthorized('admin'), createBlogController);
```

---

## Architecture

### Backend Entry Point
`server.js` → creates HTTP server + Socket.IO → connects to MongoDB → listens on PORT.

Socket.IO is initialized globally with `cors: { origin: '*' }` and chat handlers are attached via `initializeChatSocket(io)`.

### Backend API Routes (mounted in app.js)
| Prefix | Module |
|--------|--------|
| `/api/csrf` | CSRF token endpoint |
| `/api/auth` | auth (register, login, refresh, password reset, profile, saved scholarships) |
| `/api/admin` | admin |
| `/api/scholarship` | scholarship |
| `/api/blog` | blog (CRUD, image upload via Cloudinary) |
| `/api/newsletter` | newsletter |
| `/api/internship` | internship |
| `/api/chat` | chat |

### Security Middleware Order (app.js)
1. `cors` → `express.json()` → `cookieParser()` → `helmet()` → `setSecurityHeaders`
2. `csrfProtection` (csurf with cookie config)
3. Manual `XSRF-TOKEN` cookie setter (reads `req.csrfToken()`)
4. Request logger
5. Route handlers
6. `errorHandler` (must be last)

### Frontend Architecture

**Entry**: `main.jsx` — wraps `<App />` in nested context providers:
```
BrowserRouter → AuthProvider → ScholarshipProvider → InternshipProvider → ChatProvider → App
```

**Context providers** (4 total): Auth, Scholarship, Internship, Chat

**API client**: `services/api.js` — a pre-configured axios instance with:
- Automatic CSRF token attachment for mutating requests (POST/PATCH/PUT/DELETE)
- Automatic `Bearer` token attachment from in-memory store
- Silent token refresh on 401 (retries once via `/api/auth/refresh`)
- **Always use this instance** — do not create raw axios calls

**Routing**: All routes defined in `App.jsx`. Protected routes use `<ProtectedRoute>` with optional `requireAdmin` prop.

**Notifications**: Uses `react-toastify`. Import `toast` from `react-toastify` for flash messages.

---

## API Response Format

Always return this shape:
```javascript
// Success
res.status(201).json({ success: true, message: 'Created', data: payload });

// Error
res.status(404).json({ success: false, message: 'User not found' });

// List with pagination
res.status(200).json({ success: true, data: items, pagination: { total, page, limit } });

// Auth response
res.status(200).json({ success: true, accessToken, data: user });
```

---

## Key Patterns

### File Uploads
- Uses `multer` with `memoryStorage()`, 5MB limit
- Import: `import { upload } from '../../middleware/upload.js'`
- Usage: `upload.single('fieldName')` as middleware
- Images are uploaded to Cloudinary (config in `config/cloudinary.js`)

### Error Handling
- `AppError` class: extends `Error`, has `statusCode` and `isOperational` flag
- `asyncHandler` wraps async controllers to catch errors and pass to errorHandler
- `errorHandler` middleware is plain (not async-wrapped), placed at the end of app.js
- Error response for non-operational errors: always returns generic "Internal Server Error"

### Rate Limiting
- `authLimiter` and `authSlowDown` middleware available for auth endpoints
- Import from `middleware/rateLimiter.js`

### Password Hashing
- Argon2 via Mongoose pre-save hook on User model
- `userSchema.methods.comparePassword` for login verification

---

## Directory Structure

```
Frontend/src/
├── components/     # Reusable UI (Button, Card, Input, Modal, Navbar, Layout, etc.)
│   ├── admin/      # Admin-specific components
│   ├── blog/       # Blog-specific components
│   ├── chat/       # Chat-specific components
│   ├── icons/      # SVG icon components
│   ├── internships/
│   └── scholarships/
├── context/        # AuthContext, ScholarshipContext, InternshipContext, ChatContext
├── pages/          # 15 page components (all *Page.jsx)
├── services/       # api.js (axios instance), chatService, internshipService, scholarshipService, userService
├── App.jsx         # Route definitions
├── main.jsx        # Entry point + context providers
└── index.css       # Tailwind v4 import

Backend/src/
├── modules/        # auth, admin, scholarship, blog, newsletter, internship, chat
├── models/         # user.model.js, scholarship.js, blog.model.js, chat.model.js, internship.model.js, newsletter.model.js, activity.model.js
├── middleware/     # asyncHandler, auth, errorHandler, permission, rateLimiter, role, security, socketAuth, upload
├── routes/         # csrf.routes.js (non-module routes)
├── services/       # chat.socket.js, email.js
├── utils/          # AppError, logger
├── config/         # cloudinary.js, dataBase.js
├── app.js          # Express app + route mounting
└── server.js       # HTTP server + Socket.IO + DB connection
```

---

## Adding New Features

### Backend Module
1. Create `modules/<name>/` with: controller, service, routes, validation (Joi)
2. Mount routes in `app.js`:
   ```javascript
   import <name>Routes from './modules/<name>/<name>.routes.js';
   app.use('/api/<name>', <name>Routes);
   ```
3. Create model in `models/<name>.model.js` (note: use `.model.js` suffix)

### Frontend
1. **Page**: Create `pages/<Name>Page.jsx`, add route in `App.jsx`
2. **Component**: Create `components/<Name>.jsx`, use named export
3. **Service**: Add methods to `services/api.js` or create a new service file
4. **Context** (if needed): Create `context/<Name>Context.jsx`, wrap in `main.jsx` (add inside existing provider chain)

---

## Security

- CSRF protection via `csurf` (cookie-based, auto-set via `api.js` interceptor)
- Helmet for security headers
- `express-rate-limit` + `express-slow-down` for auth endpoints
- httpOnly cookies for refresh tokens
- JWT: access token (in-memory, 15m) + refresh token (httpOnly cookie, 7d)
- Argon2 for password hashing
- Socket.IO chat uses `cors: { origin: '*' }` (may need tightening in production)
