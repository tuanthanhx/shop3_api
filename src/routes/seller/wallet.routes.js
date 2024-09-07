module.exports = (app) => {
  const router = require('express').Router();
  const wallets = require('../../controllers/seller/wallet.controller');
  // const rules = require('../../rules/seller/wallet.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', wallets.index);

  router.get('/withdrawals', wallets.getWithdrawals);
  router.get('/withdrawals/:id', wallets.getWithdrawal);
  router.post('/withdrawals', wallets.createWithdrawal);
  router.post('/withdrawals/:id/cancel', wallets.cancelWithdrawal);

  app.use(`/api-seller/${apiVersion}/wallets`, router);
};
