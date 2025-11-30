const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createServiceRequest,
	getServiceRequests,
	updateServiceRequest,
	deleteServiceRequest,
} = require('../controllers/serviceRequestController');
const { serviceRequestValidation } = require('../validators/serviceValidators');
const { validateRequest } = require('../middleware/validateRequest');
router.post('/service-requests', serviceRequestValidation, validateRequest, verifyToken, createServiceRequest);
router.get('/service-requests', verifyToken, getServiceRequests);
router.put('/service-requests/:id', serviceRequestValidation, validateRequest, verifyToken, updateServiceRequest);
router.delete('/service-requests/:id', verifyToken, deleteServiceRequest);

module.exports = router;
