module.exports = (app) => {
  const router = require('express').Router();
  const users = require('../../controllers/external/user.controller');
  const rules = require('../../rules/external/user.rules');

  require('dotenv').config();
  const apiVersion = process.env.VERSION || 'v1';

  router.get('/', rules.index, users.index);
  router.get('/:id', rules.show, users.show);
  // router.post('/', users.create);
  // router.put('/:id', users.update);
  // router.post('/:id/activate', users.activate);
  // router.post('/:id/deactivate', users.deactivate);
  // router.delete('/:id', users.delete);
  // router.post('/bulk_activate', users.bulkActivate);
  // router.post('/bulk_deactivate', users.bulkDeactivate);
  // router.post('/bulk_delete', users.bulkDelete);

  app.use(`/api-external/${apiVersion}/users`, router);
};
