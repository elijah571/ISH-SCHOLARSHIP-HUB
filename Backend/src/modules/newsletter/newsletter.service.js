import { Newsletter } from '../../models/newsletter.model.js';
import { sendEmail } from '../../services/email.js';
import { AppError } from '../../utils/AppError.js';
import { newsletterTemplate } from './newsletter.template.js';
import { User } from '../../models/user.model.js';
const MESSAGES = {
  SUBSCRIBED: 'Subscribed successfully',
  REACTIVATED: 'Subscription reactivated',
  ALREADY_SUBSCRIBED: 'Email already subscribed',
  UNSUBSCRIBED: 'Unsubscribed successfully',
  NOT_FOUND: 'Subscription not found',
  USER_NOT_FOUND: 'User not Found',
  NO_SUBSCRIBERS: 'No active subscribers',
  SENT: 'Newsletter sent successfully',
};

export const subscribeNewsletterService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(USER_NOT_FOUND, 404);
  }
  const existing = await Newsletter.findOne({ user });

  if (existing) {
    if (existing.isActive) {
      throw new AppError(MESSAGES.ALREADY_SUBSCRIBED, 409);
    }

    existing.isActive = true;
    await existing.save();

    return { message: MESSAGES.REACTIVATED };
  }

  await Newsletter.create({ email, isActive: true });
  return { message: MESSAGES.SUBSCRIBED };
};

export const unsubscribeNewsletterService = async (email) => {
  const subscriber = await Newsletter.findOne({ email });

  if (!subscriber || !subscriber.isActive) {
    throw new AppError(MESSAGES.NOT_FOUND, 404);
  }

  subscriber.isActive = false;
  await subscriber.save();

  return { message: MESSAGES.UNSUBSCRIBED };
};

export const sendNewsletterService = async ({ subject, content }) => {
  const subscribers = await Newsletter.find({ isActive: true })
    .select('email')
    .lean();

  if (!subscribers.length) {
    throw new AppError(MESSAGES.NO_SUBSCRIBERS, 400);
  }

  await Promise.all(
    subscribers.map(({ email }) => {
      const html = newsletterTemplate({ subject, content, email });
      return sendEmail(email, subject, html);
    })
  );

  return { message: MESSAGES.SENT };
};
