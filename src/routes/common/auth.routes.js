module.exports = (app) => {
  const router = require('express').Router();
  const auth = require('../../controllers/common/auth.controller');
  const rules = require('../../rules/common/auth.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/is_login', rules.isLogin, auth.isLogin);
  router.get('/me', rules.findMe, auth.findMe);
  // router.get('/statistics', rules.statistics, auth.statistics); // TODO: Remove due to unused
  router.get('/login_history', rules.getLoginHistory, auth.getLoginHistory);
  router.post('/refresh_token', rules.refreshToken, auth.refreshToken);
  router.post('/login/email', rules.loginByEmail, auth.loginByEmail);
  router.post('/login/phone', rules.loginByPhone, auth.loginByPhone);
  router.post('/login/wallet', rules.loginByWallet, auth.loginByWallet);
  router.post('/login/wallet/ton', rules.loginByTonWallet, auth.loginByTonWallet);
  router.post('/generate_ton_payload', auth.generateTonPayload);
  router.post('/logout', rules.logout, auth.logout);
  router.post('/reset_password/email', rules.resetPasswordByEmail, auth.resetPasswordByEmail);
  router.post('/reset_password/phone', rules.resetPasswordByPhone, auth.resetPasswordByPhone);
  router.post('/generate_otp/email', rules.generateOtpByEmail, auth.generateOtpByEmail);
  router.post('/generate_otp/phone', rules.generateOtpByPhone, auth.generateOtpByPhone);
  router.post('/confirm_otp', rules.confirmOtp, auth.confirmOtp);

  app.use(`/api-common/${apiVersion}/auth`, router);
};
