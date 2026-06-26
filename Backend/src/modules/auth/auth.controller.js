import {
  registerUserService,
  verifyEmailService,
  loginUserService,
  refreshTokenService,
  forgotPasswordService,
  resetPasswordService,
  logoutService,
} from './auth.service.js';
import { scholarshipUserRepo } from './auth.repository.js';
import { scholarshipRepo } from '../scholarship/scholarship.repository.js';
import { logActivity } from '../admin/admin.service.js';
import { validateRegistration, validateLogin } from './auth.validation.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { AppError } from '../../utils/AppError.js';
import { logger } from '../../utils/logger.js';
import { Scholarship } from '../../database/models/index.js';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
};
const SESSION_COOKIE = 'ish_session';
const SESSION_OPTS = { ...COOKIE_OPTS, httpOnly: false };

/* ─── Register ─────────────────────────────────────────────────────────────── */
export const registerUser = asyncHandler(async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) throw new AppError(error.details[0].message, 400);

  const user = await registerUserService(req.body);
  res.status(201).json({ success: true, message: 'Registration successful. Please verify your email.', data: user });
});

/* ─── Verify Email ──────────────────────────────────────────────────────────── */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  if (!token) throw new AppError('Verification token missing', 400);
  await verifyEmailService(token);
  res.status(200).json({ success: true, message: 'Email verified successfully' });
});

/* ─── Login ─────────────────────────────────────────────────────────────────── */
export const loginUser = asyncHandler(async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) throw new AppError(error.details[0].message, 400);

  const { accessToken, refreshToken, user } = await loginUserService(req);

  res
    .cookie('refreshToken', refreshToken, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .cookie(SESSION_COOKIE, '1', { ...SESSION_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .status(200)
    .json({ success: true, accessToken, data: user });
});

/* ─── Refresh Token ─────────────────────────────────────────────────────────── */
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new AppError('Refresh token missing', 401);

  const { accessToken, newRefreshToken } = await refreshTokenService(token);

  res
    .cookie('refreshToken', newRefreshToken, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .cookie(SESSION_COOKIE, '1', { ...SESSION_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .status(200)
    .json({ success: true, accessToken });
});

/* ─── Forgot Password ───────────────────────────────────────────────────────── */
export const forgotPassword = asyncHandler(async (req, res) => {
  if (!req.body.email) throw new AppError('Email is required', 400);
  await forgotPasswordService(req.body.email);
  res.status(200).json({ success: true, message: 'If the email exists, a reset link has been sent' });
});

/* ─── Reset Password ────────────────────────────────────────────────────────── */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!password) throw new AppError('New password is required', 400);
  await resetPasswordService(token, password);
  res.status(200).json({ success: true, message: 'Password reset successful' });
});

/* ─── Logout ────────────────────────────────────────────────────────────────── */
export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) await logoutService(req.user.id, token);

  res
    .clearCookie('refreshToken', COOKIE_OPTS)
    .clearCookie(SESSION_COOKIE, SESSION_OPTS)
    .json({ success: true, message: 'Logged out successfully' });
});

/* ─── Logout All Devices ────────────────────────────────────────────────────── */
export const logoutAll = asyncHandler(async (req, res) => {
  const { userRepo } = await import('./auth.repository.js');
  await userRepo.deleteAllSessions(req.user.id);

  res
    .clearCookie('refreshToken', COOKIE_OPTS)
    .clearCookie(SESSION_COOKIE, SESSION_OPTS)
    .json({ success: true, message: 'Logged out from all devices' });
});

/* ─── Save Scholarship ──────────────────────────────────────────────────────── */
export const saveScholarship = asyncHandler(async (req, res) => {
  const scholarshipId = req.params.id;
  const userId = req.user.id;

  const scholarship = await scholarshipRepo.findById(scholarshipId);
  if (!scholarship) throw new AppError('Scholarship not found', 404);

  const existing = await scholarshipUserRepo.findSavedOne(userId, scholarshipId);
  if (existing) throw new AppError('Scholarship already saved', 400);

  await scholarshipUserRepo.save(userId, scholarshipId);

  logActivity({
    userId, userName: req.user.fullName, userEmail: req.user.email,
    action: 'saved', targetType: 'scholarship', targetId: scholarshipId, targetTitle: scholarship.title,
  });

  res.status(200).json({ success: true, message: 'Scholarship saved successfully' });
});

/* ─── Unsave Scholarship ────────────────────────────────────────────────────── */
export const unsaveScholarship = asyncHandler(async (req, res) => {
  const scholarshipId = req.params.id;
  const userId = req.user.id;

  const existing = await scholarshipUserRepo.findSavedOne(userId, scholarshipId);
  if (!existing) throw new AppError('Scholarship not in saved list', 400);

  await scholarshipUserRepo.unsave(userId, scholarshipId);

  res.status(200).json({ success: true, message: 'Scholarship removed from saved' });
});

/* ─── Mark As Applied ───────────────────────────────────────────────────────── */
export const markAsApplied = asyncHandler(async (req, res) => {
  const scholarshipId = req.params.id;
  const userId = req.user.id;

  const scholarship = await scholarshipRepo.findById(scholarshipId);
  if (!scholarship) throw new AppError('Scholarship not found', 404);

  const existing = await scholarshipUserRepo.findAppliedOne(userId, scholarshipId);
  if (existing) throw new AppError('Already applied to this scholarship', 400);

  await scholarshipUserRepo.apply(userId, scholarshipId);

  logActivity({
    userId, userName: req.user.fullName, userEmail: req.user.email,
    action: 'applied', targetType: 'scholarship', targetId: scholarshipId, targetTitle: scholarship.title,
  });

  res.status(200).json({ success: true, message: 'Marked as applied' });
});

/* ─── Get Saved Scholarships ────────────────────────────────────────────────── */
export const getSavedScholarships = asyncHandler(async (req, res) => {
  const saved = await scholarshipUserRepo.findSaved(req.user.id);
  const ids = saved.map((s) => s.scholarshipId);

  const scholarships = ids.length
    ? await Scholarship.findAll({ where: { id: ids } })
    : [];

  res.status(200).json({ success: true, data: scholarships });
});

/* ─── Get Applied Scholarships ──────────────────────────────────────────────── */
export const getAppliedScholarships = asyncHandler(async (req, res) => {
  const applied = await scholarshipUserRepo.findApplied(req.user.id);
  const ids = applied.map((a) => a.scholarshipId);

  const scholarships = ids.length
    ? await Scholarship.findAll({ where: { id: ids } })
    : [];

  const result = applied.map((a) => ({
    scholarship: scholarships.find((s) => s.id === a.scholarshipId),
    appliedAt: a.appliedAt,
  }));

  res.status(200).json({ success: true, data: result });
});

/* ─── Get Profile ───────────────────────────────────────────────────────────── */
export const getProfile = asyncHandler(async (req, res) => {
  const [savedCount, appliedCount] = await Promise.all([
    scholarshipUserRepo.findSaved(req.user.id).then((r) => r.length),
    scholarshipUserRepo.findApplied(req.user.id).then((r) => r.length),
  ]);

  res.status(200).json({
    success: true,
    data: {
      id: req.user.id, fullName: req.user.fullName,
      email: req.user.email, role: req.user.role,
      isEmailVerified: req.user.isEmailVerified,
      savedCount, appliedCount,
    },
  });
});
