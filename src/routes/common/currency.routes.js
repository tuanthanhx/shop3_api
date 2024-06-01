module.exports = (app) => {
  const router = require('express').Router();
  const currencies = require('../../controllers/common/currency.controller');
  const rules = require('../../rules/common/currency.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, currencies.index);

  app.use(`/api-common/${apiVersion}/currencies`, router);
};
