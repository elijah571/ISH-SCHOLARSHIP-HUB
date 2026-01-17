import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

// IP-based rate limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10, // max 10 requests per IP per window
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  message: 'Too many requests from this IP, try again later',
});

// Optional: slow down instead of blocking immediately
export const authSlowDown = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 5,
  delayMs: () => 500,
});
