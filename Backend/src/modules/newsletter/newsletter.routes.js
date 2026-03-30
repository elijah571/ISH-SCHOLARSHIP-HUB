import express from 'express';
import {
  subscribeNewsletter,
  unsubscribeNewsletter,
  sendNewsletter,
} from './newsletter.controller.js';
import { isAuthorized } from '../../middleware/role.middleware.js';
import { VerifyUser } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Public - anyone can subscribe/unsubscribe
router.post('/subscribe', subscribeNewsletter);
router.post('/unsubscribe', unsubscribeNewsletter);

// Admin - only admins can send newsletters
router.post('/send', VerifyUser, isAuthorized('admin'), sendNewsletter);

export default router;
