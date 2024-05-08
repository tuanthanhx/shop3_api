const { query, validationResult } = require('express-validator');
const multer = require('multer');
const logger = require('../utils/logger');

exports.validateRules = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  return next();
};

exports.handleQueries = [
  (req, res, next) => {
    Object.keys(req.query).forEach((key) => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    });
    next();
  },
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
];

exports.handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    logger.error('Multer error:', err.message);
    return res.status(400).json({ errors: err.message });
  }
  return next();
};
