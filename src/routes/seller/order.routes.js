module.exports = (app) => {
  const router = require('express').Router();
  const orders = require('../../controllers/user/order.controller');
  const rules = require('../../rules/user/order.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, orders.index);
  router.get('/:id', rules.show, orders.show);
  router.post('/:id/update_status', rules.updateStatus, orders.updateStatus);
  router.post('/:id/trackings', rules.createTracking, orders.createTracking);

  app.use(`/api-seller/${apiVersion}/orders`, router);
};
