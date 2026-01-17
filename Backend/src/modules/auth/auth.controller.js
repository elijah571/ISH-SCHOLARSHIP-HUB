import {
  registerUserService,
  verifyEmailService,
  loginUserService,
  refreshTokenService,
  forgotPasswordService,
  resetPasswordService,
  logoutService,
} from './auth.service.js';

import { validateRegistration } from './auth.validation.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { AppError } from '../../utils/AppError.js';

/* ================= COOKIE OPTIONS ================= */
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true, // MUST be true in production
  sameSite: 'strict',
  path: '/api/auth/refresh',
};

/* ================= REGISTER ================= */
export const registerUser = asyncHandler(async (req, res) => {
  const { error } = validateRegistration(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const user = await registerUserService(req.body);

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please verify your email.',
    user,
  });
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
  if (!token) {
    throw new AppError('Refresh token missing', 401);
  }

  await logoutService(req.user._id, token);

  res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS).json({
    success: true,
    message: 'Logged out successfully',
  });
});

/* ================= LOGOUT ALL DEVICES ================= */
export const logoutAll = asyncHandler(async (req, res) => {
  req.user.sessions = [];
  await req.user.save();

  res.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS).json({
    success: true,
    message: 'Logged out from all devices',
  });
});
