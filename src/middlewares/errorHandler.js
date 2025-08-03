import createError from 'http-errors';
import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  const error =
    err.status && err.expose
      ? err
      : createError(err.status || 500, err.message, { cause: err });

  const { status = 500, message, stack } = error;

  logger.error(`[${req.method}] ${req.originalUrl} -> ${status}: ${message}`);
  logger.debug(stack);

  res.status(status).json({
    status: 'error',
    code: status,
    message,
  });
}
