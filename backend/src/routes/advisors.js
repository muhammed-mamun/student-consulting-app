const express = require('express');
const router = express.Router();
const advisorController = require('../controllers/advisorController');
const { verifyJWT, checkRole } = require('../middleware/auth');

// Get all advisors
router.get('/', verifyJWT, advisorController.getAdvisors);

// Get advisor by ID
router.get('/:id', verifyJWT, advisorController.getAdvisorById);

// Get advisor availability
router.get('/:id/availability', verifyJWT, advisorController.getAvailability);

// Update advisor profile (advisor only)
router.put('/profile', verifyJWT, checkRole('advisor'), advisorController.updateProfile);

module.exports = router;

