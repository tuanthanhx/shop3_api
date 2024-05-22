const { param } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.index = [];

exports.show = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  validateRules,
];
