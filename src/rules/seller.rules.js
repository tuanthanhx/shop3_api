const { body } = require('express-validator');
const { validateRules } = require('../middlewares/validators');

exports.createShop = [
  body('businessType')
    .notEmpty()
    .withMessage('businessType is required')
    .toInt(),
  body('shopName')
    .notEmpty()
    .withMessage('shopName is required'),
  body('subscribeMailingList')
    .optional()
    .toBoolean(),
  body('useCurrentEmail')
    .optional()
    .toBoolean(),
  body('useCurrentPhone')
    .optional()
    .toBoolean(),
  body('newEmail')
    .optional()
    .isEmail()
    .withMessage('newEmail is invalid format'),
  body('newPhone')
    .optional()
    .matches(/^[\d ()\-+\s]+$/)
    .withMessage('newPhone is invalid format'),
  validateRules,
];
