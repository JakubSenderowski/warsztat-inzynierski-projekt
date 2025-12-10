const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createInvoice, getInvoices, updateInvoice, deleteInvoice } = require('../controllers/invoiceController');

router.post('/invoices', verifyToken, createInvoice);
router.get('/invoices', verifyToken, getInvoices);
router.put('/invoices/:id', verifyToken, updateInvoice);
router.delete('/invoices/:id', verifyToken, deleteInvoice);

module.exports = router;
