const { body, param } = require('express-validator');
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

exports.updateProfile = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('email is invalid format')
    .trim(),
  body('emailOtp')
    .if(body('email').exists())
    .notEmpty()
    .withMessage('emailOtp is required if email is provided')
    .trim(),
  body('email')
    .optional()
    .trim(),
  body('phoneOtp')
    .if(body('phone').exists())
    .notEmpty()
    .withMessage('phoneOtp is required if phone is provided')
    .trim(),
  body('dob')
    .optional()
    .isISO8601()
    .withMessage('dob must be in the format YYYY-MM-DD')
    .custom((value) => {
      const today = new Date();
      const dobDate = new Date(value);
      if (dobDate >= today) {
        throw new Error('dob must be in the past');
      }
      return true;
    })
    .trim(),
  body('name')
    .optional()
    .trim(),
  body('avatar')
    .optional()
    .trim(),
  body('gender')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('gender must be an integer between 1 and 5'),
  body('countryCode')
    .optional()
    .trim(),
  body('languageId')
    .optional()
    .isInt()
    .withMessage('languageId must be integer'),
  body('currencyId')
    .optional()
    .isInt()
    .withMessage('currencyId must be integer'),
  body('subscribeMailingList')
    .optional()
    .toBoolean(),
  validateRules,
];

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

exports.getAddresses = [];

exports.createAddress = [
  body('firstName')
    .notEmpty()
    .withMessage('firstName is required')
    .trim(),
  body('lastName')
    .notEmpty()
    .withMessage('lastName is required')
    .trim(),
  body('phone')
    .notEmpty()
    .withMessage('phone is required')
    .trim(),
  body('countryCode')
    .notEmpty()
    .withMessage('countryCode is required')
    .trim(),
  body('address')
    .notEmpty()
    .withMessage('address is required')
    .trim(),
  body('isDefault')
    .optional()
    .toBoolean(),
  validateRules,
];

exports.updateAddress = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  body('firstName')
    .notEmpty()
    .withMessage('firstName is required')
    .trim(),
  body('lastName')
    .notEmpty()
    .withMessage('lastName is required')
    .trim(),
  body('phone')
    .notEmpty()
    .withMessage('phone is required')
    .trim(),
  body('countryCode')
    .notEmpty()
    .withMessage('countryCode is required')
    .trim(),
  body('address')
    .notEmpty()
    .withMessage('address is required')
    .trim(),
  body('isDefault')
    .optional()
    .toBoolean(),
  validateRules,
];

exports.deleteAddress = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  validateRules,
];

exports.getPaymentMethods = [];

exports.createPaymentMethodWithCards = [
  body('cardNumber')
    .notEmpty()
    .withMessage('cardNumber is required')
    .trim(),
  body('expYear')
    .notEmpty()
    .withMessage('expYear is required')
    .trim(),
  body('expMonth')
    .notEmpty()
    .withMessage('expMonth is required')
    .trim(),
  body('ccv')
    .notEmpty()
    .withMessage('ccv is required')
    .trim(),
  body('isDefault')
    .optional()
    .toBoolean(),
  validateRules,
];
exports.createPaymentMethodWithPaypal = [
  body('accountName')
    .notEmpty()
    .withMessage('accountName is required')
    .trim(),
  body('isDefault')
    .optional()
    .toBoolean(),
  validateRules,
];
exports.createPaymentMethodWithCryptocurrencies = [
  body('walletAddress')
    .notEmpty()
    .withMessage('walletAddress is required')
    .trim(),
  body('isDefault')
    .optional()
    .toBoolean(),
  validateRules,
];
exports.createPaymentMethodWithOnline = [
  body('serviceName')
    .notEmpty()
    .withMessage('serviceName is required')
    .trim(),
  body('accountName')
    .notEmpty()
    .withMessage('accountName is required')
    .trim(),
  body('isDefault')
    .optional()
    .toBoolean(),
  validateRules,
];

exports.setDefaultPaymentMethod = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  validateRules,
];

exports.deletePaymentMethod = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  validateRules,
];

exports.getPaymentMethodTypes = [];
