module.exports = (app) => {
  const router = require('express').Router();
  const news = require('../../controllers/common/news.controller');
  const rules = require('../../rules/common/news.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, news.index);
  router.get('/:id', rules.show, news.show);

  app.use(`/api-common/${apiVersion}/news`, router);
};
