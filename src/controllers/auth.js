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

// Register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    console.log('🔹 Registration attempt:', email, password);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw createError(409, 'Email in use');
    }

    const newUser = new User({ name, email, password });

    await newUser.save();

    console.log('✅ Registered user:', newUser);

    res.status(201).json({
      status: '201',
      message: 'Successfully registered a user!',
      data: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error('❌ Registration error:', err);
    next(err);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log('🔹 Login attempt:', email, password);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      throw createError(401, 'Invalid email or password');
    }

    console.log('✅ User found:', user);
    console.log('🔍 User password in the database:', user.password);
    console.log('🔍 Password provided by the user:', password);

    const testHash = await bcrypt.hash(password, 10);
    console.log('🔍 Test hashing of the given password:', testHash);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔍 Password comparison result:', isPasswordValid);
    if (!isPasswordValid) {
      console.log('❌ Wrong password for:', email);
      throw createError(401, 'Invalid email or password');
    }

    console.log('✅ Password correct! Token generation...');

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

    console.log('✅ User logged in, `accessToken` generated:', accessToken);
  } catch (err) {
    console.error('❌ Login error:', err);
    next(err);
  }
};

// Refresh
export const refresh = async (req, res, next) => {
  try {
    console.log('🔹 Cookies in `refresh`:', req.cookies); // ✅ Sprawdzenie cookies

    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createError(401, 'Refresh token missing');
    }

    console.log('✅ Refresh token downloaded:', refreshToken);

    const session = await Session.findOne({ refreshToken });
    if (!session) {
      throw createError(401, 'Invalid refresh token');
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!decoded) {
      throw createError(401, 'Invalid or expired refresh token');
    }

    console.log('✅ Refresh token verified:', decoded);

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

    console.log('✅ New `accessToken` generated:', newAccessToken);
  } catch (error) {
    console.error('❌ Session refresh error:', error);
    next(createError(401, 'Could not refresh session'));
  }
};

// Logout
export const logout = async (req, res, next) => {
  try {
    console.log('🔹 Attempt to log out, cookies:', req.cookies);

    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw createError(401, 'Refresh token missing');
    }

    console.log('✅ Refresh token found:', refreshToken);

    const deletedSession = await Session.findOneAndDelete({ refreshToken });
    if (!deletedSession) {
      throw createError(401, 'Invalid refresh token');
    }

    console.log('✅ Session deleted from MongoDB:', deletedSession);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(204).send();

    console.log('✅ User logged out successfully!');
  } catch (error) {
    console.error('❌ Logout error:', error);
    next(createError(401, 'Could not logout user'));
  }
};

// Reset Password Email
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
    console.error('❌ Error', error);
    next(createError(500, 'Failed to send the email, please try again later.'));
  }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    console.log('🔑 Token received:', token);
    console.log('🔒 New password:', password);

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token verified:', decoded);
    } catch (error) {
      console.error('❌ Token verification error:', error);
      throw createError(401, 'Token is expired or invalid.');
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      throw createError(404, 'User not found!');
    }

    console.log('🔓 Password before hashing:', password);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔍 Hashed password before writing:', hashedPassword);

    user.password = hashedPassword;
    await user.save();

    console.log('🔒 Password after hashing:', hashedPassword);

    await Session.deleteMany({ userId: user._id });

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
    console.log('✅ Password reset for:', user.email);
  } catch (error) {
    console.error('❌ Password reset error:', error);
    next(error);
  }
};
