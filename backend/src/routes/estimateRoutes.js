const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createEstimate,
	getEstimates,
	getEstimateById,
	updateEstimate,
	deleteEstimate,
} = require('../controllers/estimatedController');

router.post('/estimates', verifyToken, createEstimate);
router.get('/estimates', verifyToken, getEstimates);
router.get('/estimates/:id', verifyToken, getEstimateById);
router.put('/estimates/:id', verifyToken, updateEstimate);
router.delete('/estimates/:id', verifyToken, deleteEstimate);

module.exports = router;
