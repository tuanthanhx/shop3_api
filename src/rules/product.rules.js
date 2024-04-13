const { param, query, body } = require('express-validator');
const { validateRules, handleMulterErrors } = require('../middlewares/validators');

exports.findAll = [
  query('name')
    .optional()
    .trim(),
  query('statusId')
    .optional()
    .toInt(),
  validateRules,
];

exports.create = [
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .trim(),
  body('categoryId')
    .notEmpty()
    .withMessage('categoryId is required')
    .toInt(),
  body('description')
    .optional()
    .trim(),
  body('price')
    .notEmpty()
    .withMessage('price is required')
    .toFloat(),
  body('mainImage').custom((value, { req }) => {
    if (!req.files || !req.files.mainImage) {
      throw new Error('mainImage is required');
    }
    const file = req.files.mainImage[0];
    const fileSize = file.size;
    const fileType = file.mimetype;
    if (fileSize > 10485760) {
      throw new Error('mainImage must be less than 10MB');
    }
    if (!['image/jpeg', 'image/png'].includes(fileType)) {
      throw new Error('mainImage must be in JPEG or PNG format');
    }
    return true;
  }),
  body('mainVideo').custom((value, { req }) => {
    if (req.files && req.files.mainVideo) {
      const file = req.files.mainVideo[0];
      const fileSize = file.size;
      const fileType = file.mimetype;
      if (fileSize > 104857600) {
        throw new Error('mainVideo must be less than 100MB');
      }
      if (!['video/mp4', 'video/quicktime'].includes(fileType)) {
        throw new Error('mainVideo must be in MP4 or QuickTime format');
      }
    }
    return true;
  }),
  body('otherImages').custom((value, { req }) => {
    if (req.files && req.files.otherImages) {
      const { otherImages } = req.files;
      otherImages.forEach((file) => {
        const fileSize = file.size;
        const fileType = file.mimetype;
        if (fileSize > 10485760) {
          throw new Error('Each file in otherImages must be less than 10MB');
        }
        if (!['image/jpeg', 'image/png'].includes(fileType)) {
          throw new Error('Each file in otherImages must be in JPEG or PNG format');
        }
      });
    }
    return true;
  }),
  validateRules,
  handleMulterErrors,
];

exports.update = [
  //   param('id')
  //     .notEmpty()
  //     .withMessage('id is required')
  //     .toInt(),
  //   body('name')
  //     .optional()
  //     .trim(),
  //   query('parentId')
  //     .optional()
  //     .toInt(),
  //   validateRules,
];

exports.delete = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .toInt(),
  validateRules,
];
