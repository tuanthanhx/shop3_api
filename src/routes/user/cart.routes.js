module.exports = (app) => {
  const router = require('express').Router();
  const carts = require('../../controllers/user/cart.controller');
  const rules = require('../../rules/user/cart.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, carts.index);
  // router.get('/statistics', rules.statistics, products.statistics);
  // router.get('/:id', rules.show, products.show);
  router.post('/', rules.create, carts.create);
  // router.put('/:id', rules.update, products.update);
  // router.delete('/:id', rules.delete, products.delete);

  // router.post('/bulk_activate', rules.bulkActiveProducts, products.bulkActiveProducts);
  // router.post('/bulk_deactivate', rules.bulkDeactiveProducts, products.bulkDeactiveProducts);
  // router.post('/bulk_delete', rules.bulkDeleteProducts, products.bulkDeleteProducts);
  // router.post('/bulk_recover', rules.bulkRecoverProducts, products.bulkRecoverProducts);

  app.use(`/api-user/${apiVersion}/carts`, router);
};
