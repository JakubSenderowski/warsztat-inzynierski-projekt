const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createVehicle, getVehicles, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { vehicleValidation } = require('../validators/vehicleValidators');
const { validateRequest } = require('../middleware/validateRequest');

router.post('/vehicles', vehicleValidation, validateRequest, verifyToken, createVehicle);
router.get('/vehicles', verifyToken, getVehicles);
router.put('/vehicles/:id', vehicleValidation, validateRequest, verifyToken, updateVehicle);
router.delete('/vehicles/:id', verifyToken, deleteVehicle);

module.exports = router;
