module.exports = (app) => {
  const router = require('express').Router();
  const accounts = require('../../controllers/user/account.controller');
  const rules = require('../../rules/user/account.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/orders_statistics', rules.getOrdersStatistics, accounts.getOrdersStatistics); // TODO: Moved to /order/statistics. DELETE IT LATER

  router.post('/change_email', rules.changeEmail, accounts.changeEmail);
  router.post('/change_phone', rules.changePhone, accounts.changePhone);
  router.post('/change_dob', rules.changeDob, accounts.changeDob);
  router.post('/change_country', rules.changeCountry, accounts.changeCountry);
  router.post('/change_password', rules.changePassword, accounts.changePassword);

  router.get('/addresses', rules.getAddresses, accounts.getAddresses);
  router.post('/addresses', rules.createAddress, accounts.createAddress);
  router.put('/addresses/:id', rules.updateAddress, accounts.updateAddress);
  router.delete('/addresses/:id', rules.deleteAddress, accounts.deleteAddress);

  router.get('/payment_methods', rules.getPaymentMethods, accounts.getPaymentMethods);
  router.post('/payment_methods/cards', rules.createPaymentMethodWithCards, accounts.createPaymentMethodWithCards);
  router.post('/payment_methods/paypal', rules.createPaymentMethodWithPaypal, accounts.createPaymentMethodWithPaypal);
  router.post('/payment_methods/cryptocurrencies', rules.createPaymentMethodWithCryptocurrencies, accounts.createPaymentMethodWithCryptocurrencies);
  router.post('/payment_methods/online', rules.createPaymentMethodWithOnline, accounts.createPaymentMethodWithOnline);
  router.post('/payment_methods/:id/set_default', rules.setDefaultPaymentMethod, accounts.setDefaultPaymentMethod);
  router.delete('/payment_methods/:id', rules.deletePaymentMethod, accounts.deletePaymentMethod);
  router.get('/payment_method_types', rules.getPaymentMethodTypes, accounts.getPaymentMethodTypes);

  router.post('/connect_wallet', rules.connectWallet, accounts.connectWallet);
  router.post('/disconnect_wallet', rules.disconnectWallet, accounts.disconnectWallet);

  app.use(`/api-user/${apiVersion}/account`, router);
};
