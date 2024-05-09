module.exports = (app) => {
  const router = require('express').Router();
  const categories = require('../../controllers/admin/category.controller');
  const rules = require('../../rules/admin/category.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.findAll, categories.findAll);
  router.post('/', rules.create, categories.create);
  router.put('/:id', rules.update, categories.update);
  router.delete('/:id', rules.delete, categories.delete);

  router.get('/:id/attributes', categories.findAllAttributes);

  app.use(`/api-admin/${apiVersion}/categories`, router);
};
