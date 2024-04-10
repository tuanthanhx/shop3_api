const { body } = require('express-validator');
const { validateRules } = require('../middlewares/validators');

exports.login = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email is invalid format'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validateRules,
];

exports.refreshToken = [
  body('refreshToken')
    .notEmpty()
    .withMessage('RefreshToken is required'),
  validateRules,
];

exports.resetPassword = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email is invalid format'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  body('password_confirm')
    .notEmpty()
    .withMessage('Confirm Password is required'),
  body('verification_code')
    .notEmpty()
    .withMessage('Verification Code is required'),
  validateRules,
];

exports.generateOTP = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email is invalid format'),
  validateRules,
];
