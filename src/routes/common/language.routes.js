module.exports = (app) => {
  const router = require('express').Router();
  const languages = require('../../controllers/common/language.controller');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', languages.index);

  app.use(`/api-common/${apiVersion}/languages`, router);
};
