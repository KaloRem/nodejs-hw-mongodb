import createError from 'http-errors';
import User from '../models/userModel.js';
import Session from '../models/session.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendResetEmail } from '../services/emailService.js';

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  });
  return { accessToken, refreshToken };
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    console.log('🔹 Próba rejestracji:', email, password);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(409, 'Email in use');
    }

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

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log('🔹 Próba logowania:', email, password);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ Użytkownik nie znaleziony:', email);
      throw createError(401, 'Invalid email or password');
    }

    console.log('✅ Użytkownik znaleziony:', user);
    console.log('🔍 Hasło użytkownika w bazie:', user.password);
    console.log('🔍 Hasło podane przez użytkownika:', password);

    const testHash = await bcrypt.hash(password, 10);
    console.log('🔍 Testowe hashowanie podanego hasła:', testHash);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔍 Wynik porównania hasła:', isPasswordValid);
    if (!isPasswordValid) {
      console.log('❌ Błędne hasło dla:', email);
      throw createError(401, 'Invalid email or password');
    }

    console.log('✅ Hasło poprawne! Generowanie tokenów...');

    const { accessToken, refreshToken } = generateTokens(user._id);

    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    const refreshTokenValidUntil = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    );

    await Session.deleteMany({ userId: user._id });

    const session = new Session({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });

    await session.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

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

export const logout = async (req, res, next) => {
  try {
    console.log('🔹 Próba wylogowania, cookies:', req.cookies);

    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createError(401, 'Refresh token missing');
    }

    console.log('✅ Refresh token znaleziony:', refreshToken);

    const deletedSession = await Session.findOneAndDelete({ refreshToken });
    if (!deletedSession) {
      throw createError(401, 'Invalid refresh token');
    }

    console.log('✅ Sesja usunięta z MongoDB:', deletedSession);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(204).send();

    console.log('✅ Użytkownik poprawnie wylogowany!');
  } catch (error) {
    console.error('❌ Błąd wylogowania:', error);
    next(createError(401, 'Could not logout user'));
  }
};

export const sendResetPasswordEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw createError(404, 'User not found!');
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });

    await sendResetEmail(email, token);

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    console.error('❌ Błąd', error);
    next(createError(500, 'Failed to send the email, please try again later.'));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    console.log('🔑 Otrzymany token:', token);
    console.log('🔒 Nowe hasło:', password);

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token zweryfikowany:', decoded);
    } catch (error) {
      console.error('❌ Błąd weryfikacji tokena:', error);
      throw createError(401, 'Token is expired or invalid.');
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      throw createError(404, 'User not found!');
    }

    console.log('🔓 Hasło przed hashowaniem:', password);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔍 Haszowane hasło przed zapisem:', hashedPassword);

    user.password = hashedPassword;
    await user.save();

    console.log('🔒 Hasło po hashowaniu:', hashedPassword);

    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
    console.log('✅ Hasło zresetowane dla:', user.email);
  } catch (error) {
    console.error('❌ Błąd resetowania hasła:', error);
    next(error);
  }
};
