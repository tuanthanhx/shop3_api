module.exports = (app) => {
  const router = require('express').Router();
  const currencies = require('../../controllers/common/currency.controller');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', currencies.index);

  app.use(`/api-common/${apiVersion}/currencies`, router);
};
