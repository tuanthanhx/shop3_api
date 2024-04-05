module.exports = (app) => {
  const router = require('express').Router();
  const login = require('../controllers/login.controller');

  router.post('/', login.login);
  router.post('/refresh', login.refreshToken);

  app.use('/api/login', router);
};
