const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validateRequest');
const {
	createServiceRequest,
	getServiceRequests,
	updateServiceRequest,
	deleteServiceRequest,
} = require('../controllers/serviceRequestController');

router.post('/service-requests', verifyToken, createServiceRequest);
router.get('/service-requests', verifyToken, getServiceRequests);
router.put('/service-requests/:id', verifyToken, updateServiceRequest);
router.delete('/service-requests/:id', verifyToken, deleteServiceRequest);

module.exports = router;
