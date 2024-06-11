const { body } = require('express-validator');
const { validateRules, handleMulterErrors } = require('../../middlewares/validators');

exports.uploadAvatar = [
  body('file').custom((value, { req }) => {
    if (req.files && req.files.file) {
      const file = req.files.file[0];
      const fileSize = file.size;
      const fileType = file.mimetype;
      if (fileSize > 10485760) {
        throw new Error('Avatar must be less than 10MB');
      }
      if (!['image/jpeg', 'image/png'].includes(fileType)) {
        throw new Error('Avatar must be in JPEG or PNG format');
      }
      return true;
    }
    throw new Error('No file was provided');
  }),
  validateRules,
  handleMulterErrors,
];

exports.uploadReviewMedia = [
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
