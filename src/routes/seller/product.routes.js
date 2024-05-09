module.exports = (app) => {
  const router = require('express').Router();
  const products = require('../../controllers/product.controller');
  const rules = require('../../rules/product.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, products.index);

  router.get('/:id', rules.findOne, products.show);
  router.post('/', rules.create, products.create);
  router.put('/:id', rules.update, products.update);
  router.delete('/:id', rules.delete, products.delete);

  router.post('/bulk_activate', products.bulkActiveProducts);
  router.post('/bulk_deactivate', products.bulkDeactiveProducts);
  router.post('/bulk_delete', products.bulkDeleteProducts);
  router.post('/bulk_recover', products.bulkRecoverProducts);

  app.use(`/api-seller/${apiVersion}/products`, router);
};
