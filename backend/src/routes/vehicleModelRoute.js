const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createModel, getModels, updateModel, deleteModel } = require('../controllers/vehicleModelsController');

router.post('/models', verifyToken, createModel);
router.get('/models', verifyToken, getModels);
router.put('/models/:id', verifyToken, updateModel);
router.delete('/models/:id', verifyToken, deleteModel);

module.exports = router;
