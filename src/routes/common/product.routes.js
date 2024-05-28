module.exports = (app) => {
  const router = require('express').Router();
  const products = require('../../controllers/common/product.controller');
  const rules = require('../../rules/common/product.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, products.index);
  router.get('/:id', rules.show, products.show);

  app.use(`/api-common/${apiVersion}/products`, router);
};
