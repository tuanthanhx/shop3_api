module.exports = (app) => {
  const router = require('express').Router();
  const controller = require('../../controllers/seller/logistic_cainiao.controller');
  // const rules = require('../../rules/seller/logistic.rules'); // TODO: Add rules later

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.post('/orders', controller.createOrder);
  router.post('/orders/:id', controller.getOrder);
  router.post('/orders/:id/update', controller.updateOrder);
  router.post('/orders/:id/track', controller.getTrack);
  router.post('/orders/:id/cancel', controller.cancelOrder);

  app.use(`/api-seller/${apiVersion}/logistic/cainiao`, router);
};
