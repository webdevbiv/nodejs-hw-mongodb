import createError from 'http-errors';

export const validateBody = (schema) => (req, _res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const messages = error.details.map((d) => d.message);
    return next(createError(400, 'Validation error', { details: messages }));
  }

  next();
};
