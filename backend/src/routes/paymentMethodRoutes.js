const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createPaymentMethod,
	getPaymentMethods,
	updatePaymentMethod,
	deletePaymentMethod,
} = require('../controllers/paymentMethodController');

router.post('/payment-methods', verifyToken, createPaymentMethod);
router.get('/payment-methods', verifyToken, getPaymentMethods);
router.put('/payment-methods/:id', verifyToken, updatePaymentMethod);
router.delete('/payment-methods/:id', verifyToken, deletePaymentMethod);

module.exports = router;
