const express = require('express');
const router = express.Router();
const visitorLogController = require('../controllers/visitorLogController');
const { auth } = require('../middleware/auth');

router.get('/', auth, visitorLogController.getAll);
router.put('/:id/exit', auth, visitorLogController.markExit);
router.get('/categories', auth, visitorLogController.getCategories);

module.exports = router;
