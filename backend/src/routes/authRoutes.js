const express = require('express');
const router = express.Router();
const { register, login, getMe, refreshToken, logout } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../validators/authValidators');
const { validateRequest } = require('../middleware/validateRequest');

/* { POST }*/
router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

router.get('/me', verifyToken, getMe);

module.exports = router;
