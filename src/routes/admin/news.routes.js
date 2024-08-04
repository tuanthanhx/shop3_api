module.exports = (app) => {
  const router = require('express').Router();
  const news = require('../../controllers/admin/news.controller');
  const rules = require('../../rules/admin/news.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, news.index);
  router.get('/:id', rules.show, news.show);
  router.post('/', rules.create, news.create);
  router.put('/:id', rules.update, news.update);
  router.delete('/:id', rules.delete, news.delete);
  router.post('/:id/publish', rules.publish, news.publish);
  router.post('/:id/unpublish', rules.unpublish, news.unpublish);

  app.use(`/api-admin/${apiVersion}/news`, router);
};
