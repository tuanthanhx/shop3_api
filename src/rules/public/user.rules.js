const { query } = require('express-validator');
const { validateRules } = require('../../middlewares/validators');

exports.getStatistics = [
  query('uuid')
    .notEmpty()
    .withMessage('uuid is required')
    .trim(),
  validateRules,
];

exports.getReferrals = [
  query('referrerId')
    .notEmpty()
    .withMessage('referrerId is required')
    .trim()
    .escape(),
  validateRules,
];
