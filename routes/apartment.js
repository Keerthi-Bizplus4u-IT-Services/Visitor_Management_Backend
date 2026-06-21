const express = require('express');
const router = express.Router();
const apartmentController = require('../controllers/apartmentController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, apartmentController.getConfig);
router.put('/', auth, adminOnly, apartmentController.updateConfig);

module.exports = router;
