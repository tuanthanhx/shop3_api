const { body } = require('express-validator');
const { validateRules, handleMulterErrors } = require('../../middlewares/validators');

exports.uploadFiles = [
  body('files').custom((value, { req }) => {
    if (req.files && req.files.files) {
      const { files } = req.files;
      if (files?.length) {
        if (files.length > 9) {
          throw new Error('Maximum file count is 10');
        }
        files.forEach((file) => {
          const fileSize = file.size;
          if (fileSize > 10485760) {
            throw new Error('Each product image must be less than 10MB');
          }
        });
      }
    }
    return true;
  }),
  validateRules,
  handleMulterErrors,
];
