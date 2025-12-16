const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createPrintTemplate,
	getPrintTemplates,
	updatePrintTemplate,
	deletePrintTemplate,
} = require('../controllers/printTemplateController');

router.post('/print-templates', verifyToken, createPrintTemplate);
router.get('/print-templates', verifyToken, getPrintTemplates);
router.put('/print-templates/:id', verifyToken, updatePrintTemplate);
router.delete('/print-templates/:id', verifyToken, deletePrintTemplate);

module.exports = router;
