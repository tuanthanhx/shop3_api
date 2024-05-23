const { body, param, query } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.index = [
  query('keyword')
    .optional()
    .trim(),
  query('sortField')
    .optional()
    .trim(),
  query('sortOrder')
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
  body('description')
    .optional()
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
  body('description')
    .optional()
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
