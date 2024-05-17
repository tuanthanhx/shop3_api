module.exports = (app) => {
  const router = require('express').Router();
  const multer = require('multer');
  const media = require('../../controllers/seller/media.controller');
  const rules = require('../../rules/seller/media.rules');

  const upload = multer({ storage: multer.memoryStorage() });

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.post('/product_images', upload.fields([
    { name: 'files', maxCount: 9 },
  ]), rules.uploadProductImages, media.uploadProductImages);

  router.post('/product_video', upload.fields([
    { name: 'file', maxCount: 1 },
  ]), rules.uploadProductVideo, media.uploadProductVideo);

  router.post('/product_variant_image', upload.fields([
    { name: 'file', maxCount: 1 },
  ]), rules.uploadProductVariantImage, media.uploadProductVariantImage);

  app.use(`/api-seller/${apiVersion}/media`, router);
};
