const { body } = require('express-validator');
const { validateRules, handleMulterErrors } = require('../middlewares/validators');

exports.uploadProductImages = [
  body('files').custom((value, { req }) => {
    if (req.files && req.files.files) {
      const { files } = req.files;
      if (files?.length) {
        if (files.length > 9) {
          throw new Error('Maximum product images is 9');
        }
        files.forEach((file) => {
          const fileSize = file.size;
          if (fileSize > 10485760) {
            throw new Error('Each product image must be less than 10MB');
          }
          const fileType = file.mimetype;
          if (!['image/jpeg', 'image/png'].includes(fileType)) {
            throw new Error('Each product image must be in JPEG or PNG format');
          }
        });
        return true;
      }
    }
    throw new Error('No files was provided.');
  }),
  validateRules,
  handleMulterErrors,
];

exports.uploadProductVideo = [
  body('file').custom((value, { req }) => {
    if (req.files && req.files.file) {
      const file = req.files.file[0];
      const fileSize = file.size;
      const fileType = file.mimetype;
      if (fileSize > 104857600) {
        throw new Error('Product video must be less than 100MB');
      }
      if (!['video/mp4', 'video/quicktime'].includes(fileType)) {
        throw new Error('Product video must be in MP4 or QuickTime format');
      }
      return true;
    }
    throw new Error('No file was provided.');
  }),
  validateRules,
  handleMulterErrors,
];

exports.uploadProductVariantImage = [
  body('file').custom((value, { req }) => {
    if (req.files && req.files.file) {
      const file = req.files.file[0];
      const fileSize = file.size;
      const fileType = file.mimetype;
      if (fileSize > 10485760) {
        throw new Error('Variant image must be less than 10MB');
      }
      if (!['image/jpeg', 'image/png'].includes(fileType)) {
        throw new Error('Variant image must be in JPEG or PNG format');
      }
      return true;
    }
    throw new Error('No file was provided.');
  }),
  validateRules,
  handleMulterErrors,
];
