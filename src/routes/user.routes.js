module.exports = (app) => {
  const router = require('express').Router();
  const users = require('../controllers/user.controller');

  router.get('/me', users.findMe);
  router.get('/', users.findAll);
  router.get('/:id', users.findOne);
  router.post('/', users.create);
  router.put('/:id', users.update);
  router.delete('/:id', users.delete);

  app.use('/api/users', router);
};
