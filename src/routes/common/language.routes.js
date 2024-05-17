module.exports = (app) => {
  const router = require('express').Router();
  const languages = require('../../controllers/common/language.controller');
  const rules = require('../../rules/common/language.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, languages.index);

  app.use(`/api-common/${apiVersion}/languages`, router);
};
