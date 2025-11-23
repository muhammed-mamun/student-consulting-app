const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyJWT } = require('../middleware/auth');

// Get user profile
router.get('/profile', verifyJWT, userController.getProfile);

// Update user profile
router.put('/profile', verifyJWT, userController.updateProfile);

// Get all advisors
router.get('/advisors', verifyJWT, userController.getAdvisors);

module.exports = router;

