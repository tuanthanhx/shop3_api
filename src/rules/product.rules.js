const { param, query, body } = require('express-validator');
const { validateRules } = require('../middlewares/validators');

exports.findAll = [
  query('name')
    .optional()
    .trim(),
  query('statusId')
    .optional()
    .toInt(),
  validateRules,
];

exports.findOne = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .toInt(),
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
  validateRules,
];

exports.update = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .toInt(),
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
  validateRules,
];

exports.delete = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .toInt(),
  validateRules,
];
