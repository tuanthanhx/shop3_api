const { query } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.getHints = [
  query('keyword')
    .optional()
    .trim(),
  validateRules,
];
