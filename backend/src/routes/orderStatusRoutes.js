const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	getAllOrderStatuses,
	getOrderStatusById,
	createOrderStatus,
	updateOrderStatus,
	deleteOrderStatus,
} = require('../controllers/orderStatusController');

router.get('/order-statuses', verifyToken, getAllOrderStatuses);
router.get('/order-statuses/:id', verifyToken, getOrderStatusById);
router.post('/order-statuses', verifyToken, createOrderStatus);
router.put('/order-statuses/:id', verifyToken, updateOrderStatus);
router.delete('/order-statuses/:id', verifyToken, deleteOrderStatus);

module.exports = router;
