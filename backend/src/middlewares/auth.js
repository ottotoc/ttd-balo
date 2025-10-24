const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { UnauthorizedError, ForbiddenError } = require('../common/errors');

// Verify JWT token from cookie
const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { sub: userId, role: 'ADMIN' | 'CUSTOMER' }
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Invalid or expired token');
    }
    throw error;
  }
};

// Optional authentication (for routes that work with or without auth)
const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
    }
  } catch (error) {
    // Ignore token errors for optional auth
  }
  next();
};

// Require specific role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError('Insufficient permissions');
    }
    next();
  };
};

module.exports = { authenticate, optionalAuth, authorize };

