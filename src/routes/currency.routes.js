module.exports = (app) => {
  const router = require('express').Router();
  const currencies = require('../controllers/currency.controller');

  const rules = require('../rules/currency.rules');
  const { validateRules } = require('../middlewares/validators');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.findAll, validateRules, currencies.findAll);
  router.get('/:id', validateRules, currencies.findOne);
  router.post('/', validateRules, currencies.create);
  router.put('/:id', validateRules, currencies.update);
  router.delete('/:id', validateRules, currencies.delete);

  app.use(`/api/${apiVersion}/currencies`, router);
};
