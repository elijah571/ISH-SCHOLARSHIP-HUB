import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const verifySocketUser = async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error('Not authorized, token missing'));
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return next(new Error('User no longer exists'));
    }

    // Attach to socket (same idea as req.user)
    socket.user = user;

    next();
  } catch (err) {
    next(new Error('Invalid or expired token'));
  }
};
