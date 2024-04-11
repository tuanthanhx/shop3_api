const { body } = require('express-validator');
const { validateRules } = require('../middlewares/validators');

exports.loginByEmail = [
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('email is invalid format'),
  body('password')
    .notEmpty()
    .withMessage('password is required'),
  validateRules,
];

exports.loginByPhone = [
  body('phone')
    .notEmpty()
    .withMessage('phone is required'),
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

exports.resetPasswordByEmail = [
  body('email')
    .notEmpty()
    .withMessage('email is required')
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

exports.resetPasswordByPhone = [
  body('phone')
    .notEmpty()
    .withMessage('phone is required'),
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

exports.generateOtpByEmail = [
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('email is invalid format'),
  validateRules,
];

exports.generateOtpByPhone = [
  body('phone')
    .notEmpty()
    .withMessage('phone is required'),
  validateRules,
];
