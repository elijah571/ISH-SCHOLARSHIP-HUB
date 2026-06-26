import jwt from 'jsonwebtoken';
import { User } from '../database/models/index.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from './asyncHandler.js';

export const VerifyUser = asyncHandler(async (req, _res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) throw new AppError('Not authorized, token missing', 401);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch {
    throw new AppError('Invalid or expired token', 401);
  }

  const user = await User.findByPk(decoded.userId, {
    attributes: ['id', 'fullName', 'email', 'role', 'isEmailVerified'],
  });
  if (!user) throw new AppError('User no longer exists', 401);

  req.user = user;
  next();
});
