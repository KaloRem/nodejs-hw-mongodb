import createHttpError from 'http-errors';
const { BadRequest } = createHttpError;
import mongoose from 'mongoose';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return next(new BadRequest(`Invalid ID: ${contactId}`));
  }
  next();
};
