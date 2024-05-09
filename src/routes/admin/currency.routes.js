module.exports = (app) => {
  const router = require('express').Router();
  const currencies = require('../../controllers/currency.controller');
  const rules = require('../../rules/currency.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.findAll, currencies.findAll);
  router.get('/:id', currencies.findOne);
  router.post('/', currencies.create);
  router.put('/:id', currencies.update);
  router.delete('/:id', currencies.delete);

  app.use(`/api-admin/${apiVersion}/currencies`, router);
};
