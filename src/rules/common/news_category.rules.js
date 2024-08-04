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
