const { query } = require('express-validator');
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
