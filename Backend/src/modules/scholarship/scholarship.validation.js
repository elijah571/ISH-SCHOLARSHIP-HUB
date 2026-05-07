import Joi from 'joi';
import { AppError } from '../../utils/AppError.js';

const optionalFields = {
  field_of_study: Joi.string().allow('').optional(),
  location: Joi.string().allow('').optional(),
  university: Joi.string().allow('').optional(),
  tuition_fees: Joi.string().allow('').optional(),
  format: Joi.string().allow('').optional(),
  attendance: Joi.string().allow('').optional(),
  degree_type: Joi.string().allow('').optional(),
  special_programme: Joi.string().allow('').optional(),
  image: Joi.any().optional(),
};

export class CreateScholarshipDTO {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.country = data.country;
    this.deadline = data.deadline;
    this.funding_type = data.funding_type;
    this.link = data.link;
    this.duration = data.duration;
    this.field_of_study = data.field_of_study;
    this.location = data.location;
    this.university = data.university;
    this.tuition_fees = data.tuition_fees;
    this.format = data.format;
    this.attendance = data.attendance;
    this.degree_type = data.degree_type;
    this.special_programme = data.special_programme;
    this.image = data.image;
  }

  static schema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().min(50).max(600).required(),
    country: Joi.string().required(),
    deadline: Joi.date().greater('now').required(),
    funding_type: Joi.string().required(),
    link: Joi.string().uri().required(),
    duration: Joi.string().required(),
    ...optionalFields,
  });

  validate() {
    const { error, value } = CreateScholarshipDTO.schema.validate(this, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new AppError(error.details.map((detail) => detail.message).join(', '), 400);
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
    this.field_of_study = data.field_of_study;
    this.location = data.location;
    this.university = data.university;
    this.tuition_fees = data.tuition_fees;
    this.format = data.format;
    this.attendance = data.attendance;
    this.degree_type = data.degree_type;
    this.special_programme = data.special_programme;
    this.image = data.image;
  }

  static schema = Joi.object({
    title: Joi.string().min(3).max(200),
    description: Joi.string().min(50).max(600),
    country: Joi.string(),
    deadline: Joi.date().greater('now'),
    funding_type: Joi.string(),
    link: Joi.string().uri().optional(),
    duration: Joi.string().optional(),
    ...optionalFields,
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
      throw new AppError(error.details.map((detail) => detail.message).join(', '), 400);
    }

    return value;
  }
}
