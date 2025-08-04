import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': `"name" must be a string`,
    'any.required': `"name" is required`,
  }),
  email: Joi.string().email().required().messages({
    'string.email': `"email" must be a valid email`,
    'any.required': `"email" is required`,
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': `"password" should be at least 6 characters`,
    'any.required': `"password" is required`,
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': `"email" must be a valid email`,
    'any.required': `"email" is required`,
  }),
  password: Joi.string().required().messages({
    'any.required': `"password" is required`,
  }),
});
