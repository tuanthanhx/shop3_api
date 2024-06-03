const {
  query,
  param,
  body,
  check,
} = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.index = [
  query('status')
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
  check('cartIds')
    .isArray({ min: 1 })
    .withMessage('cartIds must be an array with at least one element'),
  check('cartIds.*')
    .isInt({ min: 1 })
    .withMessage('Each cartId must be a positive integer'),
  body('paymentMethodId')
    .isInt()
    .withMessage('paymentMethodId must be integer'),
  body('logisticsProviderOptionId')
    .isInt()
    .withMessage('logisticsProviderOptionId must be integer'),
  body('userAddressId')
    .isInt()
    .withMessage('userAddressId must be integer'),
  validateRules,
];

exports.cancel = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  validateRules,
];

exports.complete = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  validateRules,
];

exports.updateStatus = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  body('statusId')
    .isInt()
    .withMessage('statusId must be integer'),
  validateRules,
];

exports.getReviews = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  validateRules,
];

exports.createReview = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  check('reviews').isArray({ min: 1 }).withMessage('Reviews must be an array with at least one review'),
  check('reviews.*.orderItemId')
    .isInt()
    .withMessage('orderItemId must be an integer'),
  check('reviews.*.rate')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rate must be an integer between 1 and 5'),
  check('reviews.*.message')
    .optional()
    .isString()
    .withMessage('Message must be a string'),
  check('reviews.*.images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  check('reviews.*.images.*')
    .optional()
    .isURL()
    .withMessage('Each image must be a valid URL'),
  check('reviews.*.videos')
    .optional()
    .isArray()
    .withMessage('Videos must be an array'),
  check('reviews.*.videos.*')
    .optional()
    .isURL()
    .withMessage('Each video must be a valid URL'),
  validateRules,
];
