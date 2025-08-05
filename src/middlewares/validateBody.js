import createError from 'http-errors';
import { logger } from '../utils/logger.js';

export const validateBody = (schema) => (req, _res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const messages = error.details.map((d) => d.message);
    logger.warn(
      {
        path: req.originalUrl,
        method: req.method,
        errors: messages,
      },
      '[VALIDATION] Request body validation failed',
    );
    return next(createError(400, 'Validation error', { details: messages }));
  }

  logger.info(
    {
      path: req.originalUrl,
      method: req.method,
    },
    '[VALIDATION] Request body passed validation',
  );

  next();
};
