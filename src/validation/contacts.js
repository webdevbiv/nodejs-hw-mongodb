import mongoose from 'mongoose';
import Joi from 'joi';

// Define the contact schema using Mongoose
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const Contact = mongoose.model('Contact', contactSchema);

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

export const updateContactSchema = Joi.object({
  name: stringField,
  phoneNumber: stringField,
  email: Joi.string().email().trim(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
}).min(1);
