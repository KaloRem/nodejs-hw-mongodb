const Joi = require('joi');
const createError = require('http-errors');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(createError(400, error.details[0].message));
    } else {
      next();
    }
  };
};

module.exports = validate;
