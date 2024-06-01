module.exports = (app) => {
  const router = require('express').Router();
  const countries = require('../../controllers/common/country.controller');
  const rules = require('../../rules/common/country.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, countries.index);

  app.use(`/api-common/${apiVersion}/countries`, router);
};
