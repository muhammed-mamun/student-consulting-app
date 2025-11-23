const { body, validationResult } = require('express-validator');

/**
 * Validation result handler
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Register validation rules
 */
const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('role').isIn(['student', 'advisor']).withMessage('Role must be student or advisor'),
  handleValidationErrors
];

/**
 * Login validation rules
 */
const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

/**
 * Appointment validation rules
 */
const validateAppointment = [
  body('advisorId').isInt().withMessage('Advisor ID must be a number'),
  body('appointmentDate').isISO8601().withMessage('Invalid date format'),
  body('appointmentTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Invalid time format (expected HH:MM:SS)'),
  body('issueCategory').notEmpty().withMessage('Issue category is required'),
  body('issueDescription').trim().notEmpty().withMessage('Issue description is required'),
  handleValidationErrors
];

/**
 * Feedback validation rules
 */
const validateFeedback = [
  body('appointmentId').isInt().withMessage('Appointment ID must be a number'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim(),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateAppointment,
  validateFeedback,
};

