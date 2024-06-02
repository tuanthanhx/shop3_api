const { check } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

// exports.index = [];

// exports.getCount = [];

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
