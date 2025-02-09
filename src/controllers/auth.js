const createError = require('http-errors');
const User = require('../models/user');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Sprawdź, czy użytkownik o podanym emailu już istnieje
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(409, 'Email in use');
    }

    // Utwórz nowego użytkownika
    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({
      status: 'success',
      message: 'Successfully registered a user!',
      data: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register };
