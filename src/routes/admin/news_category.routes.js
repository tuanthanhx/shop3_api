module.exports = (app) => {
  const router = require('express').Router();
  const newsCategories = require('../../controllers/admin/news_category.controller');
  const rules = require('../../rules/admin/news_category.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, newsCategories.index);
  router.get('/:id', rules.show, newsCategories.show);
  router.post('/', rules.create, newsCategories.create);
  router.put('/:id', rules.update, newsCategories.update);
  router.delete('/:id', rules.delete, newsCategories.delete);

  app.use(`/api-admin/${apiVersion}/news_categories`, router);
};
