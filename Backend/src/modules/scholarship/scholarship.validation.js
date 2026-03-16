import Joi from 'joi';

export class CreateScholarshipDTO {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.country = data.country;
    this.deadline = data.deadline;
    this.funding_type = data.funding_type;
    this.link = data.link;
    this.image = data.image;
    this.duration = data.duration;
  }

  static schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(50).max(600).required(),
    country: Joi.string().required(),
    deadline: Joi.date().greater('now').required(),
    funding_type: Joi.string().required(),
    duration: Joi.string().required(),
    link: Joi.string().uri().required(),
    image: Joi.any().optional(),
  });

  validate() {
    const { error, value } = CreateScholarshipDTO.schema.validate(this);

    if (error) {
      throw new Error(error.details[0].message);
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
    this.image = data.image;
    this.duration = data.duration;
  }

  static schema = Joi.object({
    title: Joi.string().min(3).max(50),
    description: Joi.string().min(50).max(600),
    country: Joi.string(),
    deadline: Joi.date().greater('now'),
    funding_type: Joi.string(),
    duration: Joi.string(),
    link: Joi.string().uri(),
    image: Joi.any().optional(),
  })
    .min(1)
    .messages({
      'object.min': 'At least one field must be updated',
    });
  validate() {
    const { error, value } = UpdateScholarshipDTO.schema.validate(this);

    if (error) {
      throw new Error(error.details[0].message);
    }

    return value;
  }
}
