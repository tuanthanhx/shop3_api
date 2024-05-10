module.exports = (app) => {
  const router = require('express').Router();
  const languages = require('../../controllers/admin/language.controller');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', languages.index);
  router.get('/:id', languages.show);
  router.post('/', languages.create);
  router.put('/:id', languages.update);
  router.delete('/:id', languages.delete);

  app.use(`/api-admin/${apiVersion}/languages`, router);
};
