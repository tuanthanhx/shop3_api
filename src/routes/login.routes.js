module.exports = (app) => {
  const router = require('express').Router();
  const login = require('../controllers/login.controller');

  router.post('/', login.login);
  router.post('/reset_password', login.resetPassword);
  router.post('/refresh', login.refreshToken);
  router.post('/generate_sms', login.generateSms);

  app.use('/api/login', router);
};
