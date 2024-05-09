module.exports = (app) => {
  const router = require('express').Router();
  const categories = require('../../controllers/seller/category.controller');
  const rules = require('../../rules/seller/category.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.findAll, categories.findAll);
  router.get('/:id/attributes', categories.findAllAttributes);

  app.use(`/api-seller/${apiVersion}/categories`, router);
};
