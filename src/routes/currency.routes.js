module.exports = (app) => {
  const router = require('express').Router();
  const currencies = require('../controllers/currency.controller');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', currencies.findAll);
  router.get('/:id', currencies.findOne);
  router.post('/', currencies.create);
  router.put('/:id', currencies.update);
  router.delete('/:id', currencies.delete);

  app.use(`/api/${apiVersion}/currencies`, router);
};
