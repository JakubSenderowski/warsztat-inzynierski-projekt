const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createUnitOfMeasure,
	getUnitMeasures,
	updateUnitMeasure,
	deleteUnitMeasure,
} = require('../controllers/unitOfMeasureController');

router.post('/units-of-measure', verifyToken, createUnitOfMeasure);
router.get('/units-of-measure', verifyToken, getUnitMeasures);
router.put('/units-of-measure/:id', verifyToken, updateUnitOfMeasure);
router.delete('/units-of-measure/:id', verifyToken, deleteUnitOfMeasure);

module.exports = router;
