module.exports = (app) => {
  const router = require('express').Router();
  const register = require('../controllers/register.controller');

  router.post('/', register.register);
  router.post('/generate_code', register.generateVerificationCode);

  app.use('/api/register', router);
};
