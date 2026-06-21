const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { auth } = require('../middleware/auth');

router.get('/by-flat/:flatId', auth, reportController.getByFlat);
router.get('/summary', auth, reportController.getSummary);

module.exports = router;
