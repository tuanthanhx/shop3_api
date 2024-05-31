const { body } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.index = [];

exports.connectWallet = [
  body('address')
    .notEmpty()
    .withMessage('address is required')
    .trim(),
  body('signature')
    .notEmpty()
    .withMessage('signature is required')
    .trim(),
  body('message')
    .notEmpty()
    .withMessage('message is required')
    .trim(),
  validateRules,
];

exports.disconnectWallet = [];

exports.getOrdersStatistics = [];

exports.changePassword = [
  body('receiver')
    .notEmpty()
    .withMessage('receiver is required')
    .trim(),
  body('otp')
    .notEmpty()
    .withMessage('otp is required')
    .trim(),
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
  validateRules,
];
