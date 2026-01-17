import express from 'express';

import {
  registerUser,
  loginUser,
  verifyEmail,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
  logoutAll,
} from './auth.controller.js';

import { authLimiter, authSlowDown } from '../../middleware/rateLimiter.js';
import { VerifyUser } from '../../middleware/auth.middleware.js';

const router = express.Router();

/* ================= PUBLIC ROUTES ================= */
router.post('/register', authLimiter, authSlowDown, registerUser);
router.post('/login', authLimiter, authSlowDown, loginUser);
router.get('/verify-email', verifyEmail);

router.post('/forgot-password', authLimiter, authSlowDown, forgotPassword);
router.post('/reset-password/:token', authLimiter, authSlowDown, resetPassword);

router.post('/refresh', refreshToken);

/* ================= PROTECTED ROUTES ================= */
router.post('/logout', VerifyUser, logout);
router.post('/logout-all', VerifyUser, logoutAll);

export default router;
