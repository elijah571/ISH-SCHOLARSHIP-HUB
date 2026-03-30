import { asyncHandler } from '../../middleware/asyncHandler.js';
import {
  subscribeNewsletterService,
  unsubscribeNewsletterService,
  sendNewsletterService,
} from './newsletter.service.js';

import {
  SubscribeNewsletterDTO,
  UnsubscribeNewsletterDTO,
  SendNewsletterDTO,
} from './newsLetter.valiadate.js';

export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const dto = new SubscribeNewsletterDTO(req.body);
  const validated = dto.validate();

  const result = await subscribeNewsletterService(validated.email);
  res.status(201).json({
    success: true,
    message: result.message,
  });
});

export const unsubscribeNewsletter = asyncHandler(async (req, res) => {
  const dto = new UnsubscribeNewsletterDTO(req.body);
  const validated = dto.validate();

  const result = await unsubscribeNewsletterService(validated.email);
  res.status(200).json({
    success: true,
    message: result.message,
  });
});

export const sendNewsletter = asyncHandler(async (req, res) => {
  const dto = new SendNewsletterDTO(req.body);
  const validated = dto.validate();

  const result = await sendNewsletterService({
    subject: validated.subject,
    content: validated.content,
  });

  res.status(200).json({
    success: true,
    message: result.message,
  });
});
