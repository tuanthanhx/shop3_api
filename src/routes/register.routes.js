module.exports = (app) => {
  const router = require('express').Router();
  const register = require('../controllers/register.controller');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.post('/', register.register);

  app.use(`/api/${apiVersion}/register`, router);
};
