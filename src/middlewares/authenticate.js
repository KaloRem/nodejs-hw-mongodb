import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Session from '../models/session.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError(401, 'Access token missing or invalid');
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch {
      throw createError(401, 'Access token expired');
    }

    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      throw createError(401, 'Session expired, please log in again');
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export default authenticate;
