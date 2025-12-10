const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createTaxRate, getTaxRates, updateTaxRate, deleteTaxRate } = require('../controllers/taxRateController');

router.post('/tax-rates', verifyToken, createTaxRate);
router.get('/tax-rates', verifyToken, getTaxRates);
router.put('/tax-rates/:id', verifyToken, updateTaxRate);
router.delete('/tax-rates/:id', verifyToken, deleteTaxRate);

module.exports = router;
