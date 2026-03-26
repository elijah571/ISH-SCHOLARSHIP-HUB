import Joi from 'joi';

export class CreateScholarshipDTO {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.country = data.country;
    this.deadline = data.deadline;
    this.funding_type = data.funding_type;
    this.link = data.link;
    this.duration = data.duration;
    this.image = data.image;
  }

  static schema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().min(50).max(600).required(),
    country: Joi.string().required(),
    deadline: Joi.date().greater('now').required(),
    funding_type: Joi.string().optional(),
    link: Joi.string().uri().optional().allow(''),
    duration: Joi.string().optional().allow(''),
    image: Joi.any().optional(),
  });

  validate() {
    const { error, value } = CreateScholarshipDTO.schema.validate(this, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new Error(error.details.map((d) => d.message).join(', '));
    }

    return value;
  }
}

export class UpdateScholarshipDTO {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.country = data.country;
    this.deadline = data.deadline;
    this.funding_type = data.funding_type;
    this.link = data.link;
    this.duration = data.duration;
    this.image = data.image;
  }

  static schema = Joi.object({
    title: Joi.string().min(3).max(200),
    description: Joi.string().min(50).max(600),
    country: Joi.string(),
    deadline: Joi.date().greater('now'),
    funding_type: Joi.string(),
    link: Joi.string().uri().optional().allow(''),
    duration: Joi.string().optional().allow(''),
    image: Joi.any().optional(),
  })
    .min(1)
    .messages({
      'object.min': 'At least one field must be updated',
    });

  validate() {
    const { error, value } = UpdateScholarshipDTO.schema.validate(this, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new Error(error.details.map((d) => d.message).join(', '));
    }

    return value;
  }
}
