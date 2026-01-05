const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createUser, getAllUsers, getUserById, updateUser, toggleUserActive } = require('../controllers/userController');
const { getAllRoles } = require('../controllers/roleController');

router.post('/users', verifyToken, createUser);
router.get('/users', verifyToken, getAllUsers);
router.get('/users/:id', verifyToken, getUserById);
router.get('/roles', verifyToken, getAllRoles);
router.put('/users/:id', verifyToken, updateUser);
router.patch('/users/:id/toggle-active', verifyToken, toggleUserActive);

module.exports = router;
