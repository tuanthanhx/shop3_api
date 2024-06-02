module.exports = (app) => {
  const router = require('express').Router();
  const orders = require('../../controllers/user/order.controller');
  const rules = require('../../rules/user/order.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  // router.get('/', rules.index, orders.index);
  // router.get('/count', rules.getCount, orders.getCount);
  router.post('/', rules.create, orders.create);
  // router.post('/:id/update_quantity', rules.updateQuantity, orders.updateQuantity);
  // router.delete('/:id', rules.delete, orders.delete);

  app.use(`/api-user/${apiVersion}/orders`, router);
};
