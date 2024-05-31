module.exports = (app) => {
  const router = require('express').Router();
  const accounts = require('../../controllers/user/account.controller');
  const rules = require('../../rules/user/account.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.post('/connect_wallet', rules.connectWallet, accounts.connectWallet);
  router.post('/disconnect_wallet', rules.disconnectWallet, accounts.disconnectWallet);

  app.use(`/api-user/${apiVersion}/account`, router);
};
