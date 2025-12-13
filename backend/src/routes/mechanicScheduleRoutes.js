const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

const {
	createMechanicSchedule,
	getMechanicSchedules,
	updateMechanicSchedule,
	deleteMechanicSchedule,
} = require('../controllers/mechanicScheduleController');

router.post('/mechanic-schedules', verifyToken, createMechanicSchedule);
router.get('/mechanic-schedules', verifyToken, getMechanicSchedules);
router.put('/mechanic-schedules/:id', verifyToken, updateMechanicSchedule);
router.delete('/mechanic-schedules/:id', verifyToken, deleteMechanicSchedule);

module.exports = router;
