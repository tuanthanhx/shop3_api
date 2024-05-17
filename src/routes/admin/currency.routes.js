module.exports = (app) => {
  const router = require('express').Router();
  const currencies = require('../../controllers/admin/currency.controller');
  const rules = require('../../rules/admin/currency.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, currencies.index);
  router.get('/:id', rules.show, currencies.show);
  router.post('/', rules.create, currencies.create);
  router.put('/:id', rules.update, currencies.update);
  router.delete('/:id', rules.delete, currencies.delete);

  app.use(`/api-admin/${apiVersion}/currencies`, router);
};
