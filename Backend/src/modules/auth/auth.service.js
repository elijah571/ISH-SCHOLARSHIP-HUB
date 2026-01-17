import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { User } from '../../models/user.model.js';
import { sendEmail } from '../../services/email.js';
import { AppError } from '../../utils/AppError.js';
import { signAccessToken, signRefreshToken } from '../../utils/token.js';

function getAppUrl() {
  return process.env.APP_URL || `http://localhost:${process.env.PORT}`;
}

/* ================= REGISTER ================= */
export const registerUserService = async ({ fullName, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Account with this email exists', 400);
  }

  const newUser = await User.create({
    fullName,
    email,
    password,
  });

  const verifyToken = jwt.sign(
    { userId: newUser._id },
    process.env.JWT_EMAIL_VERIFY_SECRET,
    { expiresIn: '24h' }
  );

  const verifyUrl = `${getAppUrl()}/api/auth/verify-email?token=${verifyToken}`;

  await sendEmail(
    newUser.email,
    'Verify your email',
    `<p>Click below to verify your email:</p>
     <a href="${verifyUrl}">Verify Email</a>`
  );

  return {
    id: newUser._id,
    email: newUser.email,
    role: newUser.role,
    isEmailVerified: newUser.isEmailVerified,
  };
};

/* ================= VERIFY EMAIL ================= */
export const verifyEmailService = async (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_EMAIL_VERIFY_SECRET);
  } catch {
    throw new AppError('Invalid or expired token', 400);
  }

  const user = await User.findById(decoded.userId);
  if (!user) throw new AppError('User not found', 404);

  if (user.isEmailVerified) {
    throw new AppError('Email already verified', 400);
  }

  user.isEmailVerified = true;
  await user.save();

  return true;
};

/* ================= LOGIN ================= */
export const loginUserService = async (req) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isEmailVerified) {
    throw new AppError('Please verify your email first', 403);
  }

  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  const hashedRefresh = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  if (user.sessions.length >= 5) user.sessions.shift();

  user.sessions.push({
    refreshToken: hashedRefresh,
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
  });

  await user.save();
  const safeUser = {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
  };

  return { accessToken, refreshToken, user: safeUser };
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return;

  const resetToken = crypto.randomBytes(32).toString('hex');

  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  user.resetPasswordTokenExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  const resetUrl = `${getAppUrl()}/api/auth/reset-password/${resetToken}`;
  await sendEmail(user.email, 'Reset Password', resetUrl);
};

/* ================= RESET PASSWORD ================= */
export const resetPasswordService = async (token, newPassword) => {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordTokenExpires: { $gt: Date.now() },
  });

  if (!user) throw new AppError('Token invalid or expired', 400);

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpires = undefined;
  user.sessions = []; // invalidate all sessions

  await user.save();
};

/* ================= REFRESH TOKEN ================= */
export const refreshTokenService = async (token) => {
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({ 'sessions.refreshToken': hashed });
  if (!user) throw new AppError('Session expired', 401);

  if (!user.sessions.some((s) => s.refreshToken === hashed)) {
    user.sessions = [];
    await user.save();
    throw new AppError('Refresh token reuse detected', 401);
  }

  const newRefreshToken = signRefreshToken(user._id);
  const newHashed = crypto
    .createHash('sha256')
    .update(newRefreshToken)
    .digest('hex');

  user.sessions = user.sessions.map((s) =>
    s.refreshToken === hashed ? { ...s.toObject(), refreshToken: newHashed } : s
  );

  await user.save();

  return {
    accessToken: signAccessToken(user._id),
    newRefreshToken,
  };
};

/* ================= LOGOUT ================= */
export const logoutService = async (userId, token) => {
  const hashed = crypto.createHash('sha256').update(token).digest('hex');

  await User.findByIdAndUpdate(userId, {
    $pull: { sessions: { refreshToken: hashed } },
  });
};
