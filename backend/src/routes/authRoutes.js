const express = require('express');
const router = express.Router();
const { register, login, getMe, refreshToken, logout } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

/* { POST }*/
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

router.get('/me', verifyToken, getMe);

module.exports = router;
