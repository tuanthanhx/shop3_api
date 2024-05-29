module.exports = (app) => {
  const router = require('express').Router();
  const products = require('../../controllers/seller/product.controller');
  const rules = require('../../rules/seller/product.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, products.index);
  router.get('/statistics', rules.statistics, products.statistics);
  router.get('/:id', rules.show, products.show);
  router.post('/', rules.create, products.create);
  router.put('/:id', rules.update, products.update);
  router.delete('/:id', rules.delete, products.delete);

  router.post('/bulk_activate', rules.bulkActiveProducts, products.bulkActiveProducts);
  router.post('/bulk_deactivate', rules.bulkDeactiveProducts, products.bulkDeactiveProducts);
  router.post('/bulk_delete', rules.bulkDeleteProducts, products.bulkDeleteProducts);
  router.post('/bulk_recover', rules.bulkRecoverProducts, products.bulkRecoverProducts);

  app.use(`/api-seller/${apiVersion}/products`, router);
};
