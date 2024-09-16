module.exports = (app) => {
  const router = require('express').Router();
  const users = require('../../controllers/public/user.controller');
  const rules = require('../../rules/public/user.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/statistics', rules.getStatistics, users.getStatistics);

  app.use(`/api-public/${apiVersion}/users`, router);
};
