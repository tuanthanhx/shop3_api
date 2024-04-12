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
  body('refreshToken')
    .notEmpty()
    .withMessage('refreshToken is required'),
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
  body('passwordConfirm')
    .notEmpty()
    .withMessage('passwordConfirm is required'),
  body('verificationCode')
    .notEmpty()
    .withMessage('verificationCode is required'),
  validateRules,
];

exports.resetPasswordByPhone = [
  body('phone')
    .notEmpty()
    .withMessage('phone is required'),
  body('password')
    .notEmpty()
    .withMessage('password is required'),
  body('passwordConfirm')
    .notEmpty()
    .withMessage('passwordConfirm is required'),
  body('verificationCode')
    .notEmpty()
    .withMessage('verificationCode is required'),
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

exports.confirmOtp = [
  body('receiver')
    .notEmpty()
    .withMessage('receiver is required'),
  body('code')
    .notEmpty()
    .withMessage('code is required'),
  validateRules,
];
