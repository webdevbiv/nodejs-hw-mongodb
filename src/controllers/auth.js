import { registerUser, loginUser } from '../services/auth.js';
import { HttpStatus, Messages } from '../constants/index.js';
import { logger } from '../utils/logger.js';
import { getEnv } from '../utils/getEnv.js';
import ms from 'ms';

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
