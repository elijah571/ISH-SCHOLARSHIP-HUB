import Joi from 'joi';

export class CreateScholarshipDTO {
  constructor(data) {
    this.title = data.title;
    this.description = data.description;
    this.country = data.country;
    this.deadline = data.deadline;
    this.funding_type = data.funding_type;
  }

  // Validation schema
  static schema = Joi.object({
    title: Joi.string().min(3).max(50).required().messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 3 characters',
      'string.max': 'Title cannot exceed 50 characters',
    }),
    description: Joi.string().min(50).max(600).required().messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 50 characters',
      'string.max': 'Description cannot exceed 600 characters',
    }),
    country: Joi.string()
      .required()
      .messages({ 'string.empty': 'Country is required' }),
    deadline: Joi.date().greater('now').required().messages({
      'date.base': 'Deadline must be a valid date',
      'date.greater': 'Deadline must be a future date',
    }),
    funding_type: Joi.string().optional(),
  });

  // Validate method
  validate() {
    const { error, value } = CreateScholarshipDTO.schema.validate(this, {
      abortEarly: false,
    });
    if (error) {
      // Combine all error messages
      const messages = error.details.map((detail) => detail.message);
      throw new Error(messages.join(', '));
    }
    return value;
  }
}
