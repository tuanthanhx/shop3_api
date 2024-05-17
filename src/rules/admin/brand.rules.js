const { body } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.index = [];

exports.show = [];

exports.create = [
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .trim(),
  body('description')
    .optional()
    .trim(),
  validateRules,
];

exports.update = [];

exports.delete = [];
