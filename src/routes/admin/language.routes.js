module.exports = (app) => {
  const router = require('express').Router();
  const languages = require('../../controllers/language.controller');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', languages.findAll);
  router.get('/:id', languages.findOne);
  router.post('/', languages.create);
  router.put('/:id', languages.update);
  router.delete('/:id', languages.delete);

  app.use(`/api-admin/${apiVersion}/languages`, router);
};
