module.exports = (app) => {
  const router = require('express').Router();
  const carts = require('../../controllers/user/cart.controller');
  const rules = require('../../rules/user/cart.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, carts.index);
  router.get('/count', rules.getCount, carts.getCount);
  router.post('/', rules.create, carts.create);
  router.delete('/:id', rules.delete, carts.delete);

  app.use(`/api-user/${apiVersion}/carts`, router);
};
