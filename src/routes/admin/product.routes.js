module.exports = (app) => {
  const router = require('express').Router();
  const products = require('../../controllers/seller/product.controller');
  const rules = require('../../rules/seller/product.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, products.index);
  router.get('/:id', rules.show, products.show);

  router.post('/:id/approve', products.approve);
  router.post('/:id/unapprove', products.unapprove);
  router.delete('/:id', rules.delete, products.delete);

  app.use(`/api-admin/${apiVersion}/products`, router);
};
