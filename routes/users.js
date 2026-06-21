const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, adminOnly, userController.getAll);
router.post('/', auth, adminOnly, userController.create);
router.put('/:id', auth, adminOnly, userController.update);
router.delete('/:id', auth, adminOnly, userController.remove);

module.exports = router;
