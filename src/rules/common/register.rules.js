const { body } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.registerByEmail = [
  body('email')
    .notEmpty()
    .isEmail()
    .withMessage('email is invalid format'),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),
  body('passwordConfirm')
    .notEmpty()
    .withMessage('passwordConfirm is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('passwordConfirm does not match password');
      }
      return true;
    }),
  body('userGroupId')
    .optional()
    .isInt()
    .withMessage('userGroupId must be integer')
    .custom((value) => {
      if (value !== undefined && ![1, 2].includes(value)) {
        throw new Error('userGroupId must be either 1 or 2');
      }
      return true;
    }),
  body('verificationCode')
    .notEmpty()
    .withMessage('verificationCode is required'),
  validateRules,
];

exports.registerByPhone = [
  body('phone')
    .notEmpty()
    .withMessage('phone is invalid format'),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters'),
  body('passwordConfirm')
    .notEmpty()
    .withMessage('passwordConfirm is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('passwordConfirm does not match password');
      }
      return true;
    }),
  body('userGroupId')
    .optional()
    .isInt()
    .withMessage('userGroupId must be integer')
    .custom((value) => {
      if (value !== undefined && ![1, 2].includes(value)) {
        throw new Error('userGroupId must be either 1 or 2');
      }
      return true;
    }),
  body('verificationCode')
    .notEmpty()
    .withMessage('verificationCode is required'),
  validateRules,
];
