module.exports = (app) => {
  const router = require('express').Router();
  const wallets = require('../../controllers/seller/wallet.controller');
  // const rules = require('../../rules/seller/wallet.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', wallets.index);

  app.use(`/api-seller/${apiVersion}/wallets`, router);
};
