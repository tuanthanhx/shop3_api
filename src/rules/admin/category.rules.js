const { param, query, body } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.index = [
  query('parentId')
    .optional()
    .toInt(),
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
    .withMessage('name is required'),
  query('image')
    .optional()
    .trim(),
  query('parentId')
    .optional()
    .toInt(),
  validateRules,
];

exports.update = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  body('name')
    .optional()
    .trim(),
  query('parentId')
    .optional()
    .toInt(),
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
