const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createUnitOfMeasure,
	getUnitMeasures,
	updateUnitMeasure,
	deleteUnitMeasure,
} = require('../controllers/unitsOfMeasureController');

router.post('/units-of-measure', verifyToken, createUnitOfMeasure);
router.get('/units-of-measure', verifyToken, getUnitMeasures);
router.put('/units-of-measure/:id', verifyToken, updateUnitMeasure);
router.delete('/units-of-measure/:id', verifyToken, deleteUnitMeasure);

module.exports = router;
