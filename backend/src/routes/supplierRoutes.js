const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createSupplier, getSuppliers, updateSupplier, deleteSupplier } = require('../controllers/supplierController');

router.post('/suppliers', verifyToken, createSupplier);
router.get('/suppliers', verifyToken, getSuppliers);
router.put('/suppliers/:id', verifyToken, updateSupplier);
router.delete('/suppliers/:id', verifyToken, deleteSupplier);

module.exports = router;
