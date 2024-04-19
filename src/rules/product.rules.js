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
  body('productStatusId')
    .optional()
    .toInt(),
  body('description')
    .optional()
    .trim(),
  body('price')
    .optional()
    .toFloat(),
  body('sku')
    .optional()
    .trim(),
  body('quantity')
    .optional()
    .toInt(),
  body('thumbnailImage').custom((value, { req }) => {
    if (!req.files || !req.files.thumbnailImage) {
      throw new Error('thumbnailImage is required');
    }
    const file = req.files.thumbnailImage[0];
    const fileSize = file.size;
    const fileType = file.mimetype;
    if (fileSize > 10485760) {
      throw new Error('thumbnailImage must be less than 10MB');
    }
    if (!['image/jpeg', 'image/png'].includes(fileType)) {
      throw new Error('thumbnailImage must be in JPEG or PNG format');
    }
    return true;
  }),
  body('thumbnailVideo').custom((value, { req }) => {
    if (req.files && req.files.thumbnailVideo) {
      const file = req.files.thumbnailVideo[0];
      const fileSize = file.size;
      const fileType = file.mimetype;
      if (fileSize > 104857600) {
        throw new Error('thumbnailVideo must be less than 100MB');
      }
      if (!['video/mp4', 'video/quicktime'].includes(fileType)) {
        throw new Error('thumbnailVideo must be in MP4 or QuickTime format');
      }
    }
    return true;
  }),
  body('images').custom((value, { req }) => {
    if (req.files && req.files.images) {
      const { images } = req.files;
      images.forEach((file) => {
        const fileSize = file.size;
        const fileType = file.mimetype;
        if (fileSize > 10485760) {
          throw new Error('Each image file must be less than 10MB');
        }
        if (!['image/jpeg', 'image/png'].includes(fileType)) {
          throw new Error('Each image file must be in JPEG or PNG format');
        }
      });
    }
    return true;
  }),
  body('variants')
    .optional()
    .trim(), // .toArray(), // TODO: Validate if it is a valid array later
  validateRules,
  handleMulterErrors,
];

exports.update = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .toInt(),
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .trim(),
  validateRules,
];

exports.delete = [
  param('id')
    .notEmpty()
    .withMessage('id is required')
    .toInt(),
  validateRules,
];
