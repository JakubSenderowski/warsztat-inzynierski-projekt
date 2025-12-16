const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
	createFileAttachment,
	getFileAttachments,
	updateFileAttachment,
	deleteFileAttachment,
} = require('../controllers/fileAttachmentController');

router.post('/file-attachments', verifyToken, createFileAttachment);
router.get('/file-attachments', verifyToken, getFileAttachments);
router.put('/file-attachments/:id', verifyToken, updateFileAttachment);
router.delete('/file-attachments/:id', verifyToken, deleteFileAttachment);

module.exports = router;
