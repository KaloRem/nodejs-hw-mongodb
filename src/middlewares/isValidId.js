import mongoose from 'mongoose';
import createHttpError from 'http-errors';
const { BadRequest } = createHttpError;

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(new BadRequest(`Invalid ID: ${contactId}`));
  }
  next();
};
