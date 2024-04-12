module.exports = (app) => {
  const router = require('express').Router();
  const categories = require('../controllers/category.controller');
  const rules = require('../rules/category.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.findAll, categories.findAll);
  router.post('/', rules.create, categories.create);
  router.put('/:id', rules.update, categories.update);
  router.delete('/:id', rules.delete, categories.delete);

  app.use(`/api/${apiVersion}/categories`, router);
};
