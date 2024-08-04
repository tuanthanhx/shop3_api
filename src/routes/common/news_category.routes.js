module.exports = (app) => {
  const router = require('express').Router();
  const newsCategories = require('../../controllers/common/news_category.controller');
  const rules = require('../../rules/common/news_category.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, newsCategories.index);

  app.use(`/api-common/${apiVersion}/news_categories`, router);
};
