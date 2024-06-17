module.exports = (app) => {
  const router = require('express').Router();
  const orders = require('../../controllers/user/order.controller');
  const rules = require('../../rules/user/order.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, orders.index);
  router.get('/statistics', rules.getStatistics, orders.getStatistics);
  router.get('/:id', rules.show, orders.show);
  router.post('/', rules.create, orders.create);
  router.post('/:id/pay', rules.pay, orders.pay);
  router.post('/:id/cancel', rules.cancel, orders.cancel);
  router.post('/:id/complete', rules.complete, orders.complete);

  router.get('/:id/tracking', rules.getTracking, orders.getTracking);

  router.get('/:id/reviews', rules.getReviews, orders.getReviews);
  router.post('/:id/reviews', rules.createReview, orders.createReview);

  app.use(`/api-user/${apiVersion}/orders`, router);
};
