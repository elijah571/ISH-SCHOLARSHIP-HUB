import { AppError } from '../utils/AppError.js';

export const can = (permission) => {
  return (req, res, next) => {
    if (!req.user.permissions?.includes(permission)) {
      throw new AppError('Permission denied', 403);
    }
    next();
  };
};
