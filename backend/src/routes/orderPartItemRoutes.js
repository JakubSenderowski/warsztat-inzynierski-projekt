const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createPartItem,
	getPartItems,
	updatePartItem,
	deletePartItem,
} = require('../controllers/orderPartItemController');

router.post('/order-part-items', verifyToken, createPartItem);
router.get('/order-part-items', verifyToken, getPartItems);
router.put('/order-part-items/:id', verifyToken, updatePartItem);
router.delete('/order-part-items/:id', verifyToken, deletePartItem);

module.exports = router;
