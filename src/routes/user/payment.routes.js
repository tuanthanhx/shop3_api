module.exports = (app) => {
  const router = require('express').Router();
  const payments = require('../../controllers/user/payment.controller');
  const rules = require('../../rules/user/payment.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, payments.index);
  router.get('/:id', rules.show, payments.show);
  router.post('/:id/crypto', rules.payWithCrypto, payments.payWithCrypto);

  app.use(`/api-user/${apiVersion}/payments`, router);
};
