// src/utils/logger.js
import winston from 'winston';
import path from 'path';
import fs from 'fs';

const isProduction = process.env.NODE_ENV === 'production';

const { combine, timestamp, errors, printf, colorize, json, splat } =
  winston.format;

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

const fileFormat = combine(
  timestamp(),
  errors({ stack: true }),
  splat(),
  json()
);

const transports = [
  new winston.transports.Console({ format: consoleFormat }),
];

// File transports only in development (container runs as non-root in production)
if (!isProduction) {
  const logDir = 'logs';
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  transports.push(
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error', format: fileFormat }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log'), format: fileFormat })
  );
}

export const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  defaultMeta: { service: 'ISH-Scholarship-Hub' },
  transports,
  exitOnError: false,
});

if (!isProduction) {
  logger.exceptions.handle(
    new winston.transports.File({ filename: 'logs/exceptions.log', format: fileFormat })
  );
  logger.rejections.handle(
    new winston.transports.File({ filename: 'logs/rejections.log', format: fileFormat })
  );
}
