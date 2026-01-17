import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from './asyncHandler.js';

export const VerifyUser = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized, token missing', 401);
  }

  // 2. Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }

  // 3. Find user
  const user = await User.findById(decoded.userId).select('-password');
  if (!user) {
    throw new AppError('User no longer exists', 401);
  }

  // 4. Attach user to request
  req.user = user;
  next();
});
