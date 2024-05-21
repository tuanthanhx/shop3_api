const { body } = require('express-validator');
const { validateRules, handleMulterErrors } = require('../../middlewares/validators');

exports.uploadFiles = [
  body('files').custom((value, { req }) => {
    if (req.files && req.files.files) {
      const { files } = req.files;
      if (files?.length) {
        if (files.length > 10) {
          throw new Error('Maximum file count is 10');
        }
        files.forEach((file) => {
          const fileSize = file.size;
          if (fileSize > 10485760) {
            throw new Error('Each file must be less than 10MB');
          }
        });
        return true;
      }
    }
    throw new Error('No files provided.');
  }),
  validateRules,
  handleMulterErrors,
];
