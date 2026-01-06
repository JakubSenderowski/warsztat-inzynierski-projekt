const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getAllOrderStatuses } = require('../controllers/orderStatusController');

router.get('/order-statuses', verifyToken, getAllOrderStatuses);

module.exports = router;
