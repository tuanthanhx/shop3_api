module.exports = (app) => {
  const router = require('express').Router();
  const users = require('../../controllers/admin/user.controller');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', users.index);
  router.get('/:id', users.findOne);
  router.post('/', users.create);
  router.put('/:id', users.update);
  router.delete('/:id', users.delete);

  app.use(`/api-admin/${apiVersion}/users`, router);
};
