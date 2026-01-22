import express from 'express';
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
  sendNewsletter,
} from './newsletter.controller.js';
import { VerifyUser } from '../../middleware/auth.middleware.js';
import { isAthourize } from '../../middleware/role.middleware.js';

const router = express.Router();

// Public - anyone can subscribe/unsubscribe
router.post('/subscribe', VerifyUser, subscribeNewsletter);
router.post('/unsubscribe', VerifyUser, unsubscribeNewsletter);

// Admin - only admins can send newsletters
router.post('/send', VerifyUser, isAthourize('admin'), sendNewsletter);

export default router;
