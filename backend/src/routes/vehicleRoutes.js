const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { createBrand, getBrands, updateBrand, deleteBrand } = require('../controllers/vehicleController');
const router = express.Router();

router.post('/brands', verifyToken, createBrand);
router.get('/brands', verifyToken, getBrands);
router.put('/brands/:id', verifyToken, updateBrand);
router.delete('/brands/:id', verifyToken, deleteBrand);
module.exports = router;
