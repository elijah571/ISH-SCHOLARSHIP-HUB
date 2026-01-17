import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { setSecurityHeaders, csrfProtection } from './middleware/security.js';
import authRoutes from './modules/auth/auth.routes.js';
import scholarshipRoutes from './modules/scholarship/scholarship.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import csrfRoutes from './routes/csrf.routes.js';
import { logger } from './utils/logger.js';

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(setSecurityHeaders);

app.use(csrfProtection);

// expose CSRF token
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  next();
});

// ✅ Logger middleware
app.use((req, res, next) => {
  logger.info(`➡️ ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    logger.info(`📦 Body: ${JSON.stringify(req.body)}`);
  }
  next();
});

app.use('/api', csrfRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/scholarship', scholarshipRoutes);

app.use(errorHandler);
