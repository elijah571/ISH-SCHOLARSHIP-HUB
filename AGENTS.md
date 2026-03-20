# AGENTS.md - Developer Guidelines for ISH Scholarship Hub

This file provides guidelines for AI agents working in this repository.

## Project Overview

The ISH Scholarship Hub is a full-stack web application with:
- **Frontend**: React 19 + Vite + Tailwind CSS v4
- **Backend**: Express.js + MongoDB (Mongoose) + JWT authentication

```
ISH-SCHOLARSHIP-HUB/
├── Frontend/          # React SPA
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── eslint.config.js
│   └── vite.config.js
└── Backend/           # Express REST API
    ├── src/
    │   ├── modules/   # Feature modules (auth, scholarship, blog, etc.)
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── config/
    │   ├── utils/
    │   └── app.js
    └── package.json
```

---

## Build Commands

### Frontend

```bash
cd Frontend

# Development server
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

# No test framework configured
# Note: Backend package.json has a placeholder test script
```

---

## Code Style Guidelines

### General

- **No TypeScript** - This project uses plain JavaScript
- **ES Modules** - Use `import`/`export`, not CommonJS (`require`)
- **File extensions** - Always include `.js` extension in relative imports
- **Formatting** - Prettier is the default formatter (VSCode configured)

### Frontend (React)

**Imports:**
```javascript
// Good
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

// Bad
import Button from './Button.jsx';
```

**Components:**
- Use functional components with hooks
- Default export for components
- PascalCase for component names
- Use Tailwind CSS classes for styling (Tailwind v4)

```javascript
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // ...
};
export default Navbar;
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
├── <feature>.controller.js
├── <feature>.service.js
├── <feature>.routes.js
└── <feature>.validation.js
```

**Error Handling:**
- Use `asyncHandler` wrapper for all async route handlers
- Throw `AppError` for operational errors
- Global `errorHandler` middleware catches all errors

```javascript
// Controller pattern
export const registerUser = asyncHandler(async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
  // ...
});

// Custom error class
throw new AppError('Message', 400);
```

**Validation:**
- Use Joi for request validation
- Validate in controller, handle errors with asyncHandler

**Response Format:**
```javascript
// Success
res.status(201).json({
  success: true,
  message: '...',
  data: { ... }
});

// Error (handled by errorHandler)
res.status(400).json({
  success: false,
  message: 'Error message'
});
```

**Security:**
- CSRF protection via `csurf`
- Helmet for security headers
- Rate limiting configured
- httpOnly cookies for tokens

---

## Linting Rules

### Frontend ESLint

The project uses:
- `@eslint/js` - Recommended JS rules
- `eslint-plugin-react-hooks` - React hooks rules
- `eslint-plugin-react-refresh` - HMR-safe code detection

**Key rule:** `no-unused-vars` is set to error, but variables starting with uppercase or underscore are ignored (for React components and constants).

### Backend Linting

- **No ESLint configured** for Backend
- Consider adding ESLint with Node.js configs if needed

---

## Database

- **MongoDB** with Mongoose ODM
- Models located in `Backend/src/models/`
- Connection handled in `Backend/src/config/dataBase.js`

---

## Environment Variables

Create `.env` files in Backend directory:

```env
PORT=5000
MONGODB_URI=...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_USER=...
EMAIL_PASS=...
NODE_ENV=development
```

---

## Common Patterns

### Adding a New Backend Module

1. Create `src/modules/<name>/` directory
2. Create `<name>.controller.js`, `<name>.service.js`, `<name>.routes.js`, `<name>.validation.js`
3. Import and mount routes in `app.js`

### Adding a New Frontend Component

1. Create `src/components/<Name>.jsx`
2. Use functional component with hooks if needed
3. Apply Tailwind classes for styling
4. Export as default

### API Response Consistency

Always return:
```javascript
{
  success: true|false,
  message: '...',      // for errors or status
  data: {...},         // for successful responses
  // or
  user: {...},
  accessToken: '...'
}
```

---

## Testing

- **No test framework** currently configured
- To add tests: consider Jest (Backend) and Vitest or Jest (Frontend)
- Run single test example for Jest: `npm test -- --testNamePattern="pattern"`
