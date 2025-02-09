const express = require('express');
const router = express.Router();
const { register } = require('../controllers/auth');
const validate = require('../middleware/validate');
const { registerSchema } = require('../validation/auth');

router.post('/register', validate(registerSchema), register);

module.exports = router;
