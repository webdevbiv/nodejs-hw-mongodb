import {
  registerUser,
  loginUser,
  refreshSession,
  logoutSession,
  removeUserSessions,
} from '../services/auth.js';
import { HttpStatus, Messages } from '../constants/index.js';
import { logger } from '../utils/logger.js';
import { getEnv } from '../utils/getEnv.js';
import ms from 'ms';

import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { sendMail } from '../services/mailer.js';
import bcrypt from 'bcrypt';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    logger.info({ email }, '[REGISTER] Attempting registration');

    const user = await registerUser({ name, email, password });

    logger.info(
      { userId: user._id },
      '[REGISTER] User registered successfully',
    );

    res.status(HttpStatus.CREATED).json({
      status: 'success',
      message: Messages.USER_REGISTERED,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    logger.info(
      {
        email,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      },
      '[LOGIN] Attempting login',
    );

    const { accessToken, refreshToken } = await loginUser(email, password);

    const refreshExpiration = getEnv('REFRESH_TOKEN_EXPIRATION', '30d');
    const maxAge = ms(refreshExpiration);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge,
      })
      .status(HttpStatus.OK)
      .json({
        status: 'success',
        message: Messages.USER_LOGGED_IN,
        data: { accessToken },
      });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies?.refreshToken;

    if (!oldRefreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        status: 'error',
        code: HttpStatus.UNAUTHORIZED,
        message: 'Refresh token not found in cookies',
      });
    }

    const { accessToken, refreshToken } = await refreshSession(oldRefreshToken);

    const refreshExpiration = getEnv('REFRESH_TOKEN_EXPIRATION', '30d');
    const maxAge = ms(refreshExpiration);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge,
      })
      .status(HttpStatus.OK)
      .json({
        status: 'success',
        message: Messages.SESSION_REFRESHED,
        data: { accessToken },
      });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      logger.warn('[LOGOUT] No refreshToken found in cookies');
      return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    await logoutSession(refreshToken);

    res.clearCookie('refreshToken');
    res.sendStatus(HttpStatus.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/send-reset-email
 */
export const sendResetEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    logger.info({ email }, '[RESET] Send reset email requested');

    const user = await User.findOne({ email });
    if (!user) {
      throw createError(HttpStatus.NOT_FOUND, 'User not found!');
    }

    const secret = getEnv('JWT_SECRET');
    const token = jwt.sign({ email }, secret, { expiresIn: '5m' });

    const appDomain = getEnv(
      'APP_DOMAIN',
      'http://localhost:3000/auth',
    ).replace(/\/+$/, '');
    const resetUrl = `${appDomain}/reset-password?token=${encodeURIComponent(
      token,
    )}`;

    try {
      await sendMail({
        to: email,
        subject: 'Reset your password',
        text: `Use this link to reset your password (valid for 5 minutes):\n${resetUrl}`,
        html: `
          <p>Use this link to reset your password (valid for 5 minutes):</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
        `,
      });
    } catch (err) {
      logger.error({ err }, '[RESET] Email sending failed');
      throw createError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Failed to send the email, please try again later.',
      );
    }

    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/reset-pwd
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, getEnv('JWT_SECRET'));
    } catch {
      throw createError(
        HttpStatus.UNAUTHORIZED,
        'Token is expired or invalid.',
      );
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) {
      throw createError(HttpStatus.NOT_FOUND, 'User not found!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    await removeUserSessions(user._id);

    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
