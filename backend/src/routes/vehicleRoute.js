const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createVehicle, getVehicles, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');

router.post('/vehicles', verifyToken, createVehicle);
router.get('/vehicles', verifyToken, getVehicles);
router.put('/vehicles/:id', verifyToken, updateVehicle);
router.delete('/vehicles/:id', verifyToken, deleteVehicle);

module.exports = router;
