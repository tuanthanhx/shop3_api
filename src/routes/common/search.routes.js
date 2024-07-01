module.exports = (app) => {
  const router = require('express').Router();
  const search = require('../../controllers/common/search.controller');
  const rules = require('../../rules/common/search.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/hints', rules.getHints, search.getHints);

  app.use(`/api-common/${apiVersion}/search`, router);
};
