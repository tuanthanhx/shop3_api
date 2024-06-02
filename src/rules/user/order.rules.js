const { query, param, check } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.index = [
  query('status')
    .optional()
    .trim(),
  validateRules,
];

exports.show = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  validateRules,
];

exports.create = [
  check('cartIds')
    .isArray({ min: 1 })
    .withMessage('cartIds must be an array with at least one element'),
  check('cartIds.*')
    .isInt({ min: 1 })
    .withMessage('Each cartId must be a positive integer'),
  validateRules,
];

// exports.updateQuantity = [];

// exports.delete = [];
