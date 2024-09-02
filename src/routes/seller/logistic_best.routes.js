module.exports = (app) => {
  const router = require('express').Router();
  const controller = require('../../controllers/seller/logistic_best.controller');
  // const rules = require('../../rules/seller/logistic.rules'); // TODO: Add rules later

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.post('/estimate', controller.estimateFee);
  router.post('/orders', controller.createOrder);
  router.post('/orders/pdf', controller.createOrderPdf);
  router.post('/orders/status', controller.updateStatus);
  router.get('/orders/status', controller.getStatus);
  // router.post('/orders/:id', controller.getOrder);
  router.post('/orders/cancel', controller.cancelOrder);
  router.post('/orders/update', controller.updateOrder);

  app.use(`/api-seller/${apiVersion}/logistic/best`, router);
};
