import { registerUser } from '../services/auth.js';
import { HttpStatus } from '../constants/index.js';
import { Messages } from '../constants/index.js';
import { logger } from '../utils/logger.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  logger.info({ email }, '[REGISTER] Attempting registration');

  const user = await registerUser({ name, email, password });

  logger.info({ userId: user._id }, '[REGISTER] User registered successfully');

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
};
