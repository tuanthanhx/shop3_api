const { query, param } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.index = [
  query('parentId')
    .optional()
    .toInt(),
  validateRules,
];

exports.getAttributes = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  validateRules,
];
