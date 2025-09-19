const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const auth = require('../middleware/auth');
const { validateUser } = require('../middleware/validation');

router.post('/register', validateUser, UserController.register);

router.post('/login', UserController.login);

router.get('/:id', auth, UserController.getUserById);

router.get('/', auth, UserController.getAllUsers);

router.patch('/:id/block', auth, UserController.blockUser);

module.exports = router;