module.exports = (app) => {
  const router = require('express').Router();
  const auth = require('../controllers/auth.controller');
  const rules = require('../rules/auth.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/is_login', auth.isLogin);
  router.post('/refresh_token', rules.refreshToken, auth.refreshToken);
  router.post('/login/email', rules.loginByEmail, auth.loginByEmail);
  router.post('/login/phone', rules.loginByPhone, auth.loginByPhone);
  router.post('/logout', auth.logout);
  router.post('/reset_password/email', rules.resetPasswordByEmail, auth.resetPasswordByEmail);
  router.post('/reset_password/phone', rules.resetPasswordByPhone, auth.resetPasswordByPhone);
  router.post('/generate_otp/email', rules.generateOtpByEmail, auth.generateOtpByEmail);
  router.post('/generate_otp/phone', rules.generateOtpByPhone, auth.generateOtpByPhone);
  router.post('/confirm_otp', rules.confirmOtp, auth.confirmOtp);

  app.use(`/api-common/${apiVersion}/auth`, router);
};
