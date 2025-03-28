module.exports = (app) => {
  const router = require('express').Router();
  const categories = require('../../controllers/admin/category.controller');
  const rules = require('../../rules/admin/category.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, categories.index);
  router.get('/:id', rules.show, categories.show);
  router.post('/', rules.create, categories.create);
  router.put('/:id', rules.update, categories.update);
  router.delete('/:id', rules.delete, categories.delete);

  router.get('/:id/attributes', rules.findAllAttributes, categories.findAllAttributes);

  app.use(`/api-admin/${apiVersion}/categories`, router);
};
