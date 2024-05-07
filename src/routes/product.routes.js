module.exports = (app) => {
  const router = require('express').Router();
  const products = require('../controllers/product.controller');
  const rules = require('../rules/product.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, products.index);

  router.get('/:id', rules.findOne, products.show);
  router.post('/', rules.create, products.create);
  router.put('/:id', rules.update, products.update);

  router.delete('/:id', rules.delete, products.delete); // TODO: No need delete, just need to change status to 7

  // router.post('/activate', products.activeProducts);
  // router.post('/deactivate', products.deactiveProducts);
  // router.post('/delete', products.deleteProducts);
  // router.post('/recover', products.recoverProducts);

  app.use(`/api/${apiVersion}/products`, router);
};
