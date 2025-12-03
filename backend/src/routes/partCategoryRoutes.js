const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createPartCategory,
	getPartCategories,
	updatePartCategory,
	deletePartCategory,
} = require('../controllers/partCategoryController');

router.post('/part-categories', verifyToken, createPartCategory);
router.get('/part-categories', verifyToken, getPartCategories);
router.put('/part-categories/:id', verifyToken, updatePartCategory);
router.delete('/part-categories/:id', verifyToken, deletePartCategory);

module.exports = router;
