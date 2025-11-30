const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createRepairOrder,
	getRepairOrders,
	updateRepairOrder,
	deleteRepairOrder,
} = require('../controllers/repairOrderController');

router.post('/repair-orders', verifyToken, createRepairOrder);
router.get('/repair-orders', verifyToken, getRepairOrders);
router.put('/repair-orders/:id', verifyToken, updateRepairOrder);
router.delete('/repair-orders/:id', verifyToken, deleteRepairOrder);

module.exports = router;
