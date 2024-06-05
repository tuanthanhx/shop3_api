module.exports = (app) => {
  const router = require('express').Router();
  const orders = require('../../controllers/common/order.controller');
  const rules = require('../../rules/common/order.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/statuses', rules.getOrderStatuses, orders.getOrderStatuses);

  app.use(`/api-common/${apiVersion}/orders`, router);
};
