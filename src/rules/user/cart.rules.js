const { body, param } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.index = [];

exports.getCount = [];

exports.create = [
  body('productId')
    .notEmpty()
    .withMessage('productId is required')
    .isInt()
    .withMessage('productId must be integer'),
  body('productVariantId')
    .notEmpty()
    .withMessage('productVariantId is required')
    .isInt()
    .withMessage('productVariantId must be integer'),
  body('quantity')
    .notEmpty()
    .withMessage('quantity is required')
    .isInt({
      min: 1,
    })
    .withMessage('quantity must be a positive integer'),
  validateRules,
];

exports.delete = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  validateRules,
];
