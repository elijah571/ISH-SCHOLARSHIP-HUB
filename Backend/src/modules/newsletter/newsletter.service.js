import { newsletterRepo } from './newsletter.repository.js';
import { sendEmail } from '../../services/email.js';
import { AppError } from '../../utils/AppError.js';
import { newsletterTemplate } from './newsletter.template.js';

export const subscribeNewsletterService = async (email) => {
  const existing = await newsletterRepo.findByEmail(email);

  if (existing) {
    if (existing.isActive) throw new AppError('Email already subscribed', 409);
    await newsletterRepo.update(email, { isActive: true });
    return { message: 'Subscription reactivated' };
  }

  await newsletterRepo.create(email);
  return { message: 'Subscribed successfully' };
};

export const unsubscribeNewsletterService = async (email) => {
  const subscriber = await newsletterRepo.findByEmail(email);
  if (!subscriber || !subscriber.isActive) throw new AppError('Subscription not found', 404);

  await newsletterRepo.update(email, { isActive: false });
  return { message: 'Unsubscribed successfully' };
};

export const sendNewsletterService = async ({ subject, content }) => {
  const subscribers = await newsletterRepo.findAllActive();
  if (!subscribers.length) throw new AppError('No active subscribers', 400);

  await Promise.allSettled(
    subscribers.map(({ email }) =>
      sendEmail(email, subject, newsletterTemplate({ subject, content, email }))
    )
  );

  return { message: 'Newsletter sent successfully', count: subscribers.length };
};
