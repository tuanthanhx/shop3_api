const { query } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.index = [
  query('name')
    .optional()
    .trim(),
  validateRules,
];
