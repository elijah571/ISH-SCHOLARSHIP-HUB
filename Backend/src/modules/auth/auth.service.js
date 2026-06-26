import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import argon2 from 'argon2';
import { userRepo } from './auth.repository.js';
import { activityRepo } from '../admin/admin.repository.js';
import { sendEmail } from '../../services/email.js';
import { AppError } from '../../utils/AppError.js';
import { signAccessToken, signRefreshToken } from '../../utils/token.js';
import { logger } from '../../utils/logger.js';

const FRONTEND_URL = () => process.env.FRONTEND_URL || 'http://localhost:5173';

const logActivity = (data) => activityRepo.create(data).catch((e) => logger.warn('logActivity failed:', e.message));

/* ─── Register ───────────────────────────────────────────────────────────── */
export const registerUserService = async ({ fullName, email, password }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new AppError('Account with this email already exists', 400);

  const hashed = await argon2.hash(password);
  const user = await userRepo.create({ fullName, email: email.toLowerCase(), password: hashed });

  logActivity({
    userId: user.id, userName: user.fullName, userEmail: user.email,
    action: 'registered', targetType: 'user', targetId: user.id, targetTitle: user.fullName,
  });

  const verifyToken = jwt.sign({ userId: user.id }, process.env.JWT_EMAIL_VERIFY_SECRET, { expiresIn: '24h' });
  const verifyUrl = `${FRONTEND_URL()}/verify-email?token=${verifyToken}`;

  const emailResult = await sendEmail(user.email, 'Verify your email',
    `<p>Click below to verify your email:</p><a href="${verifyUrl}">Verify Email</a>`
  ).catch(() => ({ success: false }));

  return {
    id: user.id, email: user.email, role: user.role,
    isEmailVerified: user.isEmailVerified, emailSent: !!emailResult.success,
  };
};

/* ─── Verify Email ───────────────────────────────────────────────────────── */
export const verifyEmailService = async (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_EMAIL_VERIFY_SECRET);
  } catch {
    throw new AppError('Invalid or expired verification token', 400);
  }

  const user = await userRepo.findByIdWithPassword(decoded.userId);
  if (!user) throw new AppError('User not found', 404);
  if (user.isEmailVerified) throw new AppError('Email already verified', 400);

  await user.update({ isEmailVerified: true });
  return true;
};

/* ─── Login ──────────────────────────────────────────────────────────────── */
export const loginUserService = async (req) => {
  const { email, password } = req.body;

  const user = await userRepo.findByEmail(email);
  if (!user) throw new AppError('Invalid credentials', 401);

  const match = await argon2.verify(user.password, password);
  if (!match) throw new AppError('Invalid credentials', 401);

  if (!user.isEmailVerified) throw new AppError('Please verify your email first', 403);

  const [accessToken, refreshToken] = [signAccessToken(user.id), signRefreshToken(user.id)];
  const hashedRefresh = crypto.createHash('sha256').update(refreshToken).digest('hex');

  // Max 5 sessions per user
  const sessionCount = await userRepo.countSessions(user.id);
  if (sessionCount >= 5) {
    const sessions = await userRepo.getSessions(user.id);
    await userRepo.deleteSession(sessions[0].id);
  }

  await userRepo.createSession({
    userId: user.id,
    refreshToken: hashedRefresh,
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
  });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified },
  };
};

/* ─── Forgot Password ────────────────────────────────────────────────────── */
export const forgotPasswordService = async (email) => {
  const user = await userRepo.findByEmail(email);
  if (!user) return; // silent — don't reveal existence

  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');

  await user.update({
    resetPasswordToken: hashed,
    resetPasswordTokenExpires: new Date(Date.now() + 10 * 60 * 1000),
  });

  const resetUrl = `${FRONTEND_URL()}/reset-password/${rawToken}`;
  await sendEmail(user.email, 'Reset Your Password',
    `<p>Click below to reset your password (expires in 10 minutes):</p><a href="${resetUrl}">Reset Password</a>`
  ).catch((e) => logger.warn('Forgot-password email failed:', e.message));
};

/* ─── Reset Password ─────────────────────────────────────────────────────── */
export const resetPasswordService = async (token, newPassword) => {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await userRepo.findByResetToken(hashed);
  if (!user) throw new AppError('Token is invalid or expired', 400);

  const hashedPw = await argon2.hash(newPassword);

  await Promise.all([
    user.update({ password: hashedPw, resetPasswordToken: null, resetPasswordTokenExpires: null }),
    userRepo.deleteAllSessions(user.id),
  ]);
};

/* ─── Refresh Token ──────────────────────────────────────────────────────── */
export const refreshTokenService = async (token) => {
  try {
    jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const session = await userRepo.findSessionByToken(hashed);
  if (!session) throw new AppError('Session expired or revoked', 401);

  const newRefreshToken = signRefreshToken(session.userId);
  const newHashed = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

  await userRepo.updateSession(session.id, { refreshToken: newHashed });

  return { accessToken: signAccessToken(session.userId), newRefreshToken };
};

/* ─── Logout ─────────────────────────────────────────────────────────────── */
export const logoutService = async (userId, token) => {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  await userRepo.deleteSessionByToken(userId, hashed);
};
