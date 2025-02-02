const logger = require('../config/logger');

/**
 * Custom security headers middleware
 */
const securityHeaders = (req, res, next) => {
  // Hide Express
  res.removeHeader('X-Powered-By');

  // Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval';");
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  next();
};

/**
 * Request sanitization middleware
 */
const sanitizeRequest = (req, res, next) => {
  try {
    // Sanitize request body
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = req.body[key].trim();
        }
      });
    }

    // Sanitize request query
    if (req.query) {
      Object.keys(req.query).forEach(key => {
        if (typeof req.query[key] === 'string') {
          req.query[key] = req.query[key].trim();
        }
      });
    }

    next();
  } catch (error) {
    logger.error('Request sanitization error:', error);
    next(error);
  }
};

/**
 * SQL injection prevention middleware
 */
const preventSqlInjection = (req, res, next) => {
  const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b|\b(OR|AND)\b\s+\d+\s*=\s*\d+|\b(OR|AND)\b\s+'[^']*'\s*=\s*'[^']*')/i;

  try {
    // Check request body
    if (req.body) {
      Object.values(req.body).forEach(value => {
        if (typeof value === 'string' && sqlInjectionPattern.test(value)) {
          throw new Error('Potential SQL injection detected');
        }
      });
    }

    // Check request query
    if (req.query) {
      Object.values(req.query).forEach(value => {
        if (typeof value === 'string' && sqlInjectionPattern.test(value)) {
          throw new Error('Potential SQL injection detected');
        }
      });
    }

    next();
  } catch (error) {
    logger.error('SQL injection prevention error:', error);
    res.status(400).json({
      success: false,
      message: 'Invalid input detected'
    });
  }
};

module.exports = {
  securityHeaders,
  sanitizeRequest,
  preventSqlInjection
};
