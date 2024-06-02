module.exports = (app) => {
  const router = require('express').Router();
  const orderStatuses = require('../../controllers/common/order_status.controller');
  const rules = require('../../rules/common/order_status.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, orderStatuses.index);

  app.use(`/api-common/${apiVersion}/statuses`, router);
};
