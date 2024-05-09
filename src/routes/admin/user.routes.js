module.exports = (app) => {
  const router = require('express').Router();
  const users = require('../../controllers/user.controller');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/me', users.findMe); // TODO : Move this to common, and other to admin APIs later.

  router.get('/', users.findAll);
  router.get('/:id', users.findOne);
  router.post('/', users.create);
  router.put('/:id', users.update);
  router.delete('/:id', users.delete);

  app.use(`/api-seller/${apiVersion}/users`, router);
};
