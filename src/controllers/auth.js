import createError from 'http-errors';
import User from '../models/userModel.js';
import Session from '../models/session.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    console.log('🔹 Próba rejestracji:', email, password);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(409, 'Email in use');
    }

    // 🚨 NIE HASZUJEMY tutaj hasła! Mongoose zrobi to automatycznie!
    const newUser = new User({ name, email, password });

    await newUser.save();

    console.log('✅ Użytkownik zarejestrowany:', newUser);

    res.status(201).json({
      status: '201',
      message: 'Successfully registered a user!',
      data: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error('❌ Błąd rejestracji:', err);
    next(err);
  }
};

// ✅ Logowanie użytkownika
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log('🔹 Próba logowania:', email, password);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Użytkownik nie znaleziony:', email);
      throw createError(401, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ Błędne hasło dla:', email);
      throw createError(401, 'Invalid email or password');
    }

    console.log('✅ Hasło poprawne! Generowanie tokenów...');

    // ✅ Generowanie `accessToken` i `refreshToken`
    const { accessToken, refreshToken } = generateTokens(user._id);

    // ✅ Ustawienie dat ważności tokenów
    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    const refreshTokenValidUntil = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    ); // 30 dni

    // ✅ Usunięcie starej sesji użytkownika
    await Session.deleteMany({ userId: user._id });

    // ✅ Tworzenie nowej sesji użytkownika
    const session = new Session({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });

    await session.save();

    // ✅ Ustawienie `refreshToken` w cookies
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // ✅ Zwrócenie `accessToken` w odpowiedzi
    res.status(200).json({
      status: '200',
      message: 'Successfully logged in a user!',
      data: { accessToken },
    });

    console.log(
      '✅ Użytkownik zalogowany, `accessToken` wygenerowany:',
      accessToken,
    );
  } catch (err) {
    console.error('❌ Błąd logowania:', err);
    next(err);
  }
};

// ✅ Odświeżanie tokena
export const refresh = async (req, res, next) => {
  try {
    console.log('🔹 Cookies w `refresh`:', req.cookies); // ✅ Sprawdzenie cookies

    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createError(401, 'Refresh token missing');
    }

    console.log('✅ Refresh token pobrany:', refreshToken);

    const session = await Session.findOne({ refreshToken });
    if (!session) {
      throw createError(401, 'Invalid refresh token');
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded) {
      throw createError(401, 'Invalid or expired refresh token');
    }

    console.log('✅ Refresh token zweryfikowany:', decoded);

    const newAccessToken = jwt.sign(
      { userId: session.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' },
    );
    const newRefreshToken = jwt.sign(
      { userId: session.userId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' },
    );

    await Session.deleteMany({ userId: session.userId });

    const newSession = new Session({
      userId: session.userId,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    await newSession.save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: '200',
      message: 'Successfully refreshed a session!',
      data: { accessToken: newAccessToken },
    });

    console.log('✅ Nowy `accessToken` wygenerowany:', newAccessToken);
  } catch (error) {
    console.error('❌ Błąd odświeżania sesji:', error);
    next(createError(401, 'Could not refresh session'));
  }
};

// ✅ Wylogowanie użytkownika
export const logout = async (req, res, next) => {
  try {
    console.log('🔹 Próba wylogowania, cookies:', req.cookies);

    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createError(401, 'Refresh token missing');
    }

    console.log('✅ Refresh token znaleziony:', refreshToken);

    // ✅ Usunięcie sesji użytkownika
    const deletedSession = await Session.findOneAndDelete({ refreshToken });
    if (!deletedSession) {
      throw createError(401, 'Invalid refresh token');
    }

    console.log('✅ Sesja usunięta z MongoDB:', deletedSession);

    // ✅ Usunięcie ciasteczka `refreshToken`
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(204).send(); // Brak treści w odpowiedzi

    console.log('✅ Użytkownik poprawnie wylogowany!');
  } catch (error) {
    console.error('❌ Błąd wylogowania:', error);
    next(createError(401, 'Could not logout user'));
  }
};
