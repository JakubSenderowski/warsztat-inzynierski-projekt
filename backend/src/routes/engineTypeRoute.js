const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createEngineType,
	getEngineTypes,
	updateEngineType,
	deleteEngineType,
} = require('../controllers/engineTypeController');

router.post('/engines', verifyToken, createEngineType);
router.get('/engines', verifyToken, getEngineTypes);
router.put('/engines/:id', verifyToken, updateEngineType);
router.delete('/engines/:id', verifyToken, deleteEngineType);

module.exports = router;
