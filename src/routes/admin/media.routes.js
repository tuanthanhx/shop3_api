module.exports = (app) => {
  const router = require('express').Router();
  const multer = require('multer');
  const media = require('../../controllers/admin/media.controller');
  const rules = require('../../rules/admin/media.rules');

  const upload = multer({ storage: multer.memoryStorage() });

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.post('/files', upload.fields([
    { name: 'files', maxCount: 10 },
  ]), rules.uploadFiles, media.uploadFiles);

  app.use(`/api-admin/${apiVersion}/media`, router);
};
