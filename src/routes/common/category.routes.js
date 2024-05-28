module.exports = (app) => {
  const router = require('express').Router();
  const categories = require('../../controllers/common/category.controller');
  const rules = require('../../rules/common/category.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, categories.index);
  router.get('/:id', rules.show, categories.show);

  app.use(`/api-common/${apiVersion}/categories`, router);
};
