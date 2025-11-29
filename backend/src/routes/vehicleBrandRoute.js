const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createBrand, getBrands, updateBrand, deleteBrand } = require('../controllers/vehicleBrandsController');
const { brandValidation } = require('../validators/vehicleValidators');
const { validateRequest } = require('../middleware/validateRequest');

router.post('/brands', brandValidation, validateRequest, verifyToken, createBrand);
router.get('/brands', verifyToken, getBrands);
router.put('/brands/:id', brandValidation, validateRequest, verifyToken, updateBrand);
router.delete('/brands/:id', verifyToken, deleteBrand);

module.exports = router;
