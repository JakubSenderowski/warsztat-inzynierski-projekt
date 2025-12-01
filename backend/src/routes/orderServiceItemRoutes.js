const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createServiceItem,
	getServiceItems,
	updateServiceItem,
	deleteServiceItem,
} = require('../controllers/orderServiceItemController');

router.post('/order-service-items', verifyToken, createServiceItem);
router.get('/order-service-items', verifyToken, getServiceItems);
router.put('/order-service-items/:id', verifyToken, updateServiceItem);
router.delete('/order-service-items/:id', verifyToken, deleteServiceItem);

module.exports = router;
