const { body, param } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.index = [
  // query('keyword')
  //   .optional()
  //   .trim(),
  // query('sortField')
  //   .optional()
  //   .trim(),
  // query('sortOrder')
  //   .optional()
  //   .trim(),
  // validateRules,
];

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
    .isInt()
    .withMessage('quantity must be integer'),
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
