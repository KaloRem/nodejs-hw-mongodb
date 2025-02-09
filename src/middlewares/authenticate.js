const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
  try {
    // Pobranie tokena z nagłówka Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError(401, 'Access token missing or invalid');
    }

    const token = authHeader.split(' ')[1];

    // Weryfikacja tokena JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      throw createError(401, 'Access token expired');
    }

    // Pobranie użytkownika na podstawie decoded.userId
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw createError(401, 'User not found');
    }

    // Dodanie użytkownika do obiektu `req`
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;
