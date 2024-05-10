const { query } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.index = [
  query('parentId')
    .optional()
    .toInt(),
  validateRules,
];
