const { param, query } = require('express-validator');
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
  query('parentId')
    .optional()
    .isInt()
    .withMessage('parentId must be integer'),
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
