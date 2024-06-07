const { param, query, body } = require('express-validator');
const { validateRules, handleMulterErrors } = require('../../middlewares/validators');

exports.index = [
  query('folder')
    .optional()
    .trim(),
  query('limit')
    .optional()
    .custom((value) => {
      const num = Number(value);
      if (num >= 1 && num <= 25) {
        return true;
      }
      throw new Error('Invalid value for limit. Allowed values are between 1 and 25');
    }),
  query('sortField')
    .optional()
    .trim(),
  query('sortOrder')
    .optional()
    .trim(),
  validateRules,
];

exports.create = [
  body('file').custom((value, { req }) => {
    if (req.files && req.files.file) {
      const file = req.files.file[0];
      const fileSize = file.size;
      if (fileSize > 52428800) {
        throw new Error('File must be less than 50MB');
      }
      return true;
    }
    throw new Error('No file was provided');
  }),
  validateRules,
  handleMulterErrors,
];

exports.delete = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .isInt()
    .withMessage('id must be integer'),
  validateRules,
];
