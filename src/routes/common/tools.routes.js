module.exports = (app) => {
  const router = require('express').Router();
  const tools = require('../../controllers/common/tool.controller');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.post('/generate_thumbnails', tools.generateThumbnails);

  app.use(`/api-common/${apiVersion}/tools`, router);
};
