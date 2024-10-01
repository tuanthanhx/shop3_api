module.exports = (app) => {
  const router = require('express').Router();
  const orders = require('../../controllers/user/order.controller');
  const rules = require('../../rules/user/order.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, orders.index);
  router.get('/statistics', rules.getStatistics, orders.getStatistics);
  router.get('/:id', rules.show, orders.show);
  router.post('/:id/update_status', rules.updateStatus, orders.updateStatus);
  router.get('/:id/tracking', rules.getTracking, orders.getTracking);
  router.post('/:id/tracking', rules.createTracking, orders.createTracking);
  router.post('/:id/withdraw', rules.withdraw, orders.withdraw);

  // TODO: Update rules later
  router.get('/:id/logistics', orders.getLogisticsDetail);
  router.get('/:id/logistics/track', orders.getLogisticsTrack);
  router.post('/:id/logistics/track', orders.createLogisticsTrack);
  router.post('/:id/logistics', orders.createLogistics);
  router.put('/:id/logistics', orders.updateLogistics);
  router.post('/:id/logistics/cancel', orders.cancelLogistics);

  app.use(`/api-seller/${apiVersion}/orders`, router);
};
