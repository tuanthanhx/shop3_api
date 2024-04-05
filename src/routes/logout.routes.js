module.exports = (app) => {
  const router = require('express').Router();
  const logout = require('../controllers/logout.controller');

  router.post('/', logout.logout);

  app.use('/api/logout', router);
};
