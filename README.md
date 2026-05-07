# ISH Scholarship Hub

A full-stack web platform connecting students with scholarship opportunities worldwide. Browse, filter, and apply to scholarships and internships — with expert support services including resume review, essay editing, interview preparation, and admission consulting.

## Features

- **Scholarship Discovery** — Search and filter scholarships by country, funding type, and relevance
- **Internship Listings** — Browse internship opportunities alongside scholarships
- **User Dashboard** — Track applications, save scholarships, and manage your profile
- **Real-Time Chat** — Connect with support staff through live messaging
- **Blog & Newsletter** — Stay updated with educational content and announcements
- **Application Services** — Resume review, essay editing, interview prep, and admission consulting
- **Admin Panel** — Manage scholarships, internships, users, blog posts, and newsletter campaigns

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool and dev server |
| React Router v7 | Client-side routing |
| Tailwind CSS v4 | Styling |
| Axios | HTTP client with CSRF + token interceptors |
| Socket.IO Client | Real-time chat |
| React Toastify | Notifications |

### Backend

| Technology | Purpose |
|---|---|
| Express.js v5 | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JWT (Access + Refresh) | Authentication |
| Argon2 | Password hashing |
| Helmet + CSRF | Security headers and CSRF protection |
| Cloudinary | Image uploads |
| Socket.IO | Real-time chat backend |
| Winston | Logging |
| Joi | Request validation |

## Project Structure

```
ISH-SCHOLARSHIP-HUB/
├── Frontend/                  # React SPA (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── admin/         # Admin-specific components
│   │   │   ├── blog/          # Blog components
│   │   │   ├── chat/          # Chat components
│   │   │   ├── icons/         # SVG icon components
│   │   │   ├── internships/   # Internship components
│   │   │   └── scholarships/  # Scholarship components
│   │   ├── context/           # React context providers (Auth, Scholarship, Internship, Chat)
│   │   ├── pages/             # Route-level page components
│   │   ├── services/          # API client and service modules
│   │   ├── App.jsx            # Route definitions
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles (Tailwind)
│   └── package.json
├── Backend/                   # Express API server
│   ├── src/
│   │   ├── modules/           # Feature modules (MVC pattern)
│   │   │   ├── auth/          # Registration, login, password reset
│   │   │   ├── admin/         # Admin CRUD operations
│   │   │   ├── scholarship/   # Scholarship management
│   │   │   ├── internship/    # Internship management
│   │   │   ├── blog/          # Blog CRUD
│   │   │   ├── newsletter/    # Newsletter subscriptions
│   │   │   └── chat/          # Chat system
│   │   ├── models/            # Mongoose schemas
│   │   ├── middleware/        # Auth, error handling, security, upload, rate limiting
│   │   ├── services/          # Business logic (email, chat socket)
│   │   ├── utils/             # AppError, logger
│   │   ├── config/            # Database, Cloudinary
│   │   ├── app.js             # Express app setup
│   │   └── server.js          # HTTP server + Socket.IO
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)
- SMTP credentials (for email features)

### Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env  # or create manually

# Required environment variables:
# MONGO_URI=mongodb+srv://...
# JWT_ACCESS_SECRET=your-secret
# JWT_REFRESH_SECRET=your-secret
# JWT_EMAIL_VERIFY_SECRET=your-secret
# JWT_ACCESS_EXPIRATION=15m
# JWT_REFRESH_EXPIRATION=7d
# CLOUDINARY_NAME=your-cloud
# CLOUDINARY_API=your-api-key
# CLOUDINARY_SECRET=your-api-secret
# SMTP_HOST=smtp.provider.com
# SMTP_PORT=587
# SMTP_USER=your-email
# SMTP_PASS=your-password
# EMAIL_FROM=noreply@yourdomain.com
# CLIENT_URL=http://localhost:5173
# PORT=3000
# NODE_ENV=development
# APP_URL=http://localhost:3000

# Run development server
npm run dev
```

### Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:3000" > .env

# Run development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## API Endpoints

| Prefix | Module | Auth |
|---|---|---|
| `POST /api/auth/register` | User registration | Public |
| `POST /api/auth/login` | User login | Public |
| `POST /api/auth/refresh` | Token refresh | httpOnly cookie |
| `GET /api/auth/profile` | User profile | Protected |
| `POST /api/auth/save-scholarship` | Save scholarship | Protected |
| `GET /api/scholarship` | List scholarships | Public |
| `GET /api/scholarship/:id` | Scholarship details | Public |
| `GET /api/internship` | List internships | Public |
| `GET /api/internship/:id` | Internship details | Public |
| `GET /api/blog` | Blog listing | Public |
| `POST /api/blog` | Create blog post | Admin |
| `POST /api/newsletter/subscribe` | Newsletter subscription | Public |
| `GET /api/chat` | Chat conversations | Protected |
| `GET /api/admin/*` | Admin operations | Admin only |

## Security

- **CSRF Protection** — Cookie-based token with automatic attachment via axios interceptor
- **Helmet** — Security headers on all responses
- **Rate Limiting** — Express rate limiter and slow-down on authentication endpoints
- **Password Security** — Argon2 hashing via Mongoose pre-save hook
- **JWT Strategy** — Short-lived access tokens (15m, in-memory) + refresh tokens (7d, httpOnly cookie)
- **CORS** — Configured with allowed origins and credentials
- **Input Validation** — Joi schemas on all request bodies

## Authentication Flow

1. User registers or logs in → receives access token (memory) + refresh token (httpOnly cookie)
2. API calls include `Authorization: Bearer <token>` header
3. On 401, the axios interceptor silently calls `/api/auth/refresh` and retries the original request
4. Mutating requests (POST/PATCH/PUT/DELETE) automatically attach CSRF token

## Pages

### Public Pages
- Home, Scholarships, Internships, Blog, Apply Guide, Student Resources, Success Stories
- Services: Resume Review, Interview Prep, Essay Editing, Admission Consulting
- Support: Contact Us, FAQ, Privacy Policy, Terms of Service

### Protected Pages
- User Dashboard (overview, applications, saved scholarships, chat, profile, settings)
- Admin Dashboard (manage scholarships, internships, users, blogs, newsletters)

## Deployment

### Backend
- Set all environment variables in your hosting platform
- Ensure `NODE_ENV=production`
- Update `CLIENT_URL` and `APP_URL` to production domains
- MongoDB Atlas connection string must be configured

### Frontend
- Build with `npm run build` → outputs to `dist/`
- Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages)
- Set `VITE_API_URL` to your production backend URL

## License

ISC
