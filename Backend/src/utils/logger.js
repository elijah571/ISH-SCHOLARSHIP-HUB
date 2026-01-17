// src/utils/logger.js
import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure log directory exists
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const { combine, timestamp, errors, printf, colorize, json, splat } =
  winston.format;

// Custom log format for console (more readable)
const consoleFormat = combine(
  colorize(),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  splat(),
  printf(({ level, message, timestamp, stack }) => {
    return stack
      ? `[${timestamp}] ${level}: ${message}\nStack: ${stack}`
      : `[${timestamp}] ${level}: ${message}`;
  })
);

// JSON format for files (structured logging)
const fileFormat = combine(
  timestamp(),
  errors({ stack: true }),
  splat(),
  json()
);

// Create logger
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  defaultMeta: { service: 'ISH-Scholarship-Hub' },
  transports: [
    // Console logs (pretty in dev)
    new winston.transports.Console({
      format: consoleFormat,
    }),

    // Error logs
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: fileFormat,
    }),

    // Combined logs
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: fileFormat,
    }),
  ],
  exitOnError: false, // Prevent exit on handled exceptions
});

// Optional: Catch unhandled exceptions and unhandled rejections
logger.exceptions.handle(
  new winston.transports.File({
    filename: path.join(logDir, 'exceptions.log'),
    format: fileFormat,
  })
);

logger.rejections.handle(
  new winston.transports.File({
    filename: path.join(logDir, 'rejections.log'),
    format: fileFormat,
  })
);
