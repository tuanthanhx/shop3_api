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

// body('password').isLength({ min: 6 }), // Ensure password length is at least 6 characters
//   body('confirmPassword').custom((value, { req }) => {
//     // Custom validation to check if confirmPassword matches password
//     if (value !== req.body.password) {
//       throw new Error('Password confirmation does not match password');
//     }
//     return true;
//   })

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
