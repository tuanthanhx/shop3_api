module.exports = (app) => {
  const router = require('express').Router();
  const accounts = require('../../controllers/user/account.controller');
  const rules = require('../../rules/user/account.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.post('/connect_wallet', rules.connectWallet, accounts.connectWallet);
  router.post('/connect_wallet/ton', rules.connectTonWallet, accounts.connectTonWallet);
  router.post('/disconnect_wallet', rules.disconnectWallet, accounts.disconnectWallet);

  router.post('/profile', rules.updateProfile, accounts.updateProfile);
  router.post('/change_password', rules.changePassword, accounts.changePassword);

  app.use(`/api-seller/${apiVersion}/account`, router);
};
