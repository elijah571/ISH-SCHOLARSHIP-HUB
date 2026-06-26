import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { randomUUID } from 'crypto';
import { apiLimiter } from './middleware/rateLimiter.js';

import { setSecurityHeaders, csrfProtection } from './middleware/security.js';
import authRoutes from './modules/auth/auth.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import csrfRoutes from './routes/csrf.routes.js';
import { logger } from './utils/logger.js';

//routes
import scholarshipRoutes from './modules/scholarship/scholarship.routes.js';
import blogRoutes from './modules/blog/blog.route.js';
import newsletterRoutes from './modules/newsletter/newsletter.routes.js';
import internshipRoutes from './modules/internship/internship.routes.js';
import chatRoutes from './modules/chat/chat.routes.js';

export const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((o) => o.trim());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

// Request ID for tracing
app.use((req, _res, next) => {
  req.requestId = req.headers['x-request-id'] || randomUUID();
  next();
});

app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());
app.use(helmet());
app.use(setSecurityHeaders);
app.use('/api', apiLimiter);

app.use(csrfProtection);

// expose CSRF token
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  });
  next();
});

const SENSITIVE_KEYS = new Set(['password', 'token', 'refreshToken', 'accessToken', 'secret']);
const redactBody = (body) => {
  if (!body || typeof body !== 'object') return body;
  const redacted = { ...body };
  for (const key of Object.keys(redacted)) {
    if (SENSITIVE_KEYS.has(key)) redacted[key] = '[REDACTED]';
  }
  return redacted;
};

// Health check (no auth, no CSRF, no rate limit)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.use((req, res, next) => {
  logger.info(`[${req.requestId}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    logger.debug(`Body: ${JSON.stringify(redactBody(req.body))}`);
  }
  next();
});

app.use('/api', csrfRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/scholarship', scholarshipRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/internship', internshipRoutes);
app.use('/api/chat', chatRoutes);

app.use(errorHandler);
