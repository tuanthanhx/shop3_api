module.exports = (app) => {
  const router = require('express').Router();
  const auth = require('../controllers/auth.controller');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/is_login', auth.isLogin);
  router.post('/login', auth.login);
  router.post('/logout', auth.logout);
  router.post('/refresh_token', auth.refreshToken);
  router.post('/reset_password', auth.resetPassword);
  router.post('/generate_otp', auth.generateOTP);

  app.use(`/api/${apiVersion}/auth`, router);
};
