const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { verifyJWT, checkRole } = require('../middleware/auth');
const { validateAppointment } = require('../middleware/validation');

// Create appointment (student only)
router.post('/', verifyJWT, checkRole('student'), validateAppointment, appointmentController.createAppointment);

// Get appointments
router.get('/', verifyJWT, appointmentController.getAppointments);

// Get appointment by ID
router.get('/:id', verifyJWT, appointmentController.getAppointmentById);

// Approve appointment (advisor only)
router.put('/:id/approve', verifyJWT, checkRole('advisor'), appointmentController.approveAppointment);

// Reject appointment (advisor only)
router.put('/:id/reject', verifyJWT, checkRole('advisor'), appointmentController.rejectAppointment);

// Complete appointment
router.put('/:id/complete', verifyJWT, appointmentController.completeAppointment);

// Cancel appointment
router.delete('/:id', verifyJWT, appointmentController.cancelAppointment);

module.exports = router;

