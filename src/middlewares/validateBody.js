import createHttpError from 'http-errors';
const { BadRequest } = createHttpError;

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new BadRequest(error.message));
    }
    next();
  };
};
