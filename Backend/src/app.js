import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';

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

export const app = express();

const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? process.env.CLIENT_URL
      : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-XSRF-TOKEN', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
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
  logger.info(` ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    logger.info(`Body: ${JSON.stringify(req.body)}`);
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

app.use(errorHandler);
