const { body } = require('express-validator');
const { validateRules } = require('../middlewares/validators');

exports.registerByEmail = [
  body('email')
    .notEmpty()
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

exports.registerByPhone = [
  body('phone')
    .notEmpty()
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
