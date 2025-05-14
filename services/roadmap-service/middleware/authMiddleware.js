/**
 * Authentication Middleware
 * 
 * Handles JWT token verification and user authentication.
 */

const jwt = require('jsonwebtoken');

/**
 * Protect routes - Middleware to verify JWT token and set user on request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
exports.protect = async (req, res, next) => {
  try {
    // Get token from header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Not authorized, no token'
      });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
      next();
    } catch (error) {
      console.error(`[AUTH_MIDDLEWARE] Token verification error: ${error.message}`);
      return res.status(401).json({
        status: 'fail',
        message: 'Not authorized, token failed'
      });
    }
  } catch (error) {
    console.error(`[AUTH_MIDDLEWARE] Error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};
