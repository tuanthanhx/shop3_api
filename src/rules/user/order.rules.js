const { query, param, body, check } = require('express-validator');
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
  body('paymentMethodId')
    .isInt()
    .withMessage('paymentMethodId must be integer'),
  body('logisticsProviderOptionId')
    .isInt()
    .withMessage('logisticsProviderOptionId must be integer'),
  body('userAddressId')
    .isInt()
    .withMessage('userAddressId must be integer'),
  validateRules,
];

exports.cancel = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  validateRules,
];

exports.complete = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  validateRules,
];
