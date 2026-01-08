const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createInvoice,
	getInvoices,
	updateInvoice,
	deleteInvoice,
	generateInvoicePDF,
} = require('../controllers/invoiceController');

router.post('/invoices', verifyToken, createInvoice);
router.get('/invoices', verifyToken, getInvoices);
router.put('/invoices/:id', verifyToken, updateInvoice);
router.delete('/invoices/:id', verifyToken, deleteInvoice);
router.get('/invoices/:id/pdf', verifyToken, generateInvoicePDF);
module.exports = router;
