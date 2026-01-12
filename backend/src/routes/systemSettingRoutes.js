const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createSystemSetting,
	getSystemSettings,
	getSystemSettingById,
	updateSystemSetting,
	deleteSystemSetting,
} = require('../controllers/systemSettingController');

router.post('/system-settings', verifyToken, createSystemSetting);
router.get('/system-settings', verifyToken, getSystemSettings);
router.get('/system-settings/:id', verifyToken, getSystemSettingById);
router.put('/system-settings/:id', verifyToken, updateSystemSetting);
router.delete('/system-settings/:id', verifyToken, deleteSystemSetting);

module.exports = router;
