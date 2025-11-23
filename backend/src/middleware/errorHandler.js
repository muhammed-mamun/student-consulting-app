/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = 'Validation error';
    error.errors = err.errors || {};
    return res.status(400).json(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    return res.status(401).json(error);
  }

  // Supabase errors
  if (err.code && err.code.startsWith('PGSQL')) {
    error.message = 'Database error';
    return res.status(500).json(error);
  }

  // Default to 500 server error
  res.status(err.status || 500).json(error);
};

module.exports = errorHandler;

