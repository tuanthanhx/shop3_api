const { param, query } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.index = [
  query('keyword')
    .optional()
    .trim(),
  query('minPrice')
    .optional()
    .toInt(),
  query('maxPrice')
    .optional()
    .toInt(),
  query('categoryId')
    .optional()
    .trim(), // list of int
  query('codStatus')
    .optional()
    .toBoolean(),
  query('limit')
    .optional()
    .custom((value) => {
      const num = Number(value);
      if (num >= 1 && num <= 25) {
        return true;
      }
      throw new Error('Invalid value for limit. Allowed values are between 1 and 25');
    }),
  query('sortField')
    .optional()
    .trim(),
  query('sortOrder')
    .optional()
    .trim(),
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

exports.getReviews = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  query('rate')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('rate must be an integer between 1 and 5'),
  validateRules,
];
