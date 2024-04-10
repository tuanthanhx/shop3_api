module.exports = (app) => {
  const router = require('express').Router();
  const auth = require('../controllers/auth.controller');

  const rules = require('../rules/auth.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/is_login', auth.isLogin);
  router.post('/login', rules.login, auth.login);
  router.post('/logout', auth.logout);
  router.post('/refresh_token', rules.refreshToken, auth.refreshToken);
  router.post('/reset_password', rules.resetPassword, auth.resetPassword);
  router.post('/generate_otp', rules.generateOTP, auth.generateOTP);

  app.use(`/api/${apiVersion}/auth`, router);
};
