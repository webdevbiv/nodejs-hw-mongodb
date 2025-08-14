// src/routes/auth.js
import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  sendResetEmail,
  resetPassword,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
  sendResetEmailSchema,
  resetPwdSchema,
} from '../validation/auth.js';

const router = Router();

// Registration
router.post('/register', validateBody(registerSchema), register);

// Login
router.post('/login', validateBody(loginSchema), login);

// Refresh session
router.post('/refresh', refresh);

// Logout
router.post('/logout', logout);

// Send reset email
router.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  sendResetEmail,
);

// Reset password
router.post('/reset-pwd', validateBody(resetPwdSchema), resetPassword);

export default router;
