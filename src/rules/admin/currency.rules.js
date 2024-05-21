const { query, param, body } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.index = [
  query('name')
    .optional()
    .trim(),
  query('code')
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
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .trim(),
  body('code')
    .notEmpty()
    .withMessage('code is required')
    .trim(),
  body('symbol')
    .notEmpty()
    .withMessage('symbol is required')
    .trim(),
  validateRules,
];

exports.update = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .trim(),
  body('code')
    .notEmpty()
    .withMessage('code is required')
    .trim(),
  body('symbol')
    .notEmpty()
    .withMessage('symbol is required')
    .trim(),
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
