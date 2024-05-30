const { body } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.index = [];

exports.connectWallet = [
  body('address')
    .notEmpty()
    .withMessage('phone is required')
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
