import { logger } from '../utils/logger.js';

export const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, { abortEarly: false });

  if (error) {
    const messages = error.details.map((d) => d.message);
    logger.warn(
      {
        path: req.originalUrl,
        method: req.method,
        errors: messages,
      },
      '[VALIDATION] Query validation failed',
    );

    return res.status(400).json({
      status: 400,
      message: 'Invalid query parameters',
      details: messages,
    });
  }

  logger.info(
    {
      path: req.originalUrl,
      method: req.method,
      validatedQuery: value,
    },
    '[VALIDATION] Query passed validation',
  );

  Object.assign(req.query, value);
  next();
};
