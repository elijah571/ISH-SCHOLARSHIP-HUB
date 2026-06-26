import jwt from 'jsonwebtoken';
import { User } from '../database/models/index.js';

export const verifySocketUser = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Not authorized, token missing'));

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'fullName', 'email', 'role'],
    });
    if (!user) return next(new Error('User no longer exists'));

    socket.user = user;
    next();
  } catch {
    next(new Error('Invalid or expired token'));
  }
};
