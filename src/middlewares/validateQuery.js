export const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid query parameters',
      details: error.details.map((d) => d.message),
    });
  }

  Object.assign(req.query, value);
  next();
};
