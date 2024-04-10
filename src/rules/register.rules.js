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
  body('password_confirm')
    .notEmpty()
    .withMessage('password_confirm is required'),
  body('verification_code')
    .notEmpty()
    .withMessage('verification_code is required'),
  validateRules,
];

exports.registerByPhone = [
  body('phone')
    .notEmpty()
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
