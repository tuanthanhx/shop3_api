module.exports = (app) => {
  const router = require('express').Router();
  const currencies = require('../../controllers/admin/currency.controller');
  const rules = require('../../rules/admin/currency.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, currencies.index);
  router.get('/:id', currencies.show);
  router.post('/', currencies.create);
  router.put('/:id', currencies.update);
  router.delete('/:id', currencies.delete);

  app.use(`/api-admin/${apiVersion}/currencies`, router);
};
