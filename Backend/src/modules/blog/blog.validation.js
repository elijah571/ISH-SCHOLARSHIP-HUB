import Joi from 'joi';
import { AppError } from '../../utils/AppError.js';

/* ===================== CREATE BLOG DTO ===================== */
export class CreateBlogDTO {
  constructor(data) {
    this.title = data.title;
    this.slug = data.slug;
    this.content = data.content;
    this.published = data.published;
    this.image = data.image;
  }

  static schema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    slug: Joi.string().min(3).max(150).optional(),
    content: Joi.string().required(),
    published: Joi.boolean().optional(),
    image: Joi.any().optional(),
  });

  validate() {
    const { error, value } = CreateBlogDTO.schema.validate(this, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new AppError(error.details.map((detail) => detail.message).join(', '), 400);
    }

    return value;
  }
}

/* ===================== UPDATE BLOG DTO ===================== */
export class UpdateBlogDTO {
  constructor(data) {
    this.title = data.title;
    this.slug = data.slug;
    this.content = data.content;
    this.published = data.published;
    this.image = data.image;
  }

  static schema = Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    slug: Joi.string().min(3).max(150).optional(),
    content: Joi.string().optional(),
    published: Joi.boolean().optional(),
    image: Joi.any().optional(),
  })
    .min(1)
    .messages({
      'object.min': 'At least one field must be updated',
    });

  validate() {
    const { error, value } = UpdateBlogDTO.schema.validate(this, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new AppError(error.details.map((detail) => detail.message).join(', '), 400);
    }

    return value;
  }
}
