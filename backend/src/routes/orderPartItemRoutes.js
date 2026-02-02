const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createPartItem,
	getPartItems,
	getPartItemsByRepairOrder,
	updatePartItem,
	deletePartItem,
} = require('../controllers/orderPartItemController');

router.get('/repair-orders/:repair_order_id/part-items', verifyToken, getPartItemsByRepairOrder);
router.post('/order-part-items', verifyToken, createPartItem);
router.get('/order-part-items', verifyToken, getPartItems);
router.put('/order-part-items/:id', verifyToken, updatePartItem);
router.delete('/order-part-items/:id', verifyToken, deletePartItem);

module.exports = router;
