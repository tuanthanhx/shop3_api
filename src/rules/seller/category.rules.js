const { query } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.findAll = [
  query('parentId')
    .optional()
    .toInt(),
  validateRules,
];
