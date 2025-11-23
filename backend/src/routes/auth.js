const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validation');
const { verifyJWT } = require('../middleware/auth');

// Register user
router.post('/register', validateRegister, authController.register);

// Login user
router.post('/login', validateLogin, authController.login);

// Get current user
router.get('/me', verifyJWT, authController.getMe);

// Refresh token
router.post('/refresh-token', verifyJWT, authController.refreshToken);

// Logout user (no auth required - just clears local state)
router.post('/logout', authController.logout);

module.exports = router;

