module.exports = (app) => {
  const router = require('express').Router();
  const multer = require('multer');
  const media = require('../../controllers/user/media.controller');
  const rules = require('../../rules/user/media.rules');

  const upload = multer({ storage: multer.memoryStorage() });

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.post('/avatar', upload.fields([
    { name: 'file', maxCount: 1 },
  ]), rules.uploadAvatar, media.uploadAvatar);

  router.post('/review_media', upload.fields([
    { name: 'files', maxCount: 10 },
  ]), rules.uploadReviewMedia, media.uploadReviewMedia);

  app.use(`/api-user/${apiVersion}/media`, router);
};
