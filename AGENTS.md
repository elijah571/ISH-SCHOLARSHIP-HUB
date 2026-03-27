# AGENTS.md - Developer Guidelines for ISH Scholarship Hub

This file provides guidelines for AI agents working in this repository.

## Project Overview

Full-stack web application:
- **Frontend**: React 19 + Vite + Tailwind CSS v4 + React Router v7
- **Backend**: Express.js v5 + MongoDB (Mongoose) + JWT authentication

## Build Commands

### Frontend
```bash
cd Frontend
npm run dev      # Development (http://localhost:5173)
npm run build    # Production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

### Backend
```bash
cd Backend
npm start        # Production server
npm run dev      # Development with nodemon
npm test         # Placeholder only (no tests configured)
```

---

## Code Style Guidelines

### General
- **Plain JavaScript only** - No TypeScript
- **ES Modules** - Use `import`/`export`, NOT CommonJS
- **Include `.js` extension** in all relative imports: `./auth.service.js`
- **No `@ts-ignore`** or type suppression ever

### Frontend (React)

**Imports** - No `.jsx` extension:
```javascript
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
```

**Components:**
- Functional components with hooks only
- Default export for pages, named export for reusable components
- PascalCase component names
- PascalCase variables = components (required for `no-unused-vars` rule)

```javascript
// Page (default export)
const DashboardPage = () => { /* ... */ };
export default DashboardPage;

// Reusable (named export)
export const Button = ({ children }) => { /* ... */ };
```

**Tailwind v4:** CSS-first config (no `tailwind.config.js`), utility classes in JSX.

### Backend (Express)

**Module Structure** (MVC pattern per feature):
```
modules/<feature>/
├── <feature>.controller.js   # Request handlers
├── <feature>.service.js      # Business logic
├── <feature>.routes.js       # Route definitions
└── <feature>.validation.js  # Joi schemas
```

**Error Handling Pattern:**
```javascript
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { AppError } from '../../utils/AppError.js';

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  res.status(200).json({ success: true, data: user });
});
```

**AppError Class:**
```javascript
export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;  // User-facing error flag
  }
}
```

**API Response Format:**
```javascript
// Success
res.status(201).json({ success: true, message: 'Created', data: payload });

// List with pagination
res.status(200).json({ success: true, data: items, pagination: { total, page, limit } });
```

**Model Naming:** Singular PascalCase: `user.model.js`, `scholarship.model.js`

---

## Directory Structure

```
Frontend/src/
├── components/     # Reusable UI components
├── context/        # React context providers (AuthContext, ScholarshipContext, etc.)
├── pages/          # Page components
├── services/      # API service modules
└── main.jsx       # App entry point

Backend/src/
├── modules/       # Feature modules (auth, scholarship, blog, etc.)
├── models/        # Mongoose schemas
├── middleware/    # Auth, CSRF, error handling
├── services/      # Email, chat, socket services
├── utils/         # AppError, logger, token utilities
├── config/        # Database, cloudinary config
├── app.js         # Express app setup
└── server.js      # Server entry point
```

---

## API Response Consistency

Always return this shape:
```javascript
{ success: true|false, message: '...', data: {...} }
```

Auth endpoints: `{ success, accessToken, data: user }`

---

## Security

- CSRF protection via `csurf` middleware
- Helmet for security headers
- `express-rate-limit` for rate limiting
- httpOnly cookies for tokens
- JWT: access token (short-lived) + refresh token (httpOnly cookie)
- Argon2 for password hashing

---

## Testing

- **No test framework configured**
- No `npm test` available
- Verify manually: run both servers, test endpoints with Postman/curl

---

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| React | ^19.2.0 | UI framework |
| React Router | ^7.13.0 | Routing |
| Axios | ^1.13.6 | HTTP client |
| Tailwind | ^4.1.18 | Styling |
| Express | ^5.2.1 | Web framework |
| Mongoose | ^9.1.4 | MongoDB ODM |
| Joi | ^18.0.2 | Validation |
| Argon2 | ^0.44.0 | Password hashing |
| Winston | ^3.19.0 | Logging |

---

## Adding New Features

### Backend Module
1. Create `modules/<name>/` with 4 files (controller, service, routes, validation)
2. Import and mount routes in `app.js`:
   ```javascript
   import <name>Routes from './modules/<name>/<name>.routes.js';
   app.use('/api/<name>', <name>Routes);
   ```

### Frontend Component
1. Create `components/<Name>.jsx`
2. Use functional component with hooks
3. Apply Tailwind classes
4. Export as default (pages) or named (reusable)

### Context Provider
1. Create `context/<Name>Context.jsx`
2. Wrap with provider in `main.jsx` (order matters: Auth → others)
