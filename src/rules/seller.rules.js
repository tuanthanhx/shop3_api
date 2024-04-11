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
  validateRules,
];
