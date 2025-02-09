const createError = require('http-errors');
const User = require('../models/user');
const Session = require('../models/session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Funkcja do generowania tokenów
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  });
  return { accessToken, refreshToken };
};

// ✅ Rejestracja użytkownika
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Sprawdzenie, czy użytkownik o podanym emailu już istnieje
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(409, 'Email in use');
    }

    // Utworzenie nowego użytkownika
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

// ✅ Logowanie użytkownika
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Sprawdzenie, czy użytkownik istnieje
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createError(401, 'Invalid email or password');
    }

    // Usunięcie poprzednich sesji użytkownika
    await Session.deleteMany({ userId: user._id });

    // Generowanie nowych tokenów
    const { accessToken, refreshToken } = generateTokens(user._id);
    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    const refreshTokenValidUntil = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    );

    // Tworzenie nowej sesji
    const session = new Session({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });
    await session.save();

    // Ustawienie ciasteczka z refresh tokenem
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // Zwracamy accessToken w odpowiedzi
    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in a user!',
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createError(401, 'Refresh token not provided');
    }

    // Znalezienie sesji w bazie danych
    const session = await Session.findOne({ refreshToken });
    if (!session || session.refreshTokenValidUntil < new Date()) {
      throw createError(401, 'Invalid or expired refresh token');
    }

    // Usunięcie starej sesji
    await Session.deleteMany({ userId: session.userId });

    // Generowanie nowych tokenów
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      session.userId,
    );
    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    const refreshTokenValidUntil = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    );

    // Tworzenie nowej sesji
    const newSession = new Session({
      userId: session.userId,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });
    await newSession.save();

    // Ustawienie nowego refreshToken w ciasteczku
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // Zwracamy nowy accessToken
    res.status(200).json({
      status: 'success',
      message: 'Successfully refreshed a session!',
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Usunięcie sesji z bazy danych
      await Session.findOneAndDelete({ refreshToken });

      // Usunięcie ciasteczka refreshToken
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
    }

    res.status(204).send(); // Brak treści w odpowiedzi (No Content)
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refresh, logout };
