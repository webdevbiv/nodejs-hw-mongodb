import createError from 'http-errors';
import { logger } from '../utils/logger.js';

export function notFoundHandler(req, res, next) {
  logger.warn(`Not Found: [${req.method}] ${req.originalUrl}`);
  next(createError(404, `Not Found: ${req.originalUrl}`));
}
