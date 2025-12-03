const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createPart, getParts, updatePart, deletePart } = require('../controllers/partController');

router.post('/parts', verifyToken, createPart);
router.get('/parts', verifyToken, getParts);
router.put('/parts/:id', verifyToken, updatePart);
router.delete('/parts/:id', verifyToken, deletePart);

module.exports = router;
