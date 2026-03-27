import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Unknown error';

  if (statusCode >= 500) {
    logger.error(message);
  } else {
    logger.warn(message);
  }

  res.status(statusCode).json({
    success: false,
    message: err.isOperational ? message : 'Internal Server Error',
  });
};
