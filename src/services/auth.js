import bcrypt from 'bcrypt';
import createError from 'http-errors';
import { User } from '../models/user.js';
import { Messages } from '../constants/index.js';
import { HttpStatus } from '../constants/index.js';

export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw createError(HttpStatus.CONFLICT, Messages.EMAIL_IN_USE);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};
