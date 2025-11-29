const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createModel, getModels, updateModel, deleteModel } = require('../controllers/vehicleModelsController');
const { modelValidation } = require('../validators/vehicleValidators');
const { validateRequest } = require('../middleware/validateRequest');

router.post('/models', modelValidation, validateRequest, verifyToken, createModel);
router.get('/models', verifyToken, getModels);
router.put('/models/:id', modelValidation, validateRequest, verifyToken, updateModel);
router.delete('/models/:id', verifyToken, deleteModel);

module.exports = router;
