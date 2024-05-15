module.exports = (app) => {
  const router = require('express').Router();
  const products = require('../../controllers/product.controller');
  const rules = require('../../rules/product.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, products.index);
  router.get('/:id', rules.findOne, products.show);

  router.post('/:id/approve', products.approve);
  router.post('/:id/unapprove', products.unapprove);
  router.delete('/:id', rules.delete, products.delete);

  // router.post('/bulk_activate', products.bulkActiveProducts);
  // router.post('/bulk_deactivate', products.bulkDeactiveProducts);
  // router.post('/bulk_delete', products.bulkDeleteProducts);
  // router.post('/bulk_recover', products.bulkRecoverProducts);

  app.use(`/api-admin/${apiVersion}/products`, router);
};
