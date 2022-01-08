const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

/** Authentification Routes */
router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;