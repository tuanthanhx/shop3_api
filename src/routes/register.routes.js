module.exports = (app) => {
  const router = require('express').Router();
  const register = require('../controllers/register.controller');
  const rules = require('../rules/register.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.post('/email', rules.registerByEmail, register.registerByEmail);
  router.post('/phone', rules.registerByPhone, register.registerByPhone);

  app.use(`/api/${apiVersion}/register`, router);
};
