const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createBrand, getBrands, updateBrand, deleteBrand } = require('../controllers/vehicleBrandsController');

router.post('/brands', verifyToken, createBrand);
router.get('/brands', verifyToken, getBrands);
router.put('/brands/:id', verifyToken, updateBrand);
router.delete('/brands/:id', verifyToken, deleteBrand);

module.exports = router;
