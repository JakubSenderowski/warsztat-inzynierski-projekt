const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

const {
	createAppointment,
	getAppointments,
	updateAppointment,
	deleteAppointment,
} = require('../controllers/appointmentController');

router.post('/appointments', verifyToken, createAppointment);
router.get('/appointments', verifyToken, getAppointments);
router.put('/appointments/:id', verifyToken, updateAppointment);
router.delete('/appointments/:id', verifyToken, deleteAppointment);

module.exports = router;
