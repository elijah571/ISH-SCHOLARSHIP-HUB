import {
  registerUserService,
  verifyEmailService,
  loginUserService,
  refreshTokenService,
  forgotPasswordService,
  resetPasswordService,
  logoutService,
} from './auth.service.js';
import { Scholarship } from '../../models/scholarship.js';

import { validateRegistration, validateLogin } from './auth.validation.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { AppError } from '../../utils/AppError.js';
import { logger } from '../../utils/logger.js';

/* ================= COOKIE OPTIONS ================= */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
};

const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  path: '/',
};

/* ================= REGISTER ================= */
export const registerUser = asyncHandler(async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) {
    logger.warn('Registration validation failed:', error.details[0].message);
    throw new AppError(error.details[0].message, 400);
  }

  try {
    const user = await registerUserService(req.body);

    logger.info(`User registered successfully: ${user.email}`);
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      user,
    });
  } catch (err) {
    logger.error('Registration error:', err.message);
    throw err;
  }
});

/* ================= VERIFY EMAIL ================= */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  if (!token) throw new AppError('Verification token missing', 400);

  await verifyEmailService(token);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
  });
});

/* ================= LOGIN ================= */
export const loginUser = asyncHandler(async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { accessToken, refreshToken, user } = await loginUserService(req);

  res
    .cookie('refreshToken', refreshToken, {
      ...REFRESH_COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      accessToken,
      data: user,
    });
});

/* ================= REFRESH TOKEN ================= */
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new AppError('Refresh token missing', 401);
  }

  const { accessToken, newRefreshToken } = await refreshTokenService(token);

  res
    .cookie('refreshToken', newRefreshToken, {
      ...REFRESH_COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      accessToken,
    });
});

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new AppError('Email is required', 400);

  await forgotPasswordService(email);

  res.status(200).json({
    success: true,
    message: 'If the email exists, a reset link has been sent',
  });
});

/* ================= RESET PASSWORD ================= */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) throw new AppError('New password is required', 400);

  await resetPasswordService(token, password);

  res.status(200).json({
    success: true,
    message: 'Password reset successful',
  });
});

/* ================= LOGOUT (SINGLE SESSION) ================= */
export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await logoutService(req.user._id, token);
  }

  res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/* ================= LOGOUT ALL DEVICES ================= */
export const logoutAll = asyncHandler(async (req, res) => {
  req.user.sessions = [];
  await req.user.save();

  res.clearCookie('refreshToken', COOKIE_OPTIONS).json({
    success: true,
    message: 'Logged out from all devices',
  });
});

/* ================= SAVE SCHOLARSHIP ================= */
export const saveScholarship = asyncHandler(async (req, res) => {
  const scholarshipId = req.params.id;
  const scholarship = await Scholarship.findById(scholarshipId);
  if (!scholarship) {
    throw new AppError('Scholarship not found', 404);
  }

  const user = req.user;
  const isAlreadySaved = user.savedScholarships.some(
    (s) => s._id?.toString() === scholarshipId || s.toString() === scholarshipId
  );

  if (isAlreadySaved) {
    throw new AppError('Scholarship already saved', 400);
  }

  user.savedScholarships.push(scholarshipId);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Scholarship saved successfully',
  });
});

/* ================= UNSAVE SCHOLARSHIP ================= */
export const unsaveScholarship = asyncHandler(async (req, res) => {
  const scholarshipId = req.params.id;
  const user = req.user;

  const savedId = user.savedScholarships.find(
    (s) => s._id?.toString() === scholarshipId || s.toString() === scholarshipId
  );

  if (!savedId) {
    throw new AppError('Scholarship not in saved list', 400);
  }

  user.savedScholarships = user.savedScholarships.filter(
    (s) => s._id?.toString() !== scholarshipId && s.toString() !== scholarshipId
  );
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Scholarship removed from saved',
  });
});

/* ================= MARK AS APPLIED ================= */
export const markAsApplied = asyncHandler(async (req, res) => {
  const scholarshipId = req.params.id;
  const scholarship = await Scholarship.findById(scholarshipId);
  if (!scholarship) {
    throw new AppError('Scholarship not found', 404);
  }

  const user = req.user;
  const isAlreadyApplied = user.appliedScholarships.some(
    (a) => a.scholarship?.toString() === scholarshipId
  );

  if (isAlreadyApplied) {
    throw new AppError('Already applied to this scholarship', 400);
  }

  user.appliedScholarships.push({ scholarship: scholarshipId });
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Marked as applied',
  });
});

/* ================= GET SAVED SCHOLARSHIPS ================= */
export const getSavedScholarships = asyncHandler(async (req, res) => {
  const user = await req.user.populate({
    path: 'savedScholarships',
    model: 'Scholarship',
  });

  res.status(200).json({
    success: true,
    data: user.savedScholarships,
  });
});

/* ================= GET APPLIED SCHOLARSHIPS ================= */
export const getAppliedScholarships = asyncHandler(async (req, res) => {
  const user = await req.user.populate({
    path: 'appliedScholarships.scholarship',
    model: 'Scholarship',
  });

  res.status(200).json({
    success: true,
    data: user.appliedScholarships,
  });
});

/* ================= GET PROFILE ================= */
export const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      savedCount: user.savedScholarships.length,
      appliedCount: user.appliedScholarships.length,
    },
  });
});
