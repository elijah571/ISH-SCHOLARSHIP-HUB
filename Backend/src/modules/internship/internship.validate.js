import Joi from 'joi';

export class CreateInternshipDTO {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.country = data.country;
    this.deadline = data.deadline;
    this.type = data.type;
    this.institution = data.institution;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.image = data.image;
  }

  static schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(50).max(600).required(),
    country: Joi.string().required(),
    deadline: Joi.date().greater('now').required(),
    type: Joi.string().required(),
    institution: Joi.string().required(),
    startDate: Joi.date().greater('now').required(),
    endDate: Joi.date().greater('now').required(),

    //  OPTIONAL image
    image: Joi.any().optional(),
  });

  validate() {
    const { error, value } = CreateInternshipDTO.schema.validate(this, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new Error(error.details.map((d) => d.message).join(', '));
    }

    return value;
  }
}

export class UpdateInternshipDTO {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.country = data.country;
    this.deadline = data.deadline;
    this.type = data.type;
    this.institution = institution;
    this.startDate = startDate;
    this.endDate = endDate;
    this.image = data.image;
  }

  static schema = Joi.object({
    title: Joi.string().min(3).max(50),
    description: Joi.string().min(50).max(600),
    country: Joi.string(),
    deadline: Joi.date().greater('now'),
    type: Joi.string(),
    institution: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    image: Joi.any().optional(),
  })
    .min(1)
    .messages({
      'object.min': 'At least one field must be updated',
    });

  validate() {
    const { error, value } = UpdateInternshipDTO.schema.validate(this, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new Error(error.details.map((d) => d.message).join(', '));
    }

    return value;
  }
}
