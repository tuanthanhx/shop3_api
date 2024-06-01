module.exports = (app) => {
  const router = require('express').Router();
  const accounts = require('../../controllers/user/account.controller');
  const rules = require('../../rules/user/account.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/orders_statistics', rules.getOrdersStatistics, accounts.getOrdersStatistics);
  router.post('/change_password', rules.changePassword, accounts.changePassword);

  router.get('/addresses', rules.getAddresses, accounts.getAddresses);
  router.post('/addresses', rules.createAddress, accounts.createAddress);
  router.put('/addresses/:id', rules.updateAddress, accounts.updateAddress);
  router.delete('/addresses/:id', rules.deleteAddress, accounts.deleteAddress);

  router.post('/connect_wallet', rules.connectWallet, accounts.connectWallet);
  router.post('/disconnect_wallet', rules.disconnectWallet, accounts.disconnectWallet);

  app.use(`/api-user/${apiVersion}/account`, router);
};
