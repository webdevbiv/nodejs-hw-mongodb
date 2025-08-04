import Joi from 'joi';

//Validation schemas for contact creation and update
const stringField = Joi.string().min(3).max(20).trim();

export const createContactSchema = Joi.object({
  name: stringField.required(),
  phoneNumber: stringField.required(),
  email: Joi.string().email().trim().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .default('personal'),
});

//Validation schema for updating contacts
export const updateContactSchema = Joi.object({
  name: stringField,
  phoneNumber: stringField,
  email: Joi.string().email().trim(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
}).min(1);
