const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createRepairOrder,
	getRepairOrders,
	updateRepairOrder,
	deleteRepairOrder,
	getRepairOrderById,
} = require('../controllers/repairOrderController');
const { repairOrderValidation } = require('../validators/serviceValidators');
const { validateRequest } = require('../middleware/validateRequest');

router.get('/repair-orders/:id', verifyToken, getRepairOrderById);
router.post('/repair-orders', repairOrderValidation, validateRequest, verifyToken, createRepairOrder);
router.get('/repair-orders', verifyToken, getRepairOrders);
router.put('/repair-orders/:id', repairOrderValidation, validateRequest, verifyToken, updateRepairOrder);
router.delete('/repair-orders/:id', verifyToken, deleteRepairOrder);

module.exports = router;
