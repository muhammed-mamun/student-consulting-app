const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { verifyJWT, checkRole } = require('../middleware/auth');
const { validateFeedback } = require('../middleware/validation');

// Submit feedback (student only)
router.post('/', verifyJWT, checkRole('student'), validateFeedback, feedbackController.submitFeedback);

// Get feedback for appointment
router.get('/:appointmentId', verifyJWT, feedbackController.getFeedbackByAppointment);

// Get feedback for advisor
router.get('/advisor/:advisorId', verifyJWT, feedbackController.getFeedbackByAdvisor);

module.exports = router;

