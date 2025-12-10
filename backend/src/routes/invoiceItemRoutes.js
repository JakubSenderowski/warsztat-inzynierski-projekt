const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createInvoiceItem,
	getInvoiceItems,
	updateInvoiceItem,
	deleteInvoiceItem,
} = require('../controllers/invoiceItemController');

router.post('/invoice-items', verifyToken, createInvoiceItem);
router.get('/invoice-items', verifyToken, getInvoiceItems);
router.put('/invoice-items/:id', verifyToken, updateInvoiceItem);
router.delete('/invoice-items/:id', verifyToken, deleteInvoiceItem);

module.exports = router;
