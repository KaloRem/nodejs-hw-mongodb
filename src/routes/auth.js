import express from 'express';
import { register, login, refresh, logout } from '../controllers/auth.js';
import validate from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../validation/auth.js';
import { sendResetPasswordEmail } from '../controllers/auth.js';
import { resetEmailSchema } from '../validation/auth.js';
import { resetPassword } from '../controllers/auth.js';
import { resetPasswordSchema } from '../validation/auth.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post(
  '/send-reset-email',
  validate(resetEmailSchema),
  sendResetPasswordEmail,
);
router.post('/reset-pwd', validate(resetPasswordSchema), resetPassword);

export default router;
