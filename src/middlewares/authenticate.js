import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { getEnv } from '../utils/getEnv.js';
import { User } from '../models/user.js';
import { logger } from '../utils/logger.js';

const ACCESS_SECRET = getEnv('ACCESS_SECRET');

export const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('[AUTH] Missing or invalid Authorization header');
      throw createError(401, 'Authorization header missing or invalid');
    }

    const token = authHeader.split(' ')[1];

    let payload;
    try {
      payload = jwt.verify(token, ACCESS_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        logger.warn('[AUTH] Access token expired');
        throw createError(401, 'Access token expired');
      }
      logger.warn('[AUTH] Invalid access token');
      throw createError(401, 'Invalid access token');
    }

    const user = await User.findById(payload.sub);

    if (!user) {
      logger.warn(`[AUTH] User not found: ${payload.sub}`);
      throw createError(401, 'User not found');
    }

    logger.info({ userId: user._id }, '[AUTH] User authenticated');
    req.user = user;
    next();
  } catch (error) {
    logger.error(`[AUTH] Authentication failed: ${error.message}`);
    next(error);
  }
};
