module.exports = (app) => {
  const router = require('express').Router();
  const orders = require('../../controllers/user/order.controller');
  const rules = require('../../rules/user/order.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, orders.index);
  router.get('/:id', rules.show, orders.show);
  router.post('/:id/update_status', rules.updateStatus, orders.updateStatus);
  router.get('/:id/tracking', rules.getTracking, orders.getTracking);
  router.post('/:id/tracking', rules.createTracking, orders.createTracking);

  app.use(`/api-seller/${apiVersion}/orders`, router);
};
