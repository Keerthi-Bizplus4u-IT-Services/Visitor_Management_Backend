const express = require('express');
const router = express.Router();
const flatController = require('../controllers/flatController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, flatController.getAll);
router.get('/:id', auth, flatController.getById);
router.post('/', auth, adminOnly, flatController.create);
router.put('/:id', auth, adminOnly, flatController.update);
router.delete('/:id', auth, adminOnly, flatController.remove);

module.exports = router;
