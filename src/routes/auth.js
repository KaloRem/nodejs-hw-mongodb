const express = require('express');
const router = express.Router();
const { register, login, refresh, logout } = require('../controllers/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validation/auth');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout); // ➡️ Nowy endpoint

module.exports = router;
