import bcrypt from 'bcrypt';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import ms from 'ms';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { Messages } from '../constants/index.js';
import { HttpStatus } from '../constants/index.js';
import { getEnv } from '../utils/getEnv.js';

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

const ACCESS_SECRET = getEnv('ACCESS_SECRET');
const REFRESH_SECRET = getEnv('REFRESH_SECRET');
const ACCESS_TOKEN_EXPIRATION = getEnv('ACCESS_TOKEN_EXPIRATION', '15m');
const REFRESH_TOKEN_EXPIRATION = getEnv('REFRESH_TOKEN_EXPIRATION', '30d');

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(HttpStatus.UNAUTHORIZED, Messages.INVALID_CREDENTIALS);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError(HttpStatus.UNAUTHORIZED, Messages.INVALID_CREDENTIALS);
  }

  await Session.findOneAndDelete({ userId: user._id });

  const accessToken = jwt.sign({ sub: user._id }, ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });

  const refreshToken = jwt.sign({ sub: user._id }, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });

  const accessTokenValidUntil = new Date(
    Date.now() + ms(ACCESS_TOKEN_EXPIRATION),
  );
  const refreshTokenValidUntil = new Date(
    Date.now() + ms(REFRESH_TOKEN_EXPIRATION),
  );

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

export const refreshSession = async (oldRefreshToken) => {
  let payload;

  try {
    payload = jwt.verify(oldRefreshToken, REFRESH_SECRET);
  } catch {
    throw createError(HttpStatus.UNAUTHORIZED, Messages.INVALID_REFRESH_TOKEN);
  }

  const existingSession = await Session.findOneAndDelete({
    refreshToken: oldRefreshToken,
  });

  if (!existingSession) {
    throw createError(HttpStatus.UNAUTHORIZED, Messages.INVALID_REFRESH_TOKEN);
  }

  const userId = payload.sub;
  const user = await User.findById(userId);
  if (!user) {
    throw createError(HttpStatus.UNAUTHORIZED, Messages.USER_NOT_FOUND);
  }

  const accessToken = jwt.sign({ sub: user._id }, ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });

  const refreshToken = jwt.sign({ sub: user._id }, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION,
  });

  const accessTokenValidUntil = new Date(
    Date.now() + ms(ACCESS_TOKEN_EXPIRATION),
  );
  const refreshTokenValidUntil = new Date(
    Date.now() + ms(REFRESH_TOKEN_EXPIRATION),
  );

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

export const logoutSession = async (refreshToken) => {
  await Session.findOneAndDelete({ refreshToken });
};

export const removeUserSessions = async (userId) => {
  await Session.deleteMany({ userId });
};
