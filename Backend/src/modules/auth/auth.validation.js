import joi from 'joi';

export const validateRegistration = (data) => {
  const schema = joi.object({
    fullName: joi.string().min(3).max(60).required(),
    email: joi.string().email().required(),
    role: joi.string().optional(),
    password: joi
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[0-9]/)
      .regex(/[!@#$%^&*]/)
      .required(),
  });
  return schema.validate(data);
};

export const validateLogin = (data) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};
