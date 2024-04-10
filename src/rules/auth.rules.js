const { body } = require('express-validator');
const { validateRules } = require('../middlewares/validators');

exports.login = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('email is invalid format'),
  body('password')
    .notEmpty()
    .withMessage('password is required'),
  validateRules,
];

exports.refreshToken = [
  body('refresh_token')
    .notEmpty()
    .withMessage('refresh_token is required'),
  validateRules,
];

exports.resetPassword = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('email is invalid format'),
  body('password')
    .notEmpty()
    .withMessage('password is required'),
  body('password_confirm')
    .notEmpty()
    .withMessage('password_confirm is required'),
  body('verification_code')
    .notEmpty()
    .withMessage('verification_code is required'),
  validateRules,
];

exports.generateOTP = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('email is invalid format'),
  validateRules,
];
