const { param, query, body } = require('express-validator');
const { validateRules } = require('../middlewares/validators');

exports.findAll = [
  query('parentId')
    .optional()
    .toInt(),
  validateRules,
];

exports.create = [
  body('name')
    .notEmpty()
    .withMessage('name is required'),
  query('parentId')
    .optional()
    .toInt(),
  validateRules,
];

exports.update = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .toInt(),
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
    .toInt(),
  validateRules,
];
