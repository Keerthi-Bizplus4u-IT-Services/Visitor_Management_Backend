const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');
const { auth } = require('../middleware/auth');
const upload = require('../config/upload');

router.get('/', auth, visitorController.getAll);
router.get('/:id', auth, visitorController.getById);
router.post('/', auth, upload.single('photo'), visitorController.create);

module.exports = router;
