# AGENTS.md - Developer Guidelines for ISH Scholarship Hub

This file provides guidelines for AI agents working in this repository.

## Project Overview

The ISH Scholarship Hub is a full-stack web application with:
- **Frontend**: React 19 + Vite + Tailwind CSS v4
- **Backend**: Express.js + MongoDB (Mongoose) + JWT authentication

```
ISH-SCHOLARSHIP-HUB/
├── Frontend/              # React SPA
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/       # React context providers
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Helper functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── eslint.config.js
│   └── vite.config.js
└── Backend/               # Express REST API
    ├── src/
    │   ├── config/         # Database, cloudinary config
    │   ├── middleware/     # Auth, CSRF, rate limiting, error handling
    │   ├── models/        # Mongoose schemas
    │   ├── modules/       # Feature modules (auth, scholarship, blog, etc.)
    │   ├── routes/        # Standalone routes
    │   ├── services/      # Email service
    │   ├── utils/         # AppError, logger, token utilities
    │   ├── app.js         # Express app setup
    │   └── server.js      # Server entry point
    └── package.json
```

---

## Build Commands

### Frontend

```bash
cd Frontend

# Development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Run linter (ESLint)
npm run lint

# Preview production build
npm run preview
```

### Backend

```bash
cd Backend

# Start production server
npm start

# Development with hot reload (nodemon)
npm run dev

# Note: No test framework configured
# Placeholder test script: npm test
```

---

## Code Style Guidelines

### General

- **No TypeScript** - This project uses plain JavaScript
- **ES Modules** - Use `import`/`export`, not CommonJS (`require`)
- **File extensions** - Always include `.js` extension in relative imports (e.g., `./auth.service.js`)
- **Formatting** - Prettier is the default formatter (VSCode configured)

### Frontend (React)

**Imports:**
```javascript
// Good - no .jsx extension
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

// Bad - includes extension
import Button from './Button.jsx';
```

**Components:**
- Use functional components with hooks
- Default export for page components, named export for reusable components
- PascalCase for component names
- Tailwind CSS classes for styling (Tailwind v4)

```javascript
// Page component (default export)
const DashboardPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // ...
};
export default DashboardPage;

// Reusable component (named export)
export const Button = ({ children, variant }) => {
  // ...
};
```

**Tailwind v4:**
- Uses `@tailwindcss/vite` plugin
- CSS-first configuration (no `tailwind.config.js`)
- Utility classes directly in JSX

### Backend (Express)

**Module Structure:**
Each feature module follows MVC pattern:
```
modules/<feature>/
├── <feature>.controller.js   # Request handlers
├── <feature>.service.js      # Business logic
├── <feature>.routes.js       # Route definitions
└── <feature>.validation.js   # Joi validation schemas
```

**Error Handling:**
- Use `asyncHandler` wrapper for all async route handlers
- Throw `AppError` for operational errors (user-facing)
- Global `errorHandler` middleware catches all errors

```javascript
// Controller pattern
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { AppError } from '../../utils/AppError.js';

export const getUser = asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.status(200).json({ success: true, data: user });
});
```

**AppError Class:**
```javascript
// Located in: src/utils/AppError.js
export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;  // User-facing error flag
  }
}
```

**Validation:**
- Use Joi for request validation
- Validate in controller, handle errors with asyncHandler

**Response Format:**
```javascript
// Success
res.status(201).json({
  success: true,
  message: 'Operation successful',
  data: { /* payload */ }
});

// List response
res.status(200).json({
  success: true,
  data: items,
  pagination: { total, page, limit }
});

// Error (handled by errorHandler)
res.status(400).json({
  success: false,
  message: 'Error message'
});
```

**Security:**
- CSRF protection via `csurf` middleware
- Helmet for security headers
- Rate limiting via `express-rate-limit`
- httpOnly cookies for tokens
- JWT access tokens (short-lived) + refresh tokens (httpOnly cookies)

---

## Linting Rules

### Frontend ESLint

The project uses ESLint flat config with:
- `@eslint/js` - Recommended JS rules
- `eslint-plugin-react-hooks` - React hooks rules
- `eslint-plugin-react-refresh` - HMR-safe code detection

**Key rule:** `no-unused-vars` set to error, but variables starting with uppercase or underscore are ignored (for React components and constants).

```javascript
// Ignored by no-unused-vars rule:
const MyComponent = () => {};  // PascalCase = component
const _privateVar = 'x';      // underscore prefix = constant
```

### Backend Linting

- **No ESLint configured** for Backend
- Consider adding ESLint with Node.js configs if needed

---

## Database

- **MongoDB** with Mongoose ODM
- Models located in `Backend/src/models/`
- Connection handled in `Backend/src/config/dataBase.js`

**Model Naming:**
- Singular, PascalCase: `user.model.js`, `scholarship.model.js`
- Schema name PascalCase: `const ScholarshipSchema = new Schema(...)`

---

## Environment Variables

Create `.env` file in Backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ish-scholarship
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## Common Patterns

### Adding a New Backend Module

1. Create `src/modules/<name>/` directory
2. Create the four files:
   - `<name>.controller.js` - Request handlers
   - `<name>.service.js` - Business logic (DB operations)
   - `<name>.routes.js` - Route definitions
   - `<name>.validation.js` - Joi schemas
3. Import and mount routes in `src/app.js`:
   ```javascript
   import <name>Routes from './modules/<name>/<name>.routes.js';
   app.use('/api/<name>', <name>Routes);
   ```

### Adding a New Frontend Component

1. Create `src/components/<Name>.jsx`
2. Use functional component with hooks if needed
3. Apply Tailwind classes for styling
4. Export as default (pages) or named (reusable)

### API Response Consistency

Always return:
```javascript
{
  success: true|false,
  message: '...',      // for errors or status descriptions
  data: {...}          // for successful responses
  // For auth: { success, accessToken, data: user }
}
```

---

## Testing

- **No test framework** currently configured
- To add tests: consider Jest (Backend) and Vitest or Jest (Frontend)
- When configured, run single test:
  ```bash
  npm test -- --testNamePattern="pattern"
  ```

---

## Key Dependencies

### Frontend
- `react` ^19.2.0 - UI framework
- `react-router-dom` ^7.13.0 - Routing
- `axios` ^1.13.6 - HTTP client
- `tailwindcss` ^4.1.18 - Styling

### Backend
- `express` ^5.2.1 - Web framework
- `mongoose` ^9.1.4 - MongoDB ODM
- `jsonwebtoken` ^9.0.3 - JWT authentication
- `argon2` ^0.44.0 - Password hashing
- `joi` ^18.0.2 - Validation
- `helmet` ^8.1.0 - Security headers
- `winston` ^3.19.0 - Logging
