module.exports = (app) => {
  const router = require('express').Router();
  const products = require('../controllers/product.controller');
  const rules = require('../rules/product.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.findAll, products.findAll);
  router.get('/:id', rules.findOne, products.findOne);
  router.post('/', rules.create, products.create);
  router.put('/:id', rules.update, products.update);
  router.delete('/:id', rules.delete, products.delete);

  app.use(`/api/${apiVersion}/products`, router);
};
