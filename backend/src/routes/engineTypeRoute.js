const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createEngineType,
	getEngineTypes,
	updateEngineType,
	deleteEngineType,
} = require('../controllers/engineTypeController');
const { engineValidation } = require('../validators/vehicleValidators');
const { validateRequest } = require('../middleware/validateRequest');

router.post('/engines', engineValidation, validateRequest, verifyToken, createEngineType);
router.get('/engines', verifyToken, getEngineTypes);
router.put('/engines/:id', engineValidation, validateRequest, verifyToken, updateEngineType);
router.delete('/engines/:id', verifyToken, deleteEngineType);

module.exports = router;
