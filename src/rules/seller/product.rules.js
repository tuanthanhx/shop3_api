const { param, query, body } = require('express-validator');
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
  query('statusId')
    .optional()
    .toInt(),
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

exports.statistics = [];

exports.show = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  validateRules,
];

exports.create = [
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .trim(),
  body('description')
    .optional()
    .trim(),
  body('categoryId')
    .optional()
    .toInt(),
  body('productStatusId')
    .optional()
    .toInt(),
  body('brandId')
    .optional()
    .toInt(),
  body('attributes') // TODO: Add a custom validate later
    .optional(),
  body('variants') // TODO: Add a custom validate later
    .optional(),
  body('productVariants') // TODO: Add a custom validate later
    .optional(),
  body('packageWeight')
    .optional()
    .toInt(),
  body('packageWidth')
    .optional()
    .toInt(),
  body('packageHeight')
    .optional()
    .toInt(),
  body('packageLength')
    .optional()
    .toInt(),
  body('logisticsServiceIds')
    .optional(), // TODO: Validate if it is a undifined, null, empty array, something array later
  body('cod')
    .optional()
    .toBoolean(),
  validateRules,
];

exports.update = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .trim(),
  body('description')
    .optional()
    .trim(),
  body('categoryId')
    .optional()
    .toInt(),
  body('productStatusId')
    .optional()
    .toInt(),
  body('brandId')
    .optional()
    .toInt(),
  body('attributes') // TODO: Add a custom validate later
    .optional(),
  body('variants') // TODO: Add a custom validate later
    .optional(),
  body('productVariants') // TODO: Add a custom validate later
    .optional(),
  body('packageWeight')
    .optional()
    .toInt(),
  body('packageWidth')
    .optional()
    .toInt(),
  body('packageHeight')
    .optional()
    .toInt(),
  body('packageLength')
    .optional()
    .toInt(),
  body('logisticsServiceIds')
    .optional(), // TODO: Validate if it is a undifined, null, empty array, something array later
  body('cod')
    .optional()
    .toBoolean(),
  validateRules,
];

exports.delete = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  validateRules,
];

exports.bulkActiveProducts = [
  body('ids') // TODO: Validate it later
    .notEmpty()
    .withMessage('ids is required')
    .toInt(),
  validateRules,
];

exports.bulkDeactiveProducts = [
  body('ids') // TODO: Validate it later
    .notEmpty()
    .withMessage('ids is required')
    .toInt(),
  validateRules,
];

exports.bulkDeleteProducts = [
  body('ids') // TODO: Validate it later
    .notEmpty()
    .withMessage('ids is required')
    .toInt(),
  validateRules,
];

exports.bulkRecoverProducts = [
  body('ids') // TODO: Validate it later
    .notEmpty()
    .withMessage('ids is required')
    .toInt(),
  validateRules,
];
