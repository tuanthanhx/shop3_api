const { body, param, query } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.index = [
  query('keyword')
    .optional()
    .trim(),
  query('catId')
    .optional()
    .toInt(),
  body('isPublished')
    .optional()
    .toBoolean(),
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

exports.create = [
  body('title')
    .notEmpty()
    .withMessage('title is required')
    .trim(),
  body('excerpt')
    .optional()
    .trim(),
  body('content')
    .notEmpty()
    .withMessage('content is required')
    .trim(),
  body('catIds').custom((value) => {
    if (value === undefined) return true;
    if (!Array.isArray(value)) {
      throw new Error('catIds must be provided as an array');
    }
    const isValid = value.every((id) => Number.isInteger(id));
    if (!isValid) {
      throw new Error('Each item in catIds must be an integer');
    }
    return true;
  }),
  body('image')
    .optional()
    .trim(),
  body('isPublished')
    .notEmpty()
    .withMessage('isPublished is required')
    .toBoolean(),
  validateRules,
];

exports.update = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  body('title')
    .optional()
    .trim(),
  body('excerpt')
    .optional()
    .trim(),
  body('content')
    .optional()
    .trim(),
  body('catIds').custom((value) => {
    if (value === undefined) return true;
    if (!Array.isArray(value)) {
      throw new Error('catIds must be provided as an array');
    }
    const isValid = value.every((id) => Number.isInteger(id));
    if (!isValid) {
      throw new Error('Each item in catIds must be an integer');
    }
    return true;
  }),
  body('image')
    .optional()
    .trim(),
  body('isPublished')
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

exports.publish = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  validateRules,
];

exports.unpublish = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  validateRules,
];
