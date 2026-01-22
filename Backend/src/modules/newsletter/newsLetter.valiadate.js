// backend/modules/newsletter/newsletter.validation.js
import Joi from 'joi';

export class SubscribeNewsletterDTO {
  constructor(data) {
    this.email = data.email;
  }

  static schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
  });

  validate() {
    const { error, value } = SubscribeNewsletterDTO.schema.validate(this, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new Error(error.details.map((d) => d.message).join(', '));
    }

    return value;
  }
}

export class UnsubscribeNewsletterDTO {
  constructor(data) {
    this.email = data.email;
  }

  static schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
  });

  validate() {
    const { error, value } = UnsubscribeNewsletterDTO.schema.validate(this, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new Error(error.details.map((d) => d.message).join(', '));
    }

    return value;
  }
}

export class SendNewsletterDTO {
  constructor(data) {
    this.subject = data.subject;
    this.content = data.content;
  }

  static schema = Joi.object({
    subject: Joi.string().trim().min(3).max(100).required(),
    content: Joi.string().trim().min(10).required(),
  });

  validate() {
    const { error, value } = SendNewsletterDTO.schema.validate(this, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new Error(error.details.map((d) => d.message).join(', '));
    }

    return value;
  }
}
