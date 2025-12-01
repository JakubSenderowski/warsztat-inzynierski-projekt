const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createServiceCatalog,
	getServiceCatalogs,
	updateServiceCatalog,
	deleteServiceCatalog,
} = require('../controllers/serviceCatalogController');

router.post('/service-catalog', verifyToken, createServiceCatalog);
router.get('/service-catalog', verifyToken, getServiceCatalogs);
router.put('/service-catalog/:id', verifyToken, updateServiceCatalog);
router.delete('/service-catalog/:id', verifyToken, deleteServiceCatalog);

module.exports = router;
