module.exports = (app) => {
  const router = require('express').Router();
  const wallets = require('../../controllers/admin/wallet.controller');
  // const rules = require('../../rules/seller/wallet.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/withdrawals', wallets.getWithdrawals);
  router.get('/withdrawals/:id', wallets.getWithdrawal);
  router.post('/withdrawals/:id/approve', wallets.approveWithdrawal);
  router.post('/withdrawals/:id/decline', wallets.declineWithdrawal);

  app.use(`/api-admin/${apiVersion}/wallets`, router);
};
